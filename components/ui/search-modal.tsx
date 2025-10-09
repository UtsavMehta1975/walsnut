'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Clock, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber?: string
  price: number
  description?: string
  images?: Array<{ imageUrl: string; isPrimary: boolean }>
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Search function
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
        
        // Save to recent searches
        if (searchQuery.trim()) {
          const newRecentSearches = [
            searchQuery.trim(),
            ...recentSearches.filter(s => s !== searchQuery.trim())
          ].slice(0, 5) // Keep only 5 recent searches
          
          setRecentSearches(newRecentSearches)
          localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [recentSearches])

  // Handle input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [query, handleSearch])

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/watches?search=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  // Handle product click
  const handleProductClick = (productId: string) => {
    router.push(`/watches/${productId}`)
    onClose()
  }

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm)
    router.push(`/watches?search=${encodeURIComponent(searchTerm)}`)
    onClose()
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Search Watches</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search by brand, model, or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </form>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          ) : query.trim() ? (
            // Search Results
            <div className="p-4">
              {results.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                  </p>
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl}
                            alt={product.model}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {product.brand} {product.model}
                        </h3>
                        {product.referenceNumber && (
                          <p className="text-sm text-gray-500 truncate">
                            Ref: {product.referenceNumber}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-yellow-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {results.length >= 5 && (
                    <Button
                      onClick={() => {
                        router.push(`/watches?search=${encodeURIComponent(query)}`)
                        onClose()
                      }}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      View All Results
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No watches found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords or check spelling</p>
                </div>
              )}
            </div>
          ) : (
            // Recent Searches
            <div className="p-4">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                      >
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium text-gray-700 mb-2">Start typing to search for watches</p>
                  <p className="text-sm mt-1 mb-6">Search by brand, model, or description</p>
                  <Button
                    onClick={() => {
                      router.push('/watches')
                      onClose()
                    }}
                    className="bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Browse All Watches
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
