'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OptimizedImage } from '@/components/OptimizedImage'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'

interface ProductCardProps {
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
  variant?: 'featured' | 'watches'
}

export function ProductCard({ product, variant = 'watches' }: ProductCardProps) {
  const { addItem } = useCartStore()

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
    <Link href={`/watches/${product.id}`}>
      <Card className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
        variant === 'featured' ? 'card-walnut' : 'product-card'
      }`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <OptimizedImage
              src={product.imageUrl}
              alt={`${product.brand} ${product.model}`}
              width={300}
              height={300}
              fill={true}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.previousPrice && product.previousPrice > product.price && (
              <div className={`absolute top-1 left-1 md:top-2 md:left-2 text-white text-xs px-1 md:px-2 py-0.5 md:py-1 rounded ${
                variant === 'featured' ? 'bg-walnut-600' : 'bg-red-500'
              }`}>
                {Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)}% OFF
              </div>
            )}
            <div className={`absolute top-1 right-1 md:top-2 md:right-2 text-white text-xs px-1 md:px-2 py-0.5 md:py-1 rounded ${
              variant === 'featured' ? 'bg-earth-800/80' : 'bg-black/70'
            }`}>
              {product.condition.replace('_', ' ')}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          <div className="mb-2">
            <h3 className={`font-semibold text-sm md:text-base ${
              variant === 'featured' ? 'text-earth-900' : 'text-gray-900'
            }`}>
              {product.brand}
            </h3>
            <p className={`text-xs md:text-sm ${
              variant === 'featured' ? 'text-earth-700' : 'text-gray-600'
            }`}>
              {product.model}
            </p>
            <p className={`text-xs ${
              variant === 'featured' ? 'text-earth-600' : 'text-gray-500'
            }`}>
              {product.referenceNumber}
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div>
              <p className={`text-sm md:text-lg font-bold ${
                variant === 'featured' ? 'text-walnut-700' : 'text-gray-900'
              }`}>
                {formatPrice(product.price)}
              </p>
              {product.previousPrice && product.previousPrice > product.price && (
                <p className={`text-xs md:text-sm line-through ${
                  variant === 'featured' ? 'text-earth-500' : 'text-gray-500'
                }`}>
                  {formatPrice(product.previousPrice)}
                </p>
              )}
            </div>
            <span className={`text-xs ${
              variant === 'featured' ? 'text-earth-600' : 'text-gray-500'
            }`}>
              {product.year}
            </span>
          </div>

          <div className="flex flex-col md:space-y-2">
            {/* Mobile: Horizontal buttons */}
            <div className="flex space-x-1 md:hidden">
              <Button 
                className={`flex-1 text-xs py-1 ${
                  variant === 'featured' ? 'btn-walnut' : 'variant-luxury'
                }`}
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                {product.stockQuantity === 0 ? 'Out' : 'Cart'}
              </Button>
              <Link 
                href={`/checkout?productId=${product.id}&brand=${encodeURIComponent(product.brand)}&model=${encodeURIComponent(product.model)}&price=${product.price}&imageUrl=${encodeURIComponent(product.imageUrl)}`} 
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button 
                  className={`w-full text-xs py-1 ${
                    variant === 'featured' 
                      ? 'bg-walnut-600 hover:bg-walnut-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0 ? 'Out' : 'Buy'}
                </Button>
              </Link>
            </div>
            
            {/* Desktop: Vertical buttons */}
            <div className="hidden md:flex md:flex-col md:space-y-2">
              <Button 
                className={`w-full text-sm py-2 ${
                  variant === 'featured' ? 'btn-walnut' : 'variant-luxury'
                }`}
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Link 
                href={`/checkout?productId=${product.id}&brand=${encodeURIComponent(product.brand)}&model=${encodeURIComponent(product.model)}&price=${product.price}&imageUrl=${encodeURIComponent(product.imageUrl)}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button 
                  className={`w-full text-sm py-2 ${
                    variant === 'featured' 
                      ? 'bg-walnut-600 hover:bg-walnut-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Buy Now'}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
