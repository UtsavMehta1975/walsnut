'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cart-store'
import { useAuth } from '@/contexts/auth-context'
import { ShoppingCart, Zap } from 'lucide-react'

interface Product {
  id: string
  brand: string
  model: string
  price: number
  previousPrice?: number
  imageUrl: string
  referenceNumber?: string
}

interface CleanProductCardProps {
  product: Product
}

export function CleanProductCard({ product }: CleanProductCardProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const discountPercentage = product.previousPrice 
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: `${product.brand} ${product.model}`,
      price: product.price,
      image: product.imageUrl
    })
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: `${product.brand} ${product.model}`,
      price: product.price,
      image: product.imageUrl
    })
    // Redirect to checkout (allow both authenticated and guest users)
    window.location.href = '/checkout'
  }

  return (
    <div className="group block">
      <div className="bg-white/95 hover:shadow-sm transition-shadow duration-200">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {product.brand} {product.model}
          </h3>
          
          {/* Reference Number */}
          {product.referenceNumber && (
            <p className="text-xs text-gray-500 mb-2">
              {product.referenceNumber}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>

          {/* Price Badge */}
          <div className="mt-2">
            {discountPercentage > 0 ? (
              <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                {discountPercentage}% OFF
              </span>
            ) : (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                Fixed Price
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-3 space-y-2">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
