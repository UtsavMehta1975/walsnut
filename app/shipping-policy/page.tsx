'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Truck, Clock, MapPin, Package, Shield, Globe, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-walnut-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-earth-600 hover:text-walnut-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gradient-walnut">
                Shipping Policy
              </h1>
              <p className="text-earth-600 mt-2">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-walnut-200/50 p-6 md:p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Truck className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Shipping Information</h2>
            </div>
            <p className="text-earth-700 leading-relaxed mb-4">
              At Walnut, we understand that receiving your timepiece quickly and safely is important. Our shipping policy is designed to provide you with reliable, secure, and timely delivery of your orders.
            </p>
            <p className="text-earth-700 leading-relaxed">
              We partner with trusted shipping carriers to ensure your valuable timepieces arrive in perfect condition, with full tracking and insurance coverage.
            </p>
          </section>

          {/* Free Shipping */}
          <section className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Free Shipping on All Orders</h3>
              </div>
              <p className="text-green-700">
                Enjoy complimentary standard shipping on all orders within India. No minimum purchase required - every order ships free!
              </p>
            </div>
          </section>

          {/* Shipping Options */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Shipping Options</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-earth-800">Standard Shipping</h3>
                </div>
                <ul className="space-y-2 text-sm text-earth-700">
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>3-5 business days</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span>Free for all orders</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Fully insured</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Tracking included</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-walnut-50 border border-walnut-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Truck className="h-5 w-5 text-walnut-600" />
                  <h3 className="font-medium text-earth-800">Express Shipping</h3>
                </div>
                <ul className="space-y-2 text-sm text-earth-700">
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-walnut-600" />
                    <span>1-2 business days</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-walnut-600" />
                    <span>₹500 additional charge</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-walnut-600" />
                    <span>Priority handling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-walnut-600" />
                    <span>Real-time tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Order Processing</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Order Confirmation</h3>
                  <p className="text-earth-700">
                    You&apos;ll receive an order confirmation email immediately after placing your order, including your order number and estimated delivery date.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Processing</h3>
                  <p className="text-earth-700">
                    Orders are typically processed and shipped within 24 hours during business days (Monday-Friday). Orders placed on weekends or holidays will be processed the next business day.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Shipping Notification</h3>
                  <p className="text-earth-700">
                    Once your order ships, you&apos;ll receive a shipping confirmation email with tracking information and estimated delivery date.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Delivery</h3>
                  <p className="text-earth-700">
                    Your package will be delivered to your specified address. Signature may be required for high-value items to ensure secure delivery.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Areas */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Delivery Areas</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-3">Domestic Shipping (India)</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>All states and union territories</li>
                  <li>Free standard shipping</li>
                  <li>3-5 business days delivery</li>
                  <li>Express shipping available</li>
                  <li>Remote areas may take longer</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-3">International Shipping</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Select countries available</li>
                  <li>Shipping costs vary by location</li>
                  <li>7-14 business days delivery</li>
                  <li>Customs duties may apply</li>
                  <li>Contact us for availability</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tracking */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Order Tracking</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Track Your Order</h3>
                  <p className="text-earth-700 mb-3">
                    Stay updated on your order&apos;s journey with our comprehensive tracking system:
                  </p>
                  <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                    <li>Real-time tracking updates</li>
                    <li>Email notifications at key milestones</li>
                    <li>Estimated delivery date</li>
                    <li>Delivery confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Packaging */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Packaging & Security</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Secure Packaging</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Premium gift box packaging</li>
                  <li>Shock-absorbent materials</li>
                  <li>Tamper-evident seals</li>
                  <li>Discrete outer packaging</li>
                  <li>Weather-resistant materials</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Insurance & Protection</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Full value insurance coverage</li>
                  <li>Loss and damage protection</li>
                  <li>Signature confirmation for high-value items</li>
                  <li>24/7 customer support</li>
                  <li>Claims assistance if needed</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery Issues */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Delivery Issues</h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-2">Delivery Delays</h3>
                    <p className="text-earth-700 mb-3">
                      While we strive for timely delivery, occasional delays may occur due to:
                    </p>
                    <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                      <li>Weather conditions</li>
                      <li>Carrier delays</li>
                      <li>Customs processing (international)</li>
                      <li>Remote location delivery</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-2">Failed Deliveries</h3>
                    <p className="text-earth-700 mb-3">
                      If delivery fails, our carriers will:
                    </p>
                    <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                      <li>Attempt delivery 3 times</li>
                      <li>Leave a delivery notice</li>
                      <li>Hold package at local facility</li>
                      <li>Contact you for pickup arrangements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">International Shipping</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Global Delivery</h3>
                  <p className="text-earth-700 mb-3">
                    We ship to select international destinations. Please note:
                  </p>
                  <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                    <li>Shipping costs vary by country</li>
                    <li>Delivery time: 7-14 business days</li>
                    <li>Customs duties and taxes may apply</li>
                    <li>Import restrictions may apply</li>
                    <li>Contact us for specific country availability</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-walnut-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Shipping Support</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              Have questions about shipping? Our customer support team is here to help:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-earth-800 mb-2">Customer Support</h3>
                <p className="text-earth-700">Email: shipping@walnut.com</p>
                <p className="text-earth-700">Phone: +91 (555) 123-4567</p>
                <p className="text-earth-700">Hours: Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
              
              <div>
                <h3 className="font-medium text-earth-800 mb-2">Quick Links</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/contact" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund-policy" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
