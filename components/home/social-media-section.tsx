'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Instagram, Camera, Heart, Package } from 'lucide-react'
import { InstagramPosts } from './instagram-posts'

interface Product {
  id: string
  brand: string
  model: string
  price: number
  previousPrice?: number
  imageUrl: string
  category: string
}

interface CategoryProduct {
  category: string
  product: Product | null
  isLoading: boolean
}

export function SocialMediaSection() {
  const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([
    { category: 'for-him', product: null, isLoading: true },
    { category: 'for-her', product: null, isLoading: true },
    { category: 'sale', product: null, isLoading: true },
    { category: 'new-arrivals', product: null, isLoading: true }
  ])

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        // Fetch one product from each category
        const promises = categoryProducts.map(async (cat, index) => {
          try {
            const response = await fetch(`/api/products?category=${cat.category}&limit=1&sortBy=createdAt&sortOrder=desc`)
            if (response.ok) {
              const data = await response.json()
              const products = Array.isArray(data?.data) ? data.data : data
              
              if (products.length > 0) {
                const product = products[0]
                const primary = product.images?.find((img: any) => img.isPrimary) || product.images?.[0]
                
                return {
                  ...cat,
                  product: {
                    id: product.id,
                    brand: product.brand,
                    model: product.model,
                    price: Number(product.price) || 0,
                    previousPrice: product.previousPrice ? Number(product.previousPrice) : undefined,
                    imageUrl: primary?.imageUrl || '/web-banner.png',
                    category: cat.category
                  },
                  isLoading: false
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching ${cat.category} product:`, error)
          }
          
          return { ...cat, isLoading: false }
        })

        const results = await Promise.all(promises)
        setCategoryProducts(results)
      } catch (error) {
        console.error('Error fetching category products:', error)
        // Set all to not loading if there's an error
        setCategoryProducts(prev => prev.map(cat => ({ ...cat, isLoading: false })))
      }
    }

    fetchCategoryProducts()
  }, [])

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'for-him': return 'For Him'
      case 'for-her': return 'For Her'
      case 'sale': return 'Sale'
      case 'new-arrivals': return 'New Arrivals'
      default: return category
    }
  }

  const getCategoryLink = (category: string) => {
    switch (category) {
      case 'for-him': return '/watches?category=for-him'
      case 'for-her': return '/watches/for-her'
      case 'sale': return '/watches/sale'
      case 'new-arrivals': return '/watches?category=new-arrivals'
      default: return '/watches'
    }
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Spotted with Walnut
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Follow our journey on Instagram and discover our curated collections. See how our timepieces come to life in the real world.
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium">Instagram Feed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Curated Collections</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Premium Selection</span>
            </div>
          </div>
        </div>

        {/* Instagram Posts Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">
              Latest from Instagram
            </h3>
            <p className="text-gray-600 text-sm">
              Follow us <a href="https://instagram.com/thewalnutstore.in" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">@thewalnutstore.in</a> for daily inspiration
            </p>
          </div>
          <InstagramPosts />
        </div>

        {/* Product Categories Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">
              Shop by Category
            </h3>
            <p className="text-gray-600 text-sm">
              Discover our curated collections. One stunning piece from each category to inspire your style.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryProducts.map((cat, index) => (
            <Link key={cat.category} href={getCategoryLink(cat.category)} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                {cat.isLoading ? (
                  // Loading skeleton
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-400">
                      <Package className="h-8 w-8" />
                    </div>
                  </div>
                ) : cat.product ? (
                  // Product image
                  <Image
                    src={cat.product.imageUrl}
                    alt={`${cat.product.brand} ${cat.product.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  // Fallback image
                  <Image
                    src="/web-banner.png"
                    alt="Collection placeholder"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">View</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-black text-sm line-clamp-1">
                  {getCategoryDisplayName(cat.category)}
                </h4>
                {cat.product ? (
                  <>
                    <p className="text-xs text-gray-600 mt-1">
                      {cat.product.brand} {cat.product.model}
                    </p>
                    <p className="text-sm font-bold text-black mt-1">
                      {cat.product.previousPrice ? (
                        <span className="line-through text-gray-400 mr-2">
                          ₹{cat.product.previousPrice.toLocaleString()}
                        </span>
                      ) : null}
                      ₹{cat.product.price.toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Coming Soon
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/watches">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              <Package className="h-4 w-4 mr-2" />
              View All Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
