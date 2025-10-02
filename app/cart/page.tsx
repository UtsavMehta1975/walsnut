'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react'
import { useCart } from '@/store/cart-store'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { user } = useAuth()
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    // Allow both authenticated and guest checkout
    // Redirect directly to checkout page
    window.location.href = '/checkout'
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to add premium timepieces to your cart
            </p>
            <Link href="/watches">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3">
                Browse Watches
              </Button>
            </Link>
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
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-black text-sm md:text-base truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0 border-gray-300"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 border-gray-300"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button and Total */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="text-sm font-semibold text-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                </div>
                
                {!user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 mb-2">
                      Sign in to complete your purchase and track your orders
                    </p>
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
                
                <Button
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-3"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
