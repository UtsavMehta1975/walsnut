'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

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

const allProducts: Product[] = []

export default function WatchesPage() {
  const [products, setProducts] = useState<Product[]>(allProducts)
  const [category, setCategory] = useState<string>('')
  const { addToCart } = useCart()
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
      } catch {
        // ignore
      }
    }
    fetchLatest()
  }, [category])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  const handleProductClick = (productId: string) => {
    router.push(`/watches/${productId}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {category === 'for-her' ? 'For Her Collection' : 
               category === 'sale-1499' ? 'Sale - ₹1,499 Collection' :
               category === 'sale-1999' ? 'Sale - ₹1,999 Collection' :
               category === 'for-him' ? 'For Him Collection' :
               'All Products'}
            </h1>
            {(category === 'sale-1499' || category === 'sale-1999') && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-lg mb-6">
                <p className="text-lg font-semibold">
                  🎉 Limited Time Offers - Premium Watches at Unbeatable Prices
                </p>
                <div className="mt-2 text-sm opacity-90">
                  {category === 'sale-1499' ? 'Entry Level Collection at ₹1,499' : 'Premium Collection at ₹1,999'}
                </div>
              </div>
            )}
          </div>

          {/* Products Grid - 2x2 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Product Image */}
                <div 
                  className="relative h-64 cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {product.discount}% off
                  </div>
                  {/* Sold Out Badge */}
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-sm font-bold">
                      Sold Out
                    </div>
                  )}
                  {/* Wishlist Button */}
                  <button 
                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle wishlist functionality
                    }}
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 
                    className="text-lg font-semibold text-black mb-2 cursor-pointer hover:text-yellow-600"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.name}
                  </h3>

                  {/* Color Options */}
                  {product.colors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.colors.slice(0, 2).map((color) => (
                        <span key={color} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {color}
                        </span>
                      ))}
                      {product.colors.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{product.colors.length - 2} See {product.colors.length - 2} more option(s)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600">Regular price {formatPrice(product.price)}</div>
                    <div className="text-sm text-gray-600">Sale price {formatPrice(product.price)}</div>
                    <div className="text-sm text-gray-500 line-through">Regular price ~~{formatPrice(product.originalPrice)}~~</div>
                    <div className="text-xs text-gray-600">Unit price /</div>
                  </div>

                  {/* Sale Ending Timer */}
                  <div className="mb-3 text-center">
                    <p className="text-xs text-red-500 font-semibold">
                      Sale Ending In:
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {product.inStock ? (
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-black text-white hover:bg-gray-800"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add To Cart
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        Sold Out
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => handleProductClick(product.id)}
                    >
                      Select options
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
