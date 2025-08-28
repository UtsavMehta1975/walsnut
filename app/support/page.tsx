import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Mail, Phone, MessageCircle, Clock } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Customer Support
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're here to help with any questions or concerns about your Walnut timepiece
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-walnut-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-walnut-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">
              Get detailed responses within 24 hours
            </p>
            <a 
              href="mailto:support@walnut.com" 
              className="text-walnut-600 hover:text-walnut-700 font-medium"
            >
              support@walnut.com
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-walnut-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-walnut-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">
              Speak directly with our experts
            </p>
            <a 
              href="tel:+91-1800-123-4567" 
              className="text-walnut-600 hover:text-walnut-700 font-medium"
            >
              +91 1800 123 4567
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-walnut-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-walnut-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">
              Instant help during business hours
            </p>
            <button className="text-walnut-600 hover:text-walnut-700 font-medium">
              Start Chat
            </button>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Business Hours</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-walnut-600" />
                Customer Support
              </h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</p>
                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM IST</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Centers</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Monday - Saturday:</strong> 10:00 AM - 7:00 PM IST</p>
                <p><strong>Sunday:</strong> 11:00 AM - 5:00 PM IST</p>
                <p className="text-sm text-gray-500">*Hours may vary by location</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Centers */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Service Centers</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mumbai</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Address:</strong> 123, Linking Road, Bandra West, Mumbai - 400050</p>
                <p><strong>Phone:</strong> +91 22 2645 1234</p>
                <p><strong>Email:</strong> mumbai@walnut.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delhi</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Address:</strong> 456, Connaught Place, New Delhi - 110001</p>
                <p><strong>Phone:</strong> +91 11 2345 6789</p>
                <p><strong>Email:</strong> delhi@walnut.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bangalore</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Address:</strong> 789, 80 Feet Road, Koramangala, Bangalore - 560034</p>
                <p><strong>Phone:</strong> +91 80 4123 4567</p>
                <p><strong>Email:</strong> bangalore@walnut.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chennai</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Address:</strong> 321, T Nagar, Chennai - 600017</p>
                <p><strong>Phone:</strong> +91 44 2345 6789</p>
                <p><strong>Email:</strong> chennai@walnut.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Common Issues & Solutions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My watch stopped working</h3>
              <p className="text-gray-600 mb-2">
                This is usually due to a dead battery. Please visit any of our service centers for a battery replacement.
              </p>
              <p className="text-sm text-gray-500">
                Battery replacement cost: ₹500 (free under warranty)
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Water got inside my watch</h3>
              <p className="text-gray-600 mb-2">
                Immediately stop using the watch and contact our support team. Do not attempt to open the watch yourself.
              </p>
              <p className="text-sm text-gray-500">
                Covered under warranty if within warranty period
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The strap is damaged</h3>
              <p className="text-gray-600 mb-2">
                We offer strap replacement services. Visit any service center or contact support for ordering.
              </p>
              <p className="text-sm text-gray-500">
                Leather strap: ₹1,500 | Metal strap: ₹3,000
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The watch is running fast/slow</h3>
              <p className="text-gray-600 mb-2">
                This indicates the movement needs regulation. Please visit a service center for professional adjustment.
              </p>
              <p className="text-sm text-gray-500">
                Covered under warranty
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
