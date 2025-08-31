'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Clock, Users, MapPin, TrendingUp, Star, ShoppingCart } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  description: string
  image: string
  price: number
  category: string
  features: string[]
  sku: string
}

const lifestyleRecommendations = {
  adventure: {
    title: "Adventure & Outdoor",
    description: "For thrill-seekers and outdoor enthusiasts who need durability and functionality.",
    recommendations: [
      {
        id: '1',
        title: 'Sport Elite Diver Pro',
        description: 'Perfect for diving and water sports with 300m water resistance',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 85000,
        category: 'Sport Elite',
        features: ['300m Water Resistance', 'Luminescent Hands', 'Stainless Steel Case', 'Rotating Bezel'],
        sku: 'SPT-ELT-DIVER-PRO-001'
      },
      {
        id: '2',
        title: 'Racing Elite Chronograph',
        description: 'High-precision chronograph for racing and timing events',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 125000,
        category: 'Racing Elite',
        features: ['Chronograph Function', 'Tachymeter Scale', 'Sapphire Crystal', 'Quick Release Strap'],
        sku: 'RAC-ELT-CHRONO-002'
      }
    ]
  },
  business: {
    title: "Business & Professional",
    description: "Elegant timepieces for the boardroom and professional settings.",
    recommendations: [
      {
        id: '3',
        title: 'Luxury AAA Executive',
        description: 'Sophisticated design for business meetings and formal occasions',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 95000,
        category: 'Luxury AAA',
        features: ['Automatic Movement', 'Leather Strap', 'Date Display', 'Elegant Dial'],
        sku: 'LUX-AAA-EXEC-003'
      },
      {
        id: '4',
        title: 'Elegant Classic Tank',
        description: 'Timeless rectangular design perfect for professional attire',
        image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 32000,
        category: 'Elegant Classic',
        features: ['Quartz Movement', 'Stainless Steel', 'Blue Hands', 'Art Deco Design'],
        sku: 'ELG-CLS-TANK-004'
      }
    ]
  },
  vintage: {
    title: "Vintage & Classic",
    description: "For those who appreciate timeless designs and heritage aesthetics.",
    recommendations: [
      {
        id: '5',
        title: 'Classic Vintage Speedmaster',
        description: 'Legendary chronograph with heritage design and manual movement',
        image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 65000,
        category: 'Classic Vintage',
        features: ['Manual Movement', 'Chronograph', 'Luminescent Hands', 'Heritage Design'],
        sku: 'CLS-VNT-SPEED-005'
      },
      {
        id: '6',
        title: 'Premium Elite Heritage',
        description: 'Sophisticated design inspired by classic luxury timepieces',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 450000,
        category: 'Premium Elite',
        features: ['Automatic Movement', 'Blue Dial', 'Stainless Steel', 'Luxury Finish'],
        sku: 'PRE-ELT-HERITAGE-006'
      }
    ]
  },
  luxury: {
    title: "Luxury & Premium",
    description: "For connoisseurs who demand the finest craftsmanship and materials.",
    recommendations: [
      {
        id: '7',
        title: 'Luxury AAA Submariner',
        description: 'Premium diving watch with exceptional craftsmanship',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 95000,
        category: 'Luxury AAA',
        features: ['300m Water Resistance', 'Automatic Movement', 'Ceramic Bezel', 'Oyster Bracelet'],
        sku: 'LUX-AAA-SUB-007'
      },
      {
        id: '8',
        title: 'Premium Elite Royal Oak',
        description: 'Revolutionary design with distinctive octagonal bezel',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80',
        price: 280000,
        category: 'Premium Elite',
        features: ['Octagonal Bezel', 'Grande Tapisserie Dial', 'Integrated Bracelet', 'Luxury Finish'],
        sku: 'PRE-ELT-ROYAL-008'
      }
    ]
  }
}

export default function WatchAdvisorPage() {
  const [selectedLifestyle, setSelectedLifestyle] = useState<string | null>(null)

  const handleLifestyleSelect = (lifestyle: string) => {
    setSelectedLifestyle(lifestyle)
  }

  const formatIndianPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              Watch Advisor
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect timepiece for your lifestyle. Our expert recommendations help you choose based on your activities, style, and preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedLifestyle ? (
          /* Lifestyle Selection */
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                Choose Your Lifestyle
              </h2>
              <p className="text-gray-600">
                Select the category that best describes your lifestyle to get personalized recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(lifestyleRecommendations).map(([key, lifestyle]) => (
                <Card 
                  key={key}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleLifestyleSelect(key)}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {key === 'adventure' && <MapPin className="h-8 w-8 text-yellow-600" />}
                        {key === 'business' && <Users className="h-8 w-8 text-yellow-600" />}
                        {key === 'vintage' && <Clock className="h-8 w-8 text-yellow-600" />}
                        {key === 'luxury' && <Star className="h-8 w-8 text-yellow-600" />}
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        {lifestyle.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {lifestyle.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Recommendations Display */
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <button
                  onClick={() => setSelectedLifestyle(null)}
                  className="text-yellow-600 hover:text-yellow-700 font-medium mb-2 flex items-center"
                >
                  ← Back to Lifestyle Selection
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  {lifestyleRecommendations[selectedLifestyle as keyof typeof lifestyleRecommendations].title}
                </h2>
                <p className="text-gray-600 mt-2">
                  {lifestyleRecommendations[selectedLifestyle as keyof typeof lifestyleRecommendations].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lifestyleRecommendations[selectedLifestyle as keyof typeof lifestyleRecommendations].recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square relative">
                    <Image
                      src={recommendation.image}
                      alt={recommendation.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-black mb-2">
                          {recommendation.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-2">
                          {recommendation.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            {recommendation.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            SKU: {recommendation.sku}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black">
                          {formatIndianPrice(recommendation.price)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-black mb-2">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {recommendation.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link href={`/watches/${recommendation.sku}`} className="flex-1">
                          <Button className="w-full bg-black text-white hover:bg-gray-800">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" className="flex-1">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
