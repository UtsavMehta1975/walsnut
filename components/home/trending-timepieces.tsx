'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Star, Clock, TrendingUp, Sparkles } from 'lucide-react'
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
  category: string
  badge?: string
}

const trendingProducts: Product[] = [
  {
    id: '1',
    name: 'Men Quartz Blue Dial Analog Stainless Steel Watch',
    brand: 'Luxury AAA',
    price: 18495,
    originalPrice: 18495,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 128,
    isBestseller: true,
    category: 'Premium',
    badge: 'HOT'
  },
  {
    id: '2',
    name: 'Men Quartz Grey Dial Chronograph Stainless Steel Watch',
    brand: 'Sport Elite',
    price: 23495,
    originalPrice: 23495,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    reviews: 95,
    isBestseller: true,
    category: 'Sport',
    badge: 'NEW'
  },
  {
    id: '3',
    name: 'Men Quartz Black Dial Analog Stainless Steel Watch',
    brand: 'Luxury Premium',
    price: 148500,
    originalPrice: 148500,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 67,
    category: 'Luxury',
    badge: 'LIMITED'
  },
  {
    id: '4',
    name: 'Men Quartz Green Dial Analog Stainless Steel Watch',
    brand: 'Fashion Elite',
    price: 46495,
    originalPrice: 46495,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.2,
    reviews: 89,
    isBestseller: true,
    category: 'Fashion',
    badge: 'TRENDING'
  },
  {
    id: '5',
    name: 'Seapair NV Men Quartz Black Dial Analog Stainless Steel Watch',
    brand: 'Classic Heritage',
    price: 21200,
    originalPrice: 26500,
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    reviews: 156,
    discount: 20,
    category: 'Classic',
    badge: 'SALE'
  },
  {
    id: '6',
    name: 'Men Quartz Grey Dial Chronograph Stainless Steel Watch',
    brand: 'Sport Elite',
    price: 22495,
    originalPrice: 22495,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.1,
    reviews: 73,
    isBestseller: true,
    category: 'Sport',
    badge: 'POPULAR'
  },
  {
    id: '7',
    name: 'Seawave Men Quartz Blue Dial Analog Stainless Steel Watch',
    brand: 'Premium AAA',
    price: 29200,
    originalPrice: 36500,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 234,
    isBestseller: true,
    discount: 20,
    category: 'Premium',
    badge: 'BESTSELLER'
  },
  {
    id: '8',
    name: 'Seawave Men Quartz Blue Dial Chronograph Stainless Steel Watch',
    brand: 'Sport Premium',
    price: 42800,
    originalPrice: 53500,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    reviews: 112,
    discount: 20,
    category: 'Sport',
    badge: 'FEATURED'
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

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'HOT': return 'bg-red-500 text-white'
      case 'NEW': return 'bg-blue-500 text-white'
      case 'SALE': return 'bg-green-500 text-white'
      case 'LIMITED': return 'bg-purple-500 text-white'
      case 'TRENDING': return 'bg-orange-500 text-white'
      case 'BESTSELLER': return 'bg-yellow-500 text-black'
      case 'FEATURED': return 'bg-pink-500 text-white'
      case 'POPULAR': return 'bg-indigo-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Trending Timepieces
            </h2>
            <Sparkles className="h-8 w-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Discover the most popular and highly-rated timepieces that our customers love
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center text-yellow-400">
              <Star className="h-5 w-5 fill-current mr-1" />
              <span className="text-sm">4.8 Average Rating</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="h-5 w-5 mr-1" />
              <span className="text-sm">Updated Daily</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trendingProducts.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.badge && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(product.badge)}`}>
                        {product.badge}
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                        BESTSELLER
                      </span>
                    )}
                    {product.discount && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2 font-medium">{product.brand}</div>
                  <h3 className="font-bold text-gray-900 mb-3 text-sm line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-2">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-xl font-bold text-black">
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
                    className="w-full bg-black text-white hover:bg-gray-800 font-semibold transition-colors"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add To Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/watches">
            <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-lg px-8 py-4">
              View All Timepieces
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
