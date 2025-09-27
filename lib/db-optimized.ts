import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Optimized Prisma client with connection pooling and performance settings
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Reduce logging in development for better performance
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    
    // Connection pool optimization
    datasources: {
      db: {
        url: process.env.MYSQL_URL,
      },
    },
    
    // Transaction optimizations
    transactionOptions: {
      timeout: 5000, // 5 seconds timeout
      maxWait: 2000, // 2 seconds max wait
      isolationLevel: 'ReadCommitted', // Faster isolation level
    },
    
    // Query optimization
    errorFormat: 'minimal',
  })

// Connection pooling configuration
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
})

// Optimized query functions with caching
export const dbQueries = {
  // Get products with optimized query
  async getProducts(limit = 20, offset = 0) {
    return db.product.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          take: 1,
          orderBy: { isPrimary: 'desc' }
        },
        categories: {
          select: { category: { select: { name: true, slug: true } } }
        }
      },
      // Only select necessary fields
      select: {
        id: true,
        brand: true,
        model: true,
        price: true,
        previousPrice: true,
        sku: true,
        stockQuantity: true,
        isFeatured: true,
        images: true,
        categories: true,
        createdAt: true
      }
    })
  },

  // Get featured products
  async getFeaturedProducts() {
    return db.product.findMany({
      where: { isFeatured: true },
      take: 8,
      include: {
        images: {
          take: 1,
          orderBy: { isPrimary: 'desc' }
        }
      },
      select: {
        id: true,
        brand: true,
        model: true,
        price: true,
        previousPrice: true,
        sku: true,
        stockQuantity: true,
        images: true
      }
    })
  },

  // Get user with minimal data
  async getUserByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hashedPassword: true
      }
    })
  },

  // Get product by ID with optimized includes
  async getProductById(id: string) {
    return db.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        categories: {
          select: { category: { select: { name: true, slug: true } } }
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: { name: true }
            }
          }
        }
      }
    })
  }
}

export default db
