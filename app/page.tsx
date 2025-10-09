'use client'

import { Navbar } from '@/components/layout/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { ShopByBrands } from '@/components/home/shop-by-brands'
import { TrendingTimepieces } from '@/components/home/trending-timepieces'
import { CategorySection } from '@/components/home/category-section'
import { BoutiqueLocator } from '@/components/home/boutique-locator'
import { SocialMediaSection } from '@/components/home/social-media-section'
import { AuthenticityBanner } from '@/components/home/authenticity-banner'
import { WatchAdvisor } from '@/components/home/watch-advisor'
import { WhyChooseWalnut } from '@/components/home/why-choose-walnut'
import { Footer } from '@/components/layout/footer'
import { MobileBottomNav } from '@/components/ui/mobile-top-nav'
import { StickyWhatsApp } from '@/components/ui/sticky-whatsapp'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <HeroSection />
        <ShopByBrands />
        <CategorySection />
        <TrendingTimepieces />
        <BoutiqueLocator />
        <SocialMediaSection />
        <AuthenticityBanner />
        <WatchAdvisor />
        <WhyChooseWalnut />
      </main>
      <MobileBottomNav activeSection="home" />
      <Footer />
    </div>
  )
}


