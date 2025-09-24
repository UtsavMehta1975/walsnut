'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SearchBar } from '@/components/ui/search-bar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Package, Filter } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber?: string
  price: number
  previousPrice?: number
  condition: string
  description: string
  images: Array<{
    id: string
    imageUrl: string
    altText?: string
  }>
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      searchProducts(query)
    }
  }, [query])

  const searchProducts = async (searchQuery: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setError('Failed to search products')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('An error occurred while searching')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-6 w-6 text-yellow-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar 
              placeholder="Search for watches, brands, models..."
              showResults={false}
            />
          </div>
        </div>

        {/* Search Query Display */}
        {query && (
          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? (
                'Searching for...'
              ) : (
                <>
                  Search results for <span className="font-semibold text-gray-900">"{query}"</span>
                  {products.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({products.length} result{products.length !== 1 ? 's' : ''} found)
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for watches...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <p>{error}</p>
            </div>
            <Button onClick={() => searchProducts(query)}>
              Try Again
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && query && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No watches found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any watches matching "{query}". Try different keywords or browse our collection.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/watches">Browse All Watches</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/watch-advisor">Get Recommendations</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && !error && products.length > 0 && (
          <div className="space-y-6">
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/watches/${product.id}`}>
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].imageUrl}
                            alt={product.images[0].altText || `${product.brand} ${product.model}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Condition Badge */}
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.condition === 'NEW' 
                              ? 'bg-green-100 text-green-800' 
                              : product.condition === 'PRE_OWNED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {product.condition.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                            {product.brand} {product.model}
                          </h3>
                          {product.referenceNumber && (
                            <p className="text-sm text-gray-500">
                              Ref: {product.referenceNumber}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                            {product.previousPrice && product.previousPrice > product.price && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(product.previousPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Load More Button (if needed) */}
            {products.length >= 10 && (
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Browse Categories */}
        {!query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <Button variant="outline" asChild>
                <Link href="/watches?category=for-him">For Him</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/watches/for-her">For Her</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/watches/sale">Sale</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/watches">All Watches</Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
