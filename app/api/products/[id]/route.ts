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
    console.log('🗑️ [DELETE PRODUCT API] Request received for productId:', params.id)
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      console.error('🔴 [DELETE PRODUCT API] No authorization header')
      return NextResponse.json(
        { error: 'Authorization required. Please sign in as admin.' },
        { status: 401 }
      )
    }

    const userEmail = authHeader.replace('Bearer ', '')
    console.log('🔍 [DELETE PRODUCT API] Checking admin access for:', userEmail)
    
    const user = await db.user.findUnique({
      where: { email: userEmail },
      select: { role: true, email: true }
    })

    if (!user) {
      console.error('🔴 [DELETE PRODUCT API] User not found:', userEmail)
      return NextResponse.json(
        { error: 'User not found. Please sign in again.' },
        { status: 403 }
      )
    }

    if (user.role !== 'ADMIN') {
      console.error('🔴 [DELETE PRODUCT API] User is not admin:', userEmail, 'Role:', user.role)
      return NextResponse.json(
        { error: 'Admin access required. Your role: ' + user.role },
        { status: 403 }
      )
    }

    console.log('✅ [DELETE PRODUCT API] Admin verified, checking if product exists...')
    
    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        orderItems: true,
        wishlistItems: true,
        reviews: true
      }
    })

    if (!product) {
      console.error('🔴 [DELETE PRODUCT API] Product not found:', params.id)
      return NextResponse.json(
        { error: 'Product not found. It may have already been deleted.' },
        { status: 404 }
      )
    }

    console.log('📦 [DELETE PRODUCT API] Product found:', product.brand, product.model)
    console.log('📊 [DELETE PRODUCT API] Related data:', {
      images: product.images.length,
      orderItems: product.orderItems.length,
      wishlistItems: product.wishlistItems.length,
      reviews: product.reviews.length
    })

    // Delete product (related data will cascade delete due to onDelete: Cascade in schema)
    await db.product.delete({
      where: { id: params.id }
    })

    console.log('✅ [DELETE PRODUCT API] Product deleted successfully:', params.id)
    return NextResponse.json({ 
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: {
        brand: product.brand,
        model: product.model
      }
    })
  } catch (error: any) {
    console.error('🔴 [DELETE PRODUCT API] Error:', error)
    
    // Check for specific database errors
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete product. It has related orders or references that must be removed first.' },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found or already deleted.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete product: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}