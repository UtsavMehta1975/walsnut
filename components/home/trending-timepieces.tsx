'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CleanProductCard } from '@/components/ui/clean-product-card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cart-store'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/image-utils'

interface Product {
  id: string
  name: string
  brand: string
  model: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  isBestseller?: boolean
  discount?: number
  category: string
  badge?: string
  referenceNumber?: string
}

export function TrendingTimepieces() {
  const { addToCart } = useCart()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleProducts, setVisibleProducts] = useState(20) // Show 20 products initially (4 rows x 5 columns)

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

  const handleShowMore = () => {
    setVisibleProducts(prev => prev + 20) // Show 20 more products (4 more rows)
  }

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setIsLoading(true)
        // Fetch ALL products, not just 8
        const res = await fetch('/api/products?limit=100&sortBy=createdAt&sortOrder=desc')
        if (!res.ok) {
          console.error('Failed to fetch products')
          return
        }
        const json = await res.json()
        console.log('API Response:', json) // Debug log
        
        const data = Array.isArray(json?.data) ? json.data : json
        console.log('Data to map:', data) // Debug log
        
        const mapped: Product[] = data.map((p: any) => {
          // Use the new getProductImageUrl function for proper image handling
          const imageUrl = getProductImageUrl(p)
          
          console.log(`Product ${p.brand} ${p.model}:`, { 
            hasImages: !!p.images, 
            imageCount: p.images?.length || 0,
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
      } finally {
        setIsLoading(false)
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

  if (isLoading) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
              Trending Timepieces
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full mb-8">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header - Minimal */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
            Trending Timepieces
          </h2>
          <p className="text-gray-600">Showing {products.length} premium timepieces</p>
        </div>

        {/* Clean Product Grid - 4 rows x 5 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {products.slice(0, visibleProducts).map((product) => (
            <CleanProductCard
              key={product.id}
              product={{
                id: product.id,
                brand: product.brand || 'Brand',
                model: product.model || 'Model',
                price: product.price,
                previousPrice: product.originalPrice,
                imageUrl: product.image,
                referenceNumber: product.referenceNumber
              }}
            />
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
