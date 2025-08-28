import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE - Delete a specific image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
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



