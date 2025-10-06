// Upload all 34 products to production database
const productionUrl = 'https://www.thewalnutstore.com';

async function uploadAllToProduction() {
  console.log('🚀 Starting production upload of all products...');
  
  try {
    // First, get all products from local database
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

    // Upload each product to production
    for (let i = 0; i < localProducts.length; i++) {
      const product = localProducts[i];
      console.log(`\n📦 Uploading ${i + 1}/${localProducts.length}: ${product.brand} ${product.model}`);
      
      try {
        // Create product in production
        const productResponse = await fetch(`${productionUrl}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin@walnut.com',
          },
          body: JSON.stringify({
            brand: product.brand,
            model: product.model,
            referenceNumber: product.referenceNumber,
            price: product.price,
            previousPrice: product.previousPrice,
            condition: product.condition,
            year: product.year,
            gender: product.gender,
            description: product.description,
            stockQuantity: product.stockQuantity,
            specifications: {
              case: product.caseMaterial || 'Stainless Steel',
              bracelet: product.bandMaterial || 'Stainless Steel',
              waterResistance: product.waterResistance || '50m',
              diameter: product.diameter || '42mm'
            },
            authenticity: {
              guaranteed: product.authenticityStatus === 'VERIFIED'
            }
          }),
        });

        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          console.log(`❌ Product creation failed: ${productResponse.status} - ${errorText}`);
          continue;
        }

        const createdProduct = await productResponse.json();
        console.log(`✅ Product created: ${createdProduct.id}`);

        // Add images to production
        if (product.images && product.images.length > 0) {
          for (let j = 0; j < product.images.length; j++) {
            const image = product.images[j];
            const imageResponse = await fetch(`${productionUrl}/api/products/${createdProduct.id}/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin@walnut.com',
              },
              body: JSON.stringify({
                imageUrl: image.url,
                altText: image.altText || `${product.brand} ${product.model} - Image ${j + 1}`,
                isPrimary: image.isPrimary || j === 0,
                sortOrder: image.sortOrder || j + 1
              }),
            });

            if (imageResponse.ok) {
              console.log(`✅ Image ${j + 1} added`);
            } else {
              console.log(`❌ Image ${j + 1} failed`);
            }
          }
        }

        console.log(`🎉 ${product.brand} ${product.model} uploaded to production successfully!`);

      } catch (error) {
        console.error(`❌ Error uploading ${product.brand} ${product.model}:`, error.message);
      }
    }

    console.log('\n🎊 Production upload completed!');
    
    // Verify production upload
    console.log('\n🔍 Verifying production upload...');
    const productionResponse = await fetch(`${productionUrl}/api/products?admin=true`, {
      headers: {
        'Authorization': 'Bearer admin@walnut.com',
      },
    });

    if (productionResponse.ok) {
      const productionProducts = await productionResponse.json();
      console.log(`✅ Production now has ${productionProducts.length} products`);
    } else {
      console.log('❌ Could not verify production upload');
    }

  } catch (error) {
    console.error('❌ Production upload failed:', error.message);
  }
}

// Run the upload
uploadAllToProduction().catch(console.error);
