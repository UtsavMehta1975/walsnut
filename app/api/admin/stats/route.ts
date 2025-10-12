import { NextRequest, NextResponse } from 'next/server'
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

    // Check admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const userEmail = authHeader.replace('Bearer ', '')
    const adminUser = await db.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })

    if (!adminUser || adminUser.role !== 'ADMIN') {
      console.error('🔴 [ADMIN STATS API] Not authorized:', userEmail)
      return NextResponse.json(
        { error: 'Admin access required' },
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
    const processingOrders = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length
    const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length
    
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
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders
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

