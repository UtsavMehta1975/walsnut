'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/store/cart-store'

export function Navbar() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const { getItemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const handleAdminPanelClick = () => {
    if (mounted && isAuthenticated && user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/auth/signin')
    }
  }

  const cartItemCount = mounted ? getItemCount() : 0

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with border */}
          <Link href="/" className="text-2xl font-bold text-black border-2 border-black px-3 py-1 rounded hover:bg-black hover:text-white transition-colors">
            WALNUT
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <Link href="/watches" className="text-gray-700 hover:text-yellow-400 transition-colors">
              Men Watch
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-yellow-400 transition-colors">
              Reviews
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-yellow-400 transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="text-gray-700 hover:text-yellow-400 transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-700 hover:text-yellow-400 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {mounted && isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-700 hover:text-yellow-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Account
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={handleAdminPanelClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                  Log in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-700">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/watches"
                className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Men Watch
              </Link>
              <Link
                href="/reviews"
                className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              {mounted && isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        handleAdminPanelClick()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-yellow-400"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-yellow-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
