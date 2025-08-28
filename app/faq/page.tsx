import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our watches, services, and policies
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Product Questions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Product Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What makes Walnut watches special?</h3>
                <p className="text-gray-600">
                  Walnut watches are precision-crafted homage timepieces that combine the legacy of iconic design 
                  with modern engineering. Each watch is carefully assembled by skilled artisans using premium 
                  materials and reliable movements.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Are Walnut watches water resistant?</h3>
                <p className="text-gray-600">
                  Yes, all Walnut watches feature water resistance. The specific rating varies by model, 
                  ranging from 30m to 100m. Please check the product specifications for your specific model.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What type of movements do you use?</h3>
                <p className="text-gray-600">
                  We use reliable Japanese and Swiss movements known for their accuracy and durability. 
                  Each movement is carefully tested and regulated before assembly.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer different strap options?</h3>
                <p className="text-gray-600">
                  Yes, we offer various strap options including leather, stainless steel, and NATO straps. 
                  Additional straps can be purchased separately and are easy to change.
                </p>
              </div>
            </div>
          </div>

          {/* Ordering & Shipping */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Ordering & Shipping</h2>
            
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is shipping free?</h3>
                <p className="text-gray-600">
                  Yes, standard shipping is free on all orders over ₹5,000. For orders under ₹5,000, 
                  a nominal shipping fee of ₹200 applies.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I track my order?</h3>
                <p className="text-gray-600">
                  Yes, you'll receive a tracking number via email once your order ships. You can track your 
                  package through our website or the courier's tracking system.
                </p>
              </div>
            </div>
          </div>

          {/* Returns & Warranty */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Returns & Warranty</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is your return policy?</h3>
                <p className="text-gray-600">
                  We offer a 30-day return window for all watches. The watch must be unworn and in its original 
                  packaging. Return shipping is free for defective items.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What warranty do you provide?</h3>
                <p className="text-gray-600">
                  All Walnut watches come with a 2-year limited warranty covering manufacturing defects. 
                  Extended warranty options are also available.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I get my watch serviced?</h3>
                <p className="text-gray-600">
                  Contact our customer service team or visit an authorized service center. We have service 
                  centers in major cities across India.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my watch arrives damaged?</h3>
                <p className="text-gray-600">
                  If your watch arrives damaged, please contact us immediately with photos. We'll arrange 
                  a replacement or refund at no additional cost.
                </p>
              </div>
            </div>
          </div>

          {/* Account & Payment */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Account & Payment</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, UPI, net banking, and digital wallets 
                  including Paytm, PhonePe, and Google Pay.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">
                  Yes, we use industry-standard SSL encryption to protect your payment information. 
                  We never store your complete payment details on our servers.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I save my payment information?</h3>
                <p className="text-gray-600">
                  Yes, you can save your payment methods securely in your account for faster checkout 
                  on future purchases.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer installment plans?</h3>
                <p className="text-gray-600">
                  Yes, we offer EMI options through our partner banks. You can choose from 3, 6, or 12-month 
                  installment plans at checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
