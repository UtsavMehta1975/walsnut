'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  href: string
  image: string
  color: string
}

const categories: Category[] = [
  {
    id: 'premium-watches',
    name: 'Premium Watches',
    href: '/watches?category=for-him',
    image: '/watch.png',
    color: 'bg-purple-100 hover:bg-purple-200'
  },
  {
    id: 'signature-eyewear',
    name: 'Signature Eyewear',
    href: '/sunglasses',
    image: '/glass.png',
    color: 'bg-gray-100 hover:bg-gray-200'
  },
  {
    id: 'elite-speakers',
    name: 'Elite Speakers',
    href: '/speakers',
    image: '/speaker.png',
    color: 'bg-green-100 hover:bg-green-200'
  },
  {
    id: 'true-wireless-earbuds',
    name: 'True Wireless Earbuds',
    href: '/earbuds',
    image: '/airbuds.png',
    color: 'bg-blue-100 hover:bg-blue-200'
  },
  {
    id: 'all-products',
    name: 'All Products',
    href: '/watches',
    image: '/allproductsshopbycategory.png',
    color: 'bg-purple-100 hover:bg-purple-200'
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    href: '/watches?category=new-arrivals',
    image: '/newarrivalshopbycategory.png',
    color: 'bg-yellow-100 hover:bg-yellow-200'
  }
]

export function CategorySection() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Discover our curated collections
          </p>
        </div>

        {/* Categories Grid - Horizontal Scrollable */}
        <div className="relative">
          {/* Scrollable Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="flex-shrink-0 group"
              >
                <div className="flex flex-col items-center space-y-3">
                  {/* Circular Category Image */}
                  <div className={`
                    w-20 h-20 md:w-24 md:h-24 
                    rounded-full 
                    flex items-center justify-center 
                    transition-all duration-300 
                    group-hover:scale-105 
                    group-hover:shadow-lg
                    ${category.color}
                    overflow-hidden
                  `}>
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        console.error('Image failed to load:', category.image, e);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', category.image);
                      }}
                    />
                  </div>
                  
                  {/* Category Name */}
                  <div className="text-center">
                    <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center text-gray-400 text-sm">
              <span>Swipe to see more</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
