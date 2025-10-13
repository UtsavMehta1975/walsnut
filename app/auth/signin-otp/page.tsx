'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { OTPVerification } from '@/components/auth/otp-verification'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Phone } from 'lucide-react'

export default function SignInWithOTP() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    
    try {
      // Send OTP to phone
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          type: 'PHONE',
          purpose: 'LOGIN'
        })
      })

      if (response.ok) {
        toast.success('OTP sent to your phone!')
        setShowOTPVerification(true)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerified = async () => {
    toast.success('Phone verified! Logging you in...')
    
    // Find user by phone and create session
    try {
      const response = await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      if (response.ok) {
        const userData = await response.json()
        toast.success('Logged in successfully!')
        
        // Force reload to refresh auth context
        window.location.href = '/'
      } else {
        const error = await response.json()
        toast.error(error.error || 'Login failed. Please try again.')
        setShowOTPVerification(false)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      setShowOTPVerification(false)
    }
  }

  if (showOTPVerification) {
    return (
      <OTPVerification
        phone={phone}
        type="PHONE"
        purpose="LOGIN"
        onVerified={handleOTPVerified}
        onCancel={() => setShowOTPVerification(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Sign in with OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              No password needed! We'll send you a verification code
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '')
                    setPhone(value)
                  }}
                  className="pl-10"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                📱 We'll send a 6-digit OTP to this number
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-75 transition-all duration-200 font-semibold py-3"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                '📱 Send OTP'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Other options</span>
            </div>
          </div>

          {/* Alternative Sign In Options */}
          <div className="space-y-3">
            <Link href="/auth/signin" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                🔐 Sign in with Password
              </Button>
            </Link>
            
            <Link href="/auth/signup" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                ✨ Create New Account
              </Button>
            </Link>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Why OTP Login?</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✅ No password to remember</li>
              <li>✅ More secure than passwords</li>
              <li>✅ Quick and easy access</li>
              <li>✅ Works on any device</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

