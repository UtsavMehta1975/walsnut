import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }

    const searchTerm = query.trim().toLowerCase()

    // Search products by brand, model, reference number, and description
    const products = await db.product.findMany({
      where: {
        OR: [
          {
            brand: {
              contains: searchTerm
            }
          },
          {
            model: {
              contains: searchTerm
            }
          },
          {
            referenceNumber: {
              contains: searchTerm
            }
          },
          {
            description: {
              contains: searchTerm
            }
          }
        ]
      },
      include: {
        images: {
          where: {
            isPrimary: true
          },
          take: 1
        }
      },
      take: 10, // Limit results for dropdown
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
