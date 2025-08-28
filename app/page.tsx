import { Navbar } from '@/components/layout/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { BrandShowcase } from '@/components/home/brand-showcase'
import { AuthenticityBanner } from '@/components/home/authenticity-banner'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <AuthenticityBanner />
        <FeaturedProducts />
        <BrandShowcase />
      </main>
      <Footer />
    </div>
  )
}


