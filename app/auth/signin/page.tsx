'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getSmartRedirectUrl } from '@/lib/navigation'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  const router = useRouter()
  const { login, user, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Get redirect URL from query params
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get('redirect')
      if (redirect) {
        setRedirectUrl(redirect)
      }
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      const redirectUrl = getSmartRedirectUrl(user.role)
      router.push(redirectUrl)
    }
  }, [isAuthenticated, user, router, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('🔐 Attempting login with:', email)
      const result = await login(email, password)
      
      if (result.success) {
        // Show success toast immediately
        toast.success('Login successful!')
        
        // Get redirect URL based on user role (use user from context if available)
        const userRole = (result as any).user?.role || user?.role || 'CUSTOMER'
        const finalRedirectUrl = redirectUrl || getSmartRedirectUrl(userRole)
        
        // Immediate redirect for better UX
        router.push(finalRedirectUrl)
      } else {
        toast.error('Invalid email or password')
        console.log('❌ Login failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    console.log('🔵 [GOOGLE] Sign-in button clicked')
    
    try {
      setIsLoading(true)
      toast.loading('Opening Google Sign-In...', { id: 'google-signin' })
      
      console.log('🔵 [GOOGLE] Initiating Google OAuth flow...')
      console.log('🔵 [GOOGLE] Callback URL:', redirectUrl || '/')
      console.log('🔵 [GOOGLE] Current URL:', typeof window !== 'undefined' ? window.location.href : 'N/A')
      
      // Detect mobile device - mobile needs full redirect, not popup
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
      console.log('🔵 [GOOGLE] Device type:', isMobile ? 'Mobile (using redirect)' : 'Desktop (using popup)')
      
      if (isMobile) {
        // Mobile: Use full-page redirect (works better on mobile browsers)
        console.log('📱 [GOOGLE] Mobile detected - using full page redirect')
        await signIn('google', { 
          callbackUrl: redirectUrl || '/',
          redirect: true, // Full page redirect for mobile
        })
        // Code after this won't execute as page will redirect
        return
      }
      
      // Desktop: Use popup/current page (redirect=false to handle errors)
      console.log('💻 [GOOGLE] Desktop detected - using popup flow')
      const result = await signIn('google', { 
        callbackUrl: redirectUrl || '/',
        redirect: false, // Popup for desktop
      })
      
      console.log('🔵 [GOOGLE] SignIn response:', result)
      
      if (result?.error) {
        console.error('🔴 [GOOGLE] Sign-in error:', result.error)
        console.error('🔴 [GOOGLE] Error details:', JSON.stringify(result, null, 2))
        
        let errorMessage = 'Google sign-in failed. Please try again.'
        
        if (result.error === 'OAuthAccountNotLinked') {
          errorMessage = 'An account with this email already exists. Please sign in with your password.'
        } else if (result.error === 'OAuthCallback') {
          errorMessage = 'OAuth configuration error. Please check your Google Cloud Console settings.'
        } else if (result.error === 'Configuration') {
          errorMessage = 'Authentication is not properly configured. Please contact support.'
        }
        
        toast.error(errorMessage, { id: 'google-signin' })
        setIsLoading(false)
      } else if (result?.ok) {
        console.log('✅ [GOOGLE] Sign-in successful!')
        toast.success('Signed in successfully!', { id: 'google-signin' })
        
        // Redirect to callback URL or home
        const finalUrl = result.url || redirectUrl || '/'
        console.log('🔵 [GOOGLE] Redirecting to:', finalUrl)
        window.location.href = finalUrl
      } else if (result?.url) {
        // If we got a URL but no explicit ok, redirect anyway
        console.log('🔵 [GOOGLE] Redirecting to:', result.url)
        window.location.href = result.url
      } else {
        console.error('🔴 [GOOGLE] Unexpected response:', result)
        toast.error('An unexpected error occurred. Please try again.', { id: 'google-signin' })
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error('🔴 [GOOGLE] Unexpected error:', error)
      console.error('🔴 [GOOGLE] Error stack:', error?.stack)
      toast.error('Network error. Please check your connection and try again.', { id: 'google-signin' })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link href="/auth/signup" className="font-medium text-yellow-600 hover:text-yellow-500">
                create a new account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-75 transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-yellow-600 hover:text-yellow-500">
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div className="mt-6">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-75 transition-all duration-200 flex items-center justify-center gap-3 py-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-medium">Sign in with Google</span>
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              One-click login • Secure • Fast
            </p>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  )
}
