'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CleanProductCard } from '@/components/ui/clean-product-card'
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
  category: string
  inStock: boolean
  brand: string
  model: string
  referenceNumber?: string
}

export default function SpeakersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        // For now, we'll show a placeholder since speakers products aren't in the database yet
        // This can be updated when speakers are added to the backend
        setProducts([])
      } catch (error) {
        console.error('Error fetching speakers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpeakers()
  }, [])

  const handleProductClick = (productId: string) => {
    router.push(`/speakers/${productId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Elite Speakers
            </h1>
            <p className="text-gray-600">
              Discover our collection of premium speakers for every audio experience
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Elite Speakers Collection
              </h2>
              <p className="text-gray-600 mb-6">
                We're curating an exclusive collection of elite speakers. 
                Stay tuned for our upcoming launch featuring the finest audio equipment from top brands.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  🚀 Coming Soon - Elite Speakers Collection
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder for future products */}
          {products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product) => (
                <CleanProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
