import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL || process.env.MYSQL_URL.includes('YourStrongPassword')) {
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Temporarily disable authentication for development
    // const session = await getServerSession(authOptions)
    
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }
    
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('List users error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
