import React, { memo, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OptimizedImage } from '@/components/OptimizedImage'
import { formatPrice } from '@/lib/utils'

// Memoized Product Card Component
export const ProductCard = memo(({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  isInWishlist = false 
}: {
  product: any
  onAddToCart: (product: any) => void
  onAddToWishlist: (product: any) => void
  isInWishlist?: boolean
}) => {
  const primaryImage = useMemo(() => {
    return product.images?.find((img: any) => img.isPrimary)?.imageUrl || 
           product.images?.[0]?.imageUrl || 
           '/placeholder-watch.jpg'
  }, [product.images])

  const discountPercentage = useMemo(() => {
    if (!product.previousPrice || product.previousPrice <= product.price) return 0
    return Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
  }, [product.previousPrice, product.price])

  const handleAddToCart = useCallback(() => {
    onAddToCart(product)
  }, [onAddToCart, product])

  const handleAddToWishlist = useCallback(() => {
    onAddToWishlist(product)
  }, [onAddToWishlist, product])

  return (
    <Card className="product-card group">
      <CardHeader className="p-4 pb-2">
        <div className="relative">
          <OptimizedImage
            src={primaryImage}
            alt={`${product.brand} ${product.model}`}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-walnut-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Condition Badge */}
          <Badge className="absolute top-2 right-2 bg-earth-800/80 text-white text-xs">
            {product.condition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-earth-900 truncate">
            {product.brand} {product.model}
          </h3>
          
          <p className="text-sm text-earth-700 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-bold text-walnut-700">
                {formatPrice(product.price)}
              </p>
              {product.previousPrice && product.previousPrice > product.price && (
                <p className="text-sm text-earth-500 line-through">
                  {formatPrice(product.previousPrice)}
                </p>
              )}
            </div>
            
            {product.year && (
              <p className="text-sm text-earth-600">
                {product.year}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              className="btn-walnut flex-1" 
              size="sm"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddToWishlist}
              className={isInWishlist ? 'text-red-600 border-red-600' : ''}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

// Memoized Order Card Component
export const OrderCard = memo(({ order }: { order: any }) => {
  const statusConfig = useMemo(() => ({
    PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  }), [])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  return (
    <Card className="card-walnut">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge className={statusConfig[order.status as keyof typeof statusConfig]?.color}>
            {statusConfig[order.status as keyof typeof statusConfig]?.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {order.orderItems?.map((item: any) => (
            <div key={item.id} className="flex items-center space-x-3">
              <OptimizedImage
                src={item.product.images?.[0]?.imageUrl || '/placeholder-watch.jpg'}
                alt={item.product.model}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.product.brand} {item.product.model}
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} • {formatPrice(item.priceAtTimeOfPurchase)}
                </p>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t">
            <p className="text-lg font-semibold text-gray-900">
              Total: {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

OrderCard.displayName = 'OrderCard'

// Memoized Loading Skeleton Component
export const LoadingSkeleton = memo(({ count = 3 }: { count?: number }) => {
  const skeletons = useMemo(() => Array.from({ length: count }, (_, i) => i), [count])
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {skeletons.map((i) => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-none" />
          <CardContent className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded-none w-3/4" />
            <div className="h-3 bg-gray-200 rounded-none w-1/2" />
            <div className="h-4 bg-gray-200 rounded-none w-1/3" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 bg-gray-200 rounded-none flex-1" />
              <div className="h-8 bg-gray-200 rounded-none w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})

LoadingSkeleton.displayName = 'LoadingSkeleton'
