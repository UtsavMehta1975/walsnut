'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber: string
  price: number
  previousPrice?: number
  condition: string
  year: number
  imageUrl: string
  stockQuantity: number
}

interface ProductTileProps {
  product: Product
  variant?: 'default' | 'featured'
}

export function ProductTile({ product, variant = 'default' }: ProductTileProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleCardClick = () => {
    router.push(`/watches/${product.id}`)
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
  }

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

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        variant === 'featured' ? 'featured-product-card' : 'product-card'
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Condition Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-highlight text-black text-xs font-semibold px-2 py-1 rounded">
              {product.condition}
            </span>
          </div>

          {/* Stock Badge */}
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Only {product.stockQuantity} left
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {product.brand} {product.model}
            </h3>
            <p className="text-sm text-gray-500">{product.referenceNumber}</p>
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="flex-1 btn-highlight"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow}
              disabled={product.stockQuantity === 0}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
