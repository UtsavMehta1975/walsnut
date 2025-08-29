import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

// Debounce hook for search inputs and filters
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for scroll events and frequent updates
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRun = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }
    }, delay - (Date.now() - lastRun.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return throttledValue
}

// Optimized data fetching hook with caching
export function useOptimizedFetch<T>(
  url: string,
  options?: {
    enabled?: boolean
    cacheTime?: number
    staleTime?: number
  }
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map())
  
  const { enabled = true, cacheTime = 5 * 60 * 1000, staleTime = 30 * 1000 } = options || {}

  const fetchData = useCallback(async () => {
    if (!enabled) return

    const now = Date.now()
    const cached = cacheRef.current.get(url)
    
    // Return cached data if it's still fresh
    if (cached && (now - cached.timestamp) < staleTime) {
      setData(cached.data)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      // Cache the result
      cacheRef.current.set(url, { data: result, timestamp: now })
      
      // Clean up old cache entries
      const entries = Array.from(cacheRef.current.entries())
      for (const [key, value] of entries) {
        if (now - value.timestamp > cacheTime) {
          cacheRef.current.delete(key)
        }
      }
      
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [url, enabled, cacheTime, staleTime])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [ref, setRef] = useState<Element | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(ref)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return [setRef, isIntersecting] as const
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    )
    
    return {
      start: Math.max(0, start - overscan),
      end
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end)
  }, [items, visibleRange])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.start * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}

// Memory efficient list rendering hook
export function useInfiniteScroll<T>(
  items: T[],
  pageSize: number = 20
) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const newItems = items.slice(0, page * pageSize)
    setDisplayedItems(newItems)
    setHasMore(newItems.length < items.length)
  }, [items, page, pageSize])

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1)
    }
  }, [hasMore])

  return {
    displayedItems,
    hasMore,
    loadMore
  }
}

// Optimized state management for forms
export function useOptimizedForm<T extends Record<string, any>>(
  initialState: T,
  validationSchema?: (data: T) => Record<string, string> | null
) {
  const [formData, setFormData] = useState<T>(initialState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    
    // Clear field error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [errors])

  const validate = useCallback(() => {
    if (!validationSchema) return true
    
    const validationErrors = validationSchema(formData)
    setErrors(validationErrors || {})
    
    return !validationErrors
  }, [formData, validationSchema])

  const reset = useCallback(() => {
    setFormData(initialState)
    setErrors({})
    setIsDirty(false)
  }, [initialState])

  return {
    formData,
    errors,
    isDirty,
    updateField,
    validate,
    reset,
    setFormData
  }
}
