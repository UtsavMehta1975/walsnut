import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Get a specific image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const image = await db.productImage.findFirst({
      where: {
        id: params.imageId,
        productId: params.id
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error fetching product image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product image' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
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
    // Check if image exists and belongs to the product
    const image = await db.productImage.findFirst({
      where: {
        id: params.imageId,
        productId: params.id
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete the image
    await db.productImage.delete({
      where: { id: params.imageId }
    })

    // Reorder remaining images
    const remainingImages = await db.productImage.findMany({
      where: { productId: params.id },
      orderBy: { sortOrder: 'asc' }
    })

    // Update sort order for remaining images
    const updatePromises = remainingImages.map((img, index) =>
      db.productImage.update({
        where: { id: img.id },
        data: { sortOrder: index }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product image:', error)
    return NextResponse.json(
      { error: 'Failed to delete product image' },
      { status: 500 }
    )
  }
}

// PATCH - Update image properties (primary status, alt text, sort order)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
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
    const { isPrimary, altText, sortOrder } = await request.json()

    // If setting as primary, unset other primary images
    if (isPrimary) {
      await db.productImage.updateMany({
        where: { productId: params.id },
        data: { isPrimary: false }
      })
    }

    // Update the image
    const updatedImage = await db.productImage.update({
      where: { id: params.imageId },
      data: {
        isPrimary: isPrimary !== undefined ? isPrimary : undefined,
        altText: altText !== undefined ? altText : undefined,
        sortOrder: sortOrder !== undefined ? sortOrder : undefined
      }
    })

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error('Error updating product image:', error)
    return NextResponse.json(
      { error: 'Failed to update product image' },
      { status: 500 }
    )
  }
}



