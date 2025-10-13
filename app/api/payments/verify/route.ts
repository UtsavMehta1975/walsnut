import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { orderId, cfOrderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Verifying payment for order:', orderId)

    // Step 1: Get order from database
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      console.error('❌ Order not found:', orderId)
      return NextResponse.json(
        { error: 'Order not found', verified: false },
        { status: 404 }
      )
    }

    console.log('📦 Order found:', {
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
    })

    // Step 2: Check if already verified
    if (order.paymentStatus === 'COMPLETED' && order.status === 'CONFIRMED') {
      console.log('✅ Payment already verified and completed')
      return NextResponse.json({
        verified: true,
        status: 'COMPLETED',
        order: {
          id: order.id,
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          paymentTransactionId: order.paymentTransactionId,
          customerEmail: order.user.email,
          customerName: order.user.name,
          customerPhone: order.user.phone,
        },
      })
    }

    // Step 3: Verify with Cashfree API if cfOrderId provided
    if (cfOrderId && process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) {
      try {
        console.log('🔐 Verifying with Cashfree API:', cfOrderId)
        
        const cashfreeResponse = await fetch(
          `https://api.cashfree.com/pg/orders/${cfOrderId}`,
          {
            method: 'GET',
            headers: {
              'x-api-version': '2023-08-01',
              'x-client-id': process.env.CASHFREE_APP_ID,
              'x-client-secret': process.env.CASHFREE_SECRET_KEY,
            },
          }
        )

        if (cashfreeResponse.ok) {
          const cashfreeData = await cashfreeResponse.json()
          console.log('💳 Cashfree response:', {
            order_id: cashfreeData.order_id,
            order_status: cashfreeData.order_status,
            payment_status: cashfreeData.order_status,
          })

          // Check if payment is successful in Cashfree
          if (cashfreeData.order_status === 'PAID') {
            // Update order status to COMPLETED
            await db.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: 'COMPLETED',
                status: 'CONFIRMED',
                paymentCompletedAt: new Date(),
              },
            })

            console.log('✅ Payment verified and order updated to COMPLETED')

            return NextResponse.json({
              verified: true,
              status: 'COMPLETED',
              order: {
                id: order.id,
                status: 'CONFIRMED',
                paymentStatus: 'COMPLETED',
                totalAmount: order.totalAmount,
                shippingAddress: order.shippingAddress,
                paymentTransactionId: order.paymentTransactionId,
                customerEmail: order.user.email,
                customerName: order.user.name,
                customerPhone: order.user.phone,
              },
            })
          } else if (cashfreeData.order_status === 'ACTIVE') {
            // Payment is pending
            console.log('⏳ Payment is still pending')
            return NextResponse.json({
              verified: false,
              status: 'PENDING',
              message: 'Payment is being processed',
            })
          } else if (cashfreeData.order_status === 'EXPIRED' || cashfreeData.order_status === 'TERMINATED' || cashfreeData.order_status === 'USER_DROPPED') {
            // Payment cancelled or expired by user
            console.log('🚫 Payment cancelled/dropped by user:', cashfreeData.order_status)
            
            await db.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: 'CANCELLED',
                status: 'CANCELLED',
              },
            })

            return NextResponse.json({
              verified: false,
              status: 'CANCELLED',
              message: 'Payment was cancelled. You can retry payment from your orders page.',
            })
          } else {
            // Payment failed
            console.log('❌ Payment failed in Cashfree:', cashfreeData.order_status)
            
            await db.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: 'FAILED',
                status: 'CANCELLED',
              },
            })

            return NextResponse.json({
              verified: false,
              status: 'FAILED',
              message: 'Payment failed. Please try again from your orders page.',
            })
          }
        } else {
          console.error('❌ Cashfree API error:', await cashfreeResponse.text())
        }
      } catch (cfError) {
        console.error('❌ Error verifying with Cashfree:', cfError)
      }
    }

    // Step 4: Return current order status if Cashfree verification not possible
    if (order.paymentStatus === 'PENDING' || order.paymentStatus === 'PROCESSING') {
      console.log('⏳ Payment is still processing')
      return NextResponse.json({
        verified: false,
        status: 'PENDING',
        message: 'Payment is being processed. Please wait a moment.',
      })
    }

    if (order.paymentStatus === 'FAILED') {
      console.log('❌ Payment failed')
      return NextResponse.json({
        verified: false,
        status: 'FAILED',
        message: 'Payment failed. Please try again.',
      })
    }

    // Default: treat as pending
    console.log('⏳ Payment verification inconclusive, treating as pending')
    return NextResponse.json({
      verified: false,
      status: 'PENDING',
      message: 'Payment verification in progress',
    })
  } catch (error) {
    console.error('❌ Payment verification error:', error)
    return NextResponse.json(
      {
        error: 'Failed to verify payment',
        verified: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

