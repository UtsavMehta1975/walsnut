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

export default function SignInPage() {
  const router = useRouter()
  const { login, user, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('admin@walnut.com')
  const [password, setPassword] = useState('admin123')
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


          {/* Test Credentials */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium text-blue-800 mb-2">Test Credentials:</p>
            <div className="space-y-1 text-blue-700">
              <p><strong>Admin:</strong> admin@walnut.com / admin123</p>
              <p><strong>User:</strong> user@walnut.com / user123</p>
            </div>
          </div>

          {/* Debug info */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p><strong>Debug Info:</strong></p>
            <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>User Role: {user?.role || 'None'}</p>
            <p>User ID: {user?.id || 'None'}</p>
            <p>Session Status: {isAuthenticated ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
