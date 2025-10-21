import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
// Cashfree SDK will be imported dynamically to avoid build issues

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

    const { orderId, paymentMethod, amount, isCOD, customerInfo } = await request.json()
    
    console.log('💳 [PAYMENT] Payment request received:', { orderId, paymentMethod, amount, isCOD })
    
    // Get order details first (order contains userId)
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { 
        orderItems: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true
          }
        }
      }
    })

    if (!order) {
      console.error('❌ [PAYMENT] Order not found:', orderId)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Ensure we have customer identity
    const userForPayment = order.user || {
      id: 'guest',
      email: customerInfo?.email,
      name: `${customerInfo?.firstName || ''} ${customerInfo?.lastName || ''}`.trim() || 'Customer',
      phone: customerInfo?.phone || '9999999999'
    }
    if (!userForPayment.email) {
      console.error('❌ [PAYMENT] Missing customer email for payment')
      return NextResponse.json({ error: 'Customer email required for payment' }, { status: 400 })
    }

    // Ensure cookie is set so subsequent pages (orders) can read session
    try {
      const cookieStore = cookies()
      cookieStore.set('user', JSON.stringify({
        id: userForPayment.id,
        email: userForPayment.email,
        name: userForPayment.name,
        phone: userForPayment.phone,
        role: 'CUSTOMER'
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
    } catch {}
    
    console.log('✅ [PAYMENT] Order found:', { orderId: order.id, userId: order.userId, totalAmount: order.totalAmount })

    // Generate unique order ID for Cashfree
    const cashfreeOrderId = `order_${order.id}_${Date.now()}`
    
    // Use custom amount for COD (₹200 advance) or full amount for other methods
    const paymentAmount = amount || Number(order.totalAmount)
    
    console.log('💳 [PAYMENT] Payment details:', {
      orderId,
      isCOD,
      totalOrderAmount: Number(order.totalAmount),
      paymentAmount,
      method: paymentMethod,
      customerEmail: order.user.email
    })
    
    // Create payment session using Cashfree API directly
    const paymentSessionRequest = {
      order_id: cashfreeOrderId,
      order_amount: paymentAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: userForPayment.id,
        customer_email: userForPayment.email!,
        customer_phone: userForPayment.phone || '9999999999',
        customer_name: userForPayment.name || 'Customer'
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

  } catch (error: any) {
    console.error('❌ Payment initialization error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    })
    return NextResponse.json(
      { 
        error: 'Payment initialization failed',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
