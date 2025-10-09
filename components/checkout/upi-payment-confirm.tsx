'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, Clock, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface UPIPaymentConfirmProps {
  orderDetails: {
    orderId: string
    amount: number
    customerEmail: string
  }
  onConfirmed: () => void
  onCancelled: () => void
}

export function UPIPaymentConfirm({ orderDetails, onConfirmed, onCancelled }: UPIPaymentConfirmProps) {
  const [utrNumber, setUtrNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirmPayment = async () => {
    if (!utrNumber || utrNumber.length < 12) {
      toast.error('Please enter a valid 12-digit UTR/Transaction ID')
      return
    }

    setIsSubmitting(true)

    try {
      // Submit payment confirmation to backend
      const response = await fetch('/api/payments/confirm-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderDetails.orderId,
          utrNumber: utrNumber,
          amount: orderDetails.amount,
          paymentMethod: 'upi_manual'
        })
      })

      if (response.ok) {
        toast.success('Payment confirmation submitted! We will verify and confirm your order.', {
          duration: 5000,
          icon: '✅'
        })
        
        // Clear session storage
        sessionStorage.removeItem('pending_upi_payment')
        
        // Call success callback
        onConfirmed()
      } else {
        throw new Error('Failed to submit payment confirmation')
      }
    } catch (error) {
      console.error('Payment confirmation error:', error)
      toast.error('Failed to confirm payment. Please contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyUPIId = () => {
    navigator.clipboard.writeText('8755111258@jupiteraxis')
    toast.success('UPI ID copied!', { icon: '📋' })
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Complete Your Payment
        </h3>
        <p className="text-sm text-gray-600">
          Pay the amount in your UPI app, then confirm below
        </p>
      </div>

      {/* Payment Details Card */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Pay To:</span>
            <div className="text-right">
              <div className="font-bold text-gray-900">Walnut Store</div>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm text-blue-600 font-mono">8755111258@jupiteraxis</code>
                <button
                  onClick={copyUPIId}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Amount:</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{orderDetails.amount.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order ID:</span>
            <code className="text-sm font-mono text-gray-900">{orderDetails.orderId}</code>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-900 font-semibold mb-2">
          📱 Steps to Complete Payment:
        </p>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Open your UPI app (PhonePe, GPay, Paytm, etc.)</li>
          <li>Pay ₹{orderDetails.amount.toFixed(2)} to <strong>8755111258@jupiteraxis</strong></li>
          <li>Note down the 12-digit UTR/Transaction ID</li>
          <li>Enter the UTR number below and confirm</li>
        </ol>
      </div>

      {/* UTR Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          UTR / Transaction ID <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="Enter 12-digit UTR number"
          value={utrNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 12)
            setUtrNumber(value)
          }}
          className="text-center font-mono text-lg"
          maxLength={12}
        />
        <p className="text-xs text-gray-500 mt-1">
          You'll find this in your payment app after successful transaction
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleConfirmPayment}
          disabled={isSubmitting || utrNumber.length !== 12}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              I've Completed the Payment
            </>
          )}
        </Button>

        <Button
          onClick={onCancelled}
          variant="outline"
          className="w-full border-gray-300 text-gray-700"
        >
          Cancel / Pay Later
        </Button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          💡 Having trouble? Contact us at support@thewalnutstore.com
        </p>
      </div>
    </div>
  )
}

