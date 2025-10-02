import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.MYSQL_URL) {
      // Return mock data if database is not configured
      return NextResponse.json({
        data: [
          { id: 'premium-watches', name: 'Premium Watches', productCount: 0 },
          { id: 'signature-eyewear', name: 'Signature Eyewear', productCount: 0 },
          { id: 'elite-speakers', name: 'Elite Speakers', productCount: 0 },
          { id: 'true-wireless-earbuds', name: 'True Wireless Earbuds', productCount: 0 }
        ]
      })
    }

    // Get all categories from the database
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Also add the virtual categories that are handled in the products API
    const virtualCategories = [
      {
        id: 'sale',
        name: 'Sale',
        slug: 'sale',
        type: 'SALE',
        productCount: await db.product.count({
          where: {
            previousPrice: { not: null }
          }
        })
      },
      {
        id: 'sale-1499',
        name: 'Under ₹1,499',
        slug: 'sale-1499',
        type: 'SALE_1499',
        productCount: await db.product.count({
          where: {
            previousPrice: { not: null },
            price: { lte: 1499 }
          }
        })
      },
      {
        id: 'sale-1999',
        name: 'Under ₹1,999',
        slug: 'sale-1999',
        type: 'SALE_1999',
        productCount: await db.product.count({
          where: {
            previousPrice: { not: null },
            price: { lte: 1999 }
          }
        })
      },
      {
        id: 'new-arrivals',
        name: 'New Arrivals',
        slug: 'new-arrivals',
        type: 'GENERAL',
        productCount: await db.product.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        })
      }
    ]

    // Get gender-based category counts
    const mensCount = await db.product.count({
      where: { gender: 'MENS' }
    })
    
    const womensCount = await db.product.count({
      where: { gender: 'WOMENS' }
    })

    // Add gender-based categories
    const genderCategories = [
      {
        id: 'for-him',
        name: 'For Him',
        slug: 'for-him',
        type: 'FOR_HIM',
        productCount: mensCount
      },
      {
        id: 'for-her',
        name: 'For Her',
        slug: 'for-her',
        type: 'FOR_HER',
        productCount: womensCount
      }
    ]

    // Combine all categories
    const allCategories = [
      ...genderCategories,
      ...virtualCategories,
      ...categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        type: cat.type,
        productCount: cat._count.products
      }))
    ]

    // Filter out categories with no products
    const categoriesWithProducts = allCategories.filter(cat => cat.productCount > 0)

    return NextResponse.json({
      success: true,
      data: categoriesWithProducts
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

