import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().positive()
  })),
  shippingAddress: z.string(),
  totalAmount: z.number().positive()
})

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ORDERS API] GET request received')
    console.log('🔍 [ORDERS API] Headers:', {
      cookie: request.headers.get('cookie')?.substring(0, 100),
      auth: request.headers.get('authorization')
    })
    
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      console.error('🔴 [ORDERS API] Database not configured - MYSQL_URL missing')
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Get authenticated user from NextAuth session or custom session
    let userId: string | null = null
    let userEmail: string | null = null
    
    // Try NextAuth session first (for OAuth users)
    try {
      console.log('🔍 [ORDERS API] Checking NextAuth session...')
      const session = await getServerSession(authOptions)
      console.log('🔍 [ORDERS API] NextAuth session:', session ? 'Found' : 'Not found')
      if (session?.user) {
        console.log('🔍 [ORDERS API] Session user:', {
          email: session.user.email,
          id: session.user.id,
          name: session.user.name
        })
        
        userId = session.user.id
        userEmail = session.user.email
        
        // If ID is missing, try to find user by email
        if (!userId && userEmail) {
          console.log('🔍 [ORDERS API] No ID in session, finding by email...')
          const dbUser = await db.user.findUnique({
            where: { email: userEmail }
          })
          if (dbUser) {
            userId = dbUser.id
            console.log('✅ [ORDERS API] Found user in DB:', userId)
          }
        }
        
        if (userId) {
          console.log('✅ [ORDERS API] User authenticated via NextAuth:', userEmail, 'ID:', userId)
        }
      } else {
        console.log('⚠️ [ORDERS API] NextAuth session is null or no user')
      }
    } catch (error) {
      console.error('⚠️ [ORDERS API] NextAuth session check failed:', error)
    }
    
    // If no NextAuth session, check custom session from cookie (for credentials users)
    if (!userId) {
      console.log('🔍 [ORDERS API] Checking custom cookie session...')
      const cookies = request.headers.get('cookie')
      if (cookies && cookies.includes('user=')) {
        try {
          const userCookie = cookies.split('user=')[1]?.split(';')[0]
          if (userCookie) {
            const userData = JSON.parse(decodeURIComponent(userCookie))
            userId = userData.id
            userEmail = userData.email
            console.log('✅ [ORDERS API] User authenticated via cookie:', userEmail)
          }
        } catch (error) {
          console.warn('⚠️ [ORDERS API] Cookie parsing failed:', error)
        }
      }
    }
    
    if (!userId) {
      console.log('🔴 [ORDERS API] No authenticated user found')
      console.log('🔴 [ORDERS API] Checked NextAuth session: No user ID')
      console.log('🔴 [ORDERS API] Checked cookie: No user ID')
      return NextResponse.json(
        { 
          error: 'Authentication required. Please sign in to view orders.',
          debug: {
            hasSession: !!userEmail,
            hasUserId: !!userId
          }
        },
        { status: 401 }
      )
    }

    console.log('✅ [ORDERS API] Fetching orders for userId:', userId)

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statusFilter = searchParams.get('status') || ''
    const paymentStatusFilter = searchParams.get('paymentStatus') || ''

    const skip = (page - 1) * limit

    // Build where clause - ONLY show this user's orders
    const where: any = { 
      userId: userId // ⚠️ CRITICAL: Only show orders for authenticated user
    }
    
    // Filter by order status
    if (statusFilter) {
      where.status = statusFilter
    }
    
    // Filter by payment status
    if (paymentStatusFilter) {
      where.paymentStatus = paymentStatusFilter
    } else {
      // By default, only show orders with payment completed or pending
      // Don't show failed payments unless specifically requested
      where.paymentStatus = {
        in: ['PENDING', 'PROCESSING', 'COMPLETED']
      }
    }

    console.log('🔍 [ORDERS API] Query filters:', where)
    
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.order.count({ where })
    ])

    console.log(`✅ [ORDERS API] Found ${orders.length} orders (total: ${total})`)

    const totalPages = Math.ceil(total / limit)

    // Convert Decimal fields to numbers for consistent JSON serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      paymentAmount: order.paymentAmount ? Number(order.paymentAmount) : null,
      orderItems: order.orderItems.map(item => ({
        ...item,
        priceAtTimeOfPurchase: Number(item.priceAtTimeOfPurchase),
        product: {
          ...item.product,
          price: Number(item.product.price),
          previousPrice: item.product.previousPrice ? Number(item.product.previousPrice) : null,
        }
      }))
    }))

    return NextResponse.json({
      orders: serializedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('🔴 [ORDERS API] Get orders error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 [ORDERS API] POST request received')
    
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      console.error('🔴 [ORDERS API] Database not configured - MYSQL_URL missing')
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Get authenticated user - REQUIRED for creating orders
    let userId: string | null = null
    
    // Try NextAuth session first
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        userId = session.user.id
        console.log('✅ [ORDERS API] User authenticated via NextAuth:', session.user.email)
      }
    } catch (error) {
      console.warn('⚠️ [ORDERS API] NextAuth session check failed:', error)
    }
    
    // Check custom session from cookie if no NextAuth session
    if (!userId) {
      const cookies = request.headers.get('cookie')
      if (cookies && cookies.includes('user=')) {
        try {
          const userCookie = cookies.split('user=')[1]?.split(';')[0]
          if (userCookie) {
            const userData = JSON.parse(decodeURIComponent(userCookie))
            userId = userData.id
            console.log('✅ [ORDERS API] User authenticated via cookie:', userData.email)
          }
        } catch (error) {
          console.warn('⚠️ [ORDERS API] Cookie parsing failed:', error)
        }
      }
    }
    
    if (!userId) {
      console.log('🔴 [ORDERS API] No authenticated user found')
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to create an order.' },
        { status: 401 }
      )
    }
    
    console.log('✅ [ORDERS API] Creating order for userId:', userId)

    const body = await request.json()
    const { items, shippingAddress, totalAmount } = createOrderSchema.parse(body)

    // Validate stock availability
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.brand} ${product.model}` },
          { status: 400 }
        )
      }
    }

    // Create order with transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          totalAmount,
          shippingAddress,
          status: 'PENDING'
        }
      })

      // Create order items and update stock
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtTimeOfPurchase: item.price
          }
        })

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        })
      }

      return newOrder
    })

    return NextResponse.json({
      message: 'Order created successfully',
      order
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





