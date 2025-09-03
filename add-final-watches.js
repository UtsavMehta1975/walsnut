require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const finalWatches = [
  // 1. ALL NEW EXCLUSIVE MARBLE DIAL ROLEX
  {
    brand: 'Rolex',
    model: 'Exclusive Marble Dial Daytona',
    referenceNumber: '5A Premium Collection',
    price: 2799,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'QUARTZ',
    caseMaterial: 'Smart fir silver Body',
    bandMaterial: 'Adjustable strap with original branding',
    waterResistance: 'Water Resistant',
    diameter: '42mm',
    description: `ALL NEW EXCLUSIVE MARBLE DIAL ROLEX 🤩

✅ There aren't too many modern Rolex that become cult items almost instantly, The exclusive Daytona is one that did suiting your every occasion wrist. ✅

PROFESSIONAL AND CLASSIC CHOICE ❣

The Rolex Exclusive Marble Dial Daytona represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Daytona design with a stunning sunray marble black colour dial that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the working chronograph with 12-hour analog and 24-hour counter to the diamond colours bezel. The smart fir silver body with adjustable strap showcases Rolex's commitment to precision engineering, while the original branding on strap and dial ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The heavy quality premium stop watch chronograph machinery provides reliable timekeeping, while the 42mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Rolex Exclusive Marble Dial Daytona offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    sku: 'ROLEX-MARBLE-DAYTONA-2024-001',
    isFeatured: true,
    categories: ['FOR_HIM']
  },

  // 2. Omega x Swatch Earthphase MoonSwatch
  {
    brand: 'Omega x Swatch',
    model: 'Earth Phase MoonSwatch - Mission to the Moon',
    referenceNumber: '7AA Premium Collection',
    price: 2999,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'QUARTZ',
    caseMaterial: 'Not specified',
    bandMaterial: 'Soft & adjustable Velcro strap',
    waterResistance: 'Not specified',
    diameter: '42mm',
    description: `✅ Discover the perfect blend of iconic heritage and innovative design with the Omega x Swatch Earthphase MoonSwatch - Mission to the Moon. ✅

IT OFFERS A PLAYFUL YET SOPHISTICATED TWIST ON A CLASSIC. ❣

The Omega x Swatch Earthphase MoonSwatch represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic MoonSwatch design with a stunning chronograph functionality that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the working chronograph with signature Moonwatch hands to the timeless black and white aesthetic. The caseback proudly displays the "Mission to the Moon" showcasing Omega x Swatch's commitment to precision engineering, while the soft & adjustable Velcro strap ensures maximum comfort.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The 100% quality quartz movement chronograph machinery provides reliable timekeeping, while the 42mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Omega x Swatch Earthphase MoonSwatch offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    sku: 'OMEGA-SWATCH-MOONSWATCH-2024-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },

  // 3. Fossil Original Model
  {
    brand: 'Fossil',
    model: 'Original Model',
    referenceNumber: '7AAA Premium Collection',
    price: 2799,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Full black case',
    bandMaterial: 'Brown leather strap',
    waterResistance: 'Not specified',
    diameter: '42mm',
    description: `Since its creation, the iconic movement has made history; an integral component of many of FOSSIL most renowned timepieces in the current collection. ♨

The Fossil Original Model represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Fossil design with a stunning skeleton dial that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the 12-hour dial to the brown leather strap. The skeleton dial with open machinery showcases Fossil's commitment to precision engineering, while the full black case ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The automatic movement provides reliable timekeeping, while the 42mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Fossil Original Model offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    sku: 'FOSSIL-ORIGINAL-MODEL-2024-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },

  // 4. Tommy Hilfiger Open Heart Automatic
  {
    brand: 'Tommy Hilfiger',
    model: 'Modern Automatic',
    referenceNumber: '7AA Premium Collection',
    price: 2899,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Not specified',
    bandMaterial: '22mm premium metal stainless steel belt',
    waterResistance: 'Not specified',
    diameter: '43mm',
    description: `Tommy Hilfiger Open Heart Automatic 💙💙

✅ A must-have timepiece for all the watch aficionados complemented with buckled strap, this men analog watch from TOMMY HILFIGER will be a perfect pick. ✅

The Tommy Hilfiger Open Heart Automatic represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Tommy Hilfiger design with a stunning open heart movement that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working automatically 24-hour analog to the open front and back machinery. The stainless steel dial showcases Tommy Hilfiger's commitment to precision engineering, while the 22mm premium metal stainless steel belt ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The authentic automatic Japanese engine provides reliable timekeeping, while the 43mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tommy Hilfiger Open Heart Automatic offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    sku: 'TOMMY-HILFIGER-AUTOMATIC-2024-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },

  // 5. Tissot T-Classic
  {
    brand: 'Tissot',
    model: 'T-Classic',
    referenceNumber: '7A Premium Collection',
    price: 2699,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Not specified',
    bandMaterial: 'Brown leather strap',
    waterResistance: 'Not specified',
    diameter: '42mm',
    description: `Tissot T-Classic T-complication Mechanical Manual-winding Open Dial Men's Watch 😍

The Tissot T-Classic represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic T-Classic design with a stunning open dial that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the automatic movement to the brown leather strap. The white dial showcases Tissot's commitment to precision engineering, while the 42mm case size ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The automatic movement provides reliable timekeeping, while the 12mm case thickness offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tissot T-Classic offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 4,
    sku: 'TISSOT-T-CLASSIC-2024-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },

  // 6. Rado Diastar
  {
    brand: 'Rado',
    model: 'Diastar',
    referenceNumber: '5A Grade High Quality',
    price: 2299,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'QUARTZ',
    caseMaterial: 'Full silver steel dial case and back',
    bandMaterial: 'Super heavy quality full silver metal chain',
    waterResistance: 'Not specified',
    diameter: 'Not specified',
    description: `🔥🔥 SUPER HIGH QUALITY RADO DIASTAR.. IN STOCK 🔥 🔥

The Rado Diastar represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Diastar design with a stunning shaded color designer dials that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the first quality Japan battery movement to the white detailing textured dial. The super high quality AA sapphire crystal glass showcases Rado's commitment to precision engineering, while the full silver steel dial case and back ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The Japan battery movement provides reliable timekeeping, while the super heavy quality full silver metal chain offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Rado Diastar offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    sku: 'RADO-DIASTAR-2024-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  },

  // 7. G-Shock GM2100
  {
    brand: 'G-Shock',
    model: 'GM-2100-BB-1A',
    referenceNumber: '7AA Premium Collection',
    price: 1999,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'UNISEX',
    movement: 'QUARTZ',
    caseMaterial: 'Black metal body',
    bandMaterial: 'Smart fit fibre strap',
    waterResistance: 'Water and impact resistant',
    diameter: '49.3 × 44.4 × 11.8 mm',
    description: `Most demanded G-Shock GM2100 with black metal body in stock 🤩 ❤

The G-Shock GM2100 represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic G-Shock design with a stunning black metal body that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working stopwatch/day/date digital display to the smart fit fibre strap. The black metal bezel and body showcases G-Shock's commitment to precision engineering, while the easy pin buckled lock ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The digital drive system provides reliable timekeeping, while the 49.3 × 44.4 × 11.8 mm dimensions offer the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the G-Shock GM2100 offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 6,
    sku: 'GSHOCK-GM2100-2024-001',
    isFeatured: false,
    categories: ['FOR_HIM', 'FOR_HER']
  },

  // 8. Tissot T-Sports
  {
    brand: 'Tissot',
    model: 'T-Sports 1853',
    referenceNumber: '7AAA Premium Collection',
    price: 2999,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Round case',
    bandMaterial: 'Black fibre strap',
    waterResistance: 'Not specified',
    diameter: '44mm',
    description: `Feel the need for sophisticated speed when you accelerate your style with T race basic edition.💯

The Tissot T-Sports 1853 represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic T-Sports design with a stunning chronograph functionality that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the date indicator to the 12-hour dial. The working chronograph showcases Tissot's commitment to precision engineering, while the black fibre strap ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The heavy quality automatic movement provides reliable timekeeping, while the 44mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tissot T-Sports 1853 offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 4,
    sku: 'TISSOT-T-SPORTS-2024-001',
    isFeatured: false,
    categories: ['FOR_HIM']
  }
];

async function addFinalWatches() {
  try {
    console.log('Starting to add final watches...');
    console.log(`Total watches to add: ${finalWatches.length}`);
    
    for (const watch of finalWatches) {
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

    console.log('🎉 All final watches added successfully!');
    console.log(`Total watches added: ${finalWatches.length}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFinalWatches();
