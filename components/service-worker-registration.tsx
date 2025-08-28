'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })

      // Handle updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated')
        // Optionally reload the page to use the new service worker
        // window.location.reload()
      })
    }
  }, [])

  return null
}
