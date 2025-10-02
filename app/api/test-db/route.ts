import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL || process.env.MYSQL_URL.includes('YourStrongPassword')) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured for production',
        message: 'Please update MYSQL_URL with the correct password (currently using placeholder: YourStrongPassword)'
      })
    }

    // Test database connection
    await db.$connect()
    
    // Test a simple query
    const result = await db.$queryRaw`SELECT 1 as test`
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))
    
    // Test categories table
    const categoriesCount = await db.category.count()
    
    // Test users table
    const usersCount = await db.user.count()
    
    await db.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: {
        test: serializedResult,
        categoriesCount: Number(categoriesCount),
        usersCount: Number(usersCount),
        environment: {
          hasMysqlUrl: !!process.env.MYSQL_URL,
          mysqlUrlPrefix: process.env.MYSQL_URL?.substring(0, 30) + '...',
          nodeEnv: process.env.NODE_ENV,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
          hasNextAuthUrl: !!process.env.NEXTAUTH_URL
        }
      }
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      errorType: error.constructor.name,
      environment: {
        hasMysqlUrl: !!process.env.MYSQL_URL,
        mysqlUrlPrefix: process.env.MYSQL_URL?.substring(0, 30) + '...',
        nodeEnv: process.env.NODE_ENV,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL
      }
    }, { status: 500 })
  }
}
