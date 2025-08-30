'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Store, Users, Clock } from 'lucide-react'

export function BoutiqueLocator() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Explore Walnut Boutiques Near You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit our exclusive boutiques to experience premium timepieces in person and get expert guidance from our specialists.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Stats */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">80+</div>
                <div className="text-gray-600">Walnut Boutiques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">18+</div>
                <div className="text-gray-600">Cities across India</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Store className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Exclusive Boutiques</h4>
                  <p className="text-sm text-gray-600">Premium shopping experience</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Expert Staff</h4>
                  <p className="text-sm text-gray-600">Professional guidance</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Extended Hours</h4>
                  <p className="text-sm text-gray-600">Convenient shopping times</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/store-locator">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold">
                  LOCATE STORE
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Map placeholder */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive Store Map</p>
                <p className="text-sm text-gray-400 mt-2">Find nearest boutique</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
