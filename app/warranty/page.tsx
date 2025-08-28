import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Warranty & Service
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive warranty coverage and professional service for your Walnut timepiece
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warranty Coverage */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Warranty Coverage</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Covered</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Manufacturing Defects</h4>
                    <p className="text-sm text-gray-600">Any defects in materials or workmanship</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Movement Issues</h4>
                    <p className="text-sm text-gray-600">Problems with timekeeping accuracy</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Case & Crystal</h4>
                    <p className="text-sm text-gray-600">Structural integrity issues</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty Period</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-walnut-600 pl-4">
                  <h4 className="font-semibold text-gray-900">2-Year Limited Warranty</h4>
                  <p className="text-gray-600">Comprehensive coverage on all components</p>
                  <p className="text-sm text-gray-500">From date of purchase</p>
                </div>
                <div className="border-l-4 border-walnut-600 pl-4">
                  <h4 className="font-semibold text-gray-900">Extended Warranty</h4>
                  <p className="text-gray-600">Available for additional 3 years</p>
                  <p className="text-sm text-gray-500">₹2,000 per year</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Service & Repairs</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Authorized Service Centers</h3>
              <p className="text-gray-600 mb-4">
                All repairs must be performed by authorized Walnut service centers to maintain 
                warranty coverage. We have service centers in major cities across India.
              </p>
              <div className="space-y-2 text-gray-600">
                <p>• Mumbai - Bandra West</p>
                <p>• Delhi - Connaught Place</p>
                <p>• Bangalore - Koramangala</p>
                <p>• Chennai - T Nagar</p>
                <p>• Kolkata - Park Street</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Process</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-walnut-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact Service Center</h4>
                    <p className="text-sm text-gray-600">Call or visit nearest authorized center</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-walnut-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Assessment</h4>
                    <p className="text-sm text-gray-600">Technician evaluates the issue</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-walnut-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Repair</h4>
                    <p className="text-sm text-gray-600">Professional repair using genuine parts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Care Instructions</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-walnut-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💧</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Water Resistance</h3>
              <p className="text-gray-600 text-sm">
                Avoid exposing your watch to water unless it's specifically designed for water resistance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-walnut-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧽</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cleaning</h3>
              <p className="text-gray-600 text-sm">
                Clean your watch regularly with a soft, dry cloth. For leather straps, use a leather cleaner.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-walnut-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Battery</h3>
              <p className="text-gray-600 text-sm">
                Replace the battery every 2-3 years or when the watch stops. Always use authorized service centers.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
