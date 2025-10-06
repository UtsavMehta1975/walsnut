// Update all existing products with variant SKUs and color information
const { generateVariantSkus, generateVariantInfo } = require('./lib/sku-generator.ts');

async function updateProductsWithVariants() {
  console.log('🎨 Starting product variant update...');
  
  try {
    // Get all products from local database
    console.log('📊 Fetching all products from local database...');
    const localResponse = await fetch('http://localhost:3000/api/products?admin=true', {
      headers: {
        'Authorization': 'Bearer admin@walnut.com',
      },
    });

    if (!localResponse.ok) {
      throw new Error('Failed to fetch local products');
    }

    const localProducts = await localResponse.json();
    console.log(`✅ Found ${localProducts.length} products in local database`);

    let updatedCount = 0;

    for (const product of localProducts) {
      console.log(`\n🎨 Processing ${product.brand} ${product.model}`);
      
      if (product.images && product.images.length > 0) {
        // Generate variant SKUs for all images
        const imageData = product.images.map(img => ({
          url: img.imageUrl,
          altText: img.altText
        }));
        
        const variantSkus = generateVariantSkus(product.brand, product.model, imageData);
        
        console.log(`   📸 Found ${product.images.length} images`);
        console.log(`   🎨 Generated ${variantSkus.length} variant SKUs`);
        
        // Update each image with variant information
        for (let i = 0; i < product.images.length; i++) {
          const image = product.images[i];
          const variant = variantSkus[i];
          
          try {
            const updateResponse = await fetch(`http://localhost:3000/api/products/${product.id}/images/${image.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin@walnut.com',
              },
              body: JSON.stringify({
                variantSku: variant.sku,
                colorName: variant.colorName,
                colorCode: variant.colorCode,
                isSelectable: true
              }),
            });

            if (updateResponse.ok) {
              console.log(`   ✅ Updated image ${i + 1}: ${variant.sku} (${variant.colorName})`);
            } else {
              console.log(`   ❌ Failed to update image ${i + 1}`);
            }
          } catch (error) {
            console.log(`   ❌ Error updating image ${i + 1}: ${error.message}`);
          }
        }
        
        updatedCount++;
      } else {
        console.log(`   ⚠️ No images found for ${product.brand} ${product.model}`);
      }
    }

    console.log(`\n🎊 Variant update completed!`);
    console.log(`📊 Updated ${updatedCount} products with variant SKUs`);

  } catch (error) {
    console.error('❌ Variant update failed:', error.message);
  }
}

// Run the update
updateProductsWithVariants().catch(console.error);
