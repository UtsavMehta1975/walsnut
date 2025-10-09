'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, ShoppingCart, Heart, User, Search, Gift } from 'lucide-react'
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
  const phoneNumber = '+917466965196'
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/', isInternal: true },
    { id: 'watches', icon: Search, label: 'Browse', href: '/watches', isInternal: true },
    { id: 'whatsapp', icon: null, label: 'WhatsApp', href: whatsappUrl, isInternal: false, isWhatsApp: true },
    { id: 'refer', icon: Gift, label: 'Refer & Earn', href: '/refer-and-earn', isInternal: true },
    { id: 'account', icon: User, label: 'Account', href: '/account', isInternal: true },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          // WhatsApp button (special styling)
          if (item.isWhatsApp) {
            return (
              <a 
                key={item.id} 
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button
                  className="w-full flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all text-green-600 hover:bg-green-50"
                >
                  <div className="relative bg-green-500 w-9 h-9 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <span className="text-xs mt-1 font-medium text-green-600">
                    {item.label}
                  </span>
                </button>
              </a>
            )
          }

          // Regular nav items
          if (!Icon) return null // Skip if no icon
          
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

