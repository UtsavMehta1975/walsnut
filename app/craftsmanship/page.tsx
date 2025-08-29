import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lato-black text-gray-900 mb-4">
              The Art of Craftsmanship
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the meticulous attention to detail and traditional techniques that make every Walnut watch a masterpiece of precision engineering.
            </p>
          </div>

          {/* Craftsmanship Process */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl lato-bold text-gray-900 mb-6">Our Craftsmanship Process</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl lato-bold text-gray-900 mb-3">Design & Engineering</h3>
                  <p className="text-gray-600">
                    Every Walnut watch begins with meticulous design and engineering. Our team of expert designers and engineers work together to create timepieces that are both beautiful and functional.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl lato-bold text-gray-900 mb-3">Material Selection</h3>
                  <p className="text-gray-600">
                    We carefully select only the finest materials - from premium stainless steel cases to scratch-resistant sapphire crystals and genuine leather straps.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl lato-bold text-gray-900 mb-3">Precision Assembly</h3>
                  <p className="text-gray-600">
                    Each watch is assembled by hand by our skilled craftsmen, ensuring every component is perfectly aligned and every detail is attended to.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl lato-bold text-gray-900 mb-3">Quality Testing</h3>
                  <p className="text-gray-600">
                    Every watch undergoes rigorous quality testing to ensure accuracy, water resistance, and durability before it reaches your wrist.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl lato-bold text-gray-900 mb-6">Craftsmanship Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-walnut-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Hand-assembled by expert craftsmen</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-walnut-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Premium materials and finishes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-walnut-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Rigorous quality control</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-walnut-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Traditional techniques meets modern innovation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-walnut-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Attention to every detail</span>
                </div>
              </div>
            </div>
          </div>

          {/* Materials Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl lato-bold text-gray-900 mb-8 text-center">Premium Materials</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-walnut-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl lato-bold text-gray-900 mb-3">Stainless Steel Cases</h3>
                <p className="text-gray-600">
                  High-grade 316L stainless steel provides durability and corrosion resistance while maintaining a premium finish.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-walnut-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl lato-bold text-gray-900 mb-3">Sapphire Crystals</h3>
                <p className="text-gray-600">
                  Scratch-resistant sapphire crystals ensure your watch face remains pristine for years to come.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-walnut-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👜</span>
                </div>
                <h3 className="text-xl lato-bold text-gray-900 mb-3">Genuine Leather Straps</h3>
                <p className="text-gray-600">
                  Premium leather straps that age beautifully and provide exceptional comfort on your wrist.
                </p>
              </div>
            </div>
          </div>

          {/* Heritage Section */}
          <div className="text-center">
            <h2 className="text-3xl lato-bold text-gray-900 mb-6">A Legacy of Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              For generations, our family has been crafting timepieces that stand the test of time. 
              Every Walnut watch carries forward this tradition of excellence and attention to detail.
            </p>
            <div className="bg-walnut-600 text-white px-8 py-4 rounded-lg inline-block">
              <span className="text-lg lato-bold">Experience the difference craftsmanship makes</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
