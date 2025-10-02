import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      database: {
        configured: !!process.env.MYSQL_URL,
        hasCorrectPassword: process.env.MYSQL_URL?.includes('YourStrongPassword') === false
      },
      cashfree: {
        appId: !!process.env.CASHFREE_APP_ID,
        secretKey: !!process.env.CASHFREE_SECRET_KEY,
        environment: !!process.env.CASHFREE_ENVIRONMENT,
        webhookSecret: !!process.env.CASHFREE_WEBHOOK_SECRET
      },
      nextauth: {
        secret: !!process.env.NEXTAUTH_SECRET,
        url: !!process.env.NEXTAUTH_URL
      }
    }

    return NextResponse.json({
      status: 'Environment Check',
      ...envCheck,
      message: envCheck.database.configured && envCheck.database.hasCorrectPassword 
        ? 'Environment variables look good!' 
        : 'Please update environment variables in Vercel'
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { error: 'Failed to check environment' },
      { status: 500 }
    )
  }
}
