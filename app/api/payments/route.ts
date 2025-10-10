import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
// Cashfree SDK will be imported dynamically to avoid build issues

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      console.error('Database not configured - MYSQL_URL missing')
      return NextResponse.json(
        { error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Check if Cashfree credentials are configured
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error('Cashfree credentials not configured')
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact administrator.' },
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

    const { orderId, paymentMethod, amount, isCOD } = await request.json()
    
    // Get order details
    const order = await db.order.findUnique({
      where: { id: orderId, userId: userId },
      include: { orderItems: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Generate unique order ID for Cashfree
    const cashfreeOrderId = `order_${order.id}_${Date.now()}`
    
    // Use custom amount for COD (₹200 advance) or full amount for other methods
    const paymentAmount = amount || Number(order.totalAmount)
    
    console.log('💳 Payment details:', {
      orderId,
      isCOD,
      totalOrderAmount: Number(order.totalAmount),
      paymentAmount,
      method: paymentMethod
    })
    
    // Create payment session using Cashfree API directly
    const paymentSessionRequest = {
      order_id: cashfreeOrderId,
      order_amount: paymentAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: userId,
        customer_email: firstUser.email,
        customer_phone: firstUser.phone || '9999999999',
        customer_name: firstUser.name || 'Customer'
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id={order_id}`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`
      },
      order_note: isCOD 
        ? `COD Order - ₹${paymentAmount} advance (Total: ₹${order.totalAmount})` 
        : `Order for ${order.orderItems.length} items`,
      order_tags: {
        order_type: 'ecommerce',
        payment_method: paymentMethod,
        is_cod: isCOD ? 'true' : 'false',
        full_amount: String(order.totalAmount)
      }
    }

    // Call Cashfree API directly
    const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify(paymentSessionRequest)
    })

    if (!cashfreeResponse.ok) {
      const errorData = await cashfreeResponse.json()
      throw new Error(`Cashfree API error: ${errorData.message || 'Failed to create payment session'}`)
    }

    const paymentSession = await cashfreeResponse.json()
    
    if (!paymentSession || !paymentSession.payment_session_id) {
      throw new Error('Failed to create payment session')
    }

    // Update order with payment details
    await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PROCESSING',
        paymentMethod,
        paymentGateway: 'cashfree',
        paymentTransactionId: cashfreeOrderId
      }
    })

    return NextResponse.json({
      paymentSessionId: paymentSession.payment_session_id,
      orderId: cashfreeOrderId,
      amount: paymentAmount,
      totalAmount: Number(order.totalAmount),
      isCOD: isCOD || false,
      currency: 'INR'
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    )
  }
}
