import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 [LIST USERS API] Request received')
    
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Check admin authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const userEmail = authHeader.replace('Bearer ', '')
      const adminUser = await db.user.findUnique({
        where: { email: userEmail },
        select: { role: true }
      })

      if (!adminUser || adminUser.role !== 'ADMIN') {
        console.error('🔴 [LIST USERS API] Not authorized:', userEmail)
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
      console.log('✅ [LIST USERS API] Admin verified:', userEmail)
    }
    
    console.log('📊 [LIST USERS API] Fetching users with order statistics...')
    
    // Fetch users with their order statistics
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            totalAmount: true,
            status: true,
            paymentStatus: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ [LIST USERS API] Found ${users.length} users`)

    // Calculate order statistics for each user
    const usersWithStats = users.map(user => {
      // Count only completed/confirmed orders
      const completedOrders = user.orders.filter(order => 
        order.paymentStatus === 'COMPLETED' || 
        order.status === 'CONFIRMED' || 
        order.status === 'SHIPPED' || 
        order.status === 'DELIVERED'
      )
      
      const totalOrders = completedOrders.length
      const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        orderCount: totalOrders,
        totalSpent: totalSpent,
        isActive: totalOrders > 0 || (new Date().getTime() - new Date(user.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 // Active if has orders or joined in last 30 days
      }
    })

    console.log('✅ [LIST USERS API] Calculated statistics for all users')

    return NextResponse.json(usersWithStats)
  } catch (error) {
    console.error('🔴 [LIST USERS API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
