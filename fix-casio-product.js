// Fix Casio Vintage product - combine all images into one product
const casioVintageWatch = {
  brand: "CASIO",
  model: "VINTAGE",
  referenceNumber: "A158WA-1Q",
  price: 900,
  previousPrice: 1200,
  condition: "NEW",
  year: 2024,
  gender: "MENS",
  description: "Experience the timeless appeal of the Casio Vintage digital watch - a perfect blend of retro charm and modern functionality. This iconic timepiece features a classic rectangular design with a stainless steel case and band, making it a versatile accessory for any occasion. The digital display provides clear time reading with day/date functions, while the LED backlight ensures visibility in any lighting condition. Built with Casio's renowned durability, this watch is water-resistant and features a reliable quartz movement. The vintage aesthetic combined with contemporary reliability makes this watch a must-have for collectors and fashion enthusiasts alike. Perfect for daily wear, special occasions, or as a statement piece that never goes out of style.",
  stockQuantity: 50,
  categories: ["premium-watches", "new-arrivals", "all-products"],
  specifications: {
    movement: "Quartz Digital",
    case: "Stainless Steel",
    dial: "Digital LCD Display",
    bracelet: "Stainless Steel Band",
    waterResistance: "30M",
    powerReserve: "7 Years Battery Life",
    diameter: "33.2mm",
    thickness: "8.5mm"
  },
  authenticity: {
    guaranteed: true,
    certificate: true,
    serviceHistory: true
  },
  // ALL images for the SAME watch
  images: [
    "https://lh3.googleusercontent.com/d/1d9dmVVJrkvaWQa_toQMVcGDY2kK6ZoeN",
    "https://lh3.googleusercontent.com/d/1fSJcPXQRA6WQ4Lj7ctn1IZp1Eouf_k6K",
    "https://lh3.googleusercontent.com/d/1KxMd91pcwobyNJnzWes4D6tzilv2WUNY",
    "https://lh3.googleusercontent.com/d/1ALB6CXao0sgNFtOoxvCSLRiDI7qOgr3a",
    "https://lh3.googleusercontent.com/d/1I-N58-PDmYVLT1F8Hl5QsCkCIVPhoe7n",
    "https://lh3.googleusercontent.com/d/1qwDgqYJPxJePWcnC-2rC9tQc7y7PUWDF",
    "https://lh3.googleusercontent.com/d/1NHMAkJY99wiQDLjujYeerYLZmGdh5v4S"
  ]
};

async function fixCasioProduct() {
  console.log('🔧 Fixing Casio Vintage product...');
  
  try {
    // First, delete all existing Casio products
    console.log('🗑️ Deleting existing Casio products...');
    const deleteResponse = await fetch('http://localhost:3000/api/products/clear-casio', {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer admin@walnut.com',
      },
    });

    if (deleteResponse.ok) {
      console.log('✅ Deleted existing Casio products');
    } else {
      console.log('⚠️ Could not delete existing products (they may not exist)');
    }

    // Create the single Casio Vintage product
    console.log('📝 Creating single Casio Vintage product...');
    const productResponse = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin@walnut.com',
      },
      body: JSON.stringify({
        brand: casioVintageWatch.brand,
        model: casioVintageWatch.model,
        referenceNumber: casioVintageWatch.referenceNumber,
        price: casioVintageWatch.price,
        previousPrice: casioVintageWatch.previousPrice,
        condition: casioVintageWatch.condition,
        year: casioVintageWatch.year,
        gender: casioVintageWatch.gender,
        description: casioVintageWatch.description,
        stockQuantity: casioVintageWatch.stockQuantity,
        categories: casioVintageWatch.categories,
        specifications: casioVintageWatch.specifications,
        authenticity: casioVintageWatch.authenticity
      }),
    });

    if (productResponse.ok) {
      const createdProduct = await productResponse.json();
      console.log(`✅ Product created: ${createdProduct.brand} ${createdProduct.model} (ID: ${createdProduct.id})`);
      
      // Add ALL images to the single product
      console.log(`🖼️ Adding ${casioVintageWatch.images.length} images to the single product...`);
      for (let i = 0; i < casioVintageWatch.images.length; i++) {
        const imageResponse = await fetch(`http://localhost:3000/api/products/${createdProduct.id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin@walnut.com',
          },
          body: JSON.stringify({
            imageUrl: casioVintageWatch.images[i],
            altText: `${casioVintageWatch.brand} ${casioVintageWatch.model} - Image ${i + 1}`,
            isPrimary: i === 0, // First image is primary
            sortOrder: i
          }),
        });

        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          console.log(`  ✅ Image ${i + 1} added: ${imageResult.imageUrl}`);
        } else {
          const error = await imageResponse.json();
          console.log(`  ❌ Failed to add image ${i + 1}: ${error.error || 'Unknown error'}`);
        }
      }
      
      console.log('\n🎉 Casio Vintage product fixed successfully!');
      console.log(`📱 Single product with ${casioVintageWatch.images.length} images`);
      console.log('💰 Price: ₹900 (was ₹1200)');
      console.log('📦 Stock: 50 units');
    } else {
      const error = await productResponse.json();
      console.log(`❌ Failed to create product: ${error.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Error fixing Casio product:`, error.message);
  }
}

// Run the fix
fixCasioProduct().catch(console.error);
