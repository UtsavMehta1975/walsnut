'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductTile } from '@/components/ui/product-tile'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber?: string
  description: string
  price: number
  previousPrice?: number
  condition: string
  year: number
  gender: string
  movement: string
  caseMaterial: string
  bandMaterial: string
  waterResistance?: string
  diameter?: string
  authenticityStatus: string
  sku: string
  stockQuantity: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  images: Array<{
    id: string
    imageUrl: string
    isPrimary: boolean
    sortOrder: number
  }>
  imageUrl: string // This will be derived from the primary image
}

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=sale&limit=50')
        if (response.ok) {
          const data = await response.json()
          const products = Array.isArray(data?.data) ? data.data : data
          const mappedProducts = products.map((p: any) => {
            const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
            return {
              ...p,
              imageUrl: primary?.imageUrl || '/web-banner.png',
              referenceNumber: p.referenceNumber || 'N/A'
            }
          })
          setProducts(mappedProducts)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        setError('Error fetching products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sale products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-8 px-6 rounded-lg mb-8">
            <h1 className="text-4xl font-bold mb-4">
              🎉 SALE COLLECTION
            </h1>
            <p className="text-xl opacity-90">
              Limited Time Offers - Premium Watches at Unbeatable Prices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-800 mb-2">₹1,499</h3>
              <p className="text-yellow-700">Entry Level Collection</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-800 mb-2">₹1,999</h3>
              <p className="text-orange-700">Premium Collection</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sale products found</h3>
            <p className="text-gray-600">Check back soon for amazing deals!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
