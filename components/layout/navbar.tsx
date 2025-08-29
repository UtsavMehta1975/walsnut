'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ShoppingCart, Heart, User, Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ClientOnly } from '@/components/ui/client-only'

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { getItemCount } = useCartStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const cartItemCount = getItemCount()

  const handleSignOut = () => {
    // Clear cart state
    useCartStore.getState().clearCart()
    
    // Logout
    logout()
    
    // Redirect to home
    window.location.href = '/'
  }

  return (
    <nav className="nav-walnut sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button - Left Side */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-earth-600 hover:text-walnut-600"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/watches" className="text-earth-600 hover:text-walnut-600 transition-colors duration-300">
              Watches
            </Link>
            <Link href="/brands" className="text-earth-600 hover:text-walnut-600 transition-colors duration-300">
              Collections
            </Link>
            <Link href="/about" className="text-earth-600 hover:text-walnut-600 transition-colors duration-300">
              About
            </Link>
            <Link href="/contact" className="text-earth-600 hover:text-walnut-600 transition-colors duration-300">
              Contact
            </Link>
          </div>

          {/* Logo - Right Side */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl lato-bold text-gradient-walnut">
              Walnut
            </span>
          </Link>

          {/* Desktop Actions - Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-earth-600 hover:text-walnut-600"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-earth-600 hover:text-walnut-600">
                <ShoppingCart className="h-5 w-5" />
                <ClientOnly>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-walnut-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </ClientOnly>
              </Button>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="text-earth-600 hover:text-walnut-600">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* User Menu */}
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-earth-600 hover:text-walnut-600">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-earth-600 hover:text-walnut-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="btn-walnut">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions - Right Side (Cart, Search) */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-earth-600 hover:text-walnut-600"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-earth-600 hover:text-walnut-600">
                <ShoppingCart className="h-5 w-5" />
                <ClientOnly>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-walnut-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </ClientOnly>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search watches..."
                className="flex-1"
              />
              <Button className="btn-walnut">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/watches" className="text-earth-600 hover:text-walnut-600">
                Watches
              </Link>
              <Link href="/brands" className="text-earth-600 hover:text-walnut-600">
                Collections
              </Link>
              <Link href="/about" className="text-earth-600 hover:text-walnut-600">
                About
              </Link>
              <Link href="/contact" className="text-earth-600 hover:text-walnut-600">
                Contact
              </Link>
              
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{user?.name}</p>
                      <p>{user?.email}</p>
                    </div>
                    <Link href="/account" className="block text-earth-600 hover:text-walnut-600">
                      My Account
                    </Link>
                    <Link href="/orders" className="block text-earth-600 hover:text-walnut-600">
                      My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin" className="block text-earth-600 hover:text-walnut-600">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block text-left text-earth-600 hover:text-walnut-600"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/signin" className="block text-earth-600 hover:text-walnut-600">
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="block text-earth-600 hover:text-walnut-600">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
