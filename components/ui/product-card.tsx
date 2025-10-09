
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Star, Eye, Check } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import { useWishlist } from '@/store/wishlist-store'
import { formatPrice } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/image-utils'
import toast from 'react-hot-toast'

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber?: string
  price: number
  previousPrice?: number
  condition: string
  year: number
  imageUrl: string
  stockQuantity: number
  images?: Array<{
    id: string
    imageUrl: string
    isPrimary: boolean
    sortOrder: number
  }>
}

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'featured' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Get the proper image URL using the utility function
  const imageUrl = getProductImageUrl(product)

  const handleCardClick = () => {
    router.push(`/watches/${product.id}`)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add to cart
    addToCart({
      id: product.id,
      name: `${product.brand} ${product.model}`,
      price: product.price,
      image: imageUrl
    })
    
    // Show success feedback
    setJustAdded(true)
    toast.success(`${product.brand} ${product.model} added to cart!`, {
      duration: 2000,
      icon: '🛒',
    })
    
    // Reset button state after animation
    setTimeout(() => setJustAdded(false), 2000)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        imageUrl: imageUrl
      })
    }
  }

  const isWishlisted = isInWishlist(product.id)

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg bg-white/95 ${
        variant === 'featured' ? 'featured-product-card' : 'product-card'
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-none">
          <Image
            src={imageUrl}
            alt={`${product.brand} ${product.model}`}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            unoptimized={imageUrl.includes('drive.google.com')}
          />
          
          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full"
              onClick={handleWishlistToggle}
            >
              <Heart 
                className={`h-4 w-4 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} 
              />
            </Button>
          </div>

          {/* Condition Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-highlight text-black text-xs font-semibold px-2 py-1 rounded">
              {product.condition}
            </span>
          </div>

          {/* Stock Badge */}
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <div className="absolute top-2 left-16 z-10">
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

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">(4.5)</span>
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
          <div className="flex gap-2 sm:gap-2">
            <Button 
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className={`flex-1 h-[44px] w-[44px] sm:h-[44px] sm:w-auto sm:flex-1 text-sm sm:text-sm font-semibold rounded-none flex items-center justify-center transition-all duration-300 ${
                justAdded 
                  ? 'bg-green-500 hover:bg-green-600 scale-105' 
                  : 'btn-highlight'
              }`}
              size="default"
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4 sm:mr-1 animate-bounce" />
                  <span className="hidden sm:inline ml-1">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline ml-1">Add to Cart</span>
                </>
              )}
            </Button>
            <Button 
              onClick={handleCardClick}
              disabled={product.stockQuantity === 0}
              variant="outline"
              className="h-[44px] w-[44px] rounded-none flex items-center justify-center"
              size="default"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
