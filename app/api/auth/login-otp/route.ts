import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    
    console.log('📱 [OTP LOGIN] Attempting login for phone:', phone)
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }
    
    // Find user by phone
    const user = await db.user.findFirst({
      where: { 
        phone: phone,
        phoneVerified: { not: null } // Must be verified
      }
    })
    
    if (!user) {
      console.log('❌ [OTP LOGIN] No verified user found with phone:', phone)
      return NextResponse.json(
        { error: 'No account found with this phone number. Please sign up first or verify your phone.' },
        { status: 404 }
      )
    }
    
    console.log('✅ [OTP LOGIN] User found:', user.email)
    
    // Create session cookie (for credentials-based auth)
    const cookieStore = cookies()
    const userData = {
      id: user.id,
      email: user.email!,
      name: user.name,
      role: user.role
    }
    
    cookieStore.set('user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })
    
    console.log('✅ [OTP LOGIN] Session created for:', user.email)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('🔴 [OTP LOGIN] Error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

