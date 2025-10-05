'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

// Force dynamic rendering for admin page
export const dynamic = 'force-dynamic'
// Force fresh deployment
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Plus, Edit, Trash2, Package, Users, TrendingUp, ShoppingCart, Eye, FileText, Settings, BarChart3, Menu, X, Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import AdminImageManager from '@/components/ui/admin-image-manager'

interface ProductSpecifications {
  movement: string
  case: string
  dial: string
  bracelet: string
  waterResistance: string
  powerReserve: string
  diameter: string
  thickness: string
}

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber: string
  price: number
  previousPrice?: number
  condition: string
  year: number
  gender: string
  description: string
  stockQuantity: number
  specifications: ProductSpecifications
  authenticity: {
    guaranteed: boolean
    certificate: boolean
    serviceHistory: boolean
  }
  categories?: string[]
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  date: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
}

interface Customer {
  id: string
  name: string
  email: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  status: 'ACTIVE' | 'INACTIVE'
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // State for real data from database
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true)
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product => 
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchQuery])

  // Check authentication and admin role
  useEffect(() => {
    console.log('=== ADMIN PAGE AUTH CHECK ===')
    console.log('isLoading:', isLoading)
    console.log('isAuthenticated:', isAuthenticated)
    console.log('user:', user)
    console.log('user?.role:', user?.role)
    console.log('user?.role.toUpperCase() === "ADMIN":', user?.role?.toUpperCase() === 'ADMIN')
    
    if (isLoading) {
      console.log('⏳ Still loading authentication...')
      return
    }
    
    // Check authentication status - only redirect if we're sure we're not authenticated
    if (!isAuthenticated && !isLoading) {
      console.log('❌ Not authenticated and not loading, redirecting to signin')
      router.push('/auth/signin')
      return
    }
    
    // Debug: Log user info
    console.log('User:', user)
    console.log('User role:', user?.role)
    
    // Check if user has admin role (case insensitive)
    if (!user?.role || user.role.toUpperCase() !== 'ADMIN') {
      console.log('❌ Not admin, redirecting to signin')
      router.push('/auth/signin')
      toast.error('Access denied. Admin privileges required.')
      return
    }
    
    
    
    // Fetch data only once when admin access is confirmed
    const fetchAllData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchCustomers()
      ])
    }
    
    fetchAllData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, isLoading, router])

  // Fetch all data from database (for manual refresh)
  const fetchAllData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchCustomers()
    ])
  }

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const response = await fetch('/api/products?admin=true', {
        headers: {
          'Authorization': `Bearer ${user?.email}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true)
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${user?.email}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoadingOrders(false)
    }
  }

  // Fetch customers from database
  const fetchCustomers = async () => {
    try {
      setIsLoadingCustomers(true)
      const response = await fetch('/api/auth/list-users', {
        headers: {
          'Authorization': `Bearer ${user?.email}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Transform user data to Customer format
        const customersData: Customer[] = data.map((user: any) => ({
          id: user.id,
          name: user.name || user.email,
          email: user.email,
          joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString(),
          totalOrders: user.orderCount || 0,
          totalSpent: user.totalSpent || 0,
          status: user.isActive ? 'ACTIVE' : 'INACTIVE'
        }))
        setCustomers(customersData)
      } else {
        toast.error('Failed to fetch customers')
      }
    } catch (error) {
      toast.error('Failed to fetch customers')
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  const [newProduct, setNewProduct] = useState({
    brand: '',
    model: '',
    referenceNumber: '',
    price: '',
    previousPrice: '',
    condition: 'NEW',
    year: new Date().getFullYear().toString(),
    gender: 'MENS',
    description: '',
    stockQuantity: '1',
    categories: [] as string[],
    specifications: {
      movement: '',
      case: '',
      dial: '',
      
      bracelet: '',
      waterResistance: '',
      powerReserve: '',
      diameter: '',
      thickness: ''
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    }
  })

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Check if user is admin
  if (!isAuthenticated || !user?.role || user.role.toUpperCase() !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const handleAddProduct = async () => {
    if (!newProduct.brand || !newProduct.model || !newProduct.price) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.email}`,
        },
        body: JSON.stringify({
          brand: newProduct.brand,
          model: newProduct.model,
          referenceNumber: newProduct.referenceNumber,
          price: parseFloat(newProduct.price),
          previousPrice: newProduct.previousPrice ? parseFloat(newProduct.previousPrice) : undefined,
          condition: newProduct.condition,
          year: parseInt(newProduct.year),
          description: newProduct.description,
          stockQuantity: parseInt(newProduct.stockQuantity),
          // TODO: categories will be implemented after database schema update
          // categories: newProduct.categories,
          specifications: newProduct.specifications,
          authenticity: newProduct.authenticity
        }),
      })

      if (response.ok) {
        const createdProduct = await response.json()
        setProducts([...products, createdProduct])
        setNewProduct({
          brand: '',
          model: '',
          referenceNumber: '',
          price: '',
          previousPrice: '',
          condition: 'NEW',
          year: new Date().getFullYear().toString(),
          gender: 'MENS',
          description: '',
          stockQuantity: '1',
          categories: [],
          specifications: {
            movement: '',
            case: '',
            dial: '',
            bracelet: '',
            waterResistance: '',
            powerReserve: '',
            diameter: '',
            thickness: ''
          },
          authenticity: {
            guaranteed: true,
            certificate: true,
            serviceHistory: true
          }
        })
        setIsAddingProduct(false)
        toast.success('Product added successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add product')
      }
    } catch (error) {
      toast.error('Failed to add product')
    }
  }

  const handleClearAllProducts = async () => {
    if (!confirm('Are you sure you want to clear ALL products? This action cannot be undone!')) {
      return
    }

    try {
      // Clear all products through the API
      const response = await fetch('/api/products/clear-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.email}`,
        },
      })

      if (response.ok) {
        setProducts([])
        toast.success('All products cleared successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to clear products')
      }
    } catch (error) {
      toast.error('Failed to clear products')
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      brand: product.brand,
      model: product.model,
      referenceNumber: product.referenceNumber,
      price: product.price.toString(),
      previousPrice: product.previousPrice?.toString() || '',
      condition: product.condition,
      year: product.year.toString(),
      gender: product.gender || 'MENS',
      description: product.description,
      stockQuantity: product.stockQuantity.toString(),
      categories: [], // TODO: Add categories when Product interface is updated
      specifications: {
        movement: product.specifications?.movement || '',
        case: product.specifications?.case || '',
        dial: product.specifications?.dial || '',
        bracelet: product.specifications?.bracelet || '',
        waterResistance: product.specifications?.waterResistance || '',
        powerReserve: product.specifications?.powerReserve || '',
        diameter: product.specifications?.diameter || '',
        thickness: product.specifications?.thickness || ''
      },
      authenticity: {
        guaranteed: product.authenticity?.guaranteed ?? true,
        certificate: product.authenticity?.certificate ?? true,
        serviceHistory: product.authenticity?.serviceHistory ?? true
      }
    })
    setIsAddingProduct(true)
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.email}`,
        },
        body: JSON.stringify({
          brand: newProduct.brand,
          model: newProduct.model,
          referenceNumber: newProduct.referenceNumber,
          price: parseFloat(newProduct.price),
          previousPrice: newProduct.previousPrice ? parseFloat(newProduct.previousPrice) : undefined,
          condition: newProduct.condition,
          year: parseInt(newProduct.year),
          description: newProduct.description,
          stockQuantity: parseInt(newProduct.stockQuantity),
          specifications: newProduct.specifications,
          authenticity: newProduct.authenticity
        }),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(Array.isArray(products) ? products.map(p => p.id === editingProduct.id ? updatedProduct : p) : [updatedProduct])
        setEditingProduct(null)
        setIsAddingProduct(false)
        setNewProduct({
          brand: '',
          model: '',
          referenceNumber: '',
          price: '',
          previousPrice: '',
          condition: 'NEW',
          year: new Date().getFullYear().toString(),
          gender: 'MENS',
          description: '',
          stockQuantity: '1',
          categories: [],
          specifications: {
            movement: '',
            case: '',
            dial: '',
            bracelet: '',
            waterResistance: '',
            powerReserve: '',
            diameter: '',
            thickness: ''
          },
          authenticity: {
            guaranteed: true,
            certificate: true,
            serviceHistory: true
          }
        })
        toast.success('Product updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update product')
      }
    } catch (error) {
      toast.error('Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(Array.isArray(products) ? products.filter(p => p.id !== productId) : [])
        toast.success('Product deleted successfully!')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
            setOrders(Array.isArray(orders) ? orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        ) : [])
    toast.success('Order status updated!')
  }

  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + order.total, 0) : 0
  const totalOrders = Array.isArray(orders) ? orders.length : 0
  const totalCustomers = Array.isArray(customers) ? customers.length : 0
  const totalProducts = Array.isArray(products) ? products.length : 0

  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users }
  ]

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage products, orders, customers, and analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name || user?.email}
              </span>
              <Button
                onClick={async () => {
                  await logout()
                  // The auth context will handle the redirect
                }}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs - Desktop */}
        <div className="hidden lg:flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {tabItems.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-yellow-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Navigation Tabs - Mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-lg shadow-sm mb-6 p-2">
            <div className="grid grid-cols-2 gap-2">
              {tabItems.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-yellow-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveTab('products')}
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Package className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">
                        {isLoadingProducts ? (
                          <span className="animate-pulse bg-gray-200 h-8 w-16 rounded-none"></span>
                        ) : (
                          totalProducts
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveTab('customers')}
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">
                        {isLoadingCustomers ? (
                          <span className="animate-pulse bg-gray-200 h-8 w-16 rounded-none"></span>
                        ) : (
                          totalCustomers
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveTab('orders')}
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">
                        {isLoadingOrders ? (
                          <span className="animate-pulse bg-gray-200 h-8 w-16 rounded-none"></span>
                        ) : (
                          totalOrders
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveTab('orders')}
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Synchronization */}
            <Card className="hover:shadow-md transition-shadow border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl text-blue-700">Data Synchronization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Refresh data from the database to see the latest information.
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        Click the buttons below to refresh specific data or all data at once.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={fetchAllData}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        Refresh All Data
                      </Button>
                      <Button 
                        onClick={fetchProducts}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        Refresh Products
                      </Button>
                      <Button 
                        onClick={fetchOrders}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        size="sm"
                      >
                        Refresh Orders
                      </Button>
                      <Button 
                        onClick={fetchCustomers}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        size="sm"
                      >
                        Refresh Customers
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingOrders ? (
                    // Loading skeleton for orders
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-none">
                        <div className="mb-3 sm:mb-0 space-y-2">
                          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-24 rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-20 rounded-none"></div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <div className="animate-pulse bg-gray-200 h-6 w-20 rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-16 rounded-none"></div>
                        </div>
                      </div>
                    ))
                  ) : (!Array.isArray(orders) || orders.length === 0) ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No orders found</p>
                    </div>
                  ) : (
                    (Array.isArray(orders) ? orders.slice(0, 5) : []).map((order) => (
                      <div 
                        key={order.id} 
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setActiveTab('orders')
                          // Scroll to the specific order in the orders tab
                          setTimeout(() => {
                            const orderElement = document.getElementById(`order-${order.id}`)
                            if (orderElement) {
                              orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              orderElement.classList.add('bg-yellow-50', 'border-yellow-200')
                              setTimeout(() => {
                                orderElement.classList.remove('bg-yellow-50', 'border-yellow-200')
                              }, 3000)
                            }
                          }, 100)
                        }}
                      >
                      <div className="mb-3 sm:mb-0">
                        <h4 className="font-semibold text-gray-900">{order.customerName}</h4>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        <p className="text-sm text-gray-600">{formatPrice(order.total)}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-sm text-gray-500">{order.date}</span>
                                              </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="text-lg lg:text-xl">Product Management</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={fetchProducts}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Refresh Products
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingProduct(true)
                        setEditingProduct(null)
                        setNewProduct({
                          brand: '',
                          model: '',
                          referenceNumber: '',
                          price: '',
                          previousPrice: '',
                          condition: 'NEW',
                          year: new Date().getFullYear().toString(),
                          gender: 'MENS',
                          description: '',
                          stockQuantity: '1',
                          categories: [],
                          specifications: {
                            movement: '',
                            case: '',
                            dial: '',
                            bracelet: '',
                            waterResistance: '',
                            powerReserve: '',
                            diameter: '',
                            thickness: ''
                          },
                          authenticity: {
                            guaranteed: true,
                            certificate: true,
                            serviceHistory: true
                          }
                        })
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isAddingProduct && (
                  <div className="mb-6 p-4 lg:p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <h4 className="sm:col-span-2 font-medium text-gray-900 mb-2">Basic Information</h4>
                      <Input
                        placeholder="Brand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      />
                      <Input
                        placeholder="Model"
                        value={newProduct.model}
                        onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                      />
                      <Input
                        placeholder="Reference Number"
                        value={newProduct.referenceNumber}
                        onChange={(e) => setNewProduct({ ...newProduct, referenceNumber: e.target.value })}
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                      <Input
                        placeholder="Previous Price (optional)"
                        type="number"
                        value={newProduct.previousPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, previousPrice: e.target.value })}
                      />
                      <Select value={newProduct.condition} onValueChange={(value) => setNewProduct({ ...newProduct, condition: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="PRE_OWNED">Pre-owned</SelectItem>
                          <SelectItem value="VINTAGE">Vintage</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={newProduct.gender} onValueChange={(value) => setNewProduct({ ...newProduct, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MENS">Men's</SelectItem>
                          <SelectItem value="WOMENS">Women's</SelectItem>
                          <SelectItem value="UNISEX">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Year"
                        type="number"
                        value={newProduct.year}
                        onChange={(e) => setNewProduct({ ...newProduct, year: e.target.value })}
                      />
                      <Input
                        placeholder="Stock Quantity"
                        type="number"
                        value={newProduct.stockQuantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          placeholder="Description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-4">Product Categories</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newProduct.categories) && newProduct.categories.includes('premium-watches')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  categories: [...(Array.isArray(newProduct.categories) ? newProduct.categories : []), 'premium-watches']
                                })
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  categories: Array.isArray(newProduct.categories) ? newProduct.categories.filter(cat => cat !== 'premium-watches') : []
                                })
                              }
                            }}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          Premium Watches
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newProduct.categories) && newProduct.categories.includes('signature-eyewear')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  categories: [...(Array.isArray(newProduct.categories) ? newProduct.categories : []), 'signature-eyewear']
                                })
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  categories: Array.isArray(newProduct.categories) ? newProduct.categories.filter(cat => cat !== 'signature-eyewear') : []
                                })
                              }
                            }}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          Signature Eyewear
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newProduct.categories) && newProduct.categories.includes('elite-speakers')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  categories: [...(Array.isArray(newProduct.categories) ? newProduct.categories : []), 'elite-speakers']
                                })
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  categories: Array.isArray(newProduct.categories) ? newProduct.categories.filter(cat => cat !== 'elite-speakers') : []
                                })
                              }
                            }}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          Elite Speakers
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newProduct.categories) && newProduct.categories.includes('true-wireless-earbuds')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  categories: [...(Array.isArray(newProduct.categories) ? newProduct.categories : []), 'true-wireless-earbuds']
                                })
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  categories: Array.isArray(newProduct.categories) ? newProduct.categories.filter(cat => cat !== 'true-wireless-earbuds') : []
                                })
                              }
                            }}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          True Wireless Earbuds
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newProduct.categories) && newProduct.categories.includes('all-products')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  categories: [...(Array.isArray(newProduct.categories) ? newProduct.categories : []), 'all-products']
                                })
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  categories: Array.isArray(newProduct.categories) ? newProduct.categories.filter(cat => cat !== 'all-products') : []
                                })
                              }
                            }}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          All Products
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newProduct.categories) && newProduct.categories.includes('new-arrivals')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  categories: [...(Array.isArray(newProduct.categories) ? newProduct.categories : []), 'new-arrivals']
                                })
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  categories: Array.isArray(newProduct.categories) ? newProduct.categories.filter(cat => cat !== 'new-arrivals') : []
                                })
                              }
                            }}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          New Arrivals
                        </label>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <h4 className="sm:col-span-2 font-medium text-gray-900 mb-2">Technical Specifications</h4>
                      <Input
                        placeholder="Movement"
                        value={newProduct.specifications.movement}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, movement: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Case"
                        value={newProduct.specifications.case}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, case: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Dial"
                        value={newProduct.specifications.dial}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, dial: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Bracelet"
                        value={newProduct.specifications.bracelet}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, bracelet: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Water Resistance"
                        value={newProduct.specifications.waterResistance}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, waterResistance: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Power Reserve"
                        value={newProduct.specifications.powerReserve}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, powerReserve: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Diameter"
                        value={newProduct.specifications.diameter}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, diameter: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Thickness"
                        value={newProduct.specifications.thickness}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          specifications: { ...newProduct.specifications, thickness: e.target.value }
                        })}
                      />
                    </div>

                    {/* Authenticity */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-4">Authenticity Guarantee</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newProduct.authenticity.guaranteed}
                            onChange={(e) => setNewProduct({
                              ...newProduct,
                              authenticity: { ...newProduct.authenticity, guaranteed: e.target.checked }
                            })}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          Guaranteed Authentic
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newProduct.authenticity.certificate}
                            onChange={(e) => setNewProduct({
                              ...newProduct,
                              authenticity: { ...newProduct.authenticity, certificate: e.target.checked }
                            })}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          Certificate of Authenticity Included
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newProduct.authenticity.serviceHistory}
                            onChange={(e) => setNewProduct({
                              ...newProduct,
                              authenticity: { ...newProduct.authenticity, serviceHistory: e.target.checked }
                            })}
                            className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          Service History Available
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button 
                        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                        className="w-full sm:w-auto"
                      >
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddingProduct(false)
                          setEditingProduct(null)
                        }}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products by brand, model, reference number, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Showing {filteredProducts.length} of {products.length} products
                    </p>
                  )}
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    </div>
                  ) : (!Array.isArray(filteredProducts) || filteredProducts.length === 0) ? (
                    <div className="text-center p-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>
                        {searchQuery 
                          ? `No products found matching "${searchQuery}". Try a different search term.`
                          : "No products found. Create your first product to get started."
                        }
                      </p>
                    </div>
                  ) : (
                    (Array.isArray(filteredProducts) ? filteredProducts : []).map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 truncate">{product.brand} {product.model}</h4>
                              <p className="text-sm text-gray-600">{product.referenceNumber}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                                <span>{formatPrice(product.price)}</span>
                                <span>Stock: {product.stockQuantity}</span>
                                <span>Gender: {product.gender === 'MENS' ? 'Men\'s' : product.gender === 'WOMENS' ? 'Women\'s' : 'Unisex'}</span>
                                <span>Condition: {product.condition}</span>
                                <span>Year: {product.year}</span>
                              </div>
                              {product.specifications && (
                                <div className="mt-2 text-xs text-gray-500">
                                  <span>Movement: {product.specifications.movement || 'N/A'}</span>
                                  <span className="mx-2">•</span>
                                  <span>Case: {product.specifications.case || 'N/A'}</span>
                                  <span className="mx-2">•</span>
                                  <span>Water Res: {product.specifications.waterResistance || 'N/A'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 lg:flex-none"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 lg:flex-none"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const detailsElement = document.getElementById(`details-${product.id}`)
                                if (detailsElement) {
                                  detailsElement.classList.toggle('hidden')
                                }
                              }}
                              className="flex-1 lg:flex-none"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Image Manager for this product */}
                        <AdminImageManager productId={product.id} />
                        
                        {/* Expandable Details Section */}
                        <div id={`details-${product.id}`} className="hidden mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Basic Information */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3">Basic Information</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Brand:</span>
                                  <span className="font-medium">{product.brand}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Model:</span>
                                  <span className="font-medium">{product.model}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Reference:</span>
                                  <span className="font-medium">{product.referenceNumber || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Gender:</span>
                                  <span className="font-medium">{product.gender === 'MENS' ? 'Men\'s' : product.gender === 'WOMENS' ? 'Women\'s' : 'Unisex'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Condition:</span>
                                  <span className="font-medium">{product.condition}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Year:</span>
                                  <span className="font-medium">{product.year}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Categories:</span>
                                  <span className="font-medium">
                                    {Array.isArray(product.categories) && product.categories.length > 0 
                                      ? product.categories.map(cat => {
                                          const categoryNames: { [key: string]: string } = {
                                            'premium-watches': 'Premium Watches',
                                            'signature-eyewear': 'Signature Eyewear',
                                            'elite-speakers': 'Elite Speakers',
                                            'true-wireless-earbuds': 'True Wireless Earbuds',
                                            'all-products': 'All Products',
                                            'new-arrivals': 'New Arrivals'
                                          }
                                          return categoryNames[cat] || cat
                                        }).join(', ')
                                      : 'None'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Technical Specifications */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3">Technical Specifications</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Movement:</span>
                                  <span className="font-medium">{product.specifications?.movement || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Case:</span>
                                  <span className="font-medium">{product.specifications?.case || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Dial:</span>
                                  <span className="font-medium">{product.specifications?.dial || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Bracelet:</span>
                                  <span className="font-medium">{product.specifications?.bracelet || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Water Resistance:</span>
                                  <span className="font-medium">{product.specifications?.waterResistance || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Power Reserve:</span>
                                  <span className="font-medium">{product.specifications?.powerReserve || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Dimensions & Authenticity */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3">Dimensions & Authenticity</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Diameter:</span>
                                  <span className="font-medium">{product.specifications?.diameter || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Thickness:</span>
                                  <span className="font-medium">{product.specifications?.thickness || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Guaranteed:</span>
                                  <span className="font-medium">{product.authenticity?.guaranteed ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Certificate:</span>
                                  <span className="font-medium">{product.authenticity?.certificate ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Service History:</span>
                                  <span className="font-medium">{product.authenticity?.serviceHistory ? 'Yes' : 'No'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Description */}
                          {product.description && (
                            <div className="mt-6">
                              <h5 className="font-semibold text-gray-900 mb-3">Description</h5>
                              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="text-lg lg:text-xl">Order Management</CardTitle>
                  <Button
                    onClick={fetchOrders}
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
                  >
                    Refresh Orders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingOrders ? (
                    // Loading skeleton for orders
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="border border-gray-200 rounded-none p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div className="mb-4 lg:mb-0 space-y-2">
                            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded-none"></div>
                            <div className="animate-pulse bg-gray-200 h-3 w-48 rounded-none"></div>
                            <div className="animate-pulse bg-gray-200 h-3 w-24 rounded-none"></div>
                          </div>
                          <div className="text-left lg:text-right space-y-2">
                            <div className="animate-pulse bg-gray-200 h-6 w-20 rounded-none"></div>
                            <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-none"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="animate-pulse bg-gray-200 h-3 w-full rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-3/4 rounded-none"></div>
                        </div>
                      </div>
                    ))
                  ) : (!Array.isArray(orders) || orders.length === 0) ? (
                    <div className="text-center py-12 text-gray-500">
                      <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm">Orders will appear here once customers start placing them.</p>
                    </div>
                  ) : (
                    (Array.isArray(orders) ? orders : []).map((order) => (
                    <div key={order.id} id={`order-${order.id}`} className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="mb-4 lg:mb-0">
                          <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                          <p className="text-sm text-gray-600">{order.customerName} - {order.customerEmail}</p>
                          <p className="text-sm text-gray-600">Date: {order.date}</p>
                        </div>
                        <div className="text-left lg:text-right">
                          <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                          <Select value={order.status} onValueChange={(value: Order['status']) => handleUpdateOrderStatus(order.id, value)}>
                            <SelectTrigger className="w-full lg:w-32 mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="PROCESSING">Processing</SelectItem>
                              <SelectItem value="SHIPPED">Shipped</SelectItem>
                              <SelectItem value="DELIVERED">Delivered</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                                            <div className="space-y-2">
                        {Array.isArray(order.items) ? order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.productName} x{item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.price)}</span>
                          </div>
                        )) : (
                          <div className="text-sm text-gray-500">No items found</div>
                        )}
                      </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="text-lg lg:text-xl">Customer Management</CardTitle>
                  <Button
                    onClick={fetchCustomers}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    Refresh Customers
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingCustomers ? (
                    // Loading skeleton for customers
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 border border-gray-200 rounded-none">
                        <div className="mb-4 lg:mb-0 space-y-2">
                          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-48 rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-24 rounded-none"></div>
                        </div>
                        <div className="text-left lg:text-right space-y-2">
                          <div className="animate-pulse bg-gray-200 h-3 w-20 rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-24 rounded-none"></div>
                          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-none"></div>
                        </div>
                      </div>
                    ))
                  ) : (!Array.isArray(customers) || customers.length === 0) ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No customers found</p>
                      <p className="text-sm">Customer data will appear here once users register and place orders.</p>
                    </div>
                  ) : (
                    (Array.isArray(customers) ? customers : []).map((customer) => (
                    <div key={customer.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mb-4 lg:mb-0">
                        <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-600">Joined: {customer.joinDate}</p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-sm text-gray-600">{customer.totalOrders} orders</p>
                        <p className="text-sm text-gray-600">{formatPrice(customer.totalSpent)} spent</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.status}
                        </span>
                                              </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

