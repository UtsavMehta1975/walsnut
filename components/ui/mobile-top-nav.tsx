'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, ShoppingCart, Heart, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cart-store'
import Link from 'next/link'

interface MobileTopNavProps {
  title?: string
  showBack?: boolean
  showHome?: boolean
  showCart?: boolean
  showWishlist?: boolean
  showProfile?: boolean
  customBackUrl?: string
  onBackClick?: () => void
  actions?: React.ReactNode
  className?: string
}

export function MobileTopNav({
  title,
  showBack = true,
  showHome = false,
  showCart = true,
  showWishlist = false,
  showProfile = false,
  customBackUrl,
  onBackClick,
  actions,
  className = ''
}: MobileTopNavProps) {
  const router = useRouter()
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  const handleBack = () => {
    if (onBackClick) {
      onBackClick()
    } else if (customBackUrl) {
      router.push(customBackUrl)
    } else {
      router.back()
    }
  }

  return (
    <div className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm lg:hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side - Back Button */}
        <div className="flex items-center gap-2 flex-1">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
          )}
          
          {showHome && (
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
              >
                <Home className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
          )}

          {/* Title */}
          {title && (
            <h1 className="font-bold text-gray-900 text-lg truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center gap-2">
          {actions}
          
          {showWishlist && (
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full relative"
              >
                <Heart className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
          )}

          {showCart && (
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full relative"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {showProfile && (
            <Link href="/account">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
              >
                <User className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Progress indicator for multi-step processes
interface StepProgressProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepProgress({ steps, currentStep, className = '' }: StepProgressProps) {
  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-3 lg:hidden ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isCompleted = currentStep > stepNumber
          
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${isActive ? 'bg-blue-600 text-white scale-110' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  h-0.5 flex-1 mx-2 mt-[-16px]
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Bottom navigation bar for main sections
interface BottomNavProps {
  activeSection?: 'home' | 'watches' | 'cart' | 'account'
}

export function MobileBottomNav({ activeSection }: BottomNavProps) {
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'watches', icon: Search, label: 'Browse', href: '/watches' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', href: '/cart', badge: cartCount },
    { id: 'account', icon: User, label: 'Account', href: '/account' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <Link key={item.id} href={item.href} className="flex-1">
              <button
                className={`
                  w-full flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <div className="relative">
                  <Icon className={`h-6 w-6 ${isActive ? 'scale-110' : ''}`} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : ''}`}>
                  {item.label}
                </span>
              </button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Floating action button for quick actions
interface FloatingActionProps {
  onClick: () => void
  icon?: React.ReactNode
  label?: string
  color?: 'blue' | 'green' | 'yellow' | 'red'
}

export function FloatingAction({ onClick, icon, label, color = 'blue' }: FloatingActionProps) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    red: 'bg-red-600 hover:bg-red-700'
  }

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-24 right-4 z-40 
        ${colorClasses[color]} text-white 
        rounded-full shadow-2xl
        ${label ? 'px-6 py-3' : 'w-14 h-14'}
        flex items-center gap-2
        hover:scale-110 active:scale-95
        transition-all duration-200
        lg:hidden
      `}
    >
      {icon}
      {label && <span className="font-semibold">{label}</span>}
    </button>
  )
}

