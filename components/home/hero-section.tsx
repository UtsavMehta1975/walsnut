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
            src="/new-banner.png"
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
            <div className="text-2xl md:text-3xl font-bold text-black">Premium</div>
            <div className="text-sm text-gray-600">Range</div>
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
    </section>
  )
}
