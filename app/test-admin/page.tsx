'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestAdminPage() {
  const { user, isAuthenticated, isLoading, login } = useAuth()
  const router = useRouter()
  const [testResult, setTestResult] = useState<string>('')
  const [adminCheckResult, setAdminCheckResult] = useState<string>('')

  const testAdminLogin = async () => {
    try {
      const success = await login('admin@walnut.com', 'password123')
      if (success) {
        setTestResult('Login successful!')
        // Wait a moment for state to update
        setTimeout(() => {
          console.log('User after login:', user)
          console.log('Is authenticated:', isAuthenticated)
          console.log('User role:', user?.role)
        }, 1000)
      } else {
        setTestResult('Login failed!')
      }
    } catch (error) {
      setTestResult(`Login error: ${error}`)
    }
  }

  const checkAdminInDatabase = async () => {
    try {
      const response = await fetch('/api/auth/check-admin?email=admin@walnut.com')
      const data = await response.json()
      
      if (response.ok) {
        setAdminCheckResult(JSON.stringify(data, null, 2))
        console.log('Admin check result:', data)
      } else {
        setAdminCheckResult(`Error: ${data.message}`)
      }
    } catch (error) {
      setAdminCheckResult(`Error: ${error}`)
    }
  }

  const testAdminPanelAccess = () => {
    console.log('=== TESTING ADMIN PANEL ACCESS ===')
    console.log('User:', user)
    console.log('Is authenticated:', isAuthenticated)
    console.log('User role:', user?.role)
    console.log('Role === ADMIN:', user?.role === 'ADMIN')
    
    if (isAuthenticated && user?.role?.toUpperCase() === 'ADMIN') {
      console.log('✅ Should be able to access admin panel')
      router.push('/admin')
    } else {
      console.log('❌ Cannot access admin panel')
      setTestResult('Cannot access admin panel - check console for details')
    }
  }

  const checkLocalStorage = () => {
    const savedUser = localStorage.getItem('walnut_user')
    console.log('LocalStorage user:', savedUser)
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        console.log('Parsed user:', parsed)
        console.log('Parsed role:', parsed.role)
      } catch (error) {
        console.error('Error parsing localStorage:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Admin Panel Test</h1>
        
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Current State:</h2>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User Role: {user?.role || 'None'}</p>
          <p>Role Type: {typeof user?.role}</p>
        </div>

        <div className="space-y-2 mb-4">
          <Button onClick={testAdminLogin} className="w-full">
            Test Admin Login
          </Button>
          
          <Button onClick={checkAdminInDatabase} className="w-full">
            Check Admin in Database
          </Button>
          
          <Button onClick={testAdminPanelAccess} className="w-full">
            Test Admin Panel Access
          </Button>
          
          <Button onClick={checkLocalStorage} className="w-full">
            Check LocalStorage
          </Button>
          
          <Button onClick={() => router.push('/admin')} className="w-full">
            Direct Admin Panel Access
          </Button>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Test Result:</h2>
          <p className="text-sm">{testResult}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Admin Database Check:</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {adminCheckResult}
          </pre>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">User Data:</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
