'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface WishlistItem {
  id: string
  productId: string
  brand: string
  model: string
  price: number
  imageUrl: string
  addedAt: Date
}

export default function WishlistPage() {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    // Mock wishlist data
    const mockWishlist: WishlistItem[] = [
      {
        id: '1',
        productId: '1',
        brand: 'Luxury AAA',
        model: '7A Watch',
        price: 18495,
        imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        addedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        productId: '2',
        brand: 'Sport Elite',
        model: '2 Watch',
        price: 23495,
        imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        addedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        productId: '3',
        brand: 'Luxury Premium',
        model: '7A Day-Date Watch',
        price: 148500,
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        addedAt: new Date('2024-01-05')
      }
    ]
    
    setWishlistItems(mockWishlist)
    setIsLoading(false)
  }, [])

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.productId,
      name: `${item.brand} ${item.model}`,
      price: item.price,
      image: item.imageUrl
    })
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              {user ? 'Start adding watches to your wishlist' : 'Sign in to save your favorite watches'}
            </p>
            <div className="space-x-4">
              <Link href="/watches">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3">
                  Browse Watches
                </Button>
              </Link>
              {!user && (
                <Link href="/login">
                  <Button variant="outline" className="px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Heart className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={`${item.brand} ${item.model}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-black text-lg">{item.brand}</h3>
                  <p className="text-gray-600">{item.model}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-black">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Added {item.addedAt.toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link href={`/watches/${item.productId}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black">
                Wishlist Summary
              </h3>
              <p className="text-gray-600">
                Total value: Rs. {wishlistItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
              </p>
            </div>
            <Link href="/watches">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-6 py-2">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
