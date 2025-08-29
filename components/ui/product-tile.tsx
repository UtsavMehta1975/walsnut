'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'

interface ProductTileProps {
  product: {
    id: string
    brand: string
    model: string
    referenceNumber?: string
    price: number
    previousPrice?: number
    imageUrl: string
    condition: string
    year?: number
    stockQuantity: number
  }
  images?: string[]
}

export function ProductTile({ product, images = [] }: ProductTileProps) {
  const { addItem } = useCartStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Use provided images or fallback to single image
  const productImages = images.length > 0 ? images : [product.imageUrl]

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (productImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [productImages.length])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      productId: product.id,
      brand: product.brand,
      model: product.model,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      quantity: 1
    })
    toast.success('Added to cart!')
  }

  return (
    <Link href={`/watches/${product.id}`} className="block">
      <div className="product-tile group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
        {/* Image Container - Borderless */}
        <div className="relative aspect-square overflow-hidden">
          {/* Main Image */}
          <OptimizedImage
            src={productImages[currentImageIndex]}
            alt={`${product.brand} ${product.model}`}
            width={400}
            height={400}
            fill={true}
            className="object-cover transition-opacity duration-500"
          />
          
          {/* Image Indicators */}
          {productImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-highlight shadow-lg' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Discount Badge */}
          {product.previousPrice && product.previousPrice > product.price && (
            <div className="absolute top-2 left-2 bg-highlight text-black text-xs px-2 py-1 rounded-lg font-semibold">
              {Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)}% OFF
            </div>
          )}

          {/* Condition Badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
            {product.condition.replace('_', ' ')}
          </div>

          {/* Add to Cart Button - Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="bg-highlight text-black px-4 py-2 rounded-xl font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info - Minimal */}
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-sm text-black truncate">
            {product.brand}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {product.model}
          </p>
          {product.referenceNumber && (
            <p className="text-xs text-gray-500 truncate">
              {product.referenceNumber}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-1">
            <p className="text-lg font-bold text-black">
              {formatPrice(product.price)}
            </p>
            {product.previousPrice && product.previousPrice > product.price && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(product.previousPrice)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
