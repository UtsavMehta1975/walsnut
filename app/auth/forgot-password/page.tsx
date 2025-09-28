'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For now, just show success message
      // In the future, you can implement actual password reset
      toast.success('Password reset instructions sent to your email!')
      setIsSubmitted(true)
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('Failed to send reset instructions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  Try Different Email
                </Button>
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center mb-6">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h2 className="text-3xl font-bold text-gray-900">
                Forgot Password?
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
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
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link href="/auth/signin" className="text-sm text-yellow-600 hover:text-yellow-500">
                Remember your password? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
