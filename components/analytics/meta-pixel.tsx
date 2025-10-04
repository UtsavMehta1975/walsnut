'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// Meta Pixel ID - Replace with your actual pixel ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || 'YOUR_PIXEL_ID_HERE'

declare global {
  interface Window {
    fbq: any
  }
}

export function MetaPixel() {
  useEffect(() => {
    // Initialize Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', META_PIXEL_ID)
      window.fbq('track', 'PageView')
    }
  }, [])

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      
      {/* Meta Pixel NoScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Utility functions for tracking events
export const trackMetaPixelEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }
}

// Predefined event tracking functions
export const trackPurchase = (value: number, currency: string = 'INR', contentIds?: string[]) => {
  trackMetaPixelEvent('Purchase', {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: 'product'
  })
}

export const trackAddToCart = (value: number, currency: string = 'INR', contentIds?: string[]) => {
  trackMetaPixelEvent('AddToCart', {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: 'product'
  })
}

export const trackViewContent = (contentIds?: string[], contentType: string = 'product') => {
  trackMetaPixelEvent('ViewContent', {
    content_ids: contentIds,
    content_type: contentType
  })
}

export const trackInitiateCheckout = (value: number, currency: string = 'INR', contentIds?: string[]) => {
  trackMetaPixelEvent('InitiateCheckout', {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: 'product'
  })
}

export const trackLead = (contentName?: string, contentCategory?: string) => {
  trackMetaPixelEvent('Lead', {
    content_name: contentName,
    content_category: contentCategory
  })
}

export const trackCompleteRegistration = (method?: string) => {
  trackMetaPixelEvent('CompleteRegistration', {
    method: method || 'email'
  })
}

export const trackSearch = (searchString: string, contentIds?: string[]) => {
  trackMetaPixelEvent('Search', {
    search_string: searchString,
    content_ids: contentIds,
    content_type: 'product'
  })
}
