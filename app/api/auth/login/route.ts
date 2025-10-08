import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      return NextResponse.json(
        { message: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has a password (OAuth users don't have passwords)
    if (!user.hashedPassword) {
      return NextResponse.json(
        { message: 'This account uses social login. Please sign in with Google.' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
