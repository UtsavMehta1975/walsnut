'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-white">
      {/* Sale Banner */}
      <div className="bg-yellow-400 text-black py-3 text-center">
        <p className="text-lg font-bold">₹400/- OFF ON PREPAID ORDERS</p>
      </div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
            WALNUT
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Premium Inspired Timepieces
          </p>
          
          {/* Countdown Timer */}
          <div className="bg-black text-white py-4 px-6 rounded-lg inline-block mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="font-bold">Sale Ending In: 24:59:45</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-8">
          <Image
            src="https://images.pexels.com/photos/6157724/pexels-photo-6157724.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200"
            alt="Premium Watch Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Grand Sale</h2>
              <p className="text-xl mb-6">Up To 50% Off</p>
              <Link href="/watches">
                <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                  View All
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-black mb-4">Popular Searches</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/watches?category=new">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                New Arrivals
              </Button>
            </Link>
            <Link href="/watches?category=best">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                Best Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
