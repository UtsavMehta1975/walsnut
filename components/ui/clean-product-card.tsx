'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

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
  const discountPercentage = product.previousPrice 
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0

  return (
    <Link href={`/watches/${product.id}`} className="group block">
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
        </div>
      </div>
    </Link>
  )
}
