'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Clock, Shield } from 'lucide-react'

const featuredBrands = [
  { 
    name: 'Premium Collection', 
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Luxury inspired timepieces',
    price: '₹15,000+',
    rating: 4.8,
    reviews: 1247
  },
  { 
    name: 'Sport Collection', 
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Performance meets style',
    price: '₹8,000+',
    rating: 4.6,
    reviews: 892
  },
  { 
    name: 'Classic Collection', 
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Timeless elegance',
    price: '₹12,000+',
    rating: 4.7,
    reviews: 1567
  },
  { 
    name: 'Modern Collection', 
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Contemporary design',
    price: '₹10,000+',
    rating: 4.5,
    reviews: 945
  }
]

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

        {/* Featured Collections */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-black mb-8 text-center">Featured Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBrands.map((brand, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-square relative">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="text-xl font-bold mb-2">{brand.name}</h4>
                      <p className="text-sm opacity-90 mb-3">{brand.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < Math.floor(brand.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs">({brand.reviews})</span>
                        </div>
                        <span className="text-lg font-bold">{brand.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <p className="text-gray-600">24/7 customer support and expert guidance for your perfect timepiece</p>
            </div>
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
