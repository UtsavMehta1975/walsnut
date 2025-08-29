'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/ui/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Grid, List } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { useDebounce } from '@/lib/hooks/use-performance'

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber: string
  price: number
  previousPrice?: number
  condition: string
  year: number
  imageUrl: string
  stockQuantity: number
}

export default function WatchesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [isLoading, setIsLoading] = useState(true)

  // Debounced search for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const brands = ['Walnut']
  const conditions = ['NEW', 'PRE_OWNED', 'VINTAGE']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data) // Debug log
        // Transform the data to match our interface
        const transformedProducts: Product[] = data.data.map((product: any) => ({
          id: product.id,
          brand: product.brand,
          model: product.model,
          referenceNumber: product.referenceNumber || '',
          price: parseFloat(product.price),
          previousPrice: product.previousPrice ? parseFloat(product.previousPrice) : undefined,
          condition: product.condition,
          year: product.year || 0,
          imageUrl: product.images?.[0]?.imageUrl?.replace(/\\u0026/g, '&').replace(/\\/g, '') || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2F0Y2g8L3RleHQ+Cjwvc3ZnPgo=',
          stockQuantity: product.stockQuantity
        }))
        console.log('Transformed Products:', transformedProducts) // Debug log
        setProducts(transformedProducts)
      } else {
        console.error('Failed to fetch products')
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products]

    // Search filter with debounced term
    if (debouncedSearchTerm) {
      filtered = filtered.filter(product =>
        product.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.referenceNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    }

    // Brand filter
    if (selectedBrand && selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

    // Condition filter
    if (selectedCondition && selectedCondition !== 'all') {
      filtered = filtered.filter(product => product.condition === selectedCondition)
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'year-new':
        filtered.sort((a, b) => b.year - a.year)
        break
      case 'year-old':
        filtered.sort((a, b) => a.year - b.year)
        break
      case 'default':
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, debouncedSearchTerm, selectedBrand, selectedCondition, sortBy])

  useEffect(() => {
    filterAndSortProducts()
  }, [filterAndSortProducts, debouncedSearchTerm, selectedBrand, selectedCondition, sortBy])



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading watches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl lato-black text-gray-900 mb-2">
            Naturally Crafted Collection
          </h1>
          <p className="text-gray-600">
            Discover our precision-crafted homage timepieces, rooted in the legacy of iconic design
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search watches, brands, models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="year-new">Year: Newest First</SelectItem>
                  <SelectItem value="year-old">Year: Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedBrand('all')
                  setSelectedCondition('all')
                  setSortBy('default')
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No watches found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedBrand('all')
                setSelectedCondition('all')
                setSortBy('default')
              }}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} watches
            </div>
            
                        {/* Mobile-optimized grid: 2x2 on mobile to show 4 products in one screen */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant="watches"
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
