'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ui/product-card'

const featuredProducts = [
  {
    id: '1',
    brand: 'Walnut',
    model: 'Apex Diver',
    referenceNumber: 'WD-001',
    price: 125000,
    previousPrice: 135000,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2F0Y2g8L3RleHQ+Cjwvc3ZnPgo=',
    condition: 'New',
    year: 2024,
    stockQuantity: 10
  },
  {
    id: '2',
    brand: 'Walnut',
    model: 'Reserve Classic',
    referenceNumber: 'WD-002',
    price: 85000,
    previousPrice: 95000,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2F0Y2g8L3RleHQ+Cjwvc3ZnPgo=',
    condition: 'New',
    year: 2024,
    stockQuantity: 5
  },
  {
    id: '3',
    brand: 'Walnut',
    model: 'Heritage Sport',
    referenceNumber: 'WD-003',
    price: 95000,
    previousPrice: 108000,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2F0Y2g8L3RleHQ+Cjwvc3ZnPgo=',
    condition: 'New',
    year: 2024,
    stockQuantity: 8
  },
  {
    id: '4',
    brand: 'Walnut',
    model: 'Precision Chrono',
    referenceNumber: 'WD-004',
    price: 75000,
    previousPrice: 82000,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2F0Y2g8L3RleHQ+Cjwvc3ZnPgo=',
    condition: 'New',
    year: 2024,
    stockQuantity: 12
  }
]

export function FeaturedProducts() {
  return (
    <section className="py-12 md:py-20 cream-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl lato-black text-gradient-walnut mb-3 md:mb-4">
            Naturally Crafted Excellence
          </h2>
          <p className="text-base md:text-lg text-earth-700 max-w-2xl mx-auto px-4">
            Discover our curated selection of precision-crafted homage timepieces, each rooted in the legacy of iconic design and finished with organic precision.
          </p>
        </div>

                {/* Mobile-optimized grid: 2x2 on mobile, 4 in a row on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              variant="featured"
            />
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link href="/watches">
            <Button className="btn-walnut-outline text-sm md:text-base" size="lg">
              Explore the Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
