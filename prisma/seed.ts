import { PrismaClient, UserRole, Condition, Gender, Movement, AuthenticityStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.watchWishlist.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Cleared existing data')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Luxury',
        slug: 'luxury',
        description: 'Premium luxury timepieces from renowned brands'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Sport',
        slug: 'sport',
        description: 'High-performance sports watches'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Vintage',
        slug: 'vintage',
        description: 'Classic vintage timepieces with historical value'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Limited Edition',
        slug: 'limited-edition',
        description: 'Exclusive limited edition watches'
      }
    })
  ])

  console.log('📂 Created categories')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@walnut.com',
      hashedPassword,
      name: 'Admin User',
      address: '123 Admin Street, Admin City, AC 12345',
      role: UserRole.ADMIN
    }
  })

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@walnut.com',
      hashedPassword,
      name: 'John Customer',
      address: '456 Customer Ave, Customer City, CC 67890',
      role: UserRole.CUSTOMER
    }
  })

  console.log('👥 Created users')

  // Create products with detailed specifications
  const products = [
    {
      brand: 'Luxury AAA',
      model: 'Submariner',
      referenceNumber: '126610LN',
      description: 'A premium diving timepiece featuring exceptional craftsmanship and precision engineering. This stainless steel model features a black dial and bezel, making it perfect for both professional diving and everyday wear.',
      price: 9500.00,
      previousPrice: 10500.00,
      condition: 'NEW' as Condition,
      year: 2023,
      gender: 'MENS' as Gender,
      movement: 'AUTOMATIC' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Oyster Bracelet',
      waterResistance: '300m',
      diameter: '41mm',
      authenticityStatus: 'CERTIFIED' as AuthenticityStatus,
      sku: 'LUX-AAA-SUB-126610LN',
      stockQuantity: 2,
      isFeatured: true,
      categoryId: categories[0].id, // Luxury
      specifications: {
        movement: 'Caliber 3235, Automatic',
        case: 'Stainless Steel, 41mm',
        dial: 'Black with luminescent hour markers',
        bracelet: 'Stainless Steel Oyster with Glidelock clasp',
        waterResistance: '300m (1000ft)',
        powerReserve: '70 hours',
        diameter: '41mm',
        thickness: '12.5mm'
      }
    },
    {
      brand: 'Premium Elite',
      model: 'Nautilus',
      referenceNumber: '5711/1A-010',
      description: 'A sophisticated luxury sports timepiece representing the pinnacle of horological excellence and understated elegance. This stainless steel model with blue dial showcases exceptional craftsmanship.',
      price: 45000.00,
      previousPrice: 50000.00,
      condition: 'PRE_OWNED' as Condition,
      year: 2022,
      gender: 'MENS' as Gender,
      movement: 'AUTOMATIC' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Bracelet',
      waterResistance: '120m',
      diameter: '40.5mm',
      authenticityStatus: 'CERTIFIED' as AuthenticityStatus,
      sku: 'PRE-ELT-NAUT-5711-1A',
      stockQuantity: 1,
      isFeatured: true,
      categoryId: categories[0].id, // Luxury
      specifications: {
        movement: 'Caliber 26-330 S C, Automatic',
        case: 'Stainless Steel, 40.5mm',
        dial: 'Blue with horizontal embossing',
        bracelet: 'Stainless Steel with fold-over clasp',
        waterResistance: '120m',
        powerReserve: '45 hours',
        diameter: '40.5mm',
        thickness: '8.3mm'
      }
    },
    {
      brand: 'Sport Elite',
      model: 'Royal Oak',
      referenceNumber: '15500ST.OO.1220ST.01',
      description: 'A revolutionary luxury sports timepiece featuring a distinctive octagonal bezel and integrated bracelet. This blue dial version represents modern classic design at its finest.',
      price: 28000.00,
      previousPrice: 32000.00,
      condition: 'NEW' as Condition,
      year: 2023,
      gender: 'MENS' as Gender,
      movement: 'AUTOMATIC' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Bracelet',
      waterResistance: '50m',
      diameter: '41mm',
      authenticityStatus: 'VERIFIED' as AuthenticityStatus,
      sku: 'SPT-ELT-RO-15500ST',
      stockQuantity: 3,
      isFeatured: true,
      categoryId: categories[1].id, // Sport
      specifications: {
        movement: 'Caliber 4302, Automatic',
        case: 'Stainless Steel, 41mm',
        dial: 'Blue "Grande Tapisserie"',
        bracelet: 'Stainless Steel',
        waterResistance: '50m',
        powerReserve: '70 hours',
        diameter: '41mm',
        thickness: '10.4mm'
      }
    },
    {
      brand: 'Classic Vintage',
      model: 'Speedmaster Professional',
      referenceNumber: '310.30.42.50.01.001',
      description: 'A legendary chronograph representing human achievement and precision engineering at its finest. This timepiece showcases exceptional craftsmanship and heritage.',
      price: 6500.00,
      previousPrice: 7200.00,
      condition: 'NEW' as Condition,
      year: 2023,
      gender: 'MENS' as Gender,
      movement: 'MANUAL' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Bracelet',
      waterResistance: '50m',
      diameter: '42mm',
      authenticityStatus: 'CERTIFIED' as AuthenticityStatus,
      sku: 'CLS-VNT-SPEED-31030425001001',
      stockQuantity: 5,
      isFeatured: false,
      categoryId: categories[1].id, // Sport
      specifications: {
        movement: 'Caliber 1861, Manual',
        case: 'Stainless Steel, 42mm',
        dial: 'Black with luminescent hands',
        bracelet: 'Stainless Steel',
        waterResistance: '50m',
        powerReserve: '48 hours',
        diameter: '42mm',
        thickness: '13.2mm'
      }
    },
    {
      brand: 'Elegant Classic',
      model: 'Tank',
      referenceNumber: 'WSTA0040',
      description: 'An icon of Art Deco design and timeless elegance. This stainless steel model with blue hands offers perfect proportions and sophisticated style.',
      price: 3200.00,
      previousPrice: 3800.00,
      condition: 'PRE_OWNED' as Condition,
      year: 2021,
      gender: 'UNISEX' as Gender,
      movement: 'QUARTZ' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Bracelet',
      waterResistance: '30m',
      diameter: '27.4mm x 34.8mm',
      authenticityStatus: 'VERIFIED' as AuthenticityStatus,
      sku: 'ELG-CLS-TANK-WSTA0040',
      stockQuantity: 2,
      isFeatured: false,
      categoryId: categories[0].id, // Luxury
      specifications: {
        movement: 'Quartz',
        case: 'Stainless Steel, 27.4mm x 34.8mm',
        dial: 'Silver with blue hands',
        bracelet: 'Stainless Steel',
        waterResistance: '30m',
        powerReserve: 'Battery powered',
        diameter: '27.4mm x 34.8mm',
        thickness: '5.5mm'
      }
    },
    {
      brand: 'Racing Elite',
      model: 'Daytona',
      referenceNumber: '116500LN',
      description: 'The ultimate racing chronograph featuring exceptional precision and craftsmanship. This stainless steel model with black ceramic bezel is highly sought after by collectors worldwide.',
      price: 13500.00,
      previousPrice: 15000.00,
      condition: 'PRE_OWNED' as Condition,
      year: 2022,
      gender: 'MENS' as Gender,
      movement: 'AUTOMATIC' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Oyster Bracelet',
      waterResistance: '100m',
      diameter: '40mm',
      authenticityStatus: 'CERTIFIED' as AuthenticityStatus,
      sku: 'RAC-ELT-DAYTONA-116500LN',
      stockQuantity: 1,
      isFeatured: true,
      categoryId: categories[1].id, // Sport
      specifications: {
        movement: 'Caliber 4130, Automatic',
        case: 'Stainless Steel, 40mm',
        dial: 'White with black sub-dials',
        bracelet: 'Stainless Steel Oyster',
        waterResistance: '100m',
        powerReserve: '72 hours',
        diameter: '40mm',
        thickness: '12.4mm'
      }
    },
    {
      brand: 'Vacheron Constantin',
      model: 'Overseas',
      referenceNumber: '4500V/110A-B128',
      description: 'The Vacheron Constantin Overseas represents the perfect blend of luxury and sport. This blue dial version features the brand\'s signature Maltese cross bezel.',
      price: 22000.00,
      previousPrice: 25000.00,
      condition: 'NEW' as Condition,
      year: 2023,
      gender: 'MENS' as Gender,
      movement: 'AUTOMATIC' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Stainless Steel Bracelet',
      waterResistance: '150m',
      diameter: '41mm',
      authenticityStatus: 'CERTIFIED' as AuthenticityStatus,
      sku: 'VC-OVERSEAS-4500V',
      stockQuantity: 2,
      isFeatured: false,
      categoryId: categories[0].id, // Luxury
      specifications: {
        movement: 'Caliber 5100, Automatic',
        case: 'Stainless Steel, 41mm',
        dial: 'Blue with luminescent hands',
        bracelet: 'Stainless Steel',
        waterResistance: '150m',
        powerReserve: '60 hours',
        diameter: '41mm',
        thickness: '11mm'
      }
    },
    {
      brand: 'IWC',
      model: 'Pilot\'s Watch',
      referenceNumber: 'IW327001',
      description: 'The IWC Pilot\'s Watch Mark XVIII embodies the spirit of aviation with its clean, legible design and robust construction. Perfect for everyday wear.',
      price: 4200.00,
      previousPrice: 4800.00,
      condition: 'NEW' as Condition,
      year: 2023,
      gender: 'MENS' as Gender,
      movement: 'AUTOMATIC' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Black Leather Strap',
      waterResistance: '60m',
      diameter: '40mm',
      authenticityStatus: 'VERIFIED' as AuthenticityStatus,
      sku: 'IWC-PILOT-IW327001',
      stockQuantity: 4,
      isFeatured: false,
      categoryId: categories[1].id, // Sport
      specifications: {
        movement: 'Caliber 35111, Automatic',
        case: 'Stainless Steel, 40mm',
        dial: 'Black with luminescent hands',
        bracelet: 'Black leather strap',
        waterResistance: '60m',
        powerReserve: '42 hours',
        diameter: '40mm',
        thickness: '10.8mm'
      }
    },
    {
      brand: 'Jaeger-LeCoultre',
      model: 'Reverso',
      referenceNumber: '2548520',
      description: 'The Jaeger-LeCoultre Reverso is a masterpiece of Art Deco design with its reversible case. This classic model features a silver dial and manual movement.',
      price: 8500.00,
      previousPrice: 9500.00,
      condition: 'VINTAGE' as Condition,
      year: 2018,
      gender: 'MENS' as Gender,
      movement: 'MANUAL' as Movement,
      caseMaterial: 'Stainless Steel',
      bandMaterial: 'Black Leather Strap',
      waterResistance: '30m',
      diameter: '45.6mm x 27.4mm',
      authenticityStatus: 'VERIFIED' as AuthenticityStatus,
      sku: 'JLC-REVERSO-2548520',
      stockQuantity: 1,
      isFeatured: true,
      categoryId: categories[2].id, // Vintage
      specifications: {
        movement: 'Caliber 822, Manual',
        case: 'Stainless Steel, 45.6mm x 27.4mm',
        dial: 'Silver with black hands',
        bracelet: 'Black leather strap',
        waterResistance: '30m',
        powerReserve: '45 hours',
        diameter: '45.6mm x 27.4mm',
        thickness: '7.3mm'
      }
    },
    {
      brand: 'Hublot',
      model: 'Big Bang',
      referenceNumber: '301.SM.1770.RX',
      description: 'The Hublot Big Bang represents modern luxury with its bold design and innovative materials. This titanium model features a skeletonized dial.',
      price: 18000.00,
      previousPrice: 20000.00,
      condition: 'NEW' as Condition,
      year: 2023,
      gender: 'MENS' as Gender,
      movement: 'AUTOMATIC' as Movement,
      caseMaterial: 'Titanium',
      bandMaterial: 'Black Rubber Strap',
      waterResistance: '100m',
      diameter: '44mm',
      authenticityStatus: 'CERTIFIED' as AuthenticityStatus,
      sku: 'HUBLOT-BIGBANG-301SM1770RX',
      stockQuantity: 2,
      isFeatured: false,
      categoryId: categories[3].id, // Limited Edition
      specifications: {
        movement: 'HUB1242, Automatic',
        case: 'Titanium, 44mm',
        dial: 'Skeletonized with luminescent hands',
        bracelet: 'Black rubber strap',
        waterResistance: '100m',
        powerReserve: '72 hours',
        diameter: '44mm',
        thickness: '14.1mm'
      }
    }
  ]

  // Create products
  const createdProducts = []
  for (const productData of products) {
    const { specifications, ...productFields } = productData
    const product = await prisma.product.create({
      data: productFields
    })
    createdProducts.push(product)
  }

  console.log('⌚ Created products')

  // Create product images with optimized, fast-loading images
  const imageData = [
    // Rolex Submariner - Multiple images
    {
      cloudinaryPublicId: 'walnut/rolex-submariner-1',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Rolex Submariner front view',
      isPrimary: true,
      sortOrder: 0
    },
    {
      cloudinaryPublicId: 'walnut/rolex-submariner-2',
      imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Rolex Submariner side view',
      isPrimary: false,
      sortOrder: 1
    },
    {
      cloudinaryPublicId: 'walnut/rolex-submariner-3',
      imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Rolex Submariner detail view',
      isPrimary: false,
      sortOrder: 2
    },
    // Patek Philippe Nautilus
    {
      cloudinaryPublicId: 'walnut/patek-nautilus-1',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Patek Philippe Nautilus front view',
      isPrimary: true,
      sortOrder: 0
    },
    {
      cloudinaryPublicId: 'walnut/patek-nautilus-2',
      imageUrl: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Patek Philippe Nautilus side view',
      isPrimary: false,
      sortOrder: 1
    },
    // Audemars Piguet Royal Oak
    {
      cloudinaryPublicId: 'walnut/audemars-royal-oak-1',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Audemars Piguet Royal Oak front view',
      isPrimary: true,
      sortOrder: 0
    },
    {
      cloudinaryPublicId: 'walnut/audemars-royal-oak-2',
      imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Audemars Piguet Royal Oak detail view',
      isPrimary: false,
      sortOrder: 1
    },
    // Omega Speedmaster
    {
      cloudinaryPublicId: 'walnut/omega-speedmaster-1',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Omega Speedmaster Professional front view',
      isPrimary: true,
      sortOrder: 0
    },
    {
      cloudinaryPublicId: 'walnut/omega-speedmaster-2',
      imageUrl: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Omega Speedmaster Professional chronograph view',
      isPrimary: false,
      sortOrder: 1
    },
    // Cartier Tank
    {
      cloudinaryPublicId: 'walnut/cartier-tank-1',
      imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Cartier Tank front view',
      isPrimary: true,
      sortOrder: 0
    },
    // Rolex Daytona
    {
      cloudinaryPublicId: 'walnut/rolex-daytona-1',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Rolex Daytona front view',
      isPrimary: true,
      sortOrder: 0
    },
    {
      cloudinaryPublicId: 'walnut/rolex-daytona-2',
      imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      altText: 'Rolex Daytona chronograph view',
      isPrimary: false,
      sortOrder: 1
    },
    // Vacheron Constantin Overseas
    {
      cloudinaryPublicId: 'walnut/vacheron-overseas-1',
      imageUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
      altText: 'Vacheron Constantin Overseas front view',
      isPrimary: true,
      sortOrder: 0
    },
    // IWC Pilot's Watch
    {
      cloudinaryPublicId: 'walnut/iwc-pilot-1',
      imageUrl: 'https://images.pexels.com/photos/162553/pexels-photo-162553.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
      altText: 'IWC Pilot\'s Watch front view',
      isPrimary: true,
      sortOrder: 0
    },
    // Jaeger-LeCoultre Reverso
    {
      cloudinaryPublicId: 'walnut/jlc-reverso-1',
      imageUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
      altText: 'Jaeger-LeCoultre Reverso front view',
      isPrimary: true,
      sortOrder: 0
    },
    // Hublot Big Bang
    {
      cloudinaryPublicId: 'walnut/hublot-bigbang-1',
      imageUrl: 'https://images.pexels.com/photos/162553/pexels-photo-162553.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
      altText: 'Hublot Big Bang front view',
      isPrimary: true,
      sortOrder: 0
    }
  ]

  // Create images for each product with multiple images for some
  const productImageMapping = [
    // Rolex Submariner - 3 images
    [0, 1, 2],
    // Patek Philippe Nautilus - 2 images
    [3, 4],
    // Audemars Piguet Royal Oak - 2 images
    [5, 6],
    // Omega Speedmaster - 2 images
    [7, 8],
    // Cartier Tank - 1 image
    [9],
    // Rolex Daytona - 2 images
    [10, 11],
    // Vacheron Constantin Overseas - 1 image
    [12],
    // IWC Pilot's Watch - 1 image
    [13],
    // Jaeger-LeCoultre Reverso - 1 image
    [14],
    // Hublot Big Bang - 1 image
    [15]
  ]

  for (let i = 0; i < createdProducts.length; i++) {
    const product = createdProducts[i]
    const imageIndices = productImageMapping[i] || [i]
    
    for (let j = 0; j < imageIndices.length; j++) {
      const imageIndex = imageIndices[j]
      const image = imageData[imageIndex]
      
      await prisma.productImage.create({
        data: {
          productId: product.id,
          cloudinaryPublicId: image.cloudinaryPublicId,
          imageUrl: image.imageUrl,
          altText: image.altText,
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder
        }
      })
    }
  }

  console.log('🖼️ Created product images')

  // Create some sample orders
  const orders = [
    {
      userId: customerUser.id,
      totalAmount: 9500.00,
      status: 'CONFIRMED' as any,
      shippingAddress: '456 Customer Ave, Customer City, CC 67890',
      trackingNumber: 'TRK123456789',
      items: [
        {
          productId: createdProducts[0].id, // Rolex Submariner
          quantity: 1,
          priceAtTimeOfPurchase: 9500.00
        }
      ]
    },
    {
      userId: customerUser.id,
      totalAmount: 6500.00,
      status: 'SHIPPED' as any,
      shippingAddress: '456 Customer Ave, Customer City, CC 67890',
      trackingNumber: 'TRK987654321',
      items: [
        {
          productId: createdProducts[3].id, // Omega Speedmaster
          quantity: 1,
          priceAtTimeOfPurchase: 6500.00
        }
      ]
    }
  ]

  for (const orderData of orders) {
    const { items, ...orderFields } = orderData
    const order = await prisma.order.create({
      data: orderFields
    })

    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          ...item
        }
      })
    }
  }

  console.log('📦 Created sample orders')

  // Create some wishlist items
  await prisma.watchWishlist.create({
    data: {
      userId: customerUser.id,
      productId: createdProducts[1].id // Patek Philippe Nautilus
    }
  })

  await prisma.watchWishlist.create({
    data: {
      userId: customerUser.id,
      productId: createdProducts[2].id // Audemars Piguet Royal Oak
    }
  })

  console.log('❤️ Created wishlist items')

  // Create some reviews
  await prisma.review.create({
    data: {
      userId: customerUser.id,
      productId: createdProducts[0].id, // Rolex Submariner
      rating: 5,
      comment: 'Absolutely stunning watch! The quality is exceptional and it keeps perfect time. Highly recommend!'
    }
  })

  await prisma.review.create({
    data: {
      userId: customerUser.id,
      productId: createdProducts[3].id, // Omega Speedmaster
      rating: 4,
      comment: 'Great watch with amazing history. The manual winding is a nice touch and the chronograph works perfectly.'
    }
  })

  console.log('⭐ Created sample reviews')

  console.log('✅ Database seeding completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`   • ${categories.length} categories created`)
  console.log(`   • ${createdProducts.length} products created`)
  console.log(`   • 2 users created (1 admin, 1 customer)`)
  console.log(`   • ${imageData.length} product images created`)
  console.log(`   • ${orders.length} sample orders created`)
  console.log(`   • 2 wishlist items created`)
  console.log(`   • 2 reviews created`)
  console.log('')
  console.log('🔑 Test Accounts:')
  console.log('   Admin: admin@walnut.com / password123')
  console.log('   Customer: customer@walnut.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
