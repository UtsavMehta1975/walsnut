'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { OptimizedImage } from '@/components/OptimizedImage'
import { formatPrice } from '@/lib/utils'
import { Package, Calendar, MapPin, CreditCard, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { OrderWithItems } from '@/types'

interface OrdersResponse {
  orders: OrderWithItems[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (selectedStatus) {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/orders?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data: OrdersResponse = await response.json()
      setOrders(data.orders)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, selectedStatus])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    } else if (status === 'unauthenticated') {
      setIsLoading(false)
      setError('Please sign in to view your orders')
    }
  }, [status, fetchOrders])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
                <p className="text-gray-600 mb-4">Please sign in to view your orders</p>
                <Button className="btn-walnut" onClick={() => window.location.href = '/auth/signin'}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your orders and view order history</p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStatus === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('')}
              className={selectedStatus === '' ? 'btn-walnut' : ''}
            >
              All Orders
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className={selectedStatus === status ? 'btn-walnut' : ''}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && (
          <>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                    <p className="text-gray-600 mb-4">
                      {selectedStatus 
                        ? `You don't have any ${selectedStatus.toLowerCase()} orders`
                        : "You haven't placed any orders yet"
                      }
                    </p>
                    <Button className="btn-walnut" onClick={() => window.location.href = '/watches'}>
                      Start Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id} className="card-walnut">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <Badge className={statusConfig[order.status].color}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>{statusConfig[order.status].label}</span>
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CreditCard className="h-4 w-4" />
                              <span>{formatPrice(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <OptimizedImage
                                src={item.product.images[0]?.imageUrl || '/placeholder-watch.jpg'}
                                alt={item.product.model}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {item.product.brand} {item.product.model}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatPrice(item.priceAtTimeOfPurchase)}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{order.shippingAddress}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'btn-walnut' : ''}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
