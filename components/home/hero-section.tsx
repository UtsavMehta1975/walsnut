'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Clock, Star } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="hero-section relative overflow-hidden">
      <div className="absolute inset-0 bg-white"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl inter-black text-black leading-tight">
              Premium Inspired
              <span className="text-gradient-highlight block">Timepieces</span>
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover precision-crafted timepieces inspired by iconic designs. Each piece showcases meticulous craftsmanship and premium materials for the discerning collector.
            </p>
            
            <div className="mt-6 md:mt-8 flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-highlight" />
                <span className="text-xs md:text-sm">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-highlight" />
                <span className="text-xs md:text-sm">Precision Crafted</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-highlight" />
                <span className="text-xs md:text-sm">Iconic Design</span>
              </div>
            </div>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Link href="/watches">
                <Button size="lg" className="btn-highlight group w-full sm:w-auto">
                  Discover Collection
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" className="btn-highlight-outline w-full sm:w-auto">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="relative z-10">
              <div className="card-highlight rounded-2xl p-1 highlight-shadow-xl">
                <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8">
                  <div className="aspect-square bg-gradient-to-br from-highlight-50 to-highlight-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-highlight to-highlight-400 rounded-full flex items-center justify-center highlight-shadow">
                        <span className="text-2xl md:text-3xl lg:text-4xl">⌚</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-black mb-1 md:mb-2">Precision Crafted</h3>
                      <p className="text-gray-600 text-xs md:text-sm">Inspired by Iconic Design • Premium Quality</p>
                    </div>
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
