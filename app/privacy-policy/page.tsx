'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicyPage() {
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
                Privacy Policy
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
              <Shield className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Introduction</h2>
            </div>
            <p className="text-earth-700 leading-relaxed mb-4">
              Walnut (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, purchase our products, or interact with our services.
            </p>
            <p className="text-earth-700 leading-relaxed">
              By using our website and services, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our website.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Information We Collect</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Account credentials and profile information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, interactions)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (with your consent)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">How We Use Your Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-earth-800">Primary Uses</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support</li>
                  <li>Send order confirmations and updates</li>
                  <li>Improve our website and services</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-earth-800">Additional Uses</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Personalize your shopping experience</li>
                  <li>Send marketing communications (with consent)</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Information Sharing</h2>
            </div>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            
            <ul className="list-disc list-inside text-earth-700 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> With trusted partners who assist in operating our website, processing payments, and delivering orders</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">Data Security</h2>
            </div>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Security Measures</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing</li>
                  <li>Regular security audits</li>
                  <li>Access controls and authentication</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Your Responsibilities</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Keep your account credentials secure</li>
                  <li>Log out after each session</li>
                  <li>Use strong, unique passwords</li>
                  <li>Report suspicious activity immediately</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Your Rights</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Access and Control</h3>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Access your personal information</li>
                  <li>Update or correct your data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-earth-800 mb-2">Contact Us</h3>
                <p className="text-earth-700 mb-2">
                  To exercise your rights or for privacy-related inquiries:
                </p>
                <ul className="list-disc list-inside text-earth-700 space-y-1 ml-4">
                  <li>Email: privacy@walnut.com</li>
                  <li>Phone: +91 (555) 123-4567</li>
                  <li>Address: Mumbai, India</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Cookies and Tracking</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-cream-50 p-4 rounded-lg">
                <h3 className="font-medium text-earth-800 mb-2">Essential Cookies</h3>
                <p className="text-sm text-earth-700">Required for website functionality and security</p>
              </div>
              <div className="bg-cream-50 p-4 rounded-lg">
                <h3 className="font-medium text-earth-800 mb-2">Analytics Cookies</h3>
                <p className="text-sm text-earth-700">Help us understand how visitors use our website</p>
              </div>
              <div className="bg-cream-50 p-4 rounded-lg">
                <h3 className="font-medium text-earth-800 mb-2">Marketing Cookies</h3>
                <p className="text-sm text-earth-700">Used to deliver relevant advertisements</p>
              </div>
            </div>
          </section>

          {/* International Transfers */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-6 w-6 text-walnut-600" />
              <h2 className="text-xl font-semibold text-earth-900">International Data Transfers</h2>
            </div>
            
            <p className="text-earth-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Children&apos;s Privacy</h2>
            
            <p className="text-earth-700 leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Changes to This Policy</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
            
            <p className="text-earth-700 leading-relaxed">
              We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our website after any modifications indicates your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-walnut-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Contact Us</h2>
            
            <p className="text-earth-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-earth-800 mb-2">Walnut</h3>
                <p className="text-earth-700">Mumbai, India</p>
                <p className="text-earth-700">Email: privacy@walnut.com</p>
                <p className="text-earth-700">Phone: +91 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 className="font-medium text-earth-800 mb-2">Data Protection Officer</h3>
                <p className="text-earth-700">Email: dpo@walnut.com</p>
                <p className="text-earth-700">For urgent privacy concerns</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
