import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gold-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl lato-black text-gray-900 mb-6">
              About Walnut
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Where timeless design is naturally crafted, and every timepiece tells a story of organic precision and grounded luxury.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lato-black text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Walnut was founded on a simple principle: that iconic design, like the grain of a fine walnut, is timeless. We are a collective of horology enthusiasts and craftsmen based in India, dedicated to creating precision timepieces that pay homage to the legends of watchmaking.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our name reflects our commitment to organic, grounded quality and natural, enduring beauty. Every Walnut watch is a testament to accessible luxury, crafted for those who appreciate the roots of great design.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop"
                  alt="Luxury watch collection"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lato-black text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rooted Craftsmanship</h3>
              <p className="text-gray-600">
                Every Walnut timepiece is crafted with organic precision, featuring surgical-grade materials and finishes inspired by natural elements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Organic Design Legacy</h3>
              <p className="text-gray-600">
                We pay homage to timeless designs, naturally, bringing the enduring strength and classic grain of iconic aesthetics to your wrist.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessible Luxury</h3>
              <p className="text-gray-600">
                We democratize luxury, offering the look and feel of excellence, rooted in value for the modern Indian gentleman.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=800&fit=crop"
                  alt="Watchmaking craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lato-black text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our journey began with a deep appreciation for the artistry of watchmaking and a vision to make iconic design accessible. We believe that great design, like the grain of fine walnut, has a natural beauty that transcends time.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Each Walnut timepiece is crafted with the same attention to detail that defines the legends of horology, but with our own unique interpretation that celebrates the organic elegance of natural materials and timeless aesthetics.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we continue to grow our collection, always staying true to our roots while embracing innovation and the evolving tastes of the modern Indian gentleman who values both tradition and contemporary sophistication.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lato-black text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Craftsmen passionate about bringing you naturally crafted excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                  alt="Team member"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Arjun Patel</h3>
              <p className="text-gold-600 mb-4">Founder & Master Craftsman</p>
              <p className="text-gray-600">
                A lifelong horology enthusiast with over 20 years of experience in precision engineering and design.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
                  alt="Team member"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priya Sharma</h3>
              <p className="text-gold-600 mb-4">Head of Design</p>
              <p className="text-gray-600">
                Expert in organic design principles with deep understanding of iconic watch aesthetics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Team member"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rajesh Kumar</h3>
              <p className="text-gold-600 mb-4">Customer Experience</p>
              <p className="text-gray-600">
                Dedicated to ensuring every customer discovers their perfect naturally crafted timepiece.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer Section */}
      <div className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lato-black text-gray-900 mb-6">
              Legal & Ethical Compliance
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                <strong>Disclaimer:</strong> Walnut timepieces are inspired by classic designs but are our own unique products. They are not associated, affiliated, endorsed by, or connected to any of the renowned brands whose designs we admire.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Our inspired timepieces celebrate the artistry of iconic design while offering accessible luxury to discerning customers. Each piece is crafted with precision and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
