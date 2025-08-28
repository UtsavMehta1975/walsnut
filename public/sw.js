const CACHE_NAME = 'walnut-cache-v1'
const STATIC_CACHE = 'walnut-static-v1'
const API_CACHE = 'walnut-api-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }
})

// Handle API requests with caching
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request)
    
    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({ error: 'Offline - Please check your connection' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle static assets
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html')
    }
    
    throw error
  }
}

// Handle navigation requests
async function handleNavigation(request) {
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    return caches.match('/offline.html')
  }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif',
    '.woff', '.woff2', '.ttf', '.eot', '.ico'
  ]
  
  return staticExtensions.some(ext => pathname.endsWith(ext))
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Implement background sync logic here
  // For example, retry failed API calls
  console.log('Background sync triggered')
}
