'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber?: string
  price: number
  previousPrice?: number
  gender: string
  imageUrl: string
  isFeatured?: boolean
}

interface ProductGridCardProps {
  product: Product
  onAddToWishlist?: (productId: string) => void
  onAddToCart?: (productId: string) => void
}

export function ProductGridCard({ product, onAddToWishlist, onAddToCart }: ProductGridCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(product.id)
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart?.(product.id)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const discountPercentage = product.previousPrice 
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0

  return (
    <div className="group bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-gray-200">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/watches/${product.id}`}>
          <Image
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          />
        </Link>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Heart 
            size={16} 
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
          />
        </button>

        {/* Quick Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShoppingCart size={14} />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <div className="text-sm font-semibold text-gray-900 mb-1">
          {product.brand}
        </div>

        {/* Model */}
        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.model}
        </div>

        {/* Gender/Collection */}
        <div className="text-xs text-gray-500 mb-3">
          {product.gender === 'MENS' ? 'Men' : product.gender === 'WOMENS' ? 'Women' : product.gender}
          {product.referenceNumber && ` | ${product.referenceNumber}`}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.previousPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="flex gap-2 mt-3 sm:hidden">
          <button
            onClick={handleWishlist}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 text-sm font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <Heart size={14} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
            Wishlist
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 bg-black text-white py-2 px-3 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
