'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, CreditCard, Truck, Shield, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { useCart } from '@/store/cart-store'
import { useAuth } from '@/contexts/auth-context'
import { trackInitiateCheckout, trackPurchase } from '@/components/analytics/meta-pixel'
import MobileCheckout from '@/components/checkout/mobile-checkout'
import { UPIApps } from '@/components/checkout/upi-apps'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { items, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  
  // Get product details from URL params (for Buy Now)
  const productId = searchParams.get('productId')
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const price = searchParams.get('price')
  const imageUrl = searchParams.get('imageUrl')

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('')

  // Payment method options
  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Pay using UPI apps like PhonePe, Google Pay' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay cards' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'Direct bank transfer' },
    { id: 'wallet', name: 'Digital Wallet', icon: '💰', description: 'Paytm, PhonePe, Google Pay wallet' }
  ]

  // Determine if this is a Buy Now or Cart checkout
  const isBuyNow = productId && brand && model && price
  const checkoutItems = isBuyNow ? [{
    id: productId!,
    name: `${brand} ${model}`,
    price: parseFloat(price!),
    image: imageUrl || '/web-banner.png',
    quantity: 1
  }] : items

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0 // Free shipping for luxury items
  const tax = subtotal * 0.18 // 18% GST (Indian tax rate)
  const total = subtotal + shipping + tax

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Redirect to login if not authenticated (but allow guest checkout for now)
  useEffect(() => {
    // Temporarily disable authentication check for development
    // if (!isAuthenticated && !isLoading) {
    //   router.push('/auth/signin?redirect=/checkout')
    // }
  }, [isAuthenticated, isLoading, router])

  // Track Initiate Checkout event
  useEffect(() => {
    if (items.length > 0) {
      const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const contentIds = items.map(item => item.id)
      trackInitiateCheckout(totalValue, 'INR', contentIds)
    }
  }, [items])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Get current location and auto-fill address (mobile only)
  const useCurrentLocation = async () => {
    setIsLoadingLocation(true)
    
    try {
      if (!navigator.geolocation) {
        toast.error('Location services not supported')
        setIsLoadingLocation(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          console.log('📍 Location:', latitude, longitude)

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
              { headers: { 'User-Agent': 'WalnutStore/1.0' } }
            )

            if (response.ok) {
              const data = await response.json()
              const addr = data.address
              
              const street = addr.road || addr.street || ''
              const neighborhood = addr.neighbourhood || addr.suburb || ''
              const fullAddress = [street, neighborhood].filter(Boolean).join(', ') || addr.display_name
              
              setFormData(prev => ({
                ...prev,
                address: fullAddress,
                city: addr.city || addr.town || addr.village || '',
                state: addr.state || '',
                zipCode: addr.postcode || '',
                country: addr.country || 'India'
              }))

              toast.success('📍 Location detected! Please verify the address', { duration: 4000 })
            }
          } catch (err) {
            toast.error('Could not get address. Please enter manually.')
          }
          
          setIsLoadingLocation(false)
        },
        (error) => {
          let msg = 'Could not get location'
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission denied. Please enable in your browser.'
          }
          toast.error(msg)
          setIsLoadingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } catch (error) {
      toast.error('Failed to get location')
      setIsLoadingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Temporarily allow guest checkout
    // if (!isAuthenticated) {
    //   toast.error('Please sign in to complete your order')
    //   router.push('/auth/signin?redirect=/checkout')
    //   return
    // }

    // Form validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    // Payment method validation
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Phone validation (basic)
    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsProcessing(true)

    try {
      // Prepare comprehensive order data
      const orderData = {
        items: checkoutItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          fullAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`
        },
        orderSummary: {
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total
        },
        totalAmount: total
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderData.items,
          shippingAddress: orderData.shippingAddress.fullAddress,
          totalAmount: orderData.totalAmount
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const result = await response.json()
      
      // Initialize payment with Cashfree
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: result.order.id,
          paymentMethod
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to initialize payment')
      }

      const paymentData = await paymentResponse.json()
      
      // Clear cart if this was a cart checkout
      if (!isBuyNow) {
        clearCart()
      }
      
      // Track Purchase event
      const totalValue = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const contentIds = checkoutItems.map(item => item.id)
      trackPurchase(totalValue, 'INR', contentIds)
      
      // Initialize Cashfree payment
      const cashfree = new (window as any).Cashfree({
        mode: 'production' // Use production mode
      })
      
      cashfree.checkout({
        paymentSessionId: paymentData.paymentSessionId,
        returnUrl: `${window.location.origin}/payment/success?order_id={order_id}`,
        onSuccess: () => {
          toast.success('Payment successful!')
          router.push('/payment/success')
        },
        onFailure: () => {
          toast.error('Payment failed')
          router.push('/payment/failure')
        }
      })
      
    } catch (error) {
      console.error('Checkout error:', error)
      if (error instanceof Error) {
        if (error.message.includes('Database not configured')) {
          toast.error('Service temporarily unavailable. Please contact support.')
        } else if (error.message.includes('Failed to initialize payment')) {
          toast.error('Payment system error. Please try again or contact support.')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading if checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Allow guest checkout - no authentication required
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
  //         <p className="text-gray-600 mb-6">You need to be signed in to complete your purchase</p>
  //         <Link href="/auth/signin?redirect=/checkout">
  //           <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
  //             Sign In
  //           </Button>
  //         </Link>
  //       </div>
  //     </div>
  //   )
  // }

  // Use mobile checkout for mobile devices
  if (isMobile) {
    return <MobileCheckout />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href={isBuyNow ? "/watches" : "/cart"} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl lato-black text-gray-900">
                Checkout
              </h1>
              <p className="text-gray-600">
                Complete your purchase
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-lg font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Use Current Location Button - Mobile Only */}
                {isMobile && (
                  <div className="mb-6">
                    <Button
                      type="button"
                      onClick={useCurrentLocation}
                      disabled={isLoadingLocation}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg mb-2"
                    >
                      {isLoadingLocation ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Detecting location...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          📍 Use My Current Location
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Auto-fill address using your phone's GPS
                    </p>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">or enter manually</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2"
                  />
                  <Input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label 
                      key={method.id} 
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id 
                          ? 'border-yellow-400 bg-yellow-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-yellow-400 focus:ring-yellow-400"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* UPI Apps Section - Only on Mobile */}
                {paymentMethod === 'upi' && isMobile && (
                  <div className="mt-4">
                    <UPIApps
                      amount={total}
                      orderDetails={{
                        orderId: `ORDER_${Date.now()}`,
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        customerEmail: formData.email
                      }}
                      onPaymentInitiated={() => {
                        console.log('🎯 UPI Payment initiated via app')
                        toast.loading('Opening payment app...', { duration: 2000 })
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}




