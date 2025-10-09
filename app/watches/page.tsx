'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CleanProductCard } from '@/components/ui/clean-product-card'
import { MobileBottomNav } from '@/components/ui/mobile-top-nav'
import { useRouter } from 'next/navigation'
import { trackSearch } from '@/components/analytics/meta-pixel'

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

export default function WatchesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  
  useEffect(() => {
    // Get category and search from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    const searchParam = urlParams.get('search')
    setCategory(categoryParam || '')
    setSearchQuery(searchParam || '')
  }, [])

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        let apiUrl = '/api/products?limit=20&page=1&sortBy=createdAt&sortOrder=desc'
        
        // Add category filter if specified
        if (category) {
          apiUrl += `&category=${category}`
        }
        
        // Add search filter if specified
        if (searchQuery) {
          apiUrl += `&search=${encodeURIComponent(searchQuery)}`
        }
        
        const res = await fetch(apiUrl)
        if (!res.ok) return
        const json = await res.json()
        const data = Array.isArray(json?.data) ? json.data : json
        
        const mapped: Product[] = data.map((p: any) => {
          const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
          return {
            id: p.id,
            name: `${p.brand} ${p.model}`,
            price: Number(p.price) || 0,
            originalPrice: p.previousPrice ? Number(p.previousPrice) : Number(p.price) || 0,
            image: primary?.imageUrl || '/web-banner.png',
            description: p.description || '',
            discount: p.previousPrice && Number(p.previousPrice) > Number(p.price)
              ? Math.round(((Number(p.previousPrice) - Number(p.price)) / Number(p.previousPrice)) * 100)
              : 0,
            colors: [],
            category: 'luxury',
            inStock: p.stockQuantity > 0,
            brand: p.brand || 'Brand',
            model: p.model || 'Model',
            referenceNumber: p.referenceNumber || 'N/A'
          }
        })
        setProducts(mapped)
        setHasMore(data.length === 20) // If we get less than 20, no more products
        setCurrentPage(1) // Reset page when category changes
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchLatest()
  }, [category, searchQuery])

  // Track search events
  useEffect(() => {
    if (searchQuery && searchQuery.length > 2) {
      const contentIds = products.map(product => product.id)
      trackSearch(searchQuery, contentIds)
    }
  }, [searchQuery, products])

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      let apiUrl = `/api/products?limit=20&page=${nextPage}&sortBy=createdAt&sortOrder=desc`
      
      // Add category filter if specified
      if (category) {
        apiUrl += `&category=${category}`
      }
      
      const res = await fetch(apiUrl)
      if (!res.ok) return
      const json = await res.json()
      const data = Array.isArray(json?.data) ? json.data : json
      
      const mapped: Product[] = data.map((p: any) => {
        const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
        return {
          id: p.id,
          name: `${p.brand} ${p.model}`,
          price: Number(p.price) || 0,
          originalPrice: p.previousPrice ? Number(p.previousPrice) : Number(p.price) || 0,
          image: primary?.imageUrl || '/web-banner.png',
          description: p.description || '',
          discount: p.previousPrice && Number(p.previousPrice) > Number(p.price)
            ? Math.round(((Number(p.previousPrice) - Number(p.price)) / Number(p.previousPrice)) * 100)
            : 0,
          colors: [],
          category: 'luxury',
          inStock: p.stockQuantity > 0,
          brand: p.brand || 'Brand',
          model: p.model || 'Model',
          referenceNumber: p.referenceNumber || 'N/A'
        }
      })
      setProducts(prev => [...prev, ...mapped])
      setCurrentPage(nextPage)
      setHasMore(data.length === 20) // If we get less than 20, no more products
    } catch (error) {
      console.error('Error loading more products:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleProductClick = (productId: string) => {
    router.push(`/watches/${productId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-8 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` :
               category === 'for-her' ? 'Women\'s Watches' : 
               category === 'sale-1499' ? 'Sale Collection' :
               category === 'sale-1999' ? 'Sale Collection' :
               category === 'for-him' ? 'Men\'s Watches' :
                'All Watches'}
            </h1>
            <p className="text-gray-600">
              {searchQuery ? `Found ${products.length} watch${products.length !== 1 ? 'es' : ''} matching your search` :
               category === 'for-her' ? 'Elegant timepieces designed for the modern woman' :
               category === 'for-him' ? 'Premium watches crafted for the discerning gentleman' :
               category?.includes('sale') ? 'Discover amazing deals on premium watches' :
               'Discover our complete collection of premium timepieces'}
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
                      brand: product.brand || 'Brand',
                      model: product.model || 'Model',
                      price: product.price,
                      previousPrice: product.originalPrice && product.originalPrice > product.price ? product.originalPrice : undefined,
                      imageUrl: product.image,
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">We're currently updating our collection. Please check back soon!</p>
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
      
      <MobileBottomNav activeSection="watches" />
      <Footer />
    </div>
  )
}
