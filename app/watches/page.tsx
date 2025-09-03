'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
}

export default function WatchesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string>('')
  const router = useRouter()
  
  useEffect(() => {
    // Get category from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    setCategory(categoryParam || '')
  }, [])

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        let apiUrl = '/api/products?limit=20&sortBy=createdAt&sortOrder=desc'
        
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
            inStock: p.stockQuantity > 0
          }
        })
        setProducts(mapped)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchLatest()
  }, [category])

  const handleProductClick = (productId: string) => {
    router.push(`/watches/${productId}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-4">
        {/* Header - Minimal */}
        <div className="mb-6 px-4">
          <h1 className="text-2xl md:text-3xl font-light text-black text-center">
            {category === 'for-her' ? 'For Her' : 
             category === 'sale-1499' ? 'Sale Collection' :
             category === 'sale-1999' ? 'Sale Collection' :
             category === 'for-him' ? 'For Him' :
              'All Products'}
          </h1>
        </div>

        {/* Sharp, Minimal Product Grid - Responsive with more columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0 w-full">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="aspect-square cursor-pointer bg-white hover:opacity-90 transition-opacity duration-200"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image - Sharp corners, no rounded edges, no spacing */}
              <div className="relative w-full h-full">
                                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    priority={false}
                  />
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
