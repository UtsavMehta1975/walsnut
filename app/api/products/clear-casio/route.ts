import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Clear only Casio products
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

    // Clear only Casio products and their related data
    const casioProducts = await db.product.findMany({
      where: { brand: 'CASIO' },
      select: { id: true }
    })

    if (casioProducts.length === 0) {
      return NextResponse.json({
        message: 'No Casio products found to delete',
        deletedCount: 0
      })
    }

    // Delete related data for Casio products
    const productIds = casioProducts.map(p => p.id)
    
    await db.review.deleteMany({
      where: { productId: { in: productIds } }
    })
    
    await db.watchWishlist.deleteMany({
      where: { productId: { in: productIds } }
    })
    
    await db.orderItem.deleteMany({
      where: { productId: { in: productIds } }
    })
    
    await db.productImage.deleteMany({
      where: { productId: { in: productIds } }
    })
    
    // Delete Casio products
    const deletedProducts = await db.product.deleteMany({
      where: { brand: 'CASIO' }
    })
    
    return NextResponse.json({
      message: 'Casio products cleared successfully',
      deletedCount: deletedProducts.count
    })
    
  } catch (error) {
    console.error('Clear Casio products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
