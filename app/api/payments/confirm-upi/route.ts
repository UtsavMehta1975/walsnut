import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendUPIPaymentNotification } from '@/lib/email'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { orderId, utrNumber, amount, paymentMethod } = await request.json()

    if (!orderId || !utrNumber) {
      return NextResponse.json(
        { error: 'Order ID and UTR number are required' },
        { status: 400 }
      )
    }

    // Validate UTR format (12 digits)
    if (!/^\d{12}$/.test(utrNumber)) {
      return NextResponse.json(
        { error: 'Invalid UTR number. Must be 12 digits.' },
        { status: 400 }
      )
    }

    // Update order with payment details and fetch customer info
    const order = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PROCESSING', // Will be verified manually
        paymentMethod: paymentMethod || 'upi_manual',
        paymentTransactionId: utrNumber,
        paymentGateway: 'upi_direct',
        status: 'PENDING', // Order pending verification
      },
      include: {
        user: true
      }
    })

    console.log(`✅ UPI Payment confirmation received for order ${orderId}`)
    console.log(`💳 UTR Number: ${utrNumber}`)
    console.log(`💰 Amount: ₹${amount}`)
    console.log(`🔍 Status: Pending manual verification`)

    // Send notification to admin for verification
    try {
      await sendUPIPaymentNotification({
        orderId: order.id,
        utrNumber: utrNumber,
        amount: amount,
        customerEmail: order.user?.email || undefined,
        customerName: order.user?.name || undefined,
        customerPhone: order.user?.phone || undefined
      })
      console.log('✅ Admin notification sent successfully')
    } catch (emailError) {
      console.error('⚠️ Failed to send admin notification (non-blocking):', emailError)
      // Don't fail the payment confirmation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmation received. We will verify and confirm your order soon.',
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    })

  } catch (error) {
    console.error('UPI payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment confirmation' },
      { status: 500 }
    )
  }
}

