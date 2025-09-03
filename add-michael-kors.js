require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMichaelKors() {
  try {
    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        brand: 'Michael Kors',
        model: 'Parkers'
      }
    });

    if (existingProduct) {
      console.log('Michael Kors Parkers already exists in database');
      return;
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        brand: 'Michael Kors',
        model: 'Parkers',
        referenceNumber: 'MK5774',
        description: `✅ Perfectly made for outgoing and active ladies, this Michael Kors modern and stylish watch would be a great accessory for you. ✅

✨ Michael Kors Luxury White & Gold Stylish Girls Watch Now Available & Ready to ship today 🌟

# Michael Kors Parkers
# For Her
# 5A Premium Collection
# Model - MK5774
# Dial Size 39mm
# Features follows -

COLOUR OF A GIRL WITH THE BEST OF QUALITY ❣

- Working Chronograph
- 12 & 24 Hour Analog
- Push Button reset
- Date Indicator
- Stainless Steel Case
- 3 Link Gold Metal & Ceramic Rosegold Bracelet
- Heavy Quality Machinery ❤

₹1650 + Shipping Charges

Cash On Delivery Available ☑

Basic box is free with watch.
Note : If You Want Original Brand Box Packaging, Rs 750 Extra Charges Applicable`,
        price: 1650.00,
        previousPrice: null,
        condition: 'NEW',
        year: 2024,
        gender: 'WOMENS',
        movement: 'QUARTZ',
        caseMaterial: 'Stainless Steel',
        bandMaterial: '3 Link Gold Metal & Ceramic Rosegold Bracelet',
        waterResistance: '30m',
        diameter: '39mm',
        authenticityStatus: 'VERIFIED',
        sku: `MIC-PAR-${Date.now().toString().slice(-6)}`,
        stockQuantity: 10,
        isFeatured: true
      }
    });

    console.log('✅ Michael Kors Parkers added successfully!');
    console.log('Product ID:', product.id);
    console.log('SKU:', product.sku);

    // Now add some sample images (you can replace these with actual image URLs later)
    const imageUrls = [
      'https://drive.google.com/file/d/sample1/view?usp=drive_link',
      'https://drive.google.com/file/d/sample2/view?usp=drive_link',
      'https://drive.google.com/file/d/sample3/view?usp=drive_link'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          cloudinaryPublicId: `michael-kors-parkers-${i + 1}`,
          imageUrl: imageUrls[i],
          altText: `Michael Kors Parkers Watch - Image ${i + 1}`,
          isPrimary: i === 0, // First image is primary
          sortOrder: i
        }
      });
    }

    console.log('✅ Sample images added (replace with actual image URLs later)');

  } catch (error) {
    console.error('❌ Error adding Michael Kors product:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMichaelKors();
