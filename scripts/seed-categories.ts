import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultCategories = [
  {
    name: 'For Him',
    slug: 'for-him',
    description: 'Premium watches designed for men',
    type: 'FOR_HIM' as const
  },
  {
    name: 'For Her',
    slug: 'for-her',
    description: 'Elegant watches designed for women',
    type: 'FOR_HER' as const
  },
  {
    name: 'Sale - ₹1499',
    slug: 'sale-1499',
    description: 'Premium watches at ₹1499',
    type: 'SALE_1499' as const
  },
  {
    name: 'Sale - ₹1999',
    slug: 'sale-1999',
    description: 'Premium watches at ₹1999',
    type: 'SALE_1999' as const
  },
  {
    name: 'Luxury',
    slug: 'luxury',
    description: 'High-end luxury timepieces',
    type: 'GENERAL' as const
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sporty and durable watches',
    type: 'GENERAL' as const
  },
  {
    name: 'Classic',
    slug: 'classic',
    description: 'Timeless classic designs',
    type: 'GENERAL' as const
  },
  {
    name: 'Vintage',
    slug: 'vintage',
    description: 'Vintage and retro styles',
    type: 'GENERAL' as const
  },
  {
    name: 'Smart',
    slug: 'smart',
    description: 'Smart watches and hybrids',
    type: 'GENERAL' as const
  },
  {
    name: 'Bestsellers',
    slug: 'bestsellers',
    description: 'Our most popular watches',
    type: 'GENERAL' as const
  }
]

async function seedCategories() {
  console.log('🌱 Seeding categories...')

  for (const category of defaultCategories) {
    try {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      })

      if (existing) {
        console.log(`⏭️  Category "${category.name}" already exists`)
      } else {
        await prisma.category.create({
          data: category
        })
        console.log(`✅ Created category: ${category.name}`)
      }
    } catch (error) {
      console.error(`❌ Failed to create category ${category.name}:`, error)
    }
  }

  console.log('✅ Category seeding complete!')
}

seedCategories()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


