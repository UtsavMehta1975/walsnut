require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        brand: true,
        model: true,
        sku: true
      }
    });
    
    console.log('Existing products:');
    products.forEach(p => console.log(`- ${p.brand} ${p.model} (SKU: ${p.sku})`));
    console.log(`\nTotal products: ${products.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();

