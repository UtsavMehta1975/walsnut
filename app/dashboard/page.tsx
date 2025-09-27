'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

// Force dynamic rendering for dashboard page
export const dynamic = 'force-dynamic'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    } else if (isAuthenticated && user) {
      setShowSuccess(true)
      toast.success(`Welcome back, ${user.name || user.email}!`)
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                  Login Successful! 🎉
                </h3>
                <p className="mt-1 text-green-700">
                  Welcome back to The Walnut Store, {user.name || user.email}!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Hello, {user.name || user.email}! You're successfully logged in.
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Role: {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name || 'Not set'}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/watches">
                  <Button className="w-full" variant="outline">
                    Browse Watches
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button className="w-full" variant="outline">
                    View Cart
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button className="w-full" variant="outline">
                    My Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin Panel Card (only for admins) */}
          {user.role === 'ADMIN' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Panel
                </CardTitle>
                <CardDescription>
                  Manage your store and products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Access Admin Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="space-x-4">
            <Link href="/">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
