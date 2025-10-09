'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface UPIAppsProps {
  amount: number
  orderDetails: {
    orderId: string
    customerName: string
    customerEmail: string
  }
  onPaymentInitiated?: () => void
}

interface UPIApp {
  id: string
  name: string
  packageName: string
  logo: string
  color: string
}

export function UPIApps({ amount, orderDetails, onPaymentInitiated }: UPIAppsProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const isMobileDevice = /android|iphone|ipad|ipod|mobile/i.test(userAgent)
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isMobileDevice || isSmallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // UPI Apps configuration with SVG logos
  const upiApps: UPIApp[] = [
    {
      id: 'phonepe',
      name: 'PhonePe',
      packageName: 'com.phonepe.app',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><circle cx="12" cy="12" r="10" fill="#5F259F"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Pe</text></svg>`,
      color: 'from-purple-600 to-purple-800'
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      packageName: 'com.google.android.apps.nbu.paisa.user',
      logo: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M12 7L17 12L12 17V13H7V11H12V7Z" fill="#4285F4"/></svg>`,
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      packageName: 'net.one97.paytm',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><circle cx="12" cy="12" r="10" fill="#00BAF2"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="bold">Paytm</text></svg>`,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'fampay',
      name: 'FamPay',
      packageName: 'com.fampay.in',
      logo: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><circle cx="12" cy="12" r="10" fill="#FFB800"/><text x="12" y="16" text-anchor="middle" fill="black" font-size="9" font-weight="bold">Fam</text></svg>`,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'upi',
      name: 'Other UPI',
      packageName: 'generic',
      logo: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><rect width="24" height="24" rx="4" fill="#000"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="bold">UPI</text></svg>`,
      color: 'from-gray-700 to-gray-900'
    }
  ]

  const handleUPIAppClick = async (app: UPIApp) => {
    console.log(`🎯 User selected ${app.name} for UPI payment`)
    
    // Call the callback if provided
    onPaymentInitiated?.()
    
    try {
      // Create order first via your backend
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: orderDetails.customerName,
          customerEmail: orderDetails.customerEmail,
          amount: amount,
          paymentMethod: 'upi'
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()
      console.log('📦 Order created:', orderData.order.id)

      // Now initiate Cashfree UPI payment with preferred app
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.order.id,
          paymentMethod: 'upi',
          preferredApp: app.id // PhonePe, GPay, Paytm, etc.
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to initialize payment')
      }

      const paymentData = await paymentResponse.json()
      
      // Initialize Cashfree UPI payment with app preference
      const cashfree = new (window as any).Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || 'production'
      })
      
      // Cashfree checkout with UPI app preference
      cashfree.checkout({
        paymentSessionId: paymentData.paymentSessionId,
        returnUrl: `${window.location.origin}/payment/success?order_id={order_id}`,
        redirectTarget: '_self',
        appearance: {
          theme: 'light',
          width: '100%',
          height: '100%'
        },
        // Cashfree will handle opening the specific UPI app
        paymentMethods: {
          upi: {
            preferredApp: app.packageName
          }
        }
      })

      toast.success(
        `Opening ${app.name} via Cashfree...`,
        {
          duration: 3000,
          icon: '🔐',
        }
      )
      
    } catch (error) {
      console.error('🔴 Payment initialization error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Payment failed. Please try again.',
        { duration: 4000 }
      )
    }
  }

  if (!isMobile) {
    return null // Only show on mobile
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          ⚡ Quick Pay with UPI Apps
        </h3>
        <p className="text-sm text-gray-600">
          Tap your preferred app to pay instantly
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {upiApps.slice(0, 4).map((app) => (
          <button
            key={app.id}
            onClick={() => handleUPIAppClick(app)}
            className={`relative bg-gradient-to-br ${app.color} text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 active:scale-95 overflow-hidden`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 mb-2 mx-auto bg-white rounded-lg flex items-center justify-center">
                <span className="text-3xl">{app.logo.includes('svg') ? '💳' : app.logo}</span>
              </div>
              <div className="text-sm font-bold">{app.name}</div>
              <div className="text-xs opacity-90 mt-1">Tap to Pay</div>
            </div>
          </button>
        ))}
      </div>

      {/* Generic UPI Option */}
      <button
        onClick={() => handleUPIAppClick(upiApps[4])}
        className="w-full bg-white border-2 border-dashed border-gray-400 rounded-xl p-4 hover:bg-gray-50 hover:border-gray-600 transition-all duration-200"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-left">
            <div className="font-bold text-gray-900">{upiApps[4].name}</div>
            <div className="text-xs text-gray-600">BHIM, Amazon Pay & More</div>
          </div>
        </div>
      </button>

      {/* Payment Amount Display */}
      <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount to Pay:</span>
          <span className="text-2xl font-bold text-green-600">
            ₹{amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-gray-700 text-center">
          💡 Click on your UPI app above. After completing payment in the app, return here to see your order confirmation.
        </p>
      </div>
    </div>
  )
}

