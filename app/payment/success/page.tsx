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
  
  const orderId = searchParams.get('order_id')
  const paymentId = searchParams.get('cf_payment_id')

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      fetchOrderDetails(orderId)
    } else {
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data.order)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{orderDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment ID</p>
                    <p className="font-semibold">{paymentId || 'N/A'}</p>
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
                
                {orderDetails.shippingAddress && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{orderDetails.shippingAddress}</p>
                    </div>
                  </div>
                )}
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
