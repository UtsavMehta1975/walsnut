require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const allWatches = [
  {
    brand: 'Apple',
    model: 'Watch Ultra2 USA',
    referenceNumber: 'Ultra2 USA',
    description: `[25-08-2025 17:41] The Walnut Store: APPLE WATCH ULTRA2 USA🇺🇲

With A Alpine Strap To Give A Premium Original Look Like Never Before ❤

1:1 ORIGINAL PACKING 🔥

APPLE  ON / OFF LOGO

• All 3 buttons Working
• With Real Screws and Strap Locks Backside 
• 2.0" RETINA OLED DISPLAY 338PPI
• Pedometer/ Sleep Monitor / Deep Sleep - Light Sleep Monitoring Night Mode
• Aluminium Alloy / ABS Built Quality
• DIY CUSTOMIZE WATCH FACE
• Heart Sensor With 24/7 Monitoring / Heart Beat Pulse Count
• Fitness Mode With Different Sports Category To Calculate Heart Beat / Calorie Burnt / Step Count
• BT Calling / BT Music / BT Camera / Phone Book / Call Log
• Dialer / Call Logs  / Alarm / Message / Notification / Calendar / Sedantry Reminder
• Anti Lost / Vibration Alert
• Charging Time Upto 2 Hours ( Fast Charging Support )

🇺🇲WIRELESS POWER CHARGING CABLE⚡🔋

Price : 2700 + Shipping Charges
Cash On Delivery ✅`,
    price: 2700.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'UNISEX',
    movement: 'QUARTZ',
    caseMaterial: 'Aluminium Alloy / ABS',
    bandMaterial: 'Alpine Strap',
    waterResistance: '50m',
    diameter: '49mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 15,
    isFeatured: true
  },
  {
    brand: 'Rolex',
    model: 'GMT Master II / Sky Dweller / DateJust41',
    referenceNumber: 'Premium Collection',
    description: `[25-08-2025 17:45] The Walnut Store: Rolex Fully Automatic Ultra Premium Heavy Quality All Models Available ✅

GMT Master II 
Sky Dweller
DateJust41 

All models with premium Jubilee belt ✅

Same as original heavy automatic 💯

₹3400 + Shipping Charges
Cod Available`,
    price: 3400.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Premium Jubilee Belt',
    waterResistance: '100m',
    diameter: '41mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 8,
    isFeatured: true
  },
  {
    brand: 'Rolex',
    model: 'Yacht-Master Oyster',
    referenceNumber: 'Yacht-Master Oyster',
    description: `[25-08-2025 17:48] The Walnut Store: ✅ There aren't too many modern Rolex that become cult almost instantly, Rolex Yacht-Master is one that did suiting every wrist. ✅

🌟 Rolex Yacht-Master Oyster edition with smart fit design now Available & Ready to ship today 🌟

# Rolex
# For Men 
# 5A Premium Collection
# Model - Rolex Oyster Yacht-Master 
# Dial Size - 40mm
# Water Resistant 

PROFESSIONAL AND CLASSIC CHOICE ❣

- Working 12 Hour Analog
- Date Counter
-Black/Silver/Gold Stainless Steel dial
- Smart fir fibre strap 
- 3 point wrist adjustment strap
- Original Branding on strap and dial
- IPG colour rating with No fading
- Screw down branding lock
- Battery operated heavy machinery ❣ 

✨ New Rolex Yacht-Master Fibre Belt

₹ 1750 + Shipping Charge
Cod Available ✔

Comes comes with a basic box free of cost.`,
    price: 1750.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'QUARTZ',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Fibre Strap',
    waterResistance: '50m',
    diameter: '40mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 12,
    isFeatured: false
  },
  {
    brand: 'Seiko',
    model: 'Presage Open Heart Cocktail Time',
    referenceNumber: 'Presage Cocktail Time',
    description: `[25-08-2025 17:52] The Walnut Store: ✅ Seiko – A brand known for its innovation, craftsmanship, and advanced in-house movements, now presents the ultimate statement of elegance with the Seiko Presage Open Heart. ✅

🌟 The Latest Seiko Presage Open Heart Now Available & Ready to Ship! 🌟

# Seiko
# For Men
# 7AAA Premium Collection
# Original Model
# Presage Cocktail Time Edition
# Dial Size - 43mm
# Premium Features -

✨ Refined Luxury, Timeless Appeal ✨
 • Automatic Open Heart Movement
 • Semi-Skeleton Dial with Sunburst Blue Finish
 • Sapphire Crystal Glass
 • Smooth Sweep Second Hand
 • 24-Hour Dial
 • High-Quality Stainless Steel Bracelet (Silver Finish)
 • Water & Splash Resistant
 • Original Japanese Automatic Movement – Precision & Performance!

Rs 2800 + Shipping Charges
COD AVAILABLE  ✅`,
    price: 2800.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Stainless Steel Bracelet',
    waterResistance: '50m',
    diameter: '43mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 10,
    isFeatured: true
  },
  {
    brand: 'Fossil',
    model: 'ME3098 Townsman Automatic',
    referenceNumber: 'ME3098',
    description: `[25-08-2025 17:55] The Walnut Store: Fossil ME3098 Townsman Automatic Watch for Men 🤎

New brown and black color 🔥

Since its creation,the iconic movement has made history;an intergral component of many of FOSSIL most renowned timepieces in the current collection. ♨

* Fossil 
* For men
* 7AAA PREMIUM COLLECTION 
* Original Model
* Feature;
-12 hr dial
Brown leather strap
-Black dial 
-case size-42mm
-Band width-23mm
-Automatic movement
-Heavy machinery
-Skeleton dial with open machinery
-High end quality automatic machine 

Rs 2150  + Shipping Charges
Cash On Delivery ✅`,
    price: 2150.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Brown Leather Strap',
    waterResistance: '50m',
    diameter: '42mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 8,
    isFeatured: false
  },
  {
    brand: 'Rolex',
    model: 'DateJust36 Perpetual 2023',
    referenceNumber: 'Ref 126233',
    description: `[25-08-2025 18:00] The Walnut Store: ❤ Buy Just Premium Quality Rolex DateJust Collection ❤

✅ Few watches have attracted a mythology like that of the New Rolex Oyster Perpetual. This is a Flagship range enhancing the Brands & its Class.  ✅

🌟 Rolex Premium Quality New DateJust36 Collection now Available & Ready to ship today 🌟

# Rolex
# For Men
# 7AA Premium Collection
# New DateJust36 Perpetual 2023 - Ref 126233
# Dial Size - 41mm (Original Size) 
# Feature as follows -

- All Working automatically with 24 hour analog
- Special Grey Dial with Roman index Number giving premium look to your wrist.
- Pure stainless steel Dial & Case metal belt & Heavy Branding Lock.
- Stainless Steel Dual Tona Silver and Gold Jubileé bracelet. 
- Definite High quality Non-Comparable Original Japanese Smooth Automatic Movement. ❤

Rs 3300 + Shipping Charges
Cod Available ✅

Basic box is free with watch
If You Want Original Brand Box Packing, ₹850 Extra Charges Apply`,
    price: 3300.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'AUTOMATIC',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Silver and Gold Jubileé Bracelet',
    waterResistance: '100m',
    diameter: '41mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 6,
    isFeatured: true
  },
  {
    brand: 'Emporio Armani',
    model: 'Rose Chronograph',
    referenceNumber: 'Rose Chronograph',
    description: `[25-08-2025 18:05] The Walnut Store: Emporio Armani New Model In Stock 🤩

✨ Beautiful Emporio Armani with its All New Rose Chronograph  Dial ✨

Designed to suit the preference of urban women, this analog watch from Emporio Armani is sure to make a style statement. Secured by a mineral glass, the beige round dial is protected in a case. It exhibits plain 2-hand, and a crown for time adjustment

# Emporio Armani
# Same As Original Model 
# For Women
# 7A Premium Quality 
# Specification 

- High End Quartz Movement  
- Beautiful & New Diamond Studded Mother of Pearl dial with ROMAN Roman Figure touch ups 
- Stainless Steel Bezel, Armani Crown & Deep Glass
- Two Done Bracelet with Original Armani Butterfly lock & brand Embossed caseback

Rs 1650 + Shipping Charges 
Cod Available ✅`,
    price: 1650.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'WOMENS',
    movement: 'QUARTZ',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Two Done Bracelet',
    waterResistance: '30m',
    diameter: '36mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 15,
    isFeatured: false
  },
  {
    brand: 'G-Shock',
    model: 'GMW-B5000D',
    referenceNumber: 'GMW B5000D 1DR',
    description: `[25-08-2025 18:08] The Walnut Store: Most demanded G-Shock GMW-B5000D with metal body in stock 🤩 ❤

Brand - G-Shock
# For Unisex
# 7AA Premium Collection
# Model - GMW B5000D 1DR
# Dial Size : 42MM 

Water and impact Resistant 
Mineral Glass
Digital drive System
Working StopWatch/ Day/Date Digital Display ✅
Stailness steel strap ✅
Easy Pin Buckled Lock ✅
Full Metal Bezel and Body ✅

Working AutoLight ✅
Working World time ✅

Rs 1700 + Shipping Charges 
Cod Available ✅

Note : If You Need Original Box, ₹300 Extra Charges Apply`,
    price: 1700.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'UNISEX',
    movement: 'QUARTZ',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Stainless Steel Strap',
    waterResistance: '200m',
    diameter: '42mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 20,
    isFeatured: false
  },
  {
    brand: 'Cartier',
    model: 'Diastar Square',
    referenceNumber: 'Diastar Square',
    description: `[25-08-2025 18:10] The Walnut Store: ✅ Cartier is the Master of Materials for watches that are designed to stand the test of time Collection. ✅

🌟Cartier Super Slim machine Available & Ready to ship today 🌟

➡Cartier 
➡ For Men
➡7AA Premium Only
➡Diastar Square
➡ Dial Size - 42mm

➡ FEATURES ⬅

➡ EXCLUSIVE WRIST WEAR ❣
➡ Working 24 Hours Analog
➡ Super slim dial
➡Brown leather strap with White dail 
➡ Working chronograph for Day&Date 
➡QUartz movement 
➡Solid back stell with  name branding
➡Orignal cartier lock
➡High quality battery operated machine

 Rs 2200 + Shipping Charges

Cash on delivery available ✅`,
    price: 2200.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'MENS',
    movement: 'QUARTZ',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Brown Leather Strap',
    waterResistance: '30m',
    diameter: '42mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 12,
    isFeatured: false
  },
  {
    brand: 'Michael Kors',
    model: 'Parkers',
    referenceNumber: 'MK5774',
    description: `[25-08-2025 18:13] The Walnut Store: ✅ Perfectly made for outgoing and active ladies, this Michael Kors modern and stylish watch would be a great accessory for you. ✅

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
    stockQuantity: 18,
    isFeatured: true
  },
  {
    brand: 'Just Cavalli',
    model: 'JC1L264M0025',
    referenceNumber: 'JC1L264M0025',
    description: `[25-08-2025 18:15] The Walnut Store: ✅ JUST CAVALLI JC1L264M0025 – ROYAL WRIST GLAMOUR FOR HER ✅

🌟 Bold. Fashion-Forward. Rose Gold,Golden,Silver Rose Gold Luxury Defined. 🌟

# Just Cavalli
# For Women
# Luxury Analog Collection
# Model: JC1L264M0025 – Quartz Movement
# Dial Size: 28mm (Approx)

✨ A STATEMENT BRACELET-WATCH COMBO – GLAM & TIMELESS ✨

➡ Unique Snakehead-Shaped Dial – Signature Just Cavalli Flair
➡ Premium Gold Finish – High Polish, Eye-Catching Appeal
➡ Intricate Braided Coil Bracelet – Designer Bangle Look
➡ Elegant Patterned Dial – Crystal Studded Hour Markers
➡ Just Cavalli Logo on Dial – Authentic Brand Mark
➡ Flexible Wrap-Around Fit – No Clasp Needed
➡ Reliable Quartz Movement – Smooth & Precise Timekeeping
➡ Fashion Jewellery Meets Timepiece – Perfect for Parties or Gifting

Rs 2099 + Shipping Charge

Cash on delivery 🚚

➡ Product will be delivered same as in picture and videos – no changes to be seen`,
    price: 2099.00,
    previousPrice: null,
    condition: 'NEW',
    year: 2024,
    gender: 'WOMENS',
    movement: 'QUARTZ',
    caseMaterial: 'Stainless Steel',
    bandMaterial: 'Braided Coil Bracelet',
    waterResistance: '30m',
    diameter: '28mm',
    authenticityStatus: 'VERIFIED',
    stockQuantity: 25,
    isFeatured: false
  }
];

async function addAllWatches() {
  try {
    console.log('🚀 Starting bulk product addition...');
    console.log(`📦 Total products to add: ${allWatches.length}`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const watch of allWatches) {
      try {
        // Check if product already exists
        const existingProduct = await prisma.product.findFirst({
          where: {
            brand: watch.brand,
            model: watch.model
          }
        });

        if (existingProduct) {
          console.log(`⏭️  Skipped: ${watch.brand} ${watch.model} (already exists)`);
          skippedCount++;
          continue;
        }

        // Generate unique SKU
        const sku = `${watch.brand.substring(0, 3).toUpperCase()}-${watch.model.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

        // Create the product
        const product = await prisma.product.create({
          data: {
            brand: watch.brand,
            model: watch.model,
            referenceNumber: watch.referenceNumber,
            description: watch.description,
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
            authenticityStatus: watch.authenticityStatus,
            sku: sku,
            stockQuantity: watch.stockQuantity,
            isFeatured: watch.isFeatured
          }
        });

        console.log(`✅ Added: ${watch.brand} ${watch.model} (ID: ${product.id})`);
        addedCount++;

        // Add sample images (you can replace these with actual image URLs later)
        const imageUrls = [
          `https://drive.google.com/file/d/sample-${watch.brand.toLowerCase()}-${watch.model.toLowerCase()}-1/view?usp=drive_link`,
          `https://drive.google.com/file/d/sample-${watch.brand.toLowerCase()}-${watch.model.toLowerCase()}-2/view?usp=drive_link`,
          `https://drive.google.com/file/d/sample-${watch.brand.toLowerCase()}-${watch.model.toLowerCase()}-3/view?usp=drive_link`
        ];

        for (let i = 0; i < imageUrls.length; i++) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              cloudinaryPublicId: `${watch.brand.toLowerCase()}-${watch.model.toLowerCase()}-${i + 1}`,
              imageUrl: imageUrls[i],
              altText: `${watch.brand} ${watch.model} - Image ${i + 1}`,
              isPrimary: i === 0, // First image is primary
              sortOrder: i
            }
          });
        }

        console.log(`🖼️  Added ${imageUrls.length} sample images for ${watch.brand} ${watch.model}`);

      } catch (error) {
        console.error(`❌ Error adding ${watch.brand} ${watch.model}:`, error);
      }
    }

    console.log('\n🎉 Bulk product addition completed!');
    console.log(`✅ Successfully added: ${addedCount} products`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount} products`);
    console.log(`📊 Total processed: ${addedCount + skippedCount} products`);

  } catch (error) {
    console.error('❌ Fatal error during bulk addition:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAllWatches();
