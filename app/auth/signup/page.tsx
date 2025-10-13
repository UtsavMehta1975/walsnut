'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'
import { trackCompleteRegistration } from '@/components/analytics/meta-pixel'
import { signIn } from 'next-auth/react'
import { OTPVerification } from '@/components/auth/otp-verification'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [verificationType, setVerificationType] = useState<'EMAIL' | 'PHONE'>('EMAIL')
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const handleSendOTP = async (type: 'EMAIL' | 'PHONE') => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: type === 'EMAIL' ? email : undefined,
          phone: type === 'PHONE' ? phone : undefined,
          type,
          purpose: 'SIGNUP'
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`OTP sent to your ${type.toLowerCase()}!`)
        setVerificationType(type)
        setShowOTPVerification(true)
      } else {
        toast.error(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerified = () => {
    if (verificationType === 'EMAIL') {
      setEmailVerified(true)
      toast.success('✅ Email verified!')
    } else {
      setPhoneVerified(true)
      toast.success('✅ Phone verified!')
    }
    setShowOTPVerification(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    // Validate phone number (required and must be valid)
    if (!phone || phone.length === 0) {
      toast.error('Phone number is required')
      setIsLoading(false)
      return
    }

    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 10-digit Indian mobile number')
      setIsLoading(false)
      return
    }

    // Check if email is verified
    if (!emailVerified) {
      toast.error('Please verify your email first')
      setIsLoading(false)
      return
    }

    // Check if phone is verified
    if (!phoneVerified) {
      toast.error('Please verify your phone number first')
      setIsLoading(false)
      return
    }

    try {
      const success = await signup(name, email, password, phone)
      
      if (success) {
        // Track registration completion
        trackCompleteRegistration('email')
        
        toast.success('Account created successfully! Welcome to The Walnut Store!')
        console.log('New user account created, redirecting to dashboard...')
        router.push('/dashboard')
      } else {
        toast.error('Failed to create account. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show OTP verification modal
  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <OTPVerification
            email={verificationType === 'EMAIL' ? email : undefined}
            phone={verificationType === 'PHONE' ? phone : undefined}
            type={verificationType}
            purpose="SIGNUP"
            onVerified={handleOTPVerified}
            onCancel={() => setShowOTPVerification(false)}
          />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl lato-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join thousands of watch enthusiasts
            </p>
          </div>

          {/* Google Sign-Up Button - FIRST & PROMINENT */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-6 shadow-md">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  🚀 Recommended: Sign up with Google
                </h3>
                <p className="text-sm text-gray-600">
                  Quick • Secure • No password needed
                </p>
              </div>
              
              <Button
                type="button"
                onClick={async () => {
                  try {
                    setIsLoading(true)
                    console.log('🔵 [GOOGLE] Sign-up button clicked')
                    toast.loading('Opening Google Sign-Up...', { id: 'google-signup' })
                    
                    // Detect mobile device - mobile needs full redirect, not popup
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
                    console.log('🔵 [GOOGLE] Device type:', isMobile ? 'Mobile (using redirect)' : 'Desktop (using popup)')
                    
                    if (isMobile) {
                      // Mobile: Use full-page redirect (works better on mobile browsers)
                      console.log('📱 [GOOGLE] Mobile detected - using full page redirect')
                      await signIn('google', { 
                        callbackUrl: '/',
                        redirect: true, // Full page redirect for mobile
                      })
                      // Code after this won't execute as page will redirect
                      return
                    }
                    
                    // Desktop: Use popup/current page (redirect=false to handle errors)
                    console.log('💻 [GOOGLE] Desktop detected - using popup flow')
                    const result = await signIn('google', { 
                      callbackUrl: '/',
                      redirect: false
                    })
                    
                    console.log('🔵 [GOOGLE] Sign-up response:', result)
                    
                    if (result?.error) {
                      console.error('🔴 [GOOGLE] Sign-up error:', result.error)
                      console.error('🔴 [GOOGLE] Error details:', JSON.stringify(result, null, 2))
                      
                      let errorMessage = 'Google sign-up failed. Please try again.'
                      
                      if (result.error === 'OAuthCallback') {
                        errorMessage = 'OAuth configuration error. Please check your Google Cloud Console settings.'
                      } else if (result.error === 'Configuration') {
                        errorMessage = 'Authentication is not properly configured. Please contact support.'
                      }
                      
                      toast.error(errorMessage, { id: 'google-signup' })
                      setIsLoading(false)
                    } else if (result?.ok) {
                      console.log('✅ [GOOGLE] Sign-up successful!')
                      toast.success('Account created successfully!', { id: 'google-signup' })
                      
                      // Redirect to home
                      const finalUrl = result.url || '/'
                      console.log('🔵 [GOOGLE] Redirecting to:', finalUrl)
                      window.location.href = finalUrl
                    } else if (result?.url) {
                      console.log('🔵 [GOOGLE] Redirecting to:', result.url)
                      window.location.href = result.url
                    } else {
                      console.error('🔴 [GOOGLE] Unexpected response:', result)
                      toast.error('An unexpected error occurred. Please try again.', { id: 'google-signup' })
                      setIsLoading(false)
                    }
                  } catch (error: any) {
                    console.error('🔴 [GOOGLE] Unexpected error:', error)
                    console.error('🔴 [GOOGLE] Error stack:', error?.stack)
                    toast.error('Network error. Please check your connection and try again.', { id: 'google-signup' })
                    setIsLoading(false)
                  }
                }}
                disabled={isLoading}
                className="w-full bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-75 transition-all duration-200 flex items-center justify-center gap-3 py-4 text-base font-semibold shadow-sm hover:shadow-md"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </Button>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-center text-gray-600">
                  ✓ Instant account creation
                </p>
                <p className="text-xs text-center text-gray-600">
                  ✓ Automatically syncs if you have an existing account
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500 font-medium">Or sign up with email</span>
            </div>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 flex-1"
                    placeholder="Enter your email"
                    disabled={emailVerified}
                  />
                  <Button
                    type="button"
                    onClick={() => handleSendOTP('EMAIL')}
                    disabled={!email || isLoading || emailVerified}
                    className="mt-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    {emailVerified ? '✓ Verified' : 'Verify'}
                  </Button>
                </div>
                {emailVerified && (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Email verified successfully
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 flex-1"
                    placeholder="10-digit mobile number"
                    disabled={phoneVerified}
                  />
                  <Button
                    type="button"
                    onClick={() => handleSendOTP('PHONE')}
                    disabled={!phone || phone.length !== 10 || isLoading || phoneVerified}
                    className="mt-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    {phoneVerified ? '✓ Verified' : 'Verify'}
                  </Button>
                </div>
                {phoneVerified ? (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Phone verified successfully
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    We'll send you a verification code via SMS
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full btn-walnut disabled:opacity-75 transition-all duration-200"
                disabled={isLoading || !emailVerified || !phoneVerified}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>
              {(!emailVerified || !phoneVerified) && (
                <p className="mt-2 text-xs text-center text-red-600">
                  Please verify your email and phone number before creating account
                </p>
              )}
            </div>
          </form>

          {/* Already have account link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-walnut-600 hover:text-walnut-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
