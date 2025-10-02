import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Verify webhook signature
function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET || '')
    .update(body)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-webhook-signature') || ''
    
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(body)
    const { type, data: eventData } = data

    console.log('Cashfree webhook received:', type, eventData)

    // Handle different webhook events
    switch (type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await handlePaymentSuccess(eventData)
        break
      case 'PAYMENT_FAILED_WEBHOOK':
        await handlePaymentFailed(eventData)
        break
      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        await handlePaymentCancelled(eventData)
        break
      default:
        console.log('Unhandled webhook type:', type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(data: any) {
  const { order_id, cf_payment_id, payment_amount, payment_currency } = data
  
  // Extract our order ID from Cashfree order ID
  const orderId = order_id.split('_')[1]
  
  await db.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'COMPLETED',
      status: 'CONFIRMED',
      paymentTransactionId: cf_payment_id,
      paymentAmount: payment_amount,
      paymentCurrency: payment_currency,
      paymentCompletedAt: new Date()
    }
  })

  console.log(`Payment successful for order ${orderId}`)
}

async function handlePaymentFailed(data: any) {
  const { order_id, cf_payment_id } = data
  
  // Extract our order ID from Cashfree order ID
  const orderId = order_id.split('_')[1]
  
  await db.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'FAILED',
      paymentTransactionId: cf_payment_id
    }
  })

  console.log(`Payment failed for order ${orderId}`)
}

async function handlePaymentCancelled(data: any) {
  const { order_id } = data
  
  // Extract our order ID from Cashfree order ID
  const orderId = order_id.split('_')[1]
  
  await db.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'CANCELLED'
    }
  })

  console.log(`Payment cancelled for order ${orderId}`)
}
