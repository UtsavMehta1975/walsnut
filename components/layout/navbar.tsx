'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X, User, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/store/cart-store'
import { SearchBar } from '@/components/ui/search-bar'

export function Navbar() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const { getItemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSaleDropdownOpen, setIsSaleDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const saleDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (saleDropdownRef.current && !saleDropdownRef.current.contains(event.target as Node)) {
        setIsSaleDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
    // The auth context will handle the redirect
  }

  const handleAdminPanelClick = () => {
    console.log('=== ADMIN PANEL CLICK DEBUG ===')
    console.log('mounted:', mounted)
    console.log('isAuthenticated:', isAuthenticated)
    console.log('user:', user)
    console.log('user?.role:', user?.role)
    console.log('user?.role.toUpperCase() === "ADMIN":', user?.role?.toUpperCase() === 'ADMIN')
    
    // Remove mounted check from here since we handle it in the UI rendering
    if (isAuthenticated && user?.role?.toUpperCase() === 'ADMIN') {
      console.log('✅ Redirecting to admin panel...')
      // Use window.location.href to force full page navigation
      window.location.href = '/admin'
    } else {
      console.log('❌ Redirecting to signin page...')
      window.location.href = '/auth/signin'
    }
  }

  const cartItemCount = mounted ? getItemCount() : 0

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Logo */}
          <Link href="/" className="hidden md:flex items-center">
            <Image
              src="/logo.png"
              alt="Walnut Logo"
              width={200}
              height={80}
              className="h-20 w-auto sm:h-18 md:h-20 object-contain hover:opacity-80 transition-opacity duration-200 border-0 outline-none"
              priority
            />
          </Link>

          {/* Mobile Header Layout */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* Left side: Hamburger + Logo + Text */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/" className="flex items-center space-x-1">
                <Image
                  src="/logo.png"
                  alt="Walnut Logo"
                  width={120}
                  height={48}
                  className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
                  priority
                />
                <h1 className="text-xs font-light text-gray-500 italic">thewalnutstore.in</h1>
              </Link>
            </div>

            {/* Center: Empty space */}
            <div className="flex-1 flex justify-center">
            </div>

            {/* Right side: Search + Cart */}
            <div className="flex items-center space-x-3">
              <div className="w-32">
                <SearchBar placeholder="Search..." />
              </div>
              <Link href="/cart" className="relative text-gray-700 hover:text-yellow-400 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <Link href="/watches?category=for-him" className="text-gray-700 hover:text-yellow-400 transition-colors">
              For Him
            </Link>
            <Link href="/watches/for-her" className="text-gray-700 hover:text-yellow-400 transition-colors">
              For Her
            </Link>
            <Link href="/watches" className="text-gray-700 hover:text-yellow-400 transition-colors">
              All Products
            </Link>
            <div className="relative" ref={saleDropdownRef}>
              <button
                onClick={() => setIsSaleDropdownOpen(!isSaleDropdownOpen)}
                className="text-gray-700 hover:text-yellow-400 transition-colors flex items-center"
              >
                Sale
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isSaleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSaleDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/watches/sale"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSaleDropdownOpen(false)}
                  >
                    All Sale Items
                  </Link>
                  <Link
                    href="/watches?category=sale-1499"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSaleDropdownOpen(false)}
                  >
                    Under ₹1,499
                  </Link>
                  <Link
                    href="/watches?category=sale-1999"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSaleDropdownOpen(false)}
                  >
                    Under ₹1,999
                  </Link>
                </div>
              )}
            </div>
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
            <div className="w-64">
              <SearchBar placeholder="Search watches..." />
            </div>

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
                href="/watches?category=for-him"
                className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For Him
              </Link>
              <Link
                href="/watches/for-her"
                className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For Her
              </Link>
              <Link
                href="/watches"
                className="block px-3 py-2 text-gray-700 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <div className="px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Sale</div>
                <div className="pl-4 space-y-1">
                  <Link
                    href="/watches/sale"
                    className="block text-gray-600 hover:text-yellow-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    All Sale Items
                  </Link>
                  <Link
                    href="/watches?category=sale-1499"
                    className="block text-gray-600 hover:text-yellow-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Under ₹1,499
                  </Link>
                  <Link
                    href="/watches?category=sale-1999"
                    className="block text-gray-600 hover:text-yellow-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Under ₹1,999
                  </Link>
                </div>
              </div>
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
                  <button
                    onClick={async () => {
                      await handleLogout()
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
