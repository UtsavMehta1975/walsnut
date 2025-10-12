import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Fetch ALL orders for admin (not filtered by user)
export async function GET(request: NextRequest) {
  try {
    console.log('📦 [ADMIN ORDERS API] Request received')
    
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      console.error('🔴 [ADMIN ORDERS API] Database not configured')
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Check admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      console.error('🔴 [ADMIN ORDERS API] No authorization header')
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const userEmail = authHeader.replace('Bearer ', '')
    const adminUser = await db.user.findUnique({
      where: { email: userEmail },
      select: { role: true, email: true }
    })

    if (!adminUser || adminUser.role !== 'ADMIN') {
      console.error('🔴 [ADMIN ORDERS API] Not authorized:', userEmail, 'Role:', adminUser?.role)
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    console.log('✅ [ADMIN ORDERS API] Admin verified:', userEmail)

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100') // Higher limit for admin
    const statusFilter = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause - NO userId filter (fetch ALL orders)
    const where: any = {}
    
    if (statusFilter) {
      where.status = statusFilter
    }

    console.log('🔍 [ADMIN ORDERS API] Fetching ALL orders...')
    
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  brand: true,
                  model: true,
                  price: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                    select: {
                      imageUrl: true
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.order.count({ where })
    ])

    console.log(`✅ [ADMIN ORDERS API] Found ${orders.length} orders (total: ${total})`)

    const totalPages = Math.ceil(total / limit)

    // Convert Decimal fields to numbers and format data
    const serializedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.user.name || order.user.email,
      customerEmail: order.user.email,
      customerPhone: order.user.phone || 'N/A',
      total: Number(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod || 'N/A',
      date: order.createdAt.toISOString(),
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber || null,
      items: order.orderItems.map(item => ({
        productId: item.productId,
        productName: `${item.product.brand} ${item.product.model}`,
        quantity: item.quantity,
        price: Number(item.priceAtTimeOfPurchase)
      }))
    }))

    // Calculate dashboard statistics
    const stats = {
      totalOrders: total,
      totalRevenue: serializedOrders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
      averageOrderValue: total > 0 ? serializedOrders.reduce((sum, order) => sum + order.total, 0) / total : 0
    }

    console.log('📊 [ADMIN ORDERS API] Statistics:', stats)

    return NextResponse.json({
      orders: serializedOrders,
      stats: stats,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('🔴 [ADMIN ORDERS API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

