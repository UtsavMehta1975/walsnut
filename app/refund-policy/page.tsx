'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, RefreshCw, Clock, CheckCircle, XCircle, Truck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RefundPolicyPage() {
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
              <h1 className="text-2xl md:text-3xl lato-black text-gradient-walnut">
                Refund Policy
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
              <RefreshCw className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Our Refund Policy</h2>
            </div>
            <p className="text-earth-700 leading-relaxed mb-4">
              At Walnut, we want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, we&apos;re here to help. This policy outlines our refund and return procedures to ensure a smooth experience.
            </p>
            <p className="text-earth-700 leading-relaxed">
              We understand that purchasing a timepiece is an important decision, and we&apos;re committed to making the process as transparent and customer-friendly as possible.
            </p>
          </section>

          {/* Return Window */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Return Window</h2>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">30-Day Return Policy</h3>
              </div>
              <p className="text-green-700">
                You have 30 days from the date of delivery to return your item for a full refund or exchange. This gives you plenty of time to inspect your timepiece and ensure it meets your expectations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Eligible for Return</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Items in original condition</li>
                  <li>All original packaging included</li>
                  <li>No signs of wear or damage</li>
                  <li>Within 30 days of delivery</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Not Eligible for Return</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Custom or personalized items</li>
                  <li>Items showing signs of wear</li>
                  <li>Missing original packaging</li>
                  <li>Damaged or altered items</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Return Process</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Contact Customer Support</h3>
                  <p className="text-earth-700">
                    Email us at returns@walnut.com or call +91 (555) 123-4567 to initiate your return. Please include your order number and reason for return.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Receive Return Authorization</h3>
                  <p className="text-earth-700">
                    We&apos;ll review your request and provide you with a Return Authorization Number (RAN) and return shipping label if applicable.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Package and Ship</h3>
                  <p className="text-earth-700">
                    Securely package your item with all original materials and ship it back using the provided label or your preferred method.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-walnut-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-walnut-700 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Refund Processing</h3>
                  <p className="text-earth-700">
                    Once we receive and inspect your return, we&apos;ll process your refund within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Information */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Refund Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-earth-800 mb-3">Refund Timeline</h3>
                <ul className="space-y-2 text-sm text-earth-700">
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Processing: 5-7 business days</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Credit Card: 3-5 business days</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Bank Transfer: 5-10 business days</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-medium text-earth-800 mb-3">What You&apos;ll Receive</h3>
                <ul className="space-y-2 text-sm text-earth-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Full purchase price refund</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Original shipping costs (if applicable)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Return shipping costs (customer responsibility)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Shipping Costs</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Return Shipping Responsibility</h3>
                  <p className="text-earth-700 mb-3">
                    Customers are responsible for return shipping costs unless the item is defective or we made an error in the order.
                  </p>
                  <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                    <li>Standard return shipping: ₹200-500</li>
                    <li>Express return shipping: ₹500-1000</li>
                    <li>International returns: Actual shipping costs</li>
                    <li>We provide prepaid labels for defective items</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Exchanges</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              If you&apos;d like to exchange your item for a different size, color, or model, we&apos;re happy to help. Exchanges follow the same process as returns.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Exchange Options</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Different size or color</li>
                  <li>Different model within same price range</li>
                  <li>Upgrade to a higher-priced model (pay difference)</li>
                  <li>Downgrade to a lower-priced model (receive refund)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Exchange Process</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Contact customer support</li>
                  <li>Specify desired exchange item</li>
                  <li>Ship original item back</li>
                  <li>Receive new item once return is processed</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Damaged or Defective Items</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Immediate Action Required</h3>
                  <p className="text-earth-700">
                    If you receive a damaged or defective item, please contact us immediately. Do not attempt to repair or modify the item.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">What to Do</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Contact us within 48 hours of delivery</li>
                  <li>Take photos of the damage</li>
                  <li>Do not use or wear the item</li>
                  <li>Keep all original packaging</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Our Response</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Provide prepaid return shipping label</li>
                  <li>Process replacement immediately</li>
                  <li>Cover all shipping costs</li>
                  <li>Extend warranty if applicable</li>
                </ul>
              </div>
            </div>
          </section>

          {/* International Returns */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">International Returns</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-earth-800 mb-2">Additional Considerations</h3>
                  <p className="text-earth-700 mb-3">
                    International returns may take longer and incur additional costs. Please be aware of the following:
                  </p>
                  <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                    <li>Customs duties and taxes are non-refundable</li>
                    <li>Return shipping costs are higher</li>
                    <li>Processing time may be extended</li>
                    <li>Some countries may have import restrictions</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-walnut-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Need Help?</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              Our customer support team is here to help with any questions about returns or refunds:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-earth-800 mb-2">Customer Support</h3>
                <p className="text-earth-700">Email: thewalnutstore01@gmail.com</p>
                <p className="text-earth-700">Phone: +91 74669 65196</p>
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
                    <Link href="/shipping-policy" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Shipping Policy
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
