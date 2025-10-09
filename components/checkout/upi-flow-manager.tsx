'use client'

import { useState, useEffect } from 'react'
import { UPIApps } from './upi-apps'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

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
      console.log('🚀 Initiating proper Cashfree UPI payment (no risk warnings!)')
      
      // Create order first
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
      
      if (!createOrderResponse.ok) {
        throw new Error('Failed to create order')
      }
      
      const { order } = await createOrderResponse.json()
      console.log('✅ Order created:', order.id)
      
      // Use Cashfree's UPI Collect/Intent API (proper merchant flow)
      const upiResponse = await fetch('/api/payments/upi-collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id
        })
      })
      
      if (!upiResponse.ok) {
        throw new Error('Failed to initialize UPI payment')
      }
      
      const upiData = await upiResponse.json()
      console.log('✅ UPI payment initialized:', upiData)
      
      if (!upiData.paymentSessionId) {
        throw new Error('Payment session not created')
      }
      
      // Always use Cashfree's payment page (NO RISK WARNINGS!)
      console.log('📱 Opening Cashfree payment page with UPI')
      
      // Load Cashfree SDK
      const loadCashfreeSDK = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).Cashfree) {
            resolve()
            return
          }
          
          const script = document.createElement('script')
          script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Cashfree SDK'))
          document.head.appendChild(script)
        })
      }
      
      await loadCashfreeSDK()
      console.log('✅ Cashfree SDK loaded')
      
      const cashfree = new (window as any).Cashfree({
        mode: 'production'
      })
      
      // Open Cashfree's verified payment page
      cashfree.checkout({
        paymentSessionId: upiData.paymentSessionId,
        returnUrl: `${window.location.origin}/payment/success?order_id=${upiData.orderId}`,
      })
      
      console.log('✅ Cashfree payment page opened')
      
      toast.success('Opening secure Cashfree payment page...', {
        duration: 5000,
        icon: '🔒'
      })
      
    } catch (error: any) {
      console.error('❌ UPI payment error:', error)
      toast.error(error.message || 'Failed to initiate payment. Please try again.')
    } finally {
      setIsProcessing(false)
      setSelectedApp('')
    }
  }

  // Show UPI app buttons with Cashfree integration
  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', color: 'from-purple-600 to-purple-800', icon: '📱' },
    { id: 'gpay', name: 'Google Pay', color: 'from-blue-500 to-blue-700', icon: '💳' },
    { id: 'paytm', name: 'Paytm', color: 'from-cyan-500 to-blue-600', icon: '💰' },
    { id: 'other', name: 'Other UPI', color: 'from-gray-700 to-gray-900', icon: '📲' }
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
        {upiApps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleUPIPayment(app.name)}
            disabled={isProcessing}
            className={`relative bg-gradient-to-br ${app.color} text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing && selectedApp === app.name ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-2"></div>
                <div className="text-xs">Opening...</div>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-2">{app.icon}</div>
                <div className="text-sm font-bold">{app.name}</div>
                <div className="text-xs opacity-90 mt-1">Pay via Cashfree</div>
              </>
            )}
          </button>
        ))}
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

