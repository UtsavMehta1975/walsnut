'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'
import { ShoppingCart, Heart, User, Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ClientOnly } from '@/components/ui/client-only'

export function Navbar() {
  const { session, status, isAuthenticated, isLoading, user } = useAuth()
  const { getItemCount } = useCartStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const cartItemCount = getItemCount()

  // Debug session state
  console.log('Navbar Session State:', { 
    isAuthenticated, 
    status, 
    isLoading, 
    userEmail: user?.email,
    userRole: user?.role 
  })

  const handleSignOut = () => {
    // Clear cart state
    useCartStore.getState().clearCart()
    
    // Sign out and redirect
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="nav-walnut sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Empty for now */}
          <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl lato-bold text-gradient-walnut">
              Walnut
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop Actions */}
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
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="icon" className="text-earth-600 hover:text-walnut-600">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  {user?.role === 'ADMIN' && (
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
                  <Button className="btn-walnut" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions - Always visible on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-700">
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

            {/* User */}
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : isAuthenticated ? (
              <Link href="/account">
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search watches, brands, models..."
                className="pl-10 pr-4"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link
                href="/watches"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Watches
              </Link>
              <Link
                href="/brands"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Brands
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between px-4">
                <Link href="/wishlist" className="flex items-center space-x-2 text-gray-700">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-gray-700"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              {isAuthenticated ? (
                <div className="mt-4 space-y-2">
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 text-center bg-walnut-600 text-white rounded-md hover:bg-walnut-700 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
