'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  description: string
  discount: number
  colors: string[]
}

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Luxury AAA Men Quartz Blue Dial Analog Stainless Steel Watch',
    price: 18495,
    originalPrice: 18495,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'A premium timepiece featuring a sophisticated blue dial with analog display. Crafted with precision engineering and premium materials.',
    discount: 0,
    colors: ['Blue', 'Black', 'Silver']
  },
  {
    id: '2',
    name: 'Sport Elite Men Quartz Grey Dial Chronograph Stainless Steel Watch',
    price: 23495,
    originalPrice: 23495,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'A high-performance sports watch with chronograph functionality and elegant design.',
    discount: 0,
    colors: ['Grey', 'Black', 'Blue']
  },
  {
    id: '3',
    name: 'Luxury Premium Men Quartz Black Dial Analog Stainless Steel Watch',
    price: 148500,
    originalPrice: 148500,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'An ultra-premium timepiece with day-date functionality and luxury styling.',
    discount: 0,
    colors: ['Black', 'Silver', 'Gold']
  },
  {
    id: '4',
    name: 'Fashion Elite Men Quartz Green Dial Analog Stainless Steel Watch',
    price: 46495,
    originalPrice: 46495,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'A stylish fashion-forward timepiece with unique green dial and contemporary design.',
    discount: 0,
    colors: ['Green', 'Black', 'Silver']
  }
]

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    setProducts(dummyProducts)
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  const handleProductClick = (productId: string) => {
    router.push(`/watches/${productId}`)
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Best Of Walnut
          </h2>
          <p className="text-lg text-gray-600">
            Most Searched And Bought
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Product Image */}
              <div 
                className="relative h-64 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  {product.discount}% off
                </div>
                {/* Wishlist Button */}
                <button 
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle wishlist functionality
                  }}
                >
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 
                  className="text-lg font-semibold text-black mb-2 cursor-pointer hover:text-yellow-600"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.name}
                </h3>

                {/* Color Options */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.colors.map((color) => (
                    <span key={color} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {color}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-lg font-bold text-black">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">Rs. {product.originalPrice.toLocaleString()}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add To Cart
                  </Button>
                </div>

                {/* Sale Ending Timer */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-red-500 font-semibold">
                    Sale Ending In: 24:59:45
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/watches">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
