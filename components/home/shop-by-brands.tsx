'use client'

import Image from 'next/image'
import Link from 'next/link'

const brands = [
  { name: 'Casio', image: '/brands/casio.jpg', slug: 'casio' },
  { name: 'Adriatica', image: '/brands/adriatica.jpg', slug: 'adriatica' },
  { name: 'Fossil', image: '/brands/fossil.jpg', slug: 'fossil' },
  { name: 'Tissot', image: '/brands/tissot.jpg', slug: 'tissot' },
  { name: 'Timex', image: '/brands/timex.jpg', slug: 'timex' },
  { name: 'Guess', image: '/brands/guess.jpg', slug: 'guess' },
  { name: 'Briston', image: '/brands/briston.jpg', slug: 'briston' },
  { name: 'Coach', image: '/brands/coach.jpg', slug: 'coach' },
  { name: 'Seiko', image: '/brands/seiko.jpg', slug: 'seiko' },
  { name: 'Armani Exchange', image: '/brands/armani.jpg', slug: 'armani-exchange' },
  { name: 'Calvin Klein', image: '/brands/calvin-klein.jpg', slug: 'calvin-klein' },
  { name: 'Michael Kors', image: '/brands/michael-kors.jpg', slug: 'michael-kors' },
  { name: 'Citizen', image: '/brands/citizen.jpg', slug: 'citizen' },
  { name: 'Plein', image: '/brands/plein.jpg', slug: 'plein' },
  { name: 'Boss', image: '/brands/boss.jpg', slug: 'boss' },
  { name: 'Movado', image: '/brands/movado.jpg', slug: 'movado' },
  { name: 'Ferragamo', image: '/brands/ferragamo.jpg', slug: 'ferragamo' },
  { name: 'Britime London', image: '/brands/britime.jpg', slug: 'britime-london' },
  { name: 'Garmin', image: '/brands/garmin.jpg', slug: 'garmin' },
  { name: 'Emporio Armani', image: '/brands/emporio-armani.jpg', slug: 'emporio-armani' },
  { name: 'GC', image: '/brands/gc.jpg', slug: 'gc' },
  { name: 'Longines', image: '/brands/longines.jpg', slug: 'longines' },
  { name: 'Versace', image: '/brands/versace.jpg', slug: 'versace' },
  { name: 'Plein Sports', image: '/brands/plein-sports.jpg', slug: 'plein-sports' },
  { name: 'Obaku', image: '/brands/obaku.jpg', slug: 'obaku' },
  { name: 'Mont Neo', image: '/brands/mont-neo.jpg', slug: 'mont-neo' },
  { name: 'Darren Clark', image: '/brands/darren-clark.jpg', slug: 'darren-clark' },
  { name: 'Pierre Lannier', image: '/brands/pierre-lannier.jpg', slug: 'pierre-lannier' },
  { name: 'Helix', image: '/brands/helix.jpg', slug: 'helix' },
]

export function ShopByBrands() {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">Shop By Brand</h2>
          <Link href="/brands" className="text-yellow-600 hover:text-yellow-700 font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link 
              key={brand.slug} 
              href={`/brands/${brand.slug}`}
              className="group"
            >
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {brand.name.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 group-hover:text-yellow-600 transition-colors">
                    {brand.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
