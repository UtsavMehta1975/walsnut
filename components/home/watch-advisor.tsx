'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gift, Users, Clock, Sparkles } from 'lucide-react'

export function WatchAdvisor() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Need Gifting Advice? Let Us Guide You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Shop for someone special or yourself using our Watch Advisor. Get personalized recommendations based on style, budget, and occasion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Gift className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Gifting Guide Image</p>
              </div>
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
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Expert Guidance</h4>
                  <p className="text-sm text-gray-600">Professional advice</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Quick Results</h4>
                  <p className="text-sm text-gray-600">Instant recommendations</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Gift className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Perfect Gifts</h4>
                  <p className="text-sm text-gray-600">For every occasion</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
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
    </section>
  )
}
