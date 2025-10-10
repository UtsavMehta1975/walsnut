import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching product with ID:', params.id)
    
    // Test database connection first
    try {
      await db.$connect()
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', productId: params.id },
        { status: 503 }
      )
    }
    
    // Simple product query without complex includes
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    console.log('Product found:', product ? 'Yes' : 'No')

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Convert Decimal fields to numbers
    const serializedProduct = {
      ...product,
      price: Number(product.price),
      previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        productId: params.id
      },
      { status: 500 }
    )
  }
}

// PUT - Update product
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

    const body = await request.json()
    const {
      brand,
      model,
      referenceNumber,
      price,
      previousPrice,
      condition,
      year,
      gender,
      description,
      stockQuantity,
      specifications,
      authenticity
    } = body

    const updatedProduct = await db.product.update({
      where: { id: params.id },
      data: {
        brand,
        model,
        referenceNumber,
        price,
        previousPrice,
        condition,
        year,
        gender,
        description,
        stockQuantity,
        caseMaterial: specifications?.case || '',
        bandMaterial: specifications?.bracelet || '',
        movement: specifications?.movement || 'QUARTZ',
        waterResistance: specifications?.waterResistance || 'N/A',
        diameter: specifications?.diameter || 'N/A'
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    // Convert Decimal fields to numbers
    const serializedProduct = {
      ...updatedProduct,
      price: Number(updatedProduct.price),
      previousPrice: updatedProduct.previousPrice ? Number(updatedProduct.previousPrice) : null,
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
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

    // Delete product (images will cascade delete)
    await db.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}