'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, XCircle, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsOfServicePage() {
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
                Terms of Service
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
              <FileText className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Agreement to Terms</h2>
            </div>
            <p className="text-earth-700 leading-relaxed mb-4">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Walnut website and services operated by Walnut (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing or using our website, you agree to be bound by these Terms and all applicable laws and regulations.
            </p>
            <p className="text-earth-700 leading-relaxed">
              If you do not agree with any of these terms, you are prohibited from using or accessing this website. The materials contained in this website are protected by applicable copyright and trademark law.
            </p>
          </section>

          {/* Use License */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Use License</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Permission</h3>
                <p className="text-earth-700 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials (information or software) on Walnut&apos;s website for personal, non-commercial transitory viewing only.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Restrictions</h3>
                <p className="text-earth-700 leading-relaxed mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or &ldquo;mirror&rdquo; the materials on any other server</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Termination</h3>
                <p className="text-earth-700 leading-relaxed">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by Walnut at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
                </p>
              </div>
            </div>
          </section>

          {/* Product Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Product Information and Pricing</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-1">Accurate Information</h3>
                    <p className="text-sm text-earth-700">We strive to provide accurate product descriptions, pricing, and availability information.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-1">Pricing Changes</h3>
                    <p className="text-sm text-earth-700">Prices are subject to change without notice. All prices are in Indian Rupees (₹).</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-1">Availability</h3>
                    <p className="text-sm text-earth-700">Product availability is subject to change. We reserve the right to limit quantities.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-walnut-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-1">Quality Assurance</h3>
                    <p className="text-sm text-earth-700">All products undergo quality checks before shipping to ensure customer satisfaction.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ordering and Payment */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Ordering and Payment</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Order Acceptance</h3>
                <p className="text-earth-700 leading-relaxed mb-4">
                  All orders are subject to acceptance and availability. We reserve the right to refuse service to anyone for any reason at any time.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Payment Methods</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Credit and debit cards (Visa, MasterCard, American Express)</li>
                  <li>Digital wallets (PayPal, Google Pay, PhonePe)</li>
                  <li>UPI payments</li>
                  <li>Net banking</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Payment Security</h3>
                <p className="text-earth-700 leading-relaxed">
                  All payment information is encrypted and processed securely through our trusted payment partners. We do not store your complete payment information on our servers.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Shipping and Delivery</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Shipping Information</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Free shipping on all orders within India</li>
                  <li>Standard delivery: 3-5 business days</li>
                  <li>Express delivery: 1-2 business days (additional charges apply)</li>
                  <li>International shipping available to select countries</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Delivery Terms</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Orders are processed within 24 hours</li>
                  <li>Tracking information provided via email</li>
                  <li>Signature may be required for high-value items</li>
                  <li>Delivery delays may occur due to circumstances beyond our control</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Returns and Refunds</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Return Policy</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>30-day return window for most items</li>
                  <li>Items must be in original condition with all packaging</li>
                  <li>Return shipping costs are the responsibility of the customer</li>
                  <li>Custom or personalized items may not be eligible for return</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Refund Process</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Refunds are processed within 5-7 business days</li>
                  <li>Original payment method will be credited</li>
                  <li>Processing fees may be deducted from refunds</li>
                  <li>International returns may incur additional charges</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">User Accounts</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Account Creation</h3>
                <p className="text-earth-700 leading-relaxed mb-4">
                  To access certain features of our website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and password.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Prohibited Uses</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              You may not use our website for any unlawful purpose or to solicit others to perform unlawful acts. You agree not to:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Harass, abuse, or harm others</li>
                <li>Submit false or misleading information</li>
              </ul>
              
              <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with website functionality</li>
                <li>Use automated systems to access the website</li>
                <li>Engage in any form of fraud or deception</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Intellectual Property</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Ownership</h3>
                <p className="text-earth-700 leading-relaxed mb-4">
                  The content on this website, including but not limited to text, graphics, images, logos, and software, is the property of Walnut and is protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Limited License</h3>
                <p className="text-earth-700 leading-relaxed">
                  We grant you a limited, non-exclusive, non-transferable license to access and use our website for personal, non-commercial purposes. This license does not include the right to reproduce, distribute, or create derivative works.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Disclaimers</h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-2">General Disclaimer</h3>
                    <p className="text-sm text-earth-700">
                      The information on this website is provided &ldquo;as is&rdquo; without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-earth-800 mb-2">Limitation of Liability</h3>
                    <p className="text-sm text-earth-700">
                      In no event shall Walnut be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use of our website or services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Governing Law</h2>
            
            <p className="text-earth-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of our website shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Changes to Terms</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our website after any changes indicates your acceptance of the modified Terms.
            </p>
            
            <p className="text-earth-700 leading-relaxed">
              We encourage you to review these Terms periodically to stay informed about our practices and your rights.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-walnut-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Contact Information</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-earth-800 mb-2">Walnut</h3>
                <p className="text-earth-700">Mumbai, India</p>
                <p className="text-earth-700">Email: legal@walnut.com</p>
                <p className="text-earth-700">Phone: +91 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 className="font-medium text-earth-800 mb-2">Customer Support</h3>
                <p className="text-earth-700">Email: support@walnut.com</p>
                <p className="text-earth-700">For general inquiries and support</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
