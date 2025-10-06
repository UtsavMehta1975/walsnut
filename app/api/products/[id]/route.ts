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