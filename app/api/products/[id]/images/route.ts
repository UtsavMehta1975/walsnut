import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sanitizeImageUrl } from '@/lib/image-utils'

// GET - Get all images for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const images = await db.productImage.findMany({
      where: { productId: params.id },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching product images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product images' },
      { status: 500 }
    )
  }
}

// POST - Add new image to product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const userEmail = authHeader.replace('Bearer ', '')
    const user = await db.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    const body = await request.json()
    const { imageUrl, altText, isPrimary, sortOrder } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Sanitize and validate the image URL
    const sanitizedImageUrl = sanitizeImageUrl(imageUrl)
    
    // If sanitization failed, return error
    if (sanitizedImageUrl === '/web-banner.png' && imageUrl !== '/web-banner.png') {
      return NextResponse.json(
        { error: 'Invalid image URL format. Please provide a valid image URL.' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(sanitizedImageUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      )
    }

    // Get current max sort order if not provided
    let newSortOrder = sortOrder
    if (newSortOrder === undefined) {
      const maxSortOrder = await db.productImage.aggregate({
        where: { productId: params.id },
        _max: { sortOrder: true }
      })
      newSortOrder = (maxSortOrder._max.sortOrder || 0) + 1
    }

    // If this is primary, unset other primary images
    if (isPrimary) {
      await db.productImage.updateMany({
        where: { productId: params.id },
        data: { isPrimary: false }
      })
    }

    // Create the image record
    const image = await db.productImage.create({
      data: {
        productId: params.id,
        cloudinaryPublicId: `walnut/${Date.now()}`,
        imageUrl: sanitizedImageUrl,
        altText: altText || '',
        isPrimary: isPrimary || false,
        sortOrder: newSortOrder
      }
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error adding product image:', error)
    return NextResponse.json(
      { error: 'Failed to add product image' },
      { status: 500 }
    )
  }
}

// PUT - Update image order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const userEmail = authHeader.replace('Bearer ', '')
    const user = await db.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    const { imageIds } = await request.json()

    if (!Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'Invalid image IDs array' },
        { status: 400 }
      )
    }

    // Update sort order for all images
    const updatePromises = imageIds.map((imageId: string, index: number) =>
      db.productImage.update({
        where: { id: imageId },
        data: { sortOrder: index }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating image order:', error)
    return NextResponse.json(
      { error: 'Failed to update image order' },
      { status: 500 }
    )
  }
}



