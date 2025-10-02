import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentMethod } = await request.json()
    
    console.log('Payment test request:', { orderId, paymentMethod })
    
    // Simulate payment session creation
    const mockPaymentSessionId = `test_session_${Date.now()}`
    
    return NextResponse.json({
      paymentSessionId: mockPaymentSessionId,
      message: 'Test payment session created',
      orderId: orderId,
      paymentMethod: paymentMethod
    })
  } catch (error) {
    console.error('Payment test error:', error)
    return NextResponse.json({
      error: 'Payment test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
