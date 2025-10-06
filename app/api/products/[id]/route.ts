import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              reviews: true,
              wishlistItems: true
            }
          }
        }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Convert Decimal fields to numbers for consistent JSON serialization
    const serializedProduct = {
      ...product,
      price: Number(product.price),
      previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Update product
    const product = await db.product.update({
      where: { id: params.id },
      data: {
        brand: body.brand,
        model: body.model,
        referenceNumber: body.referenceNumber,
        description: body.description,
        price: body.price,
        previousPrice: body.previousPrice,
        condition: body.condition,
        year: body.year,
        gender: body.gender || 'MENS',
        movement: body.movement || 'AUTOMATIC',
        caseMaterial: body.specifications?.case || 'Stainless Steel',
        bandMaterial: body.specifications?.bracelet || 'Stainless Steel',
        waterResistance: body.specifications?.waterResistance || '50m',
        diameter: body.specifications?.diameter || '40mm',
        authenticityStatus: body.authenticity?.guaranteed ? 'VERIFIED' : 'PENDING',
        stockQuantity: body.stockQuantity,
        isFeatured: body.isFeatured || false
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    // Convert Decimal fields to numbers for consistent JSON serialization
    const serializedProduct = {
      ...product,
      price: Number(product.price),
      previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete product (images will be deleted automatically due to cascade)
    await db.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



