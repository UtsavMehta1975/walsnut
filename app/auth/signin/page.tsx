'use client'

import { useState } from 'react'
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
  const { login, user } = useAuth()
  const [email, setEmail] = useState('admin@walnut.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)
      
      if (result.success) {
        toast.success('Login successful!')
        
        // Wait for the session to update and then redirect
        const checkAndRedirect = () => {
          if (user?.role?.toUpperCase() === 'ADMIN') {
            router.push('/admin')
          } else if (user?.role?.toUpperCase() === 'CUSTOMER') {
            router.push('/')
          } else {
            // If user role is not yet available, wait a bit more
            setTimeout(checkAndRedirect, 200)
          }
        }
        
        // Start checking after a short delay
        setTimeout(checkAndRedirect, 100)
      } else {
        toast.error('Invalid email or password')
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
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
