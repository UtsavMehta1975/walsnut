import { Shield, CheckCircle, Award } from 'lucide-react'

export function AuthenticityBanner() {
  return (
    <section className="bg-gradient-to-r from-gold-50 to-yellow-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Authenticity Guaranteed
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every timepiece in our collection undergoes rigorous authentication by certified experts. 
            Your investment is protected with our comprehensive authenticity guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gold-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Authentication</h3>
            <p className="text-gray-600">
              Each watch is authenticated by certified horologists with decades of experience.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-gold-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              Comprehensive quality checks ensure every timepiece meets our exacting standards.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-gold-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime Support</h3>
            <p className="text-gray-600">
              Ongoing support and service for your luxury timepiece investment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


