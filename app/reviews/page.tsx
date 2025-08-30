import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Star, User } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: 'Rahul Sharma',
    rating: 5,
    date: '2024-01-15',
    comment: 'Excellent quality watch! The build is solid and the design is exactly as shown. Fast delivery and great customer service.',
    product: 'Luxury Branded 7A Watch'
  },
  {
    id: 2,
    name: 'Priya Patel',
    rating: 5,
    date: '2024-01-12',
    comment: 'Amazing watch collection! The GMT 2 watch is stunning and the price is unbeatable. Highly recommended!',
    product: 'Branded GMT 2 Watch'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    rating: 4,
    date: '2024-01-10',
    comment: 'Great value for money. The watch looks premium and the packaging was excellent. Will definitely buy again.',
    product: 'Luxury Rainbow Watch'
  },
  {
    id: 4,
    name: 'Neha Singh',
    rating: 5,
    date: '2024-01-08',
    comment: 'Perfect gift for my husband! He loves the Day-Date watch. The quality is outstanding and delivery was on time.',
    product: 'Luxury Branded 7A Day-Date Watch'
  },
  {
    id: 5,
    name: 'Vikram Mehta',
    rating: 5,
    date: '2024-01-05',
    comment: 'Best watch purchase ever! The design is elegant and the price is very reasonable. Customer support is top-notch.',
    product: 'Luxury Branded 7A Watch'
  },
  {
    id: 6,
    name: 'Anjali Desai',
    rating: 4,
    date: '2024-01-03',
    comment: 'Beautiful watch with excellent craftsmanship. The rainbow design is unique and eye-catching. Very satisfied!',
    product: 'Luxury Rainbow Watch'
  }
]

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Customer Reviews
            </h1>
            <p className="text-lg text-gray-600">
              What our customers say about our premium timepieces
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Product: {review.product}
                  </p>
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* Write Review Section */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-4">
                Share Your Experience
              </h2>
              <p className="text-gray-600 mb-6">
                We'd love to hear about your experience with our products
              </p>
              <button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3 rounded-lg">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
