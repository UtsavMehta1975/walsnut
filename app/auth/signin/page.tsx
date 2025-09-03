'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const { login, user, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('admin@walnut.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 Already authenticated, redirecting...', user.role)
      if (user.role?.toUpperCase() === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('🔐 Attempting login with:', email)
      const result = await login(email, password)
      
      if (result.success) {
        toast.success('Login successful!')
        console.log('✅ Login successful, checking user role...')
        
        // Wait a bit for the session to fully update
        setTimeout(() => {
          if (user?.role?.toUpperCase() === 'ADMIN') {
            console.log('🔄 Redirecting to admin panel...')
            router.push('/admin')
          } else {
            console.log('🔄 Redirecting to home...')
            router.push('/')
          }
        }, 500)
      } else {
        toast.error('Invalid email or password')
        console.log('❌ Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
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
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-yellow-600 hover:text-yellow-500">
                Forgot your password?
              </Link>
            </div>
          </form>

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
