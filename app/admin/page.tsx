'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Plus, Edit, Trash2, Package, Users, TrendingUp, ShoppingCart, Eye, FileText, Settings, BarChart3 } from 'lucide-react'
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
  description: string
  stockQuantity: number
  specifications: ProductSpecifications
  authenticity: {
    guaranteed: boolean
    certificate: boolean
    serviceHistory: boolean
  }
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
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Check authentication and admin role
  useEffect(() => {
    if (isLoading) return
    
    if (!isAuthenticated) {
      window.location.href = '/auth/signin'
      return
    }
    
    // Debug: Log user info
    console.log('User:', user)
    console.log('User role:', user?.role)
    
    // Check if user has admin role (case insensitive)
    if (!user?.role || user.role.toUpperCase() !== 'ADMIN') {
      window.location.href = '/'
      toast.error('Access denied. Admin privileges required.')
      return
    }
    
    fetchProducts()
  }, [user, isAuthenticated, isLoading])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?admin=true')
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

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      total: 12500,
      status: 'PENDING',
      date: '2024-01-15',
      items: [
        {
          productId: '1',
          productName: 'Rolex Submariner',
          quantity: 1,
          price: 12500
        }
      ]
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      total: 45000,
      status: 'SHIPPED',
      date: '2024-01-14',
      items: [
        {
          productId: '2',
          productName: 'Patek Philippe Nautilus',
          quantity: 1,
          price: 45000
        }
      ]
    }
  ])

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: '2024-01-01',
      totalOrders: 3,
      totalSpent: 25000,
      status: 'ACTIVE'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinDate: '2024-01-05',
      totalOrders: 1,
      totalSpent: 45000,
      status: 'ACTIVE'
    }
  ])

  const [newProduct, setNewProduct] = useState({
    brand: '',
    model: '',
    referenceNumber: '',
    price: '',
    previousPrice: '',
    condition: 'NEW',
    year: new Date().getFullYear().toString(),
    description: '',
    stockQuantity: '1',
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-walnut-600 mx-auto"></div>
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
          <Button onClick={() => window.location.href = '/'}>
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
          description: '',
          stockQuantity: '1',
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
      description: product.description,
      stockQuantity: product.stockQuantity.toString(),
      specifications: product.specifications,
      authenticity: product.authenticity
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
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
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
          description: '',
          stockQuantity: '1',
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
        setProducts(products.filter(p => p.id !== productId))
        toast.success('Product deleted successfully!')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ))
    toast.success('Order status updated!')
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalCustomers = customers.length
  const totalProducts = products.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl lato-black text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage products, orders, customers, and analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'dashboard' 
                ? 'bg-gold-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'products' 
                ? 'bg-gold-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'orders' 
                ? 'bg-gold-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'customers' 
                ? 'bg-gold-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Customers
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-gold-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{order.customerName}</h4>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        <p className="text-sm text-gray-600">${order.total.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Management</CardTitle>
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
                      description: '',
                      stockQuantity: '1',
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
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAddingProduct && (
                <div className="mb-6 p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <h4 className="md:col-span-2 font-medium text-gray-900">Basic Information</h4>
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
                                                           <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-2">
                        Images can be managed after creating the product
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Textarea
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <h4 className="md:col-span-2 font-medium text-gray-900">Technical Specifications</h4>
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
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.authenticity.guaranteed}
                          onChange={(e) => setNewProduct({
                            ...newProduct,
                            authenticity: { ...newProduct.authenticity, guaranteed: e.target.checked }
                          })}
                          className="mr-2"
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
                          className="mr-2"
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
                          className="mr-2"
                        />
                        Service History Available
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingProduct(false)
                        setEditingProduct(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

                             {/* Products List */}
               <div className="space-y-4">
                 {isLoadingProducts ? (
                   <div className="flex items-center justify-center p-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
                   </div>
                 ) : products.length === 0 ? (
                   <div className="text-center p-8 text-gray-500">
                     <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                     <p>No products found. Create your first product to get started.</p>
                   </div>
                 ) : (
                   products.map((product) => (
                     <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                       <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center space-x-4">
                           <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                             <Package className="h-8 w-8 text-gray-400" />
                           </div>
                           <div>
                             <h4 className="font-semibold">{product.brand} {product.model}</h4>
                             <p className="text-sm text-gray-600">{product.referenceNumber}</p>
                             <p className="text-sm text-gray-600">${product.price.toLocaleString()}</p>
                             <p className="text-sm text-gray-600">Stock: {product.stockQuantity}</p>
                           </div>
                         </div>
                         <div className="flex space-x-2">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleEditProduct(product)}
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleDeleteProduct(product.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                       
                       {/* Image Manager for this product */}
                       <AdminImageManager productId={product.id} />
                     </div>
                   ))
                 )}
               </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">Order #{order.id}</h4>
                        <p className="text-sm text-gray-600">{order.customerName} - {order.customerEmail}</p>
                        <p className="text-sm text-gray-600">Date: {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${order.total.toLocaleString()}</p>
                        <Select value={order.status} onValueChange={(value: Order['status']) => handleUpdateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-32">
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
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.productName} x{item.quantity}</span>
                          <span>${item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <p className="text-sm text-gray-600">Joined: {customer.joinDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{customer.totalOrders} orders</p>
                      <p className="text-sm text-gray-600">${customer.totalSpent.toLocaleString()} spent</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
