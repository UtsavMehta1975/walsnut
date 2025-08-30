'use client'

import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading, login } = useAuth()
  const [email, setEmail] = useState('superadmin@walnut.com')
  const [password, setPassword] = useState('123456')
  const [loginResult, setLoginResult] = useState<string>('')

  const handleLogin = async () => {
    try {
      const success = await login(email, password)
      setLoginResult(success ? 'Login successful!' : 'Login failed!')
    } catch (error) {
      setLoginResult(`Login error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
        
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Current State:</h2>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Test Login:</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
          <p className="mt-2 text-sm">{loginResult}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Admin Check:</h2>
          <p>Is Admin: {user?.role === 'ADMIN' ? 'Yes' : 'No'}</p>
          <p>Role: {user?.role || 'None'}</p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Actions:</h2>
          <Button 
            onClick={() => window.location.href = '/admin'} 
            className="w-full mb-2"
            disabled={!isAuthenticated || user?.role !== 'ADMIN'}
          >
            Go to Admin Panel
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            className="w-full"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
