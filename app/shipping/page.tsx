import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Truck, Package, Clock, Shield } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lato-black text-gray-900 mb-4">
              Shipping & Returns
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fast, secure shipping and hassle-free returns for your peace of mind
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl lato-black text-gray-900 mb-6">Shipping Information</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-walnut-600" />
                Delivery Options
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-walnut-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Standard Shipping</h4>
                  <p className="text-gray-600">5-7 business days</p>
                  <p className="text-sm text-gray-500">Free on orders over ₹5,000</p>
                </div>
                <div className="border-l-4 border-walnut-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Express Shipping</h4>
                  <p className="text-gray-600">2-3 business days</p>
                  <p className="text-sm text-gray-500">₹500 additional charge</p>
                </div>
                <div className="border-l-4 border-walnut-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Premium Shipping</h4>
                  <p className="text-gray-600">1-2 business days</p>
                  <p className="text-sm text-gray-500">₹1,000 additional charge</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-walnut-600" />
                Secure Packaging
              </h3>
              <p className="text-gray-600 mb-4">
                Every Walnut timepiece is carefully packaged in our signature presentation box, 
                ensuring it arrives in perfect condition. Our packaging includes:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Premium presentation box</li>
                <li>• Protective foam padding</li>
                <li>• Certificate of authenticity</li>
                <li>• Care instructions</li>
                <li>• Warranty card</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Returns Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl lato-black text-gray-900 mb-6">Returns & Exchanges</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-walnut-600" />
                Return Policy
              </h3>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you&apos;re not happy 
                with your watch, we offer a 30-day return window.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5 text-walnut-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">30-Day Return Window</h4>
                    <p className="text-sm text-gray-600">Return your watch within 30 days of delivery</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 mt-0.5 text-walnut-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Condition Requirements</h4>
                    <p className="text-sm text-gray-600">Watch must be unworn and in original packaging</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Process</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-walnut-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact Support</h4>
                    <p className="text-sm text-gray-600">Email us with your order number and reason for return</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-walnut-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Return Label</h4>
                    <p className="text-sm text-gray-600">We&apos;ll provide a prepaid return shipping label</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-walnut-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ship Back</h4>
                    <p className="text-sm text-gray-600">Package your watch securely and ship it back</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-walnut-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Refund Processed</h4>
                    <p className="text-sm text-gray-600">Refund will be processed within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl lato-black text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
              <p className="text-gray-600">
                Standard shipping takes 5-7 business days. Express shipping (2-3 days) and Premium shipping (1-2 days) 
                are available for additional charges.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
              <p className="text-gray-600">
                Currently, we ship to all major cities in India. International shipping will be available soon.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my watch arrives damaged?</h3>
              <p className="text-gray-600">
                If your watch arrives damaged, please contact us immediately with photos. We&apos;ll arrange a replacement 
                or refund at no additional cost.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I exchange my watch for a different model?</h3>
              <p className="text-gray-600">
                Yes, you can exchange your watch for a different model within 30 days, subject to availability 
                and price differences.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
