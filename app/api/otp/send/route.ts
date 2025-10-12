import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateOTP, hashOTP, getOTPExpiry, isValidEmail, isValidIndianPhone, formatPhoneNumber } from '@/lib/otp'
import { sendOTPViaEmail } from '@/lib/email'
import { sendOTPViaSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, type, purpose = 'SIGNUP' } = body

    console.log('📤 [OTP] Send OTP request:', { email, phone, type, purpose })

    // Validation
    if (!type || !['EMAIL', 'PHONE'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid OTP type. Must be EMAIL or PHONE' },
        { status: 400 }
      )
    }

    if (type === 'EMAIL' && !email) {
      return NextResponse.json(
        { error: 'Email is required for email OTP' },
        { status: 400 }
      )
    }

    if (type === 'PHONE' && !phone) {
      return NextResponse.json(
        { error: 'Phone number is required for phone OTP' },
        { status: 400 }
      )
    }

    // Validate format
    if (type === 'EMAIL' && !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (type === 'PHONE' && !isValidIndianPhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be a valid 10-digit Indian mobile number' },
        { status: 400 }
      )
    }

    const identifier = type === 'EMAIL' ? email : formatPhoneNumber(phone)

    // Rate limiting: Check if OTP was sent recently (within last 1 minute)
    const recentOTP = await db.oTP.findFirst({
      where: {
        ...(type === 'EMAIL' ? { email: identifier } : { phone: identifier }),
        type: type as any,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000) // Within last 1 minute
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (recentOTP) {
      return NextResponse.json(
        { error: 'OTP already sent. Please wait 1 minute before requesting again.' },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    console.log('🔢 [OTP] Generated OTP:', otp) // For development - remove in production

    // Hash OTP for storage
    const hashedOTP = await hashOTP(otp)

    // Delete any existing unverified OTPs for this identifier
    await db.oTP.deleteMany({
      where: {
        ...(type === 'EMAIL' ? { email: identifier } : { phone: identifier }),
        type: type as any,
        isVerified: false
      }
    })

    // Save OTP to database
    const otpRecord = await db.oTP.create({
      data: {
        email: type === 'EMAIL' ? identifier : null,
        phone: type === 'PHONE' ? identifier : null,
        otp: hashedOTP,
        type: type as any,
        purpose: purpose as any,
        expiresAt: getOTPExpiry(5), // 5 minutes expiry
        attempts: 0,
        maxAttempts: 3,
        isVerified: false
      }
    })

    // Send OTP via email or SMS
    let sent = false
    if (type === 'EMAIL') {
      sent = await sendOTPViaEmail(email, otp, purpose.toLowerCase())
    } else if (type === 'PHONE') {
      sent = await sendOTPViaSMS(phone, otp)
    }

    if (!sent) {
      // Delete the OTP record if sending failed
      await db.oTP.delete({ where: { id: otpRecord.id } })
      
      return NextResponse.json(
        { error: `Failed to send OTP via ${type.toLowerCase()}. Please try again.` },
        { status: 500 }
      )
    }

    console.log('✅ [OTP] OTP sent successfully:', { id: otpRecord.id, type, identifier })

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to your ${type.toLowerCase()}`,
      otpId: otpRecord.id,
      expiresAt: otpRecord.expiresAt
    })

  } catch (error) {
    console.error('❌ [OTP] Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error while sending OTP' },
      { status: 500 }
    )
  }
}

