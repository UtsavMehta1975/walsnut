'use client'

import { Instagram, Camera } from 'lucide-react'
import { InstagramPosts } from './instagram-posts'

export function SocialMediaSection() {

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Spotted with Walnut
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Follow our journey on Instagram and discover our curated collections. See how our timepieces come to life in the real world.
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium">Instagram Feed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Premium Selection</span>
            </div>
          </div>
        </div>

        {/* Instagram Posts Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">
              Latest from Instagram
            </h3>
            <p className="text-gray-600 text-sm">
              Follow us <a href="https://instagram.com/thewalnutstore.in" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">@thewalnutstore.in</a> for daily inspiration
            </p>
          </div>
          <InstagramPosts />
        </div>

      </div>
    </section>
  )
}
