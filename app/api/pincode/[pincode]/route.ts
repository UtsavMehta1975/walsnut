import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { pincode: string } }
) {
  try {
    const pincode = params.pincode

    // Validate PIN code format
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Invalid PIN code format. Must be 6 digits.' },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching PIN code data for:', pincode)

    // Fetch from India Post API (server-side, no CORS issues)
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'WalnutStore/1.0',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 seconds
      }
    )

    if (!response.ok) {
      console.error('❌ India Post API error:', response.status, response.statusText)
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ PIN code data fetched successfully for:', pincode)

    // Return the data (same format as India Post API)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error: any) {
    console.error('❌ PIN code API error:', error)

    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch PIN code data. Please try again.' },
      { status: 500 }
    )
  }
}

