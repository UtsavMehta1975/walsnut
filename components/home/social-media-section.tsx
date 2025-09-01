'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Instagram, Camera, Heart } from 'lucide-react'

const socialPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    caption: 'Luxury AAA Round Silver Analog watch',
    product: 'Luxury AAA Collection',
    likes: 1247,
    user: '@watchlover123'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    caption: 'Sport Elite Oval White Analog watch',
    product: 'Sport Elite Collection',
    likes: 892,
    user: '@timepiece_collector'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    caption: 'Luxury Premium Round Silver Analog watch',
    product: 'Luxury Premium Collection',
    likes: 1567,
    user: '@luxury_watches'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    caption: 'Fashion Elite Oval White Analog watch',
    product: 'Fashion Elite Collection',
    likes: 945,
    user: '@style_watcher'
  }
]

export function SocialMediaSection() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Spotted with Walnut
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Discover how our customers style their premium timepieces. Share your looks with #WatchOutForInspo
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium">@thewalnutstore.in</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">#WatchOutForInspo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {socialPosts.map((post) => (
            <Link key={post.id} href="/watches" className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-black text-sm line-clamp-1">
                  {post.caption}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {post.product}
                </p>
                <p className="text-sm font-bold text-black mt-1">
                  View Collection
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="https://www.instagram.com/thewalnutstore.in" target="_blank">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              <Instagram className="h-4 w-4 mr-2" />
              Follow Us on Instagram
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
