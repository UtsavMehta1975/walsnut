'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed' | 'pending'>('verifying')
  const [verificationMessage, setVerificationMessage] = useState('Verifying your payment...')
  const [retryCount, setRetryCount] = useState(0)
  
  const orderId = searchParams.get('order_id')?.replace('order_', '').split('_')[0]
  const cfOrderId = searchParams.get('order_id')
  const paymentId = searchParams.get('cf_payment_id')

  useEffect(() => {
    if (orderId) {
      verifyAndFetchOrder(orderId, cfOrderId || undefined)
    } else {
      setLoading(false)
      setVerificationStatus('failed')
      setVerificationMessage('No order ID provided')
    }
  }, [orderId, cfOrderId])

  const verifyAndFetchOrder = async (orderId: string, cfOrderId?: string, retry = 0) => {
    try {
      console.log('🔍 Verifying payment for order:', orderId)
      setVerificationMessage('Verifying your payment...')

      // Step 1: Verify payment with our backend
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, cfOrderId }),
      })

      const verifyData = await verifyResponse.json()
      console.log('📦 Verification response:', verifyData)

      if (verifyData.verified && verifyData.status === 'COMPLETED') {
        // Payment verified successfully
        setVerificationStatus('success')
        setOrderDetails(verifyData.order)
        setVerificationMessage('Payment verified successfully!')
        setLoading(false)
      } else if (verifyData.status === 'PENDING' && retry < 3) {
        // Payment is still being processed, retry after 2 seconds
        setVerificationMessage('Payment is being processed, please wait...')
        setRetryCount(retry + 1)
        setTimeout(() => {
          verifyAndFetchOrder(orderId, cfOrderId, retry + 1)
        }, 2000)
      } else if (verifyData.status === 'FAILED') {
        // Payment failed
        setVerificationStatus('failed')
        setVerificationMessage(verifyData.message || 'Payment verification failed')
        setLoading(false)
        
        // Redirect to failure page after 2 seconds
        setTimeout(() => {
          router.push(`/payment/failure?order_id=${orderId}&error_message=${encodeURIComponent(verifyData.message || 'Payment failed')}`)
        }, 2000)
      } else {
        // Pending but max retries reached
        setVerificationStatus('pending')
        setVerificationMessage('Payment is taking longer than expected. We will notify you once confirmed.')
        setLoading(false)
      }
    } catch (error) {
      console.error('❌ Error verifying payment:', error)
      
      if (retry < 3) {
        // Retry on error
        setTimeout(() => {
          verifyAndFetchOrder(orderId, cfOrderId, retry + 1)
        }, 2000)
      } else {
        setVerificationStatus('failed')
        setVerificationMessage('Failed to verify payment. Please contact support.')
        setLoading(false)
      }
    }
  }

  if (loading || verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-800 font-semibold text-lg mb-2">{verificationMessage}</p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500">Attempt {retryCount} of 3</p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show failure message if verification failed
  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-red-800 mb-2">
                  Payment Verification Failed
                </h1>
                <p className="text-red-600 text-lg">
                  {verificationMessage}
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Redirecting to payment failure page...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show pending message if payment is still processing
  if (verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-yellow-800 mb-2">
                  Payment Processing
                </h1>
                <p className="text-yellow-600 text-lg">
                  {verificationMessage}
                </p>
                <div className="mt-6">
                  <Link href="/orders">
                    <Button>
                      <Package className="h-4 w-4 mr-2" />
                      Check Order Status
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-600 text-lg">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </CardContent>
          </Card>

          {/* Order Details */}
          {orderDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold break-all">{orderDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment ID</p>
                    <p className="font-semibold break-all">{paymentId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">₹{orderDetails.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-green-600 capitalize">
                      {orderDetails.status}
                    </p>
                  </div>
                </div>
                
                {/* Customer Information */}
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Customer Information</p>
                  <div className="space-y-2">
                    {orderDetails.customerName && (
                      <div className="flex items-start">
                        <span className="text-sm text-gray-600 w-20">Name:</span>
                        <span className="text-sm font-medium flex-1">{orderDetails.customerName}</span>
                      </div>
                    )}
                    {orderDetails.customerEmail && (
                      <div className="flex items-start">
                        <span className="text-sm text-gray-600 w-20">Email:</span>
                        <span className="text-sm font-medium flex-1 break-all">{orderDetails.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {orderDetails.shippingAddress ? (
                      <p className="font-medium text-sm">{orderDetails.shippingAddress}</p>
                    ) : (
                      <p className="text-sm text-amber-600 flex items-center">
                        <span className="mr-2">⚠️</span>
                        Shipping address not provided. Please contact support to update your delivery address.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Order Processing</h3>
                  <p className="text-sm text-gray-600">
                    We'll process your order and prepare it for shipment within 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Shipping</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive a tracking number via email once your order ships.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Your order will be delivered within 3-7 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/orders" className="flex-1">
              <Button className="w-full" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                View All Orders
              </Button>
            </Link>
            
            <Link href="/" className="flex-1">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
