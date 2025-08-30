'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Video/Poster Banner */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-10"></div>
        
        {/* Video/Image background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Premium Watches"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Premium Inspired<br />
              <span className="text-yellow-400">Timepieces</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Discover precision-crafted timepieces inspired by iconic designs. 
              Quality craftsmanship meets timeless elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/watches">
                <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-lg px-8 py-4">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Watch Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-white py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">80+</div>
            <div className="text-sm text-gray-600">Walnut Boutiques</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-black">18+</div>
            <div className="text-sm text-gray-600">Cities across India</div>
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
