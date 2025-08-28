'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'
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
  const { data: session } = useSession()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    // Mock wishlist data
    const mockWishlist: WishlistItem[] = [
      {
        id: '1',
        productId: '1',
        brand: 'Walnut',
        model: 'Apex Diver',
        price: 125000,
        imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
        addedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        productId: '2',
        brand: 'Walnut',
        model: 'Reserve Classic',
        price: 85000,
        imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop',
        addedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        productId: '3',
        brand: 'Walnut',
        model: 'Heritage Sport',
        price: 95000,
        imageUrl: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop',
        addedAt: new Date('2024-01-05')
      }
    ]
    
    setWishlistItems(mockWishlist)
    setIsLoading(false)
  }, [])

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      productId: item.productId,
      brand: item.brand,
      model: item.model,
      price: item.price,
      imageUrl: item.imageUrl,
      stockQuantity: 1,
      quantity: 1
    })
    toast.success('Added to cart!')
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
    toast.success('Removed from wishlist')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex items-center justify-center px-4 py-8 flex-1">
          <div className="text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              {session ? 'Start adding watches to your wishlist' : 'Sign in to save your favorite watches'}
            </p>
            <div className="space-x-4">
              <Link href="/watches">
                <Button variant="luxury" size="lg">
                  Browse Watches
                </Button>
              </Link>
              {!session && (
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg">
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Heart className="h-8 w-8 text-gold-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
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
            <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.brand} ${item.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
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
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{item.brand}</h3>
                  <p className="text-gray-600">{item.model}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(item.price)}
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
                    variant="luxury"
                    className="w-full"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Wishlist Summary
              </h3>
              <p className="text-gray-600">
                Total value: {formatPrice(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
              </p>
            </div>
            <Link href="/watches">
              <Button variant="luxury-outline">
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
