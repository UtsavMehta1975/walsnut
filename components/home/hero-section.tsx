'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Banner - Both Mobile and Desktop */}
      <div className="relative w-full">
        <Link href="/watches" className="block w-full cursor-pointer">
          <Image 
            src="/web-banner.png"
            alt="Premium Watches Collection"
            width={1280}
            height={600}
            className="w-full h-auto object-contain hover:opacity-90 transition-opacity duration-300"
            priority
          />
        </Link>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">100+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">All India</div>
            <div className="text-sm text-gray-600">Delivery</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">100%</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Why Choose Walnut?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover what makes us the preferred choice for premium timepiece enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Premium Quality */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-yellow-600 font-bold text-2xl">🏆</div>
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Premium Quality</h4>
              <p className="text-gray-600 text-lg">Every timepiece is crafted with precision engineering and premium materials for lasting excellence. We source only the finest components to ensure your watch stands the test of time.</p>
            </div>

            {/* Fast Delivery */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-yellow-600 font-bold text-2xl">🚚</div>
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Fast Delivery</h4>
              <p className="text-gray-600 text-lg">Free shipping across India with express delivery options to get your timepiece quickly. We ensure secure packaging and real-time tracking for peace of mind.</p>
            </div>

            {/* Expert Guidance */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-yellow-600 font-bold text-2xl">💎</div>
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Expert Guidance</h4>
              <p className="text-gray-600 text-lg">Professional advice and support to help you find the perfect timepiece for any occasion. Our watch experts are here to guide you through every step of your selection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gifting Guide Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Need Gifting Advice? Let Us Guide You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Shop for someone special or yourself using our Watch Advisor. Get personalized recommendations based on style, budget, and occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Image */}
            <div className="relative">
              <div className="aspect-square rounded-none overflow-hidden shadow-lg">
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
                <h3 className="text-xl font-semibold text-black mb-3">
                  Personalized Watch Recommendations
                </h3>
                <p className="text-gray-600 mb-4">
                  Our expert advisors help you find the perfect timepiece for any occasion, whether it's a birthday, anniversary, or just because.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="text-yellow-600 font-bold">👥</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Expert Guidance</h4>
                    <p className="text-sm text-gray-600">Professional advice</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="text-yellow-600 font-bold">⚡</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Quick Results</h4>
                    <p className="text-sm text-gray-600">Instant recommendations</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="text-yellow-600 font-bold">🎁</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Perfect Gifts</h4>
                    <p className="text-sm text-gray-600">For every occasion</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="text-yellow-600 font-bold">✨</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Premium Quality</h4>
                    <p className="text-sm text-gray-600">Authentic timepieces</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/watch-advisor">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold">
                    EXPLORE WATCH ADVISOR
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
