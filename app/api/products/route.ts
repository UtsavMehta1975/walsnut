import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const brand = searchParams.get('brand') || ''
    const condition = searchParams.get('condition') || ''
    const gender = searchParams.get('gender') || ''
    const movement = searchParams.get('movement') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { referenceNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (brand) {
      where.brand = brand
    }

    if (condition) {
      where.condition = condition
    }

    if (gender) {
      where.gender = gender
    }

    if (movement) {
      where.movement = movement
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          category: true,
          _count: {
            select: {
              reviews: true,
              wishlistItems: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      db.product.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    // For admin panel, return all products without pagination
    if (searchParams.get('admin') === 'true') {
      const allProducts = await db.product.findMany({
        include: {
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          category: true
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(allProducts)
    }

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Generate SKU
    const sku = `${body.brand.substring(0, 3).toUpperCase()}-${body.model.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`
    
    // Create product
    const product = await db.product.create({
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
        sku: sku,
        stockQuantity: body.stockQuantity,
        isFeatured: body.isFeatured || false
      },
      include: {
        images: true,
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


