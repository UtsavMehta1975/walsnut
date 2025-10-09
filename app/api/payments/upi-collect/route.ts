import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * UPI Collect API - Creates a UPI payment request through Cashfree
 * This uses Cashfree's merchant VPA, not personal UPI ID
 * NO RISK WARNINGS!
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, upiId } = await request.json()

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

    console.log('🎯 Creating UPI Collect request via Cashfree')
    console.log('Order ID:', orderId)
    console.log('Amount:', order.totalAmount)

    // Create Cashfree order with UPI
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
        payment_methods: 'upi'
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
      console.error('Cashfree order creation error:', error)
      throw new Error('Failed to create payment order')
    }

    const orderData = await orderResponse.json()
    console.log('✅ Cashfree order created:', orderData.order_id)

    // If customer provided UPI ID, create UPI collect request
    if (upiId) {
      console.log('📱 Creating UPI Collect request for:', upiId)
      
      const upiCollectRequest = {
        order_id: orderData.order_id,
        payment_method: {
          upi: {
            channel: 'collect',
            upi_id: upiId
          }
        }
      }

      const paymentResponse = await fetch(`https://api.cashfree.com/pg/orders/${orderData.order_id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2023-08-01',
          'x-client-id': process.env.CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        },
        body: JSON.stringify(upiCollectRequest)
      })

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json()
        console.error('UPI Collect error:', error)
        throw new Error('Failed to initiate UPI collect')
      }

      const paymentData = await paymentResponse.json()
      console.log('✅ UPI Collect request sent:', paymentData)

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

      return NextResponse.json({
        success: true,
        message: 'UPI collect request sent. Check your UPI app.',
        orderId: cashfreeOrderId,
        cashfreeOrderId: orderData.order_id,
        paymentData: paymentData
      })
    }

    // If no UPI ID provided, return payment session for intent flow
    const sessionResponse = await fetch(`https://api.cashfree.com/pg/orders/${orderData.order_id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify({
        payment_method: {
          upi: {
            channel: 'link' // Generate UPI intent link
          }
        }
      })
    })

    if (!sessionResponse.ok) {
      const error = await sessionResponse.json()
      console.error('Payment session error:', error)
      throw new Error('Failed to create payment session')
    }

    const sessionData = await sessionResponse.json()
    console.log('✅ UPI intent link generated')

    // Update order
    await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PROCESSING',
        paymentMethod: 'upi',
        paymentGateway: 'cashfree',
        paymentTransactionId: cashfreeOrderId
      }
    })

    return NextResponse.json({
      success: true,
      paymentSessionId: orderData.payment_session_id,
      orderId: cashfreeOrderId,
      cashfreeOrderId: orderData.order_id,
      upiLink: sessionData.data?.payload?.upi_link || null,
      qrCode: sessionData.data?.payload?.qr_code || null
    })

  } catch (error: any) {
    console.error('❌ UPI Collect API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process UPI payment' },
      { status: 500 }
    )
  }
}

