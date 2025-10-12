'use client'

import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function OAuthDebugPage() {
  const { data: session, status } = useSession()
  const [envCheck, setEnvCheck] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/env-check')
      const data = await response.json()
      setEnvCheck(data)
      setLoading(false)
    } catch (error) {
      console.error('Error checking environment:', error)
      setLoading(false)
    }
  }

  const testGoogleSignIn = () => {
    console.log('🔵 [DEBUG] Testing Google Sign-In...')
    console.log('🔵 [DEBUG] Current URL:', window.location.href)
    console.log('🔵 [DEBUG] Session status:', status)
    console.log('🔵 [DEBUG] Session data:', session)
    
    signIn('google', { 
      callbackUrl: '/debug-oauth',
      redirect: true 
    }).then((result) => {
      console.log('🔵 [DEBUG] SignIn result:', result)
    }).catch((error) => {
      console.error('🔴 [DEBUG] SignIn error:', error)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google OAuth Debug Console
          </h1>
          <p className="text-gray-600">
            Diagnose and test your Google OAuth integration
          </p>
        </div>

        {/* Session Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Session Status
              {status === 'authenticated' && <Badge className="bg-green-100 text-green-800">Authenticated</Badge>}
              {status === 'loading' && <Badge className="bg-blue-100 text-blue-800">Loading...</Badge>}
              {status === 'unauthenticated' && <Badge className="bg-gray-100 text-gray-800">Not Authenticated</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="font-mono">{status}</span>
              </div>
              {session?.user && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="font-mono">{session.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span className="font-mono">{session.user.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Role:</span>
                    <span className="font-mono">{session.user.role || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Has Image:</span>
                    <span className="font-mono">{session.user.image ? 'Yes' : 'No'}</span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Environment Configuration
              <Button 
                size="sm" 
                variant="outline" 
                onClick={checkEnvironment}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                <p className="text-sm text-gray-600 mt-2">Checking environment...</p>
              </div>
            ) : envCheck ? (
              <div className="space-y-3">
                {/* Google Client ID */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {envCheck.hasGoogleClientId ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">GOOGLE_CLIENT_ID</span>
                  </div>
                  <div className="text-right">
                    {envCheck.googleClientIdValid ? (
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Placeholder/Invalid</Badge>
                    )}
                  </div>
                </div>

                {/* Google Client Secret */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {envCheck.hasGoogleSecret ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">GOOGLE_CLIENT_SECRET</span>
                  </div>
                  <div className="text-right">
                    {envCheck.googleSecretValid ? (
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Placeholder/Invalid</Badge>
                    )}
                  </div>
                </div>

                {/* NextAuth URL */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {envCheck.hasNextAuthUrl ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">NEXTAUTH_URL</span>
                  </div>
                  <span className="text-sm text-gray-600 font-mono">{envCheck.nextAuthUrl}</span>
                </div>

                {/* NextAuth Secret */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {envCheck.hasNextAuthSecret ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">NEXTAUTH_SECRET</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Set</Badge>
                </div>

                {/* Database */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {envCheck.hasDatabase ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">MYSQL_URL</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-600">
                Failed to load environment check
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issues & Solutions */}
        {envCheck && (!envCheck.googleClientIdValid || !envCheck.googleSecretValid) && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertCircle className="h-5 w-5" />
                Action Required: Configure Google OAuth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Step 1: Go to Google Cloud Console</h3>
                <p className="text-amber-800">
                  Visit: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-mono">
                    https://console.cloud.google.com/
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Step 2: Create OAuth 2.0 Credentials</h3>
                <ol className="list-decimal list-inside space-y-1 text-amber-800">
                  <li>Select or create a project</li>
                  <li>Go to "APIs & Services" → "Credentials"</li>
                  <li>Click "Create Credentials" → "OAuth 2.0 Client ID"</li>
                  <li>Application type: "Web application"</li>
                  <li>Add Authorized redirect URI: <code className="bg-amber-100 px-1 rounded">http://localhost:3000/api/auth/callback/google</code></li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Step 3: Update .env.local</h3>
                <p className="text-amber-800">
                  Copy your Client ID and Client Secret to .env.local:
                </p>
                <pre className="bg-amber-100 p-3 rounded text-xs overflow-auto">
{`GOOGLE_CLIENT_ID="123456789-abc123.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz789"`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Step 4: Restart Dev Server</h3>
                <pre className="bg-amber-100 p-3 rounded text-xs">
{`npm run dev`}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Button */}
        <Card>
          <CardHeader>
            <CardTitle>Test Google Sign-In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Click the button below to test the Google OAuth flow. Check browser console for detailed logs.
            </p>
            <Button 
              onClick={testGoogleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!envCheck?.googleClientIdValid || !envCheck?.googleSecretValid}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Test Google Sign-In
            </Button>
            {(!envCheck?.googleClientIdValid || !envCheck?.googleSecretValid) && (
              <p className="text-xs text-amber-600 text-center">
                ⚠️ Configure Google OAuth credentials first
              </p>
            )}
          </CardContent>
        </Card>

        {/* Console Logs */}
        <Card>
          <CardHeader>
            <CardTitle>What to Check in Browser Console</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-gray-600">Open browser DevTools (F12) and look for these logs:</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg space-y-1 font-mono text-xs">
              <div>🚀 [NEXTAUTH] Initializing with environment</div>
              <div>🔵 [DEBUG] Testing Google Sign-In...</div>
              <div>🔵 [GOOGLE] Sign-in button clicked</div>
              <div>🟢 [SIGNIN CALLBACK] Google provider detected</div>
              <div>🟡 [JWT CALLBACK] Initial sign in detected</div>
              <div>🔵 [SESSION CALLBACK] Session populated</div>
              <div>✅ [EVENT] User signed in</div>
            </div>
            <p className="text-gray-600 mt-4">If you see errors, they'll be marked with 🔴 [ERROR]</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

