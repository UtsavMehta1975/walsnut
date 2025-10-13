'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'

export default function AuthDebugPage() {
  const { data: session, status } = useSession()
  const [envCheck, setEnvCheck] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/auth/debug-env')
        const data = await response.json()
        setEnvCheck(data)
      } catch (error) {
        console.error('Error checking environment:', error)
        setEnvCheck({ error: 'Failed to check environment' })
      } finally {
        setIsLoading(false)
      }
    }
    checkEnv()
  }, [])

  const testGoogleLogin = async () => {
    console.log('🧪 [DEBUG] Testing Google login...')
    try {
      const result = await signIn('google', { 
        callbackUrl: '/auth/debug',
        redirect: false
      })
      console.log('🧪 [DEBUG] Google login result:', result)
      alert(`Result: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      console.error('🧪 [DEBUG] Google login error:', error)
      alert(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">🔍 Authentication Debug</h1>
          
          {/* Session Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Session Status</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="mb-2"><strong>Status:</strong> <span className={status === 'authenticated' ? 'text-green-600' : 'text-red-600'}>{status}</span></p>
              {session ? (
                <div>
                  <p className="mb-2"><strong>Email:</strong> {session.user?.email}</p>
                  <p className="mb-2"><strong>Name:</strong> {session.user?.name}</p>
                  <p className="mb-2"><strong>Role:</strong> {session.user?.role}</p>
                  <p className="mb-2"><strong>ID:</strong> {session.user?.id}</p>
                  <p className="mb-2"><strong>Image:</strong> {session.user?.image || 'N/A'}</p>
                </div>
              ) : (
                <p className="text-gray-600">No session found</p>
              )}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : envCheck ? (
              <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                {Object.entries(envCheck).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={value ? '✅' : '❌'}></span>
                    <strong>{key}:</strong> 
                    <span className={typeof value === 'boolean' ? (value ? 'text-green-600' : 'text-red-600') : 'text-gray-700'}>
                      {typeof value === 'boolean' ? (value ? 'Configured' : 'Missing') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-600">Failed to load environment status</p>
            )}
          </div>

          {/* OAuth URLs */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">OAuth Configuration</h2>
            <div className="bg-gray-100 rounded-lg p-4 space-y-3">
              <div>
                <p className="font-medium mb-1">Current URL:</p>
                <code className="text-sm bg-white px-2 py-1 rounded block overflow-x-auto">
                  {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
                </code>
              </div>
              <div>
                <p className="font-medium mb-1">Expected Callback URL:</p>
                <code className="text-sm bg-white px-2 py-1 rounded block overflow-x-auto">
                  {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : 'N/A'}
                </code>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-2">⚠️ Google Cloud Console Setup:</p>
                <ol className="text-sm text-yellow-700 space-y-1 ml-4 list-decimal">
                  <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                  <li>Click on your OAuth 2.0 Client ID</li>
                  <li>Add the "Expected Callback URL" above to "Authorized redirect URIs"</li>
                  <li>Also add these if testing locally:
                    <ul className="ml-4 mt-1 list-disc">
                      <li><code className="bg-white px-1">http://localhost:3000/api/auth/callback/google</code></li>
                      <li><code className="bg-white px-1">https://www.thewalnutstore.com/api/auth/callback/google</code></li>
                      <li><code className="bg-white px-1">https://thewalnutstore.com/api/auth/callback/google</code></li>
                    </ul>
                  </li>
                  <li>Click SAVE and wait 1-2 minutes for changes to propagate</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Google Login</h2>
            <Button onClick={testGoogleLogin} className="w-full">
              🧪 Test Google OAuth Flow
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Opens the Google login popup and logs the result to the browser console (F12 → Console)
            </p>
          </div>

          {/* Troubleshooting */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium text-red-800 mb-1">❌ "redirect_uri_mismatch" error</p>
                <p className="text-red-700">The callback URL is not registered in Google Cloud Console. Add it using the instructions above.</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium text-red-800 mb-1">❌ Loading forever / stays on same page</p>
                <p className="text-red-700">Check browser console (F12) for errors. Usually a redirect URI issue or NEXTAUTH_URL mismatch.</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium text-red-800 mb-1">❌ "Configuration error"</p>
                <p className="text-red-700">GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing or invalid. Check Vercel environment variables.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

