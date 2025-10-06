import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      return NextResponse.json({
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0
        },
        message: 'Database not configured'
      })
    }

    // Test database connection first
    try {
      await db.$connect()
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json({
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0
        },
        message: 'Database connection failed'
      })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const brand = searchParams.get('brand') || ''
    const condition = searchParams.get('condition') || ''
    const gender = searchParams.get('gender') || ''
    const movement = searchParams.get('movement') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const sortByParam = searchParams.get('sortBy') || 'createdAt'
    const sortOrderParam = searchParams.get('sortOrder') || 'desc'
    
    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['createdAt', 'price', 'brand', 'model', 'updatedAt']
    const sortBy = allowedSortFields.includes(sortByParam) ? sortByParam : 'createdAt'
    
    // Validate sortOrder
    const sortOrder = sortOrderParam === 'asc' ? 'asc' : 'desc'
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

    // Category filtering implementation
    if (category === 'for-him') {
      where.gender = 'MENS'
    } else if (category === 'for-her') {
      where.gender = 'WOMENS'
    } else if (category === 'sale' || category === 'sale-1499' || category === 'sale-1999') {
      // Filter products that have a previousPrice (indicating they're on sale)
      where.previousPrice = { not: null }
      
      // For specific sale price ranges
      if (category === 'sale-1499') {
        where.price = { lte: 1499 }
      } else if (category === 'sale-1999') {
        where.price = { lte: 1999 }
      }
    } else if (category === 'new-arrivals') {
      // Filter for recently added products (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      where.createdAt = { gte: thirtyDaysAgo }
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

      const allProducts = await db.product.findMany({
        include: {
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      // Convert Decimal fields to numbers
      const serializedAllProducts = allProducts.map(product => ({
        ...product,
        price: Number(product.price),
        previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
      }))
      
      return NextResponse.json(serializedAllProducts)
    }

    // Convert Decimal fields to numbers for consistent JSON serialization
    const serializedProducts = products.map(product => ({
      ...product,
      price: Number(product.price),
      previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
    }))

    const response = NextResponse.json({
      data: serializedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  } catch (error: any) {
    console.error('Products API error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization header (temporary solution)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Extract user email from authorization header
    const userEmail = authHeader.replace('Bearer ', '')
    
    // Verify user is admin
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
    
    // Validate enum fields
    const validConditions = ['NEW', 'PRE_OWNED', 'VINTAGE']
    const validGenders = ['MENS', 'WOMENS', 'UNISEX']
    const validMovements = ['AUTOMATIC', 'MANUAL', 'QUARTZ']
    
    if (body.condition && !validConditions.includes(body.condition)) {
      return NextResponse.json(
        { error: 'Invalid condition value' },
        { status: 400 }
      )
    }
    
    if (body.gender && !validGenders.includes(body.gender)) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      )
    }
    
    if (body.movement && !validMovements.includes(body.movement)) {
      return NextResponse.json(
        { error: 'Invalid movement value' },
        { status: 400 }
      )
    }
    
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
        images: true
      }
    })

    // Convert Decimal fields to numbers
    const serializedProduct = {
      ...product,
      price: Number(product.price),
      previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
    }

    return NextResponse.json(serializedProduct)
  } catch (error: any) {
    console.error('Create product error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}


