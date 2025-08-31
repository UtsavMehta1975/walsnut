'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative">
      {/* Mobile Hero Image - Top Section */}
      <div className="block md:hidden relative">
        <div className="relative w-full h-auto">
          <Image 
            src="/mobile-banner.png"
            alt="Premium Watches Collection"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Desktop Hero Video/Poster Banner */}
      <div className="hidden md:block relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/web-banner.png"
            alt="Premium Watches"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-white py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">80+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">25+</div>
            <div className="text-sm text-gray-600">State Delivery</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">100%</div>
            <div className="text-sm text-gray-600">Authentic Products</div>
          </div>
        </div>
      </div>

      {/* Gifting Guide Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src="/gift-image.jpg"
                  alt="Luxury Watch Gifting Guide"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  Perfect Gift for Every Occasion
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Discover our curated collection of premium timepieces that make the perfect gift for birthdays, anniversaries, graduations, and special milestones. Each watch tells a story of craftsmanship and elegance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">🎁</div>
                  <div className="text-sm font-medium text-gray-800">Birthday Gifts</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-red-600 mb-2">💝</div>
                  <div className="text-sm font-medium text-gray-800">Anniversary</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-2">🎓</div>
                  <div className="text-sm font-medium text-gray-800">Graduation</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600 mb-2">🏆</div>
                  <div className="text-sm font-medium text-gray-800">Achievement</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/watch-advisor">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold">
                    Get Gift Recommendations
                  </Button>
                </Link>
                <Link href="/watches">
                  <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white font-bold">
                    Browse Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
