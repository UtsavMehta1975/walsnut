'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductTile } from '@/components/ui/product-tile'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header - Minimal */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-light text-black text-center">
              Sale Collection
            </h1>
          </div>

          {/* Sharp, Minimal Product Grid - Responsive with more columns on desktop */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0 w-full">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="aspect-square cursor-pointer bg-white hover:opacity-90 transition-opacity duration-200"
                  onClick={() => window.location.href = `/watches/${product.id}`}
                >
                  {/* Product Image - Sharp corners, no rounded edges */}
                  <div className="relative w-full h-full">
                    <Image
                      src={product.imageUrl}
                      alt={`${product.brand} ${product.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      priority={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sale products found</h3>
              <p className="text-gray-600">Check back soon for amazing deals!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
