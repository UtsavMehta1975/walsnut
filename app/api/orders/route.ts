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
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Temporarily disable authentication for development
    // TODO: Re-implement proper authentication
    // Use the first user from the database for testing
    const firstUser = await db.user.findFirst()
    if (!firstUser) {
      return NextResponse.json(
        { error: 'No users found in database' },
        { status: 500 }
      )
    }
    const userId = firstUser.id

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    const where: any = { userId: userId }
    if (status) {
      where.status = status
    }

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
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.order.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    // Convert Decimal fields to numbers for consistent JSON serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount),
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
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Temporarily disable authentication for development
    // TODO: Re-implement proper authentication
    // Use the first user from the database for testing
    const firstUser = await db.user.findFirst()
    if (!firstUser) {
      return NextResponse.json(
        { error: 'No users found in database' },
        { status: 500 }
      )
    }
    const userId = firstUser.id

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





