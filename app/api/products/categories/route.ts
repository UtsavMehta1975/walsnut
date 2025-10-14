import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// POST - Assign categories to product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, categoryIds } = body

    if (!productId || !categoryIds) {
      return NextResponse.json(
        { error: 'Product ID and category IDs are required' },
        { status: 400 }
      )
    }

    // Delete existing category assignments
    await db.productCategory.deleteMany({
      where: { productId }
    })

    // Create new category assignments
    if (categoryIds.length > 0) {
      await db.productCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({
          productId,
          categoryId
        }))
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error assigning categories:', error)
    return NextResponse.json(
      { error: 'Failed to assign categories' },
      { status: 500 }
    )
  }
}


