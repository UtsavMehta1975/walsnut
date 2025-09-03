'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/store/cart-store'
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
}

// Fallback before API loads
const dummyProducts: Product[] = []

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/products?limit=8&sortBy=createdAt&sortOrder=desc')
        if (!res.ok) {
          setProducts(dummyProducts)
          return
        }
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
            colors: []
          }
        })
        setProducts(mapped)
      } catch {
        setProducts(dummyProducts)
      }
    }
    fetchLatest()
  }, [])

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
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
            Best Of Walnut
          </h2>
        </div>

        {/* Sharp, Minimal Product Grid - Mobile First */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="aspect-square cursor-pointer bg-white hover:opacity-90 transition-opacity duration-200"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image - Sharp corners, no rounded edges */}
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button - Minimal */}
        <div className="text-center mt-8">
          <Link href="/watches">
            <Button className="bg-black text-white hover:bg-gray-800 font-light px-6 py-2">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
