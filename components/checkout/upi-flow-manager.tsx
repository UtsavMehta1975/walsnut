'use client'

import { useState, useEffect } from 'react'
import { UPIApps } from './upi-apps'
import { UPIPaymentConfirm } from './upi-payment-confirm'
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingPayment, setPendingPayment] = useState<any>(null)
  const router = useRouter()

  // Check if user returned from UPI app
  useEffect(() => {
    const checkForPendingPayment = () => {
      // Check if there's a pending UPI payment in session storage
      const pending = sessionStorage.getItem('pending_upi_payment')
      
      if (pending) {
        try {
          const paymentData = JSON.parse(pending)
          const timeDiff = new Date().getTime() - new Date(paymentData.timestamp).getTime()
          
          // If payment was initiated less than 10 minutes ago
          if (timeDiff < 10 * 60 * 1000) {
            console.log('📲 User returned from UPI app!')
            setPendingPayment(paymentData)
            setShowConfirmDialog(true)
            
            toast('💳 Did you complete the payment?', {
              duration: 3000,
              icon: '👋'
            })
          } else {
            // Clean up old pending payment
            sessionStorage.removeItem('pending_upi_payment')
          }
        } catch (error) {
          console.error('Error parsing pending payment:', error)
        }
      }
    }

    // Check immediately when component mounts
    checkForPendingPayment()
    
    // Also check when window regains focus (user returning from app)
    const handleFocus = () => {
      console.log('👀 Window focused - checking for pending payment')
      checkForPendingPayment()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Check periodically (every 2 seconds) while on this page
    const interval = setInterval(checkForPendingPayment, 2000)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])

  const handlePaymentConfirmed = () => {
    console.log('✅ Payment confirmed by user')
    
    // Show success message
    toast.success('Payment submitted! Redirecting...', {
      duration: 2000
    })
    
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      router.push(`/payment/success?order_id=${orderDetails.orderId}`)
    }, 2000)
  }

  const handlePaymentCancelled = () => {
    console.log('❌ Payment cancelled by user')
    
    // Clear pending payment
    sessionStorage.removeItem('pending_upi_payment')
    setPendingPayment(null)
    setShowConfirmDialog(false)
    
    toast('You can try again with a different payment method', {
      duration: 3000
    })
  }

  const handlePaymentInitiated = () => {
    console.log('🚀 UPI payment initiated - user switching to payment app')
    
    // Don't show confirm dialog immediately
    // It will be shown when user returns (via focus/mount detection)
    setShowConfirmDialog(false)
  }

  // Show confirmation dialog if user returned from UPI app
  if (showConfirmDialog && pendingPayment) {
    return (
      <div className="space-y-4">
        {/* Back button to choose different app */}
        <button
          onClick={() => {
            setShowConfirmDialog(false)
            setPendingPayment(null)
          }}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          ← Try a different payment method
        </button>
        
        <UPIPaymentConfirm
          orderDetails={{
            orderId: orderDetails.orderId,
            amount: amount,
            customerEmail: orderDetails.customerEmail
          }}
          onConfirmed={handlePaymentConfirmed}
          onCancelled={handlePaymentCancelled}
        />
      </div>
    )
  }

  // Show UPI app selection
  return (
    <UPIApps
      amount={amount}
      orderDetails={orderDetails}
      onPaymentInitiated={handlePaymentInitiated}
    />
  )
}

