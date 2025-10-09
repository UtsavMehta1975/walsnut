'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin, CreditCard, Check, Edit, Plus, Home } from 'lucide-react';
import { useCart } from '@/store/cart-store';
import { useAuth } from '@/contexts/auth-context';
import { UPIFlowManager } from '@/components/checkout/upi-flow-manager';
import { DeliveryCheck } from '@/components/ui/delivery-check';
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
  const total = getTotal();
  const [currentStep, setCurrentStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
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

  const steps = [
    { id: 1, title: 'Shipping', icon: MapPin },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Review', icon: Check }
  ];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsProcessing(true);
    try {
      // Process payment and create order
      const orderData = {
        shippingInfo,
        paymentInfo,
        items,
        total
      };
      
      // Call your payment API here
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        // Redirect to success page
        window.location.href = '/payment/success';
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error
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

  // Get current location and reverse geocode to address
  const useCurrentLocation = async () => {
    console.log('📍 Requesting current location...');
    setIsLoadingLocation(true);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        toast.error('Location services are not supported by your browser');
        setIsLoadingLocation(false);
        return;
      }

      toast('📍 Getting your location...', { duration: 2000 });

      // Get current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('✅ Location obtained:', latitude, longitude);

          try {
            // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'WalnutStore/1.0'
                }
              }
            );

            console.log('📡 Geocoding response status:', response.status);

            if (response.ok) {
              const data = await response.json();
              const addr = data.address;
              
              console.log('📍 Address data:', addr);

              // Extract address components
              const street = addr.road || addr.street || '';
              const neighborhood = addr.neighbourhood || addr.suburb || '';
              const fullAddress = [street, neighborhood].filter(Boolean).join(', ') || addr.display_name;
              
              // Update shipping info with detected location
              setShippingInfo(prev => ({
                ...prev,
                deliveryAddress: {
                  address: fullAddress,
                  city: addr.city || addr.town || addr.village || '',
                  state: addr.state || '',
                  zipCode: addr.postcode || '',
                  country: addr.country || 'India'
                }
              }));

              // Show success notification
              toast.success('📍 Location detected! Please verify and edit if needed', {
                duration: 4000
              });
            } else {
              throw new Error('Failed to get address from location');
            }
          } catch (geocodeError) {
            console.error('❌ Geocoding error:', geocodeError);
            toast.error('Could not get address from location. Please enter manually.');
          }
          
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('❌ Location error:', error);
          let errorMessage = 'Could not get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          toast.error(errorMessage, { duration: 4000 });
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      console.error('❌ Error getting location:', error);
      toast.error('Failed to get location. Please enter address manually.');
      setIsLoadingLocation(false);
    }
  };

  // Payment method options with logos
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      logos: ['visa', 'mastercard', 'rupay'],
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      logos: ['phonepe', 'gpay', 'paytm', 'bhim'],
      description: 'PhonePe, Google Pay, Paytm, BHIM'
    }
  ];

  const updatePaymentInfo = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white' : ''}
                  ${isCompleted ? 'bg-green-600 border-green-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-white border-gray-300 text-gray-500' : ''}
                `}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1]?.title}
          </h2>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-md mx-auto">
        {currentStep === 1 && (
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
                {/* Use Current Location Button */}
                <div className="mb-4">
                  <Button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={isLoadingLocation}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                  >
                    {isLoadingLocation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Getting your location...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        📍 Use My Current Location
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    We'll auto-fill your address using GPS
                  </p>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-gray-500">or check delivery by PIN code</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Check */}
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

                {/* Use Current Location Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={useCurrentLocation}
                  disabled={isLoadingLocation}
                  className="w-full mb-4"
                >
                  {isLoadingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      📍 Use My Current Location
                    </>
                  )}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">OR ENTER MANUALLY</span>
                  </div>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
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

                  {/* Step 2: Auto-filled City & State */}
                  {shippingInfo.deliveryAddress.zipCode.length === 6 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City (Auto-filled)</Label>
                        <Input
                          id="city"
                          value={shippingInfo.deliveryAddress.city}
                          onChange={(e) => updateDeliveryAddress('city', e.target.value)}
                          className="bg-green-50 border-green-300"
                          required
                          readOnly={!!shippingInfo.deliveryAddress.city}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State (Auto-filled)</Label>
                        <Input
                          id="state"
                          value={shippingInfo.deliveryAddress.state}
                          onChange={(e) => updateDeliveryAddress('state', e.target.value)}
                          className="bg-green-50 border-green-300"
                          required
                          readOnly={!!shippingInfo.deliveryAddress.state}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Street Address (only after PIN code) */}
                  {shippingInfo.deliveryAddress.city && (
                    <div>
                      <Label htmlFor="address" className="text-base font-semibold">
                        🏠 Step 2: Enter Your Street Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="House no., Building name, Street"
                        value={shippingInfo.deliveryAddress.address}
                        onChange={(e) => updateDeliveryAddress('address', e.target.value)}
                        className="mt-2"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        e.g., "123, Apartment Name, Street Name"
                      </p>
                    </div>
                  )}
                  
                  <div className="hidden">
                    <Input
                      value={shippingInfo.deliveryAddress.country}
                      onChange={(e) => updateDeliveryAddress('country', e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue to Payment
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <div className="space-y-3 mt-2">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          paymentInfo.paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => updatePaymentInfo('paymentMethod', method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                          <div className="flex gap-1">
                            {method.logos.map((logo) => (
                              <div
                                key={logo}
                                className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold"
                              >
                                {logo === 'visa' && 'VISA'}
                                {logo === 'mastercard' && 'MC'}
                                {logo === 'rupay' && 'RUPAY'}
                                {logo === 'phonepe' && 'PP'}
                                {logo === 'gpay' && 'GP'}
                                {logo === 'paytm' && 'PT'}
                                {logo === 'bhim' && 'BHIM'}
                              </div>
                            ))}
                          </div>
                        </div>
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
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Review Order
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
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
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
