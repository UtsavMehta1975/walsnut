'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Clock, Shield } from 'lucide-react'


export function ShopByBrands() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Discover Premium Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our curated selection of inspired timepieces, each crafted with precision and style
          </p>
        </div>


        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-black mb-2">Authentic Quality</h4>
            <p className="text-gray-600">Every timepiece is crafted with premium materials and precision engineering</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-black mb-2">Fast Delivery</h4>
            <p className="text-gray-600">Free shipping across India with express delivery options available</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-black mb-2">Expert Support</h4>
            <p className="text-gray-600">Expert guidance for your perfect timepiece</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/watches">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold text-lg px-8 py-4">
              Explore All Collections
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
