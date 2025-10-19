'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
// OTP sign-in temporarily disabled
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Phone } from 'lucide-react'

export default function SignInWithOTP() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-24 px-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Phone OTP sign-in is temporarily unavailable</h2>
          <p className="text-sm text-gray-600 mb-6">Please use email and password. You can create a new account if you don't have one.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/signin"><Button className="bg-black text-white hover:bg-gray-800">Sign in</Button></Link>
            <Link href="/auth/signup"><Button variant="outline">Create account</Button></Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

