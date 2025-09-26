'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Heart } from 'lucide-react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

interface Category {
  id: string
  name: string
  slug: string
  type: string
  productCount: number
}

interface CategoryProduct {
  category: string
  product: {
    id: string
    brand: string
    model: string
    price: number
    previousPrice?: number
    imageUrl: string
    category: string
  } | null
  isLoading: boolean
}

export function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const getCategoryDisplayName = (category: string) => {
    const foundCategory = categories.find(cat => cat.slug === category || cat.id === category)
    return foundCategory?.name || category.charAt(0).toUpperCase() + category.slice(1)
  }

  const getCategoryLink = (category: string) => {
    switch (category) {
      case 'for-him': return '/watches?category=for-him'
      case 'for-her': return '/watches/for-her'
      case 'sale': return '/watches/sale'
      case 'sale-1499': return '/watches?category=sale-1499'
      case 'sale-1999': return '/watches?category=sale-1999'
      case 'new-arrivals': return '/watches?category=new-arrivals'
      default: return `/watches?category=${category}`
    }
  }

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
          
          // Initialize category products state
          const initialCategoryProducts = data.data.map((cat: Category) => ({
            category: cat.slug || cat.id,
            product: null,
            isLoading: true
          }))
          setCategoryProducts(initialCategoryProducts)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoadingCategories(false)
    }
  }, [])

  const fetchCategoryProducts = useCallback(async () => {
    if (categoryProducts.length === 0) return
    
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
    }
  }, [categoryProducts])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (categoryProducts.length > 0) {
      fetchCategoryProducts()
    }
  }, [fetchCategoryProducts, categoryProducts.length])

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Discover our curated collections. One stunning piece from each category to inspire your style.
          </p>
        </div>

        {/* Loading State */}
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-none mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Category Carousel */}
            <Splide
              options={{
                type: 'loop',
                perPage: 4,
                perMove: 1,
                gap: '1.5rem',
                padding: '1rem',
                arrows: true,
                pagination: true,
                breakpoints: {
                  1024: {
                    perPage: 3,
                  },
                  768: {
                    perPage: 2,
                  },
                  640: {
                    perPage: 2,
                  },
                  480: {
                    perPage: 1,
                  },
                },
                classes: {
                  arrows: 'splide__arrows',
                  arrow: 'splide__arrow',
                  prev: 'splide__arrow--prev',
                  next: 'splide__arrow--next',
                  pagination: 'splide__pagination',
                  page: 'splide__pagination__page',
                },
              }}
              aria-label="Product Categories"
            >
              {categoryProducts.map((cat, index) => {
                const categoryInfo = categories.find(c => c.slug === cat.category || c.id === cat.category)
                return (
                  <SplideSlide key={cat.category}>
                    <Link href={getCategoryLink(cat.category)} className="group cursor-pointer block">
                      <div className="relative aspect-square overflow-hidden rounded-none">
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
                        {categoryInfo && (
                          <p className="text-xs text-gray-500 mt-1">
                            {categoryInfo.productCount} {categoryInfo.productCount === 1 ? 'item' : 'items'}
                          </p>
                        )}
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
                  </SplideSlide>
                )
              })}
            </Splide>
            
            {/* Category Count Display */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Showing {categories.length} categories with products available
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
