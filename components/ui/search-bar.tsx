'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface SearchBarProps {
  className?: string
  placeholder?: string
  showResults?: boolean
}

export function SearchBar({ 
  className = '', 
  placeholder = 'Search watches...',
  showResults = true 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Search function
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        handleSearch(query)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  // Handle result click
  const handleResultClick = (productId: string) => {
    router.push(`/watches/${productId}`)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) {
                setIsOpen(true)
              }
            }}
            className="pl-10 pr-10 w-full"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setResults([])
                setIsOpen(false)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </p>
              </div>
              {results.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleResultClick(product.id)}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].imageUrl}
                          alt={product.model}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.brand} {product.model}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.referenceNumber}
                      </p>
                      <p className="text-sm font-semibold text-yellow-600">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {results.length > 5 && (
                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`)
                      setIsOpen(false)
                    }}
                    className="w-full text-center text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    View all {results.length} results
                  </button>
                </div>
              )}
            </>
          ) : query ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No watches found for "{query}"</p>
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                  setIsOpen(false)
                }}
                className="text-xs text-yellow-600 hover:text-yellow-700 mt-1"
              >
                Try advanced search
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
