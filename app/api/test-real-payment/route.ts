import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('Testing real payment API...')
    
    // Check environment variables
    const envCheck = {
      database: !!process.env.MYSQL_URL,
      cashfreeAppId: !!process.env.CASHFREE_APP_ID,
      cashfreeSecretKey: !!process.env.CASHFREE_SECRET_KEY,
      cashfreeEnvironment: !!process.env.CASHFREE_ENVIRONMENT,
      cashfreeWebhookSecret: !!process.env.CASHFREE_WEBHOOK_SECRET
    }
    
    console.log('Environment check:', envCheck)
    
    // Test database connection
    if (!process.env.MYSQL_URL) {
      return NextResponse.json({
        success: false,
        error: 'MYSQL_URL not configured',
        envCheck
      }, { status: 503 })
    }
    
    // Test database connection
    try {
      const firstUser = await db.user.findFirst()
      console.log('Database connection successful, first user:', firstUser?.email)
      
      return NextResponse.json({
        success: true,
        message: 'Real payment API is ready!',
        envCheck,
        databaseConnected: true,
        firstUser: firstUser ? { id: firstUser.id, email: firstUser.email } : null
      })
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        envCheck,
        databaseError: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 503 })
    }
    
  } catch (error) {
    console.error('Test real payment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
