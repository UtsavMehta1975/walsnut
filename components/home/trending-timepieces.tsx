'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Star, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

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

export function TrendingTimepieces() {
  const { addToCart } = useCart()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])

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

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/products?limit=8&sortBy=createdAt&sortOrder=desc')
        if (!res.ok) {
          console.error('Failed to fetch products')
          return
        }
        const json = await res.json()
        console.log('API Response:', json) // Debug log
        
        const data = Array.isArray(json?.data) ? json.data : json
        console.log('Data to map:', data) // Debug log
        
        const mapped: Product[] = data.map((p: any) => {
          // Get the primary image or first available image
          const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
          const imageUrl = primary?.imageUrl || p.imageUrl || '/web-banner.png'
          
          console.log(`Product ${p.brand} ${p.model}:`, { 
            hasImages: !!p.images, 
            imageCount: p.images?.length || 0,
            primaryImage: primary?.imageUrl,
            finalImage: imageUrl
          }) // Debug log
          
          return {
            id: p.id,
            name: `${p.brand} ${p.model}`,
            brand: p.brand,
            price: Number(p.price) || 0,
            originalPrice: p.previousPrice ? Number(p.previousPrice) : Number(p.price) || 0,
            image: imageUrl,
            rating: 4.5,
            reviews: 0,
            category: 'Premium',
            badge: 'NEW'
          }
        })
        
        console.log('Mapped products:', mapped) // Debug log
        setProducts(mapped)
      } catch (error) {
        console.error('Error fetching trending products:', error)
      }
    }
    fetchLatest()
  }, [])

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
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header - Minimal */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
            Trending Timepieces
          </h2>
        </div>

        {/* Sharp, Minimal Product Grid - Responsive with more columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0 w-full mb-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="aspect-square cursor-pointer bg-white hover:opacity-90 transition-opacity duration-200"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image - Sharp corners, no rounded edges */}
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  priority={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action - Minimal */}
        <div className="text-center">
          <Link href="/watches">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-light text-lg px-6 py-3">
              View All Timepieces
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
