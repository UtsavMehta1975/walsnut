import { NextRequest, NextResponse } from 'next/server'

// Instagram Basic Display API configuration
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID

interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
  thumbnail_url?: string
}

export async function GET(request: NextRequest) {
  try {
    // Check if Instagram credentials are configured
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      // Return mock data when credentials are not configured
      const mockPosts: InstagramPost[] = [
        {
          id: 'mock1',
          media_type: 'IMAGE',
          media_url: '/product/rolex-submariner-hulk-1.jpg',
          permalink: 'https://instagram.com/thewalnutstore.in',
          caption: 'Discover our latest collection of premium timepieces. This Rolex Submariner Hulk is a true masterpiece of horology.',
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 'mock2',
          media_type: 'IMAGE',
          media_url: '/product/rolex-submariner-hulk-2.jpg',
          permalink: 'https://instagram.com/thewalnutstore.in',
          caption: 'Timeless elegance meets modern craftsmanship. Every watch tells a story of precision and luxury.',
          timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          id: 'mock3',
          media_type: 'IMAGE',
          media_url: '/product/rolex-submariner-hulk-3.jpg',
          permalink: 'https://instagram.com/thewalnutstore.in',
          caption: 'Spotted with Walnut - Customer showcase. Our clients love sharing their timepiece moments with us.',
          timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        },
        {
          id: 'mock4',
          media_type: 'IMAGE',
          media_url: '/product/rolex-submariner-hulk-4.jpg',
          permalink: 'https://instagram.com/thewalnutstore.in',
          caption: 'Behind the scenes of our watchmaking process. Every detail matters in creating perfection.',
          timestamp: new Date(Date.now() - 345600000).toISOString() // 4 days ago
        },
        {
          id: 'mock5',
          media_type: 'IMAGE',
          media_url: '/web-banner.png',
          permalink: 'https://instagram.com/thewalnutstore.in',
          caption: 'New arrivals in our boutique. Fresh collection of luxury timepieces just arrived.',
          timestamp: new Date(Date.now() - 432000000).toISOString() // 5 days ago
        },
        {
          id: 'mock6',
          media_type: 'IMAGE',
          media_url: '/mobile-banner.png',
          permalink: 'https://instagram.com/thewalnutstore.in',
          caption: 'Customer stories and testimonials. Hear what our clients say about their Walnut experience.',
          timestamp: new Date(Date.now() - 518400000).toISOString() // 6 days ago
        }
      ]
      
      return NextResponse.json({
        success: false,
        message: 'Instagram integration not configured - showing demo content',
        posts: mockPosts
      })
    }

    // Fetch Instagram posts using Basic Display API
    const response = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=12`
    )

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to our format
    const posts: InstagramPost[] = data.data?.map((post: any) => ({
      id: post.id,
      media_type: post.media_type,
      media_url: post.media_url,
      permalink: post.permalink,
      caption: post.caption || '',
      timestamp: post.timestamp,
      thumbnail_url: post.thumbnail_url
    })) || []

    return NextResponse.json({
      success: true,
      posts: posts.slice(0, 6) // Limit to 6 posts for the grid
    })

  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    
    // Return mock data for development/fallback
    const mockPosts: InstagramPost[] = [
      {
        id: 'mock1',
        media_type: 'IMAGE',
        media_url: '/product/rolex-submariner-hulk-1.jpg',
        permalink: 'https://instagram.com/thewalnutstore.in',
        caption: 'Discover our latest collection of premium timepieces. This Rolex Submariner Hulk is a true masterpiece of horology.',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 'mock2',
        media_type: 'IMAGE',
        media_url: '/product/rolex-submariner-hulk-2.jpg',
        permalink: 'https://instagram.com/thewalnutstore.in',
        caption: 'Timeless elegance meets modern craftsmanship. Every watch tells a story of precision and luxury.',
        timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: 'mock3',
        media_type: 'IMAGE',
        media_url: '/product/rolex-submariner-hulk-3.jpg',
        permalink: 'https://instagram.com/thewalnutstore.in',
        caption: 'Spotted with Walnut - Customer showcase. Our clients love sharing their timepiece moments with us.',
        timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      },
      {
        id: 'mock4',
        media_type: 'IMAGE',
        media_url: '/product/rolex-submariner-hulk-4.jpg',
        permalink: 'https://instagram.com/thewalnutstore.in',
        caption: 'Behind the scenes of our watchmaking process. Every detail matters in creating perfection.',
        timestamp: new Date(Date.now() - 345600000).toISOString() // 4 days ago
      },
      {
        id: 'mock5',
        media_type: 'IMAGE',
        media_url: '/web-banner.png',
        permalink: 'https://instagram.com/thewalnutstore.in',
        caption: 'New arrivals in our boutique. Fresh collection of luxury timepieces just arrived.',
        timestamp: new Date(Date.now() - 432000000).toISOString() // 5 days ago
      },
      {
        id: 'mock6',
        media_type: 'IMAGE',
        media_url: '/mobile-banner.png',
        permalink: 'https://instagram.com/thewalnutstore.in',
        caption: 'Customer stories and testimonials. Hear what our clients say about their Walnut experience.',
        timestamp: new Date(Date.now() - 518400000).toISOString() // 6 days ago
      }
    ]

    return NextResponse.json({
      success: false,
      message: 'Using fallback data',
      posts: mockPosts
    })
  }
}
