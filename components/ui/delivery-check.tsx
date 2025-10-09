'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Truck, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeliveryCheckProps {
  onPinCodeValidated?: (pinCodeData: {
    pinCode: string
    city: string
    state: string
    deliveryDays: number
  }) => void
  variant?: 'product' | 'checkout'
  className?: string
}

interface PinCodeData {
  pinCode: string
  city: string
  state: string
  district: string
  country: string
}

export function DeliveryCheck({ onPinCodeValidated, variant = 'product', className = '' }: DeliveryCheckProps) {
  const [pinCode, setPinCode] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState<{
    available: boolean
    days: number
    city: string
    state: string
    estimatedDate: string
  } | null>(null)

  const checkDelivery = async () => {
    if (!pinCode || pinCode.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code')
      return
    }

    setIsChecking(true)
    setDeliveryInfo(null) // Reset previous results

    try {
      console.log('🔍 Checking PIN code:', pinCode)
      
      // Fetch PIN code details from India Post API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      clearTimeout(timeoutId)
      
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('📦 API Response:', JSON.stringify(data, null, 2))

      if (data && Array.isArray(data) && data.length > 0 && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0]
        const city = postOffice.District || postOffice.Block || 'Unknown'
        const state = postOffice.State || 'Unknown'
        
        console.log('✅ Found location:', { city, state, postOffice })
        
        // Calculate delivery days based on state/region
        const deliveryDays = calculateDeliveryDays(state, city)
        
        // Calculate estimated delivery date
        const estimatedDate = new Date()
        estimatedDate.setDate(estimatedDate.getDate() + deliveryDays)
        const formattedDate = estimatedDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })

        const deliveryData = {
          available: true,
          days: deliveryDays,
          city,
          state,
          estimatedDate: formattedDate
        }

        setDeliveryInfo(deliveryData)
        console.log('📍 Delivery info set:', deliveryData)

        // Call parent callback if provided
        if (onPinCodeValidated) {
          onPinCodeValidated({
            pinCode,
            city,
            state,
            deliveryDays
          })
          console.log('✅ Callback called with data')
        }

        toast.success(`✅ Delivery to ${city}, ${state} in ${deliveryDays} days!`, {
          duration: 4000
        })
      } else {
        console.log('❌ Invalid PIN code response:', data)
        const errorMessage = data && data[0] && data[0].Message ? data[0].Message : 'Invalid PIN code'
        console.log('Error message from API:', errorMessage)
        
        setDeliveryInfo({
          available: false,
          days: 0,
          city: '',
          state: '',
          estimatedDate: ''
        })
        toast.error('Invalid PIN code. Please check and try again.', {
          icon: '❌',
          duration: 3000
        })
      }
    } catch (error: any) {
      console.error('❌ PIN code check error:', error)
      
      let errorMessage = 'Failed to check delivery. '
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. Please try again.'
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage += 'Network error. Check your internet connection.'
      } else if (error.message.includes('CORS')) {
        errorMessage += 'API access issue. Please try again.'
      } else {
        errorMessage += 'Please try again later.'
      }
      
      console.error('Detailed error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      toast.error(errorMessage, {
        duration: 4000
      })
      
      setDeliveryInfo(null)
    } finally {
      setIsChecking(false)
    }
  }

  // Calculate delivery days based on location
  const calculateDeliveryDays = (state: string, city: string): number => {
    // Major metro cities - 2-3 days
    const metroCities = ['Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
    if (metroCities.some(metro => city.toLowerCase().includes(metro.toLowerCase()))) {
      return 2
    }

    // Tier 1 cities - 3-4 days
    const tier1Cities = ['Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik']
    if (tier1Cities.some(city1 => city.toLowerCase().includes(city1.toLowerCase()))) {
      return 3
    }

    // North-East states - 5-7 days
    const northEastStates = ['Assam', 'Meghalaya', 'Tripura', 'Mizoram', 'Manipur', 'Nagaland', 'Arunachal Pradesh', 'Sikkim']
    if (northEastStates.some(ne => state.toLowerCase().includes(ne.toLowerCase()))) {
      return 6
    }

    // Remote states/UTs - 5-6 days
    const remoteStates = ['Jammu and Kashmir', 'Ladakh', 'Himachal Pradesh', 'Uttarakhand', 'Andaman and Nicobar', 'Lakshadweep']
    if (remoteStates.some(remote => state.toLowerCase().includes(remote.toLowerCase()))) {
      return 5
    }

    // Default for other cities - 4-5 days
    return 4
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkDelivery()
    }
  }

  if (variant === 'product') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Check Delivery</h3>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter PIN Code"
            value={pinCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setPinCode(value)
            }}
            onKeyPress={handleKeyPress}
            className="flex-1"
            maxLength={6}
          />
          <Button
            onClick={checkDelivery}
            disabled={isChecking || pinCode.length !== 6}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isChecking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              'Check'
            )}
          </Button>
        </div>

        {deliveryInfo && (
          <div className="mt-4">
            {deliveryInfo.available ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-1">
                      Delivery Available!
                    </p>
                    <div className="text-sm text-green-800 space-y-1">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {deliveryInfo.city}, {deliveryInfo.state}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {deliveryInfo.days} {deliveryInfo.days === 1 ? 'day' : 'days'} - By {deliveryInfo.estimatedDate}
                      </p>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      🚚 Free delivery on all orders
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">
                      Delivery Not Available
                    </p>
                    <p className="text-sm text-red-700">
                      Sorry, we don't deliver to this PIN code yet. Contact support for alternatives.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Enter your PIN code to check if delivery is available in your area
        </p>
      </div>
    )
  }

  // Checkout variant - more compact
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Quick Delivery Check</h3>
          <p className="text-xs text-gray-600">Know your delivery time instantly</p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <Input
          type="text"
          placeholder="Enter 6-digit PIN code"
          value={pinCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
            setPinCode(value)
          }}
          onKeyPress={handleKeyPress}
          className="flex-1 text-center font-mono text-lg border-2 border-blue-300 focus:border-blue-500"
          maxLength={6}
        />
        <Button
          onClick={checkDelivery}
          disabled={isChecking || pinCode.length !== 6}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          {isChecking ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            'Check'
          )}
        </Button>
      </div>

      {deliveryInfo && deliveryInfo.available && (
        <div className="bg-white rounded-lg p-3 border border-green-300 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-900">Available to {deliveryInfo.city}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Estimated Delivery:
            </span>
            <span className="font-bold text-blue-600">
              {deliveryInfo.days} {deliveryInfo.days === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Expected by: <span className="font-semibold">{deliveryInfo.estimatedDate}</span>
          </p>
        </div>
      )}

      {deliveryInfo && !deliveryInfo.available && (
        <div className="bg-red-50 rounded-lg p-3 border border-red-300">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-900 text-sm">Not serviceable at this PIN code</span>
          </div>
        </div>
      )}
    </div>
  )
}

