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
    </section>
  )
}
