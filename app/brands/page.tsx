import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const collections = [
  {
    id: 'luxury',
    name: 'Luxury Collection',
    description: 'Premium timepieces with exceptional craftsmanship and elegant design.',
    imageUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600',
    watchCount: 8
  },
  {
    id: 'gmt',
    name: 'GMT Collection',
    description: 'Professional GMT watches with dual time zone functionality.',
    imageUrl: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600',
    watchCount: 6
  },
  {
    id: 'classic',
    name: 'Classic Collection',
    description: 'Timeless designs inspired by iconic dress watches.',
    imageUrl: 'https://images.pexels.com/photos/162553/pexels-photo-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
    watchCount: 12
  },
  {
    id: 'sport',
    name: 'Sport Collection',
    description: 'Robust sports watches built for adventure and performance.',
    imageUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600',
    watchCount: 10
  },
  {
    id: 'smart',
    name: 'Smart Collection',
    description: 'Modern smart watches with advanced technology and sleek design.',
    imageUrl: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600',
    watchCount: 5
  },
  {
    id: 'special',
    name: 'Special Edition',
    description: 'Limited edition timepieces with unique designs and premium materials.',
    imageUrl: 'https://images.pexels.com/photos/162553/pexels-photo-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
    watchCount: 4
  }
]

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              Collections
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our premium collections of inspired timepieces
            </p>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={collection.imageUrl}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-white/90">
                    {collection.watchCount} timepieces available
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {collection.description}
                </p>
                <Link href={`/watches?category=${collection.id}`}>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    View {collection.name}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our complete catalog to find your perfect timepiece.
          </p>
          <Link href="/watches">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3">
              Browse All Watches
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
