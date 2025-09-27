import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@walnut.com' },
    update: {},
    create: {
      email: 'admin@walnut.com',
      hashedPassword: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create normal user
  const userPassword = await bcrypt.hash('user123', 10)
  const normalUser = await prisma.user.upsert({
    where: { email: 'user@walnut.com' },
    update: {},
    create: {
      email: 'user@walnut.com',
      hashedPassword: userPassword,
      name: 'Normal User',
      role: 'CUSTOMER',
    },
  })

  // Create some sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'watches' },
      update: {},
      create: {
        name: 'Watches',
        slug: 'watches',
        description: 'Luxury timepieces',
        type: 'GENERAL',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'for-him' },
      update: {},
      create: {
        name: 'For Him',
        slug: 'for-him',
        description: 'Men\'s watches',
        type: 'FOR_HIM',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'for-her' },
      update: {},
      create: {
        name: 'For Her',
        slug: 'for-her',
        description: 'Women\'s watches',
        type: 'FOR_HER',
      },
    }),
  ])

  // Create a sample product
  const sampleProduct = await prisma.product.upsert({
    where: { sku: 'ROLEX-SUB-HULK-001' },
    update: {},
    create: {
      brand: 'Rolex',
      model: 'Submariner',
      referenceNumber: '116610LV',
      description: 'Iconic Rolex Submariner with green dial and bezel. Known as the "Hulk" due to its distinctive green color scheme.',
      price: 15000,
      previousPrice: 18000,
      condition: 'PRE_OWNED',
      year: 2020,
      gender: 'MENS',
      movement: 'AUTOMATIC',
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Oyster Bracelet',
      waterResistance: '300m',
      diameter: '40mm',
      authenticityStatus: 'VERIFIED',
      sku: 'ROLEX-SUB-HULK-001',
      stockQuantity: 5,
      isFeatured: true,
    },
  })

  // Create product images
  await prisma.productImage.createMany({
    data: [
      {
        productId: sampleProduct.id,
        cloudinaryPublicId: 'rolex-submariner-hulk-1',
        imageUrl: '/product/rolex-submariner-hulk-1.jpg',
        altText: 'Rolex Submariner Hulk front view',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        productId: sampleProduct.id,
        cloudinaryPublicId: 'rolex-submariner-hulk-2',
        imageUrl: '/product/rolex-submariner-hulk-2.jpg',
        altText: 'Rolex Submariner Hulk side view',
        isPrimary: false,
        sortOrder: 2,
      },
      {
        productId: sampleProduct.id,
        cloudinaryPublicId: 'rolex-submariner-hulk-3',
        imageUrl: '/product/rolex-submariner-hulk-3.jpg',
        altText: 'Rolex Submariner Hulk movement',
        isPrimary: false,
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  })

  // Connect product to categories
  await prisma.productCategory.createMany({
    data: [
      { productId: sampleProduct.id, categoryId: categories[0].id },
      { productId: sampleProduct.id, categoryId: categories[1].id },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Test Users Created:')
  console.log(`   Admin: admin@walnut.com / admin123`)
  console.log(`   User:  user@walnut.com / user123`)
  console.log('')
  console.log('📦 Sample Data Created:')
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Products: 1`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
