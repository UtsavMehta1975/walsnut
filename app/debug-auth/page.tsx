'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useAuth } from '@/contexts/auth-context'

export default function DebugAuthPage() {
  const { data: session, status } = useSession()
  const { user, isAuthenticated, login } = useAuth()
  const [testResult, setTestResult] = useState<string>('')

  const testLogin = async () => {
    try {
      const result = await login('admin@walnut.com', 'admin123')
      setTestResult(`Login result: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setTestResult(`Login error: ${error}`)
    }
  }

  const testNextAuthSignIn = async () => {
    try {
      const result = await signIn('credentials', {
        email: 'admin@walnut.com',
        password: 'admin123',
        redirect: false
      })
      setTestResult(`NextAuth signIn result: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setTestResult(`NextAuth signIn error: ${error}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">NextAuth Session Status:</h2>
          <p>Status: {status}</p>
          <p>Session: {JSON.stringify(session, null, 2)}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Auth Context:</h2>
          <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {JSON.stringify(user, null, 2)}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Test Results:</h2>
          <p>{testResult}</p>
        </div>

        <div className="space-x-4">
          <button 
            onClick={testLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Custom Login
          </button>
          
          <button 
            onClick={testNextAuthSignIn}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test NextAuth SignIn
          </button>
          
          <button 
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}