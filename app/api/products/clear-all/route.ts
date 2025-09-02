import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    // Check authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const email = authHeader.replace('Bearer ', '')
    
    // Verify admin user
    const adminUser = await db.user.findFirst({
      where: {
        email: email,
        role: 'ADMIN'
      }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Clear all related data first
    await db.review.deleteMany()
    await db.watchWishlist.deleteMany()
    await db.orderItem.deleteMany()
    await db.productImage.deleteMany()
    
    // Clear all products
    const deletedProducts = await db.product.deleteMany()
    
    return NextResponse.json({
      message: 'All products cleared successfully',
      deletedCount: deletedProducts.count
    })
    
  } catch (error) {
    console.error('Clear all products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
