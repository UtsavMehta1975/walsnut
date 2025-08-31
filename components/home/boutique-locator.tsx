'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Truck, Package, CheckCircle, Clock, CreditCard } from 'lucide-react'

export function BoutiqueLocator() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Simple & Fast Delivery Process
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience hassle-free shopping with our streamlined dropshipping process. From order to delivery in just 3-4 days.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Process Steps */}
          <div className="space-y-6">
            <div className="space-y-6">
              {/* Day 1 - Order */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShoppingCart className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-black">Day 1: Place Your Order</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Browse our collection, select your preferred timepiece, and complete your secure payment. Order confirmation sent instantly.
                  </p>
                </div>
              </div>

              {/* Day 2 - Processing */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-black">Day 2: Processing & Shipping</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Your order is carefully processed, quality-checked, and prepared for shipping with premium packaging.
                  </p>
                </div>
              </div>

              {/* Day 3-4 - Delivery */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-black">Day 3-4: Fast Delivery</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Your premium timepiece arrives at your doorstep with secure packaging and tracking updates throughout the journey.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-black">3-4 Days</div>
                <div className="text-sm text-gray-600">Delivery Time</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-black">100%</div>
                <div className="text-sm text-gray-600">Secure</div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/watches">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold">
                  SHOP NOW
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Process Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-8">
              <div className="text-center">
                <div className="flex justify-center space-x-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                      <ShoppingCart className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-xs text-gray-600">Order</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-yellow-300"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-xs text-gray-600">Process</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-blue-300"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <Truck className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-xs text-gray-600">Deliver</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Secure Payment</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Premium Packaging</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Truck className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Fast Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
