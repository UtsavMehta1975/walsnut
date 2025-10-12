import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Fetch admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    console.log('📊 [ADMIN STATS API] Request received')
    
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      return NextResponse.json(
        { error: 'Database not configured.' },
        { status: 503 }
      )
    }

    // Check admin authorization using server-side session
    const session = await getServerSession(authOptions)
    
    let adminEmail: string | null = null
    let isAdmin = false
    
    if (session?.user?.email) {
      adminEmail = session.user.email
      isAdmin = session.user.role === 'ADMIN'
      console.log('✅ [ADMIN STATS API] NextAuth session:', adminEmail, 'Role:', session.user.role)
    }
    
    // Fallback: Check Authorization header
    if (!adminEmail) {
      const authHeader = request.headers.get('authorization')
      if (authHeader) {
        const userEmail = authHeader.replace('Bearer ', '')
        const user = await db.user.findUnique({
          where: { email: userEmail },
          select: { role: true }
        })
        if (user) {
          adminEmail = userEmail
          isAdmin = user.role === 'ADMIN'
        }
      }
    }

    if (!adminEmail || !isAdmin) {
      console.error('🔴 [ADMIN STATS API] Not authorized')
      return NextResponse.json(
        { error: 'Admin access required. Please sign in as admin.' },
        { status: 403 }
      )
    }

    console.log('✅ [ADMIN STATS API] Admin verified, calculating statistics...')

    // Fetch all necessary data in parallel
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      orders
    ] = await Promise.all([
      db.product.count(),
      db.user.count({ where: { role: 'CUSTOMER' } }),
      db.order.count(),
      db.order.findMany({
        select: {
          totalAmount: true,
          status: true,
          paymentStatus: true,
          createdAt: true
        }
      })
    ])

    // Calculate revenue from completed orders
    const completedOrders = orders.filter(order => 
      order.paymentStatus === 'COMPLETED' || 
      order.status === 'DELIVERED'
    )
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
    
    // Calculate order statistics
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED').length
    const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length
    const refundedOrders = orders.filter(o => o.status === 'REFUNDED').length
    
    // Calculate payment statistics
    const pendingPayments = orders.filter(o => o.paymentStatus === 'PENDING').length
    const completedPayments = orders.filter(o => o.paymentStatus === 'COMPLETED').length
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentOrders = orders.filter(o => new Date(o.createdAt) > sevenDaysAgo)
    const recentRevenue = recentOrders
      .filter(o => o.paymentStatus === 'COMPLETED')
      .reduce((sum, order) => sum + Number(order.totalAmount), 0)

    const stats = {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      
      ordersByStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        refunded: refundedOrders
      },
      
      paymentStats: {
        pending: pendingPayments,
        completed: completedPayments
      },
      
      recentActivity: {
        ordersLast7Days: recentOrders.length,
        revenueLast7Days: recentRevenue
      }
    }

    console.log('✅ [ADMIN STATS API] Statistics calculated:', stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('🔴 [ADMIN STATS API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

