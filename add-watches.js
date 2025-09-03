require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const watches = [
  {
    brand: 'Tissot',
    model: 'Gentleman Powermatic 80',
    referenceNumber: 'T1274071104101',
    price: 3299,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Stainless Steel 3 Pink bracelet with Butterfly Clasp',
    waterResistance: 'Not specified',
    diameter: '41mm',
    description: `✅ The Tissot Gentleman Powermatic 80 is ergonomic and elegant in any circumstance. It is suitable for business environment & where conventional dress codes apply. ✅

HERITAGE BEAUTY IN WATCHMAKING ❣

The Tissot Gentleman Powermatic 80 represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Gentleman design with a stunning open heart face that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the 3-hand watch with pendulum rotating dial to the stainless steel 3 pink bracelet. The buckle type butterfly clasp showcases Tissot's commitment to precision engineering, while the back open transparent looking machinery provides a fascinating view of the automatic movement.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The 100% premium & reliable automatic Japanese movement machinery provides exceptional timekeeping, while the 41mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tissot Gentleman Powermatic 80 offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 5,
    sku: 'TISSOT-GENTLEMAN-80-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },
  {
    brand: 'Rolex',
    model: 'Submariner SMURF',
    referenceNumber: '5A Premium Collection',
    price: 2299,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'QUARTZ',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Stainless steel silver luxury bracelet',
    waterResistance: 'Not specified',
    diameter: '43mm',
    description: `ROLEX Submariner SMURF💙

✅ Designed to meet the demands of professional racing drivers embodies the historic and privileged bonds between Rolex and motor sport. ✅

🌟 Rolex Submariner meticulously designed watch with silver bracelet now available & Ready to ship today 🌟

The ROLEX Submariner SMURF represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Submariner design with a stunning blue dial that captures the essence of premium racing heritage.

Every detail has been meticulously crafted to perfection - from the battery operated 12-hour analog with date chronograph to the stainless steel silver luxury bracelet. The luxurious blue dial with rotating bezel showcases Rolex's commitment to precision engineering, while the heavy double buckle lock ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The battery operated heavy smooth movement machinery provides reliable timekeeping, while the 43mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the ROLEX Submariner SMURF offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    sku: 'ROLEX-SUBMARINER-SMURF-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },
  {
    brand: 'Hublot',
    model: 'Bugatti Edition',
    referenceNumber: '7A Premium Collection',
    price: 2499,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Bold Rose Gold Alloy',
    bandMaterial: 'Durable black silicone strap for sporty comfort',
    waterResistance: 'Not specified',
    diameter: '44mm',
    description: `HUBLOT Bugatti Edition ⌚🔥

✅ A design masterpiece inspired by the engine of the iconic Bugatti supercar — built for those who appreciate power, precision, and bold luxury. ✅

🌟 Limited Edition Timepiece in Black & Gold – Now Ready to Ship! 🌟

The HUBLOT Bugatti Edition represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Bugatti design with a stunning hypercar-inspired skeleton dial that captures the essence of premium motorsport craftsmanship.

Every detail has been meticulously crafted to perfection - from the unique engine block display to the hypercar-inspired dual barrel design. The transparent crystal dial with detailed inner mechanics showcases Hublot's commitment to precision engineering, while the bold rose gold alloy case with Bugatti signature detailing ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The precision movement provides reliable timekeeping, while the 44mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the HUBLOT Bugatti Edition offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    sku: 'HUBLOT-BUGATTI-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },
  {
    brand: 'Fossil',
    model: 'Modern Machine Automatic',
    referenceNumber: '7AA Premium Collection',
    price: 2999,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Not specified',
    bandMaterial: 'Silver 24mm thick 3-link bracelet',
    waterResistance: 'Not specified',
    diameter: '44mm',
    description: `✅ Daring and complex inside and out, our new motion-powered automatic Modern Machine makes an unforgettable impression on your outfit. ✅

The Fossil Modern Machine Automatic represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Fossil design with a stunning automatic movement that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working 24-hour analog to the stainless steel dial. The silver 24mm thick 3-link bracelet showcases Fossil's commitment to precision engineering, while the transparent front & back provides a fascinating view of the automatic movement.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The fully automatic self-wind machine provides reliable timekeeping, while the Japanese automatic engine ensures lasting performance and durability.

For the gentleman who understands that true luxury lies in the details, the Fossil Modern Machine Automatic offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 4,
    sku: 'FOSSIL-MODERN-MACHINE-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },
  {
    brand: 'G-Shock',
    model: 'GBM-2100A',
    referenceNumber: '7AA Premium Collection',
    price: 2099,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'UNISEX',
    movement: 'QUARTZ',
    caseMaterial: 'Silver metal body',
    bandMaterial: 'Smart fit fibre strap',
    waterResistance: 'Water and impact resistant',
    diameter: '49.3 × 44.4 × 11.8 mm',
    description: `Most demanded G-Shock GBM2100A with silver metal body and blue dial in stock 🤩 ❤

The G-Shock GBM2100A represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic G-Shock design with a stunning blue dial that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working stopwatch/day/date digital display to the smart fit fibre strap. The silver metal bezel blue dial showcases G-Shock's commitment to precision engineering, while the easy pin buckled lock ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The digital drive system provides reliable timekeeping, while the 49.3 × 44.4 × 11.8 mm dimensions offer the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the G-Shock GBM2100A offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 5,
    sku: 'GSHOCK-GBM2100A-001',
    isFeatured: false,
    categories: ['FOR_HIM', 'FOR_HER']
  },
  {
    brand: 'Seiko',
    model: 'Presage Cocktail Time Edition',
    referenceNumber: '7AAA Premium Collection',
    price: 3500,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Not specified',
    bandMaterial: 'High-quality stainless steel bracelet (silver finish)',
    waterResistance: 'Water & splash resistant',
    diameter: '43mm',
    description: `✅ Seiko – A brand known for its innovation, craftsmanship, and advanced in-house movements, now presents the ultimate statement of elegance with the Seiko Presage Open Heart. ✅

🌟 The Latest Seiko Presage Open Heart Now Available & Ready to Ship! 🌟

✨ Refined Luxury, Timeless Appeal ✨

The Seiko Presage Open Heart represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Presage design with a stunning open heart movement that captures the essence of premium Japanese craftsmanship.

Every detail has been meticulously crafted to perfection - from the automatic open heart movement to the semi-skeleton dial with sunburst blue finish. The sapphire crystal glass showcases Seiko's commitment to precision engineering, while the smooth sweep second hand ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The original Japanese automatic movement provides reliable timekeeping, while the 43mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Seiko Presage Open Heart offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    sku: 'SEIKO-PRESAGE-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  }
];

async function addWatches() {
  try {
    console.log('Starting to add watches...');
    
    for (const watch of watches) {
      console.log(`Adding ${watch.brand} ${watch.model}...`);
      
      // Create the product
      const product = await prisma.product.create({
        data: {
          brand: watch.brand,
          model: watch.model,
          referenceNumber: watch.referenceNumber,
          price: watch.price,
          previousPrice: watch.previousPrice,
          condition: watch.condition,
          year: watch.year,
          gender: watch.gender,
          movement: watch.movement,
          caseMaterial: watch.caseMaterial,
          bandMaterial: watch.bandMaterial,
          waterResistance: watch.waterResistance,
          diameter: watch.diameter,
          description: watch.description,
          stockQuantity: watch.stockQuantity,
          sku: watch.sku,
          isFeatured: watch.isFeatured,
          authenticityStatus: 'VERIFIED'
        }
      });

      // Add categories
      for (const categoryName of watch.categories) {
        // Find or create category
        let category = await prisma.category.findFirst({
          where: { name: categoryName }
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: categoryName,
              slug: categoryName.toLowerCase().replace(/_/g, '-'),
              type: categoryName
            }
          });
        }

        // Connect product to category
        await prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId: category.id
          }
        });
      }

      console.log(`✅ Added ${watch.brand} ${watch.model} with ID: ${product.id}`);
    }

    console.log('🎉 All watches added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addWatches();
