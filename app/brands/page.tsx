import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const collections = [
  {
    id: 'divers',
    name: 'Diver\'s Collection',
    description: 'Our Diver\'s Collection is engineered for resilience. Inspired by the classic tool watches that conquered the depths, each piece is built on a solid foundation of quality, ready for any adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    watchCount: 8
  },
  {
    id: 'classic',
    name: 'Classic Collection',
    description: 'Elegance, naturally defined. Our Classic Collection draws inspiration from the most revered dress watches, offering timeless design with the organic warmth of the Walnut craftsmanship.',
    imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop',
    watchCount: 12
  },
  {
    id: 'sport',
    name: 'Sport Collection',
    description: 'Precision meets performance. Our Sport Collection celebrates the heritage of racing and aviation timepieces, crafted with organic precision for the modern gentleman.',
    imageUrl: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop',
    watchCount: 10
  },
  {
    id: 'heritage',
    name: 'Heritage Collection',
    description: 'Rooted in tradition, designed for today. Our Heritage Collection pays homage to the golden age of watchmaking, bringing classic aesthetics to contemporary wrists.',
    imageUrl: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop',
    watchCount: 6
  },
  {
    id: 'precision',
    name: 'Precision Collection',
    description: 'Where accuracy meets artistry. Our Precision Collection features chronographs and complications, each crafted with the organic precision that defines Walnut excellence.',
    imageUrl: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop',
    watchCount: 8
  },
  {
    id: 'reserve',
    name: 'Reserve Collection',
    description: 'The pinnacle of Walnut craftsmanship. Our Reserve Collection represents the finest examples of our artisanal approach, where every detail reflects our commitment to organic excellence.',
    imageUrl: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop',
    watchCount: 4
  }
]

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl lato-black text-gray-900 mb-4">
              Walnut Collections
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our naturally crafted collections, each rooted in the legacy of iconic design
            </p>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection) => (
            <Card key={collection.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl lato-black text-white mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-white/90">
                      {collection.watchCount} timepieces available
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {collection.description}
                </p>
                <Link href={`/watches?collection=${collection.id}`}>
                                      <Button variant="luxury" className="w-full">
                      View {collection.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl md:text-3xl lato-black text-gray-900 mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our collection includes many more prestigious brands. Browse our complete catalog to find your perfect timepiece.
          </p>
          <Link href="/watches">
            <Button variant="luxury-outline" size="lg">
              Browse All Watches
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
