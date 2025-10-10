'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CreditCard, Check, Edit, Plus, Home } from 'lucide-react';
import { useCart } from '@/store/cart-store';
import { useAuth } from '@/contexts/auth-context';
import { UPIFlowManager } from '@/components/checkout/upi-flow-manager';
import { DeliveryCheck } from '@/components/ui/delivery-check';
import { PhonePeLogo, GooglePayLogo, PaytmLogo, GenericUPILogo } from '@/components/checkout/upi-app-logos';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface DeliveryAddress {
  id?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryAddress: DeliveryAddress;
}

interface PaymentInfo {
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export default function MobileCheckout() {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const subtotal = getTotal();
  const deliveryCharge = 100; // ₹100 delivery charge
  const total = subtotal + deliveryCharge;
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [isCheckingPinCode, setIsCheckingPinCode] = useState(false);
  
  // Pre-fill user information from account
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryAddress: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);


  const handleFinalSubmit = async () => {
    setIsProcessing(true);
    try {
      // Step 0: Save address for future use (fire and forget, don't block checkout)
      if (user) {
        fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            phone: shippingInfo.phone,
            address: shippingInfo.deliveryAddress.address,
            city: shippingInfo.deliveryAddress.city,
            state: shippingInfo.deliveryAddress.state,
            zipCode: shippingInfo.deliveryAddress.zipCode,
            country: shippingInfo.deliveryAddress.country,
            isDefault: true // Make it default if it's the first address
          })
        }).catch(err => console.log('Address save failed (non-blocking):', err));
      }

      // Step 1: Create the order with shipping address
      const fullAddress = `${shippingInfo.deliveryAddress.address}, ${shippingInfo.deliveryAddress.city}, ${shippingInfo.deliveryAddress.state} ${shippingInfo.deliveryAddress.zipCode}, ${shippingInfo.deliveryAddress.country}`;
      
      // Calculate payment amount based on method (COD = ₹200, others = full amount)
      const paymentAmount = paymentInfo.paymentMethod === 'cod' ? 200 : total;
      
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: fullAddress,
          totalAmount: total,
          paymentMethod: paymentInfo.paymentMethod,
          isCOD: paymentInfo.paymentMethod === 'cod',
          codAdvance: paymentInfo.paymentMethod === 'cod' ? 200 : 0
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderResult = await orderResponse.json();
      
      // Step 2: Initialize payment with the created order ID (using paymentAmount from line 112)
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderResult.order.id,
          paymentMethod: 'upi', // Always use UPI for payment (even for COD advance)
          amount: paymentAmount,
          isCOD: paymentInfo.paymentMethod === 'cod'
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to initialize payment');
      }

      const paymentData = await paymentResponse.json();
      
      // Clear cart and redirect to payment page
      clearCart();
      
      // Redirect to Cashfree payment page
      if (paymentData.paymentSessionId) {
        window.location.href = `https://payments.cashfree.com/order/${paymentData.paymentSessionId}`;
      } else {
        throw new Error('No payment session ID received');
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateShippingInfo = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateDeliveryAddress = (field: keyof DeliveryAddress, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      deliveryAddress: { ...prev.deliveryAddress, [field]: value }
    }));
  };

  const selectSavedAddress = (address: DeliveryAddress) => {
    setShippingInfo(prev => ({
      ...prev,
      deliveryAddress: address
    }));
    setShowNewAddress(false);
  };

  const addNewAddress = () => {
    setShowNewAddress(true);
    setShippingInfo(prev => ({
      ...prev,
      deliveryAddress: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      }
    }));
  };


  // Payment method options with logos
  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      logos: [],
      showUPIApps: true, // Show PhonePe, GPay, Paytm tiles
      description: 'Pay with any UPI app',
      payNow: total
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      logos: [],
      description: 'Visa, Mastercard, RuPay accepted',
      payNow: total
    },
    {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      logos: [],
      description: `Pay ₹200 now, ₹${(total - 200).toFixed(0)} at delivery`,
      payNow: 200,
      payLater: total - 200,
      info: 'Secure your order with ₹200 advance payment via UPI'
    }
  ];

  const updatePaymentInfo = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {/* Page Title */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-600">Complete your order</p>
      </div>

      {/* Single Page Content - All Sections Visible */}
      <div className="max-w-md mx-auto space-y-6">
          {/* Section 1: Contact & Delivery Information */}
          <div className="space-y-4">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => updateShippingInfo('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => updateShippingInfo('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => updateShippingInfo('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => updateShippingInfo('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Delivery Address
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewAddress}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Quick Delivery Check - PIN Code */}
                <div className="mb-4">
                  <DeliveryCheck
                    variant="checkout"
                    onPinCodeValidated={(data) => {
                      // Auto-fill address fields from PIN code
                      setShippingInfo(prev => ({
                        ...prev,
                        deliveryAddress: {
                          ...prev.deliveryAddress,
                          zipCode: data.pinCode,
                          city: data.city,
                          state: data.state
                        }
                      }))
                      toast.success('📍 City & State auto-filled!', {
                        duration: 2000
                      })
                    }}
                  />
                </div>

                {savedAddresses.length > 0 && !showNewAddress && (
                  <div className="space-y-2 mb-4">
                    {savedAddresses.map((address, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => selectSavedAddress(address)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{address.address}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Step 1: PIN Code First */}
                  <div>
                    <Label htmlFor="zipCode" className="text-base font-semibold">
                      📍 Step 1: Enter Your PIN Code
                    </Label>
                    <div className="relative">
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder="Enter 6-digit PIN code"
                        value={shippingInfo.deliveryAddress.zipCode}
                        onChange={async (e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                          updateDeliveryAddress('zipCode', value)
                          
                          // Auto-fetch when 6 digits entered
                          if (value.length === 6) {
                            setIsCheckingPinCode(true)
                            console.log('🔍 Fetching details for PIN:', value)
                            
                            try {
                              const response = await fetch(`/api/pincode/${value}`)
                              console.log('📡 Response status:', response.status)
                              
                              if (!response.ok) {
                                throw new Error('Network response was not ok')
                              }
                              
                              const data = await response.json()
                              console.log('📦 API Response:', data)
                              
                              if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
                                const postOffice = data[0].PostOffice[0]
                                const city = postOffice.District || postOffice.Block || ''
                                const state = postOffice.State || ''
                                
                                console.log('✅ Found:', { city, state })
                                
                                updateDeliveryAddress('city', city)
                                updateDeliveryAddress('state', state)
                                updateDeliveryAddress('country', 'India')
                                
                                toast.success(`✅ ${city}, ${state} - Delivery in 2-5 days`, {
                                  duration: 3000
                                })
                              } else {
                                console.log('❌ Invalid PIN or no data')
                                toast.error('Invalid PIN code. Please check and try again.', { 
                                  duration: 2000 
                                })
                              }
                            } catch (error) {
                              console.error('❌ PIN lookup error:', error)
                              toast.error('Failed to check PIN code. Please try again.', { 
                                duration: 2000 
                              })
                            } finally {
                              setIsCheckingPinCode(false)
                            }
                          }
                        }}
                        className="text-center text-lg font-mono mt-2 pr-10"
                        maxLength={6}
                        required
                      />
                      {isCheckingPinCode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {shippingInfo.deliveryAddress.zipCode.length === 6 && shippingInfo.deliveryAddress.city 
                        ? '✅ City & State auto-filled!'
                        : 'We will auto-fill your city and state'}
                    </p>
                  </div>

                  {/* City & State (Auto-filled from PIN code, always visible) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City {shippingInfo.deliveryAddress.city && shippingInfo.deliveryAddress.zipCode.length === 6 && '✅'}
                      </Label>
                      <Input
                        id="city"
                        placeholder="Will auto-fill from PIN"
                        value={shippingInfo.deliveryAddress.city}
                        onChange={(e) => updateDeliveryAddress('city', e.target.value)}
                        className={shippingInfo.deliveryAddress.city && shippingInfo.deliveryAddress.zipCode.length === 6 
                          ? "bg-green-50 border-green-300" 
                          : "bg-gray-50"}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {shippingInfo.deliveryAddress.city ? 'Auto-filled (editable)' : 'From PIN code'}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        State {shippingInfo.deliveryAddress.state && shippingInfo.deliveryAddress.zipCode.length === 6 && '✅'}
                      </Label>
                      <Input
                        id="state"
                        placeholder="Will auto-fill from PIN"
                        value={shippingInfo.deliveryAddress.state}
                        onChange={(e) => updateDeliveryAddress('state', e.target.value)}
                        className={shippingInfo.deliveryAddress.state && shippingInfo.deliveryAddress.zipCode.length === 6 
                          ? "bg-green-50 border-green-300" 
                          : "bg-gray-50"}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {shippingInfo.deliveryAddress.state ? 'Auto-filled (editable)' : 'From PIN code'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 2: Street Address (Always visible) */}
                  <div>
                    <Label htmlFor="address" className="text-base font-semibold">
                      🏠 Step 2: Your Complete Street Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="House/Flat No., Building, Street, Landmark"
                      value={shippingInfo.deliveryAddress.address}
                      onChange={(e) => updateDeliveryAddress('address', e.target.value)}
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      e.g., "B-301, Pearl Residency, MG Road, Near City Mall"
                    </p>
                  </div>
                  
                  <div className="hidden">
                    <Input
                      value={shippingInfo.deliveryAddress.country}
                      onChange={(e) => updateDeliveryAddress('country', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Section 2: Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <div className="space-y-3 mt-2">
                    {paymentMethods.map((method) => (
                      <div key={method.id}>
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentInfo.paymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => updatePaymentInfo('paymentMethod', method.id)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                  {method.name}
                                  {method.id === 'cod' && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                {method.info && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    ℹ️ {method.info}
                                  </div>
                                )}
                              </div>
                              {method.id === 'cod' && (
                                <div className="text-right ml-2">
                                  <div className="text-lg font-bold text-amber-600">₹200</div>
                                  <div className="text-xs text-gray-500">now</div>
                                </div>
                              )}
                            </div>

                            {/* UPI Apps Tiles - Always visible for UPI */}
                            {method.id === 'upi' && method.showUPIApps && (
                              <div className="grid grid-cols-4 gap-2 pt-2">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-14 h-14 relative">
                                    <PhonePeLogo />
                                  </div>
                                  <span className="text-[10px] text-gray-600 font-medium">PhonePe</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-14 h-14 relative">
                                    <GooglePayLogo />
                                  </div>
                                  <span className="text-[10px] text-gray-600 font-medium">GPay</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-14 h-14 relative">
                                    <PaytmLogo />
                                  </div>
                                  <span className="text-[10px] text-gray-600 font-medium">Paytm</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-14 h-14 relative">
                                    <GenericUPILogo />
                                  </div>
                                  <span className="text-[10px] text-gray-600 font-medium">Others</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* COD Explanation */}
                        {method.id === 'cod' && paymentInfo.paymentMethod === 'cod' && (
                          <div className="mt-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                              <span>💳</span> How Cash on Delivery Works:
                            </h4>
                            <ol className="text-sm space-y-2 text-gray-700">
                              <li className="flex gap-2">
                                <span className="font-bold text-amber-600">1.</span>
                                <span>Pay <strong className="text-amber-700">₹200 advance</strong> now via UPI to confirm your order</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="font-bold text-amber-600">2.</span>
                                <span>Your order will be processed and shipped to your address</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="font-bold text-amber-600">3.</span>
                                <span>Pay the remaining <strong className="text-amber-700">₹{total - 200}</strong> in cash when delivered</span>
                              </li>
                            </ol>
                            <div className="mt-3 pt-3 border-t border-amber-300">
                              <p className="text-xs text-amber-800 flex items-center gap-1">
                                <span>✅</span>
                                <span className="font-medium">The ₹200 advance secures your order and prevents fake orders.</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {paymentInfo.paymentMethod === 'card' && (
                  <>
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        value={paymentInfo.cardName}
                        onChange={(e) => updatePaymentInfo('cardName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => updatePaymentInfo('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => updatePaymentInfo('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentInfo.cvv}
                          onChange={(e) => updatePaymentInfo('cvv', e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {paymentInfo.paymentMethod === 'upi' && (
                  <div className="mt-4">
                    <UPIFlowManager
                      amount={total}
                      orderDetails={{
                        orderId: `ORDER_${Date.now()}`,
                        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                        customerEmail: shippingInfo.email
                      }}
                    />
                    <p className="text-xs text-green-700 font-semibold text-center mt-3 bg-green-50 p-2 rounded">
                      ✅ Secure Cashfree Payment Gateway • No Risk Warnings
                    </p>
                  </div>
                )}
                
              </div>
            </CardContent>
          </Card>

        {/* Section 3: Order Summary & Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Review & Confirm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Summary */}
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.email}</p>
                  <p>{shippingInfo.phone}</p>
                </div>
              </div>

              {/* Shipping Summary */}
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p>{shippingInfo.deliveryAddress.address}</p>
                  <p>{shippingInfo.deliveryAddress.city}, {shippingInfo.deliveryAddress.state} {shippingInfo.deliveryAddress.zipCode}</p>
                  <p>{shippingInfo.deliveryAddress.country}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="capitalize">{paymentInfo.paymentMethod}</p>
                  {paymentInfo.paymentMethod === 'card' && (
                    <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            Qty: {item.quantity}
                          </Badge>
                        </div>
                      </div>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium text-green-600">₹{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                  {paymentInfo.paymentMethod === 'cod' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                      <p className="text-xs text-amber-800 font-medium mb-1">💰 Cash on Delivery:</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-700">Pay now (advance)</span>
                        <span className="font-semibold text-amber-900">₹200</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-700">Pay at delivery</span>
                        <span className="font-semibold text-amber-900">₹{total - 200}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isProcessing}
                  className="w-full h-12 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentInfo.paymentMethod === 'cod' 
                        ? `Pay ₹200 Now & Confirm Order` 
                        : `Pay ₹${total} & Place Order`}
                    </>
                  )}
                </Button>
                {paymentInfo.paymentMethod === 'cod' && (
                  <p className="text-center text-xs text-gray-600">
                    You'll pay ₹{total - 200} in cash when your order is delivered
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
