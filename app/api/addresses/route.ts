import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch all saved addresses for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const addresses = await db.savedAddress.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

// POST - Create new saved address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, houseNo, flatNo, building, street, landmark, address, city, state, zipCode, country, isDefault } = body

    // If this is set as default, unset all other defaults for this user
    if (isDefault) {
      await db.savedAddress.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    // Also update user's phone if provided
    if (phone && phone !== user.phone) {
      await db.user.update({
        where: { id: user.id },
        data: { phone }
      })
    }

    const savedAddress = await db.savedAddress.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        phone,
        houseNo: houseNo || '',
        flatNo: flatNo || null,
        building: building || null,
        street: street || address, // Use street if provided, fallback to address
        landmark: landmark || null,
        address: address || street, // Full formatted address
        city,
        state,
        zipCode,
        country: country || 'India',
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({ success: true, address: savedAddress })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}

