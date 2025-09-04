'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CleanProductCard } from '@/components/ui/clean-product-card'
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

export default function ForHerPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=for-her&limit=20&page=1')
        if (response.ok) {
          const data = await response.json()
          const products = Array.isArray(data?.data) ? data.data : data
          const mappedProducts = products.map((p: any) => {
            const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
            return {
              ...p,
              brand: p.brand || 'Brand',
              model: p.model || 'Model',
              imageUrl: primary?.imageUrl || '/web-banner.png',
              referenceNumber: p.referenceNumber || 'N/A'
            }
          })
          setProducts(mappedProducts)
          setHasMore(products.length === 20) // If we get less than 20, no more products
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

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const response = await fetch(`/api/products?category=for-her&limit=20&page=${nextPage}`)
      if (response.ok) {
        const data = await response.json()
        const products = Array.isArray(data?.data) ? data.data : data
        const mappedProducts = products.map((p: any) => {
          const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
          return {
            ...p,
            brand: p.brand || 'Brand',
            model: p.model || 'Model',
            imageUrl: primary?.imageUrl || '/web-banner.png',
            referenceNumber: p.referenceNumber || 'N/A'
          }
        })
        setProducts(prev => [...prev, ...mappedProducts])
        setCurrentPage(nextPage)
        setHasMore(products.length === 20) // If we get less than 20, no more products
      }
    } catch (err) {
      console.error('Error loading more products:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
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

  const handleAddToWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', productId)
  }

  const handleAddToCart = async (productId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Women's Watches
            </h1>
            <p className="text-gray-600">
              Elegant timepieces designed for the modern woman
            </p>
          </div>

          {/* Clean Product Grid - Skartgripir Style */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.map((product) => (
                  <CleanProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      brand: product.brand,
                      model: product.model,
                      price: product.price,
                      previousPrice: product.previousPrice && product.previousPrice > product.price ? product.previousPrice : undefined,
                      imageUrl: product.imageUrl,
                      referenceNumber: product.referenceNumber
                    }}
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoadingMore}
                    className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium px-8 py-3 rounded-md transition-colors duration-200"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      'Load More Products'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No women's watches found</h3>
                <p className="text-gray-600 mb-6">Check back soon for new arrivals in our women's collection!</p>
                <a 
                  href="/watches" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200"
                >
                  Browse All Watches
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
