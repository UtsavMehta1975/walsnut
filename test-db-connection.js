const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful:', result)
    
    // Test product count
    const productCount = await prisma.product.count()
    console.log('✅ Product count:', productCount)
    
    // Test user count
    const userCount = await prisma.user.count()
    console.log('✅ User count:', userCount)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
