import { Shield, Truck, CreditCard, Headphones } from 'lucide-react'

export function AuthenticityBanner() {
  return (
    <section className="bg-white py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-sm font-semibold text-black mb-1">100% Satisfaction</h3>
            <p className="text-xs text-gray-600">Authentic Timepieces</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Truck className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-sm font-semibold text-black mb-1">Free Shipping</h3>
            <p className="text-xs text-gray-600">On Orders Above ₹999</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <CreditCard className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-sm font-semibold text-black mb-1">Secure Payment</h3>
            <p className="text-xs text-gray-600">100% Secure Checkout</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Headphones className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-sm font-semibold text-black mb-1">24/7 Support</h3>
            <p className="text-xs text-gray-600">Customer Service</p>
          </div>
        </div>
      </div>
    </section>
  )
}


