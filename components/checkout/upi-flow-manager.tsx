'use client'

import { useState, useEffect } from 'react'
import { UPIApps } from './upi-apps'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PhonePeLogo, GooglePayLogo, PaytmLogo, GenericUPILogo } from './upi-app-logos'

interface UPIFlowManagerProps {
  amount: number
  orderDetails: {
    orderId: string
    customerName: string
    customerEmail: string
  }
}

export function UPIFlowManager({ amount, orderDetails }: UPIFlowManagerProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string>('')
  const router = useRouter()

  const handleUPIPayment = async (appName: string) => {
    setIsProcessing(true)
    setSelectedApp(appName)
    
    try {
      console.log('🚀 Starting UPI payment via Cashfree payment page')
      console.log('💰 Amount:', amount)
      console.log('📱 App selected:', appName)
      
      toast('Creating order...', { icon: '⏳', duration: 2000 })
      
      // Create order first
      console.log('📝 Creating order...')
      const createOrderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [], // Will be populated from cart in API
          totalAmount: amount,
          shippingAddress: 'Pending', // Will be updated
          paymentMethod: 'upi'
        })
      })
      
      console.log('📡 Order API response status:', createOrderResponse.status)
      
      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.text()
        console.error('❌ Order creation failed:', errorData)
        throw new Error('Failed to create order: ' + errorData)
      }
      
      const { order } = await createOrderResponse.json()
      console.log('✅ Order created successfully:', order.id)
      
      toast('Initializing payment...', { icon: '💳', duration: 2000 })
      
      // Use Cashfree's UPI payment API
      console.log('💳 Calling UPI payment API...')
      const upiResponse = await fetch('/api/payments/upi-collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id
        })
      })
      
      console.log('📡 UPI API response status:', upiResponse.status)
      
      if (!upiResponse.ok) {
        const errorData = await upiResponse.text()
        console.error('❌ UPI payment init failed:', errorData)
        throw new Error('Failed to initialize UPI payment: ' + errorData)
      }
      
      const upiData = await upiResponse.json()
      console.log('✅ UPI payment response:', JSON.stringify(upiData, null, 2))
      
      if (!upiData.paymentSessionId) {
        console.error('❌ No payment session ID in response:', upiData)
        throw new Error('Payment session not created - missing paymentSessionId')
      }
      
      console.log('✅ Payment session ID obtained:', upiData.paymentSessionId)
      
      toast('Loading payment page...', { icon: '🔄', duration: 2000 })
      
      // Always use Cashfree's payment page (NO RISK WARNINGS!)
      console.log('📱 Loading Cashfree SDK...')
      
      // Load Cashfree SDK
      const loadCashfreeSDK = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).Cashfree) {
            console.log('✅ Cashfree SDK already loaded')
            resolve()
            return
          }
          
          console.log('⬇️ Downloading Cashfree SDK...')
          const script = document.createElement('script')
          script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
          script.onload = () => {
            console.log('✅ Cashfree SDK downloaded')
            resolve()
          }
          script.onerror = () => {
            console.error('❌ Failed to load Cashfree SDK')
            reject(new Error('Failed to load Cashfree SDK'))
          }
          document.head.appendChild(script)
        })
      }
      
      await loadCashfreeSDK()
      console.log('✅ Cashfree SDK ready')
      
      // Initialize Cashfree
      console.log('🔧 Initializing Cashfree instance...')
      const cashfree = new (window as any).Cashfree({
        mode: 'production'
      })
      console.log('✅ Cashfree instance created')
      
      // Open Cashfree's verified payment page
      const returnUrl = `${window.location.origin}/payment/success?order_id=${upiData.orderId}`
      console.log('🌐 Return URL:', returnUrl)
      console.log('🎫 Payment Session ID:', upiData.paymentSessionId)
      console.log('🚀 Opening Cashfree checkout...')
      
      const checkoutOptions = {
        paymentSessionId: upiData.paymentSessionId,
        returnUrl: returnUrl
      }
      
      console.log('📋 Checkout options:', checkoutOptions)
      
      cashfree.checkout(checkoutOptions)
      
      console.log('✅ Cashfree checkout initiated!')
      
      toast.success('Opening Cashfree payment page...', {
        duration: 3000,
        icon: '🔒'
      })
      
    } catch (error: any) {
      console.error('❌ UPI payment error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      toast.error(error.message || 'Failed to initiate payment. Check console for details.', {
        duration: 5000
      })
    } finally {
      console.log('🏁 Payment flow complete (processing stopped)')
      setIsProcessing(false)
      setSelectedApp('')
    }
  }

  // Show UPI app buttons with Cashfree integration and REAL logos
  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', color: 'from-purple-600 to-purple-800', Logo: PhonePeLogo },
    { id: 'gpay', name: 'Google Pay', color: 'from-blue-500 to-blue-700', Logo: GooglePayLogo },
    { id: 'paytm', name: 'Paytm', color: 'from-cyan-500 to-blue-600', Logo: PaytmLogo },
    { id: 'other', name: 'Other UPI', color: 'from-gray-700 to-gray-900', Logo: GenericUPILogo }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          🔒 Pay with UPI - Cashfree Gateway
        </h3>
        <p className="text-sm text-gray-600">
          Opens secure payment page • No risk warnings • Choose your UPI app
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {upiApps.map((app) => {
          const Logo = app.Logo
          return (
            <button
              key={app.id}
              onClick={() => handleUPIPayment(app.name)}
              disabled={isProcessing}
              className="relative bg-white border-2 border-gray-200 rounded-xl p-4 shadow-md hover:shadow-xl hover:border-yellow-400 transform hover:scale-105 transition-all duration-200 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && selectedApp === app.name ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-2"></div>
                  <div className="text-xs text-gray-600">Opening...</div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-2">
                    <Logo />
                  </div>
                  <div className="text-sm font-bold text-gray-900">{app.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Tap to Pay</div>
                </>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount to Pay:</span>
          <span className="text-2xl font-bold text-green-600">
            ₹{amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-green-800 font-bold">
            ✅ SECURE PAYMENT PAGE • NO RISK WARNINGS
          </p>
        </div>
        <p className="text-xs text-gray-600 text-center">
          RBI Authorized Gateway • Verified Merchant • PCI DSS Certified
        </p>
      </div>
    </div>
  )
}

