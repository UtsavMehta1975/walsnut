import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * UPI Collect API - Creates a UPI payment request through Cashfree
 * This uses Cashfree's merchant VPA, not personal UPI ID
 * NO RISK WARNINGS!
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Get order details
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            name: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const cashfreeOrderId = `order_${order.id}_${Date.now()}`

    console.log('🎯 Creating Cashfree order for payment page')
    console.log('Order ID:', orderId)
    console.log('Amount:', order.totalAmount)

    // Create Cashfree order - payment page will handle UPI selection
    const orderRequest = {
      order_id: cashfreeOrderId,
      order_amount: Number(order.totalAmount),
      order_currency: 'INR',
      customer_details: {
        customer_id: order.userId,
        customer_email: order.user.email,
        customer_phone: order.user.phone || '9999999999',
        customer_name: order.user.name || 'Customer'
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id=${cashfreeOrderId}`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
        payment_methods: 'upi' // Only show UPI on payment page
      }
    }

    // Create order with Cashfree
    const orderResponse = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify(orderRequest)
    })

    if (!orderResponse.ok) {
      const error = await orderResponse.json()
      console.error('❌ Cashfree order creation error:', error)
      throw new Error('Failed to create payment order')
    }

    const orderData = await orderResponse.json()
    console.log('✅ Cashfree order created:', orderData.order_id)
    console.log('✅ Payment session ID:', orderData.payment_session_id)

    // Update order status
    await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PROCESSING',
        paymentMethod: 'upi',
        paymentGateway: 'cashfree',
        paymentTransactionId: cashfreeOrderId
      }
    })

    // Return payment session for Cashfree checkout
    return NextResponse.json({
      success: true,
      paymentSessionId: orderData.payment_session_id,
      orderId: cashfreeOrderId,
      cashfreeOrderId: orderData.order_id
    })

  } catch (error: any) {
    console.error('❌ UPI payment API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process UPI payment' },
      { status: 500 }
    )
  }
}

