'use client'

export function WhyChooseWalnut() {
  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Why Choose Walnut?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover what makes us the preferred choice for premium timepiece enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Premium Quality */}
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-yellow-600 font-bold text-2xl">🏆</div>
            </div>
            <h4 className="text-xl font-semibold text-black mb-3">Premium Quality</h4>
            <p className="text-gray-600 text-lg">Every timepiece is crafted with precision engineering and premium materials for lasting excellence. We source only the finest components to ensure your watch stands the test of time.</p>
          </div>

          {/* Fast Delivery */}
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-yellow-600 font-bold text-2xl">🚚</div>
            </div>
            <h4 className="text-xl font-semibold text-black mb-3">Fast Delivery</h4>
            <p className="text-gray-600 text-lg">Free shipping across India with express delivery options to get your timepiece quickly. We ensure secure packaging and real-time tracking for peace of mind.</p>
          </div>

          {/* Expert Guidance */}
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-yellow-600 font-bold text-2xl">💎</div>
            </div>
            <h4 className="text-xl font-semibold text-black mb-3">Expert Guidance</h4>
            <p className="text-gray-600 text-lg">Professional advice and support to help you find the perfect timepiece for any occasion. Our watch experts are here to guide you through every step of your selection.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
