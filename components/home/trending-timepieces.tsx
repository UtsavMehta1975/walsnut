'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  isBestseller?: boolean
  discount?: number
}

const trendingProducts: Product[] = [
  {
    id: '1',
    name: 'Men Quartz Blue Dial Analog Stainless Steel Watch',
    brand: 'Emporio Armani',
    price: 18495,
    originalPrice: 18495,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 128,
    isBestseller: true
  },
  {
    id: '2',
    name: 'Men Quartz Grey Dial Chronograph Stainless Steel Watch',
    brand: 'Diesel',
    price: 23495,
    originalPrice: 23495,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    reviews: 95,
    isBestseller: true
  },
  {
    id: '3',
    name: 'Men Quartz Black Dial Analog Stainless Steel Watch',
    brand: 'Versace',
    price: 148500,
    originalPrice: 148500,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 67
  },
  {
    id: '4',
    name: 'Men Quartz Green Dial Analog Stainless Steel Watch',
    brand: 'Philipp Plein',
    price: 46495,
    originalPrice: 46495,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.2,
    reviews: 89,
    isBestseller: true
  },
  {
    id: '5',
    name: 'Seapair NV Men Quartz Black Dial Analog Stainless Steel Watch',
    brand: 'Atlantic',
    price: 21200,
    originalPrice: 26500,
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    reviews: 156,
    discount: 20
  },
  {
    id: '6',
    name: 'Men Quartz Grey Dial Chronograph Stainless Steel Watch',
    brand: 'Diesel',
    price: 22495,
    originalPrice: 22495,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.1,
    reviews: 73,
    isBestseller: true
  },
  {
    id: '7',
    name: 'Seawave Men Quartz Blue Dial Analog Stainless Steel Watch',
    brand: 'Atlantic',
    price: 29200,
    originalPrice: 36500,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 234,
    isBestseller: true,
    discount: 20
  },
  {
    id: '8',
    name: 'Seawave Men Quartz Blue Dial Chronograph Stainless Steel Watch',
    brand: 'Atlantic',
    price: 42800,
    originalPrice: 53500,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    reviews: 112,
    discount: 20
  }
]

export function TrendingTimepieces() {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleProductClick = (productId: string) => {
    router.push(`/watches/${productId}`)
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">Trending Timepieces</h2>
          <Link href="/watches" className="text-yellow-600 hover:text-yellow-700 font-medium">
            view all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image */}
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                
                {/* Bestseller Badge */}
                {product.isBestseller && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                    BESTSELLER
                  </div>
                )}
                
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {product.discount}% OFF
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button 
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">{product.brand}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-lg font-bold text-black">
                    ₹ {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹ {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full bg-black text-white hover:bg-gray-800 text-sm"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add To Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
