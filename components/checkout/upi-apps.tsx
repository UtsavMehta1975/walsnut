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

  // Generate UPI payment link
  const generateUPILink = (app: UPIApp) => {
    // Get UPI merchant details from environment
    const merchantVPA = process.env.NEXT_PUBLIC_UPI_ID || 'merchant@upi'
    const merchantName = process.env.NEXT_PUBLIC_UPI_MERCHANT_NAME || 'Walnut Store'
    const transactionNote = `Order ${orderDetails.orderId}`
    
    const upiParams = new URLSearchParams({
      pa: merchantVPA, // Payee address (your UPI ID)
      pn: merchantName, // Payee name
      am: amount.toFixed(2), // Amount
      cu: 'INR', // Currency
      tn: transactionNote, // Transaction note
      mc: '5411', // Merchant category code (Grocery Stores, Supermarkets)
    })

    // App-specific deep links
    const deepLinks: Record<string, string> = {
      phonepe: `phonepe://pay?${upiParams.toString()}`,
      gpay: `tez://upi/pay?${upiParams.toString()}`,
      paytm: `paytmmp://pay?${upiParams.toString()}`,
      fampay: `fampay://upi/pay?${upiParams.toString()}`,
      upi: `upi://pay?${upiParams.toString()}` // Generic UPI for other apps
    }

    return deepLinks[app.id] || deepLinks.upi
  }

  const handleUPIAppClick = (app: UPIApp) => {
    const upiLink = generateUPILink(app)
    
    console.log(`Opening ${app.name} with UPI link:`, upiLink)
    
    // Call the callback if provided
    onPaymentInitiated?.()
    
    // Try to open the app
    window.location.href = upiLink
    
    // Show instruction toast
    toast.success(
      `Opening ${app.name}... Complete the payment in the app`,
      {
        duration: 5000,
        icon: app.logo,
      }
    )
    
    // Fallback message if app doesn't open
    setTimeout(() => {
      toast(
        `If ${app.name} didn't open, please check if it's installed`,
        {
          duration: 4000,
          icon: '💡',
        }
      )
    }, 3000)
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

