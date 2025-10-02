'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, RefreshCw, Home, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  
  const orderId = searchParams.get('order_id')
  const errorMessage = searchParams.get('error_message') || 'Payment could not be processed'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Failure Header */}
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-red-800 mb-2">
                Payment Failed
              </h1>
              <p className="text-red-600 text-lg mb-4">
                {errorMessage}
              </p>
              {orderId && (
                <p className="text-sm text-gray-600">
                  Order ID: {orderId}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What can you do?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Try Again</h3>
                  <p className="text-sm text-gray-600">
                    You can retry the payment with a different payment method.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShoppingBag className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Check Payment Method</h3>
                  <p className="text-sm text-gray-600">
                    Ensure your card has sufficient balance or try a different payment method.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <XCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Contact Support</h3>
                  <p className="text-sm text-gray-600">
                    If the problem persists, please contact our support team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Common Payment Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Insufficient Balance</h4>
                <p className="text-sm text-gray-600">
                  Make sure your account has enough funds for the transaction.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Card Expired</h4>
                <p className="text-sm text-gray-600">
                  Check if your card has expired and use a valid card.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold">Network Issues</h4>
                <p className="text-sm text-gray-600">
                  Check your internet connection and try again.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/checkout" className="flex-1">
              <Button className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
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
