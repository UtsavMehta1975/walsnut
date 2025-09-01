import Link from 'next/link'

const brands = [
  { name: 'Rolex', logo: 'ROLEX', description: 'The Crown of Swiss Watchmaking' },
  { name: 'Patek Philippe', logo: 'PATEK', description: 'Generations of Excellence' },
  { name: 'Audemars Piguet', logo: 'AP', description: 'Innovation in Tradition' },
  { name: 'Omega', logo: 'Ω', description: 'Precision and Heritage' },
  { name: 'Cartier', logo: 'CARTIER', description: 'Elegance and Style' },
  { name: 'IWC', logo: 'IWC', description: 'Engineering Excellence' }
]

export function BrandShowcase() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-4xl lato-black text-gray-900 mb-4">
            Prestigious Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We partner with the world&apos;s most renowned luxury watch manufacturers to bring you authentic timepieces.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <Link key={brand.name} href="/watches">
              <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300 group">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-200 transition-colors">
                  <span className="text-2xl font-bold text-gold-600">{brand.logo}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-gray-600 text-sm">{brand.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/watches">
            <button className="text-gold-600 hover:text-gold-700 font-semibold">
              Explore All Brands →
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
