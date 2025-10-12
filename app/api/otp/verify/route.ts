import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyOTP, isOTPExpired, formatPhoneNumber } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, otp, type } = body

    console.log('🔍 [OTP] Verify OTP request:', { email, phone, type })

    // Validation
    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid OTP. Must be 6 digits.' },
        { status: 400 }
      )
    }

    if (!type || !['EMAIL', 'PHONE'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid OTP type. Must be EMAIL or PHONE' },
        { status: 400 }
      )
    }

    if (type === 'EMAIL' && !email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (type === 'PHONE' && !phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    const identifier = type === 'EMAIL' ? email : formatPhoneNumber(phone)

    // Find the most recent OTP for this identifier
    const otpRecord = await db.oTP.findFirst({
      where: {
        ...(type === 'EMAIL' ? { email: identifier } : { phone: identifier }),
        type: type as any,
        isVerified: false
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new OTP.' },
        { status: 404 }
      )
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await db.oTP.delete({ where: { id: otpRecord.id } })
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await db.oTP.delete({ where: { id: otpRecord.id } })
      return NextResponse.json(
        { error: 'Maximum verification attempts exceeded. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.otp)

    if (!isValid) {
      // Increment attempts
      await db.oTP.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 }
      })

      const remainingAttempts = otpRecord.maxAttempts - (otpRecord.attempts + 1)

      return NextResponse.json(
        { 
          error: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
          remainingAttempts 
        },
        { status: 400 }
      )
    }

    // OTP is valid - mark as verified
    await db.oTP.update({
      where: { id: otpRecord.id },
      data: { isVerified: true }
    })

    // Update user verification status if email/phone belongs to a user
    if (type === 'EMAIL' && email) {
      const user = await db.user.findUnique({ where: { email } })
      if (user && !user.emailVerified) {
        await db.user.update({
          where: { email },
          data: { emailVerified: new Date() }
        })
        console.log('✅ [OTP] User email verified:', email)
      }
    } else if (type === 'PHONE' && phone) {
      const user = await db.user.findFirst({ where: { phone: identifier } })
      if (user && !user.phoneVerified) {
        await db.user.update({
          where: { id: user.id },
          data: { phoneVerified: new Date() }
        })
        console.log('✅ [OTP] User phone verified:', phone)
      }
    }

    console.log('✅ [OTP] OTP verified successfully:', { type, identifier })

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      verified: true
    })

  } catch (error) {
    console.error('❌ [OTP] Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error while verifying OTP' },
      { status: 500 }
    )
  }
}

