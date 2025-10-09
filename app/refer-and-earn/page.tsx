'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { MobileBottomNav } from '@/components/ui/mobile-top-nav'
import { Gift, Share2, Users, IndianRupee, Clock, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReferAndEarnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-12">
        {/* Coming Soon Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-6">
            <Clock className="w-4 h-4" />
            <span className="font-semibold text-sm">Coming Soon</span>
          </div>
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gift className="w-16 h-16 text-yellow-600" />
              <Sparkles className="w-12 h-12 text-green-600 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Refer & Earn
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share the luxury of premium timepieces with your friends and earn exclusive rewards!
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Share Your Code</h3>
              <p className="text-sm text-gray-600">
                Share your unique referral code with friends and family
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">They Shop</h3>
              <p className="text-sm text-gray-600">
                Your friend makes their first purchase using your code
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">You Both Earn</h3>
              <p className="text-sm text-gray-600">
                Get rewards for every successful referral
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Info */}
        <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-50">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-yellow-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Launching Soon!
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We're working hard to bring you an exciting referral program where you can earn rewards 
              by sharing Walnut Store with your friends and family.
            </p>
            
            {/* Expected Features */}
            <div className="bg-white rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-bold text-gray-900 mb-4 text-center">What to Expect:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Unique Referral Code</p>
                    <p className="text-sm text-gray-600">Get your personal code to share</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Instant Rewards</p>
                    <p className="text-sm text-gray-600">Earn cash or discounts for each referral</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Friend Benefits</p>
                    <p className="text-sm text-gray-600">Your friends get special discounts too</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Track Your Earnings</p>
                    <p className="text-sm text-gray-600">Dashboard to monitor all your referrals</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Easy Sharing</p>
                    <p className="text-sm text-gray-600">Share via WhatsApp, SMS, or social media</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notify Me Button */}
            <Button
              onClick={() => {
                window.location.href = '/contact?subject=Refer+and+Earn+Interest'
              }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Gift className="w-5 h-5 mr-2" />
              Notify Me When It Launches
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Be the first to know when our referral program goes live!
            </p>
          </CardContent>
        </Card>

        {/* Placeholder Preview */}
        <div className="mt-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-green-200 opacity-20 blur-3xl rounded-full"></div>
          <Card className="relative border-2 border-gray-200 bg-white/80 backdrop-blur">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Preview: How It Will Work
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Get Your Code</h4>
                    <p className="text-sm text-gray-600">
                      Log in to your account and find your unique referral code in the dashboard
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Share with Friends</h4>
                    <p className="text-sm text-gray-600">
                      Send your code via WhatsApp, SMS, or social media - they get a discount!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Earn Rewards</h4>
                    <p className="text-sm text-gray-600">
                      When they purchase, you both earn! Use rewards on your next purchase
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stay Connected */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about our upcoming referral program?
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/contact'}
            className="border-2 border-gray-300 hover:bg-gray-50"
          >
            Contact Us
          </Button>
        </div>
      </div>
      
      <MobileBottomNav />
      <Footer />
    </div>
  )
}

