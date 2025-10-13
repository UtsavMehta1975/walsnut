'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Edit, Save, X, Home, ShoppingBag, MessageCircle, Gift } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface Order {
  id: string
  orderNumber: string
  date: Date
  status: string
  total: number
  items: {
    brand: string
    model: string
    quantity: number
    price: number
  }[]
}

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  // Fetch fresh user data from API
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        console.log('✅ [ACCOUNT] Fetched fresh user data:', userData)
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        })
      }
    } catch (error) {
      console.error('❌ [ACCOUNT] Error fetching user profile:', error)
    }
  }

  // Update profileData when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
      // Fetch fresh data from API to get any updates (like saved address from checkout)
      fetchUserProfile()
    }
  }, [user])

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setIsLoadingOrders(false)
        return
      }

      try {
        console.log('📦 Fetching orders for user:', user.id)
        const response = await fetch('/api/orders')
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Orders fetched:', data.orders?.length || 0)
          
          // Map API response to Order interface
          const orders: Order[] = (data.orders || []).map((order: any) => ({
            id: order.id,
            orderNumber: `#${order.id.slice(0, 8).toUpperCase()}`,
            date: new Date(order.createdAt),
            status: order.status || 'PENDING',
            total: Number(order.totalAmount),
            items: (order.orderItems || []).map((item: any) => ({
              brand: item.product?.brand || 'Product',
              model: item.product?.model || '',
              quantity: item.quantity,
              price: Number(item.price)
            }))
          }))
          
          setRecentOrders(orders)
        } else {
          console.error('Failed to fetch orders:', response.status)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoadingOrders(false)
      }
    }

    if (isAuthenticated) {
      fetchOrders()
    }
  }, [user?.id, isAuthenticated])

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original data
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center px-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your account</h1>
            <p className="text-gray-600 mb-6">Access your orders, wishlist, and profile information</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="btn-walnut"
                onClick={() => window.location.href = '/auth/signin'}
              >
                Sign In
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/auth/signup'}
              >
                Create Account
              </Button>
            </div>
            <div className="mt-8">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/watches'}
                className="text-gray-600"
              >
                ← Continue Shopping
              </Button>
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
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl lato-black text-gray-900">
            My Account
          </h1>
          <p className="text-gray-600">
            Manage your profile, view orders, and update preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.name || user?.email || 'User'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    ) : profileData.name ? (
                      <p className="text-gray-900">{profileData.name}</p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 italic">No name added</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          Add Name
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    ) : profileData.phone ? (
                      <p className="text-gray-900">{profileData.phone}</p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 italic">No phone number added</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          Add Phone
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="Enter your address"
                      />
                    ) : profileData.address ? (
                      <p className="text-gray-900">{profileData.address}</p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 italic">No address added</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          Add Address
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent mx-auto mb-3"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <p className="text-sm text-gray-500 mb-4">Start exploring our collection!</p>
                    <Button 
                      onClick={() => window.location.href = '/watches'}
                      className="bg-yellow-400 text-black hover:bg-yellow-500"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {order.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(order.total)}
                            </p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.brand} {item.model} × {item.quantity}
                              </span>
                              <span className="text-gray-900">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/orders`}
                          >
                            View Details
                          </Button>
                          {order.status === 'CONFIRMED' && (
                            <Button 
                              size="sm"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Track Order
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about orders and promotions</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Bottom Navigation Buttons - Mobile & Desktop */}
        <div className="mt-12 mb-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Browse Products */}
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-yellow-50 hover:border-yellow-400 transition-all"
                onClick={() => window.location.href = '/watches'}
              >
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
                <span className="text-sm font-medium">Browse</span>
              </Button>

              {/* WhatsApp */}
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-400 transition-all"
                onClick={() => window.open('https://wa.me/919876543210?text=Hi, I need help with my order', '_blank')}
              >
                <MessageCircle className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">WhatsApp</span>
              </Button>

              {/* Refer & Earn */}
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-400 transition-all"
                onClick={() => {
                  toast.success('Refer & Earn coming soon! 🎁', { duration: 3000 })
                }}
              >
                <Gift className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium">Refer & Earn</span>
              </Button>

              {/* Home */}
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">Home</span>
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Need help? Contact us via WhatsApp for instant support!
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
