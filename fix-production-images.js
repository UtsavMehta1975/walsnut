// Fix production images - upload all images for all products
const productionUrl = 'https://www.thewalnutstore.com';

async function fixProductionImages() {
  console.log('🖼️ Starting production image upload fix...');
  
  try {
    // Get all products from local database (with images)
    console.log('📊 Fetching products with images from local database...');
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

    // Get all products from production database
    console.log('📊 Fetching products from production database...');
    const productionResponse = await fetch(`${productionUrl}/api/products?admin=true`, {
      headers: {
        'Authorization': 'Bearer admin@walnut.com',
      },
    });

    if (!productionResponse.ok) {
      throw new Error('Failed to fetch production products');
    }

    const productionProducts = await productionResponse.json();
    console.log(`✅ Found ${productionProducts.length} products in production database`);

    // Match products and upload images
    let uploadedImages = 0;
    let totalImages = 0;

    for (const localProduct of localProducts) {
      // Find matching production product by brand and model
      const productionProduct = productionProducts.find(p => 
        p.brand === localProduct.brand && p.model === localProduct.model
      );

      if (!productionProduct) {
        console.log(`❌ No matching production product found for ${localProduct.brand} ${localProduct.model}`);
        continue;
      }

      console.log(`\n📦 Processing ${localProduct.brand} ${localProduct.model}`);
      console.log(`   Local ID: ${localProduct.id}`);
      console.log(`   Production ID: ${productionProduct.id}`);
      console.log(`   Local Images: ${localProduct.images?.length || 0}`);

      if (localProduct.images && localProduct.images.length > 0) {
        totalImages += localProduct.images.length;
        
        for (let i = 0; i < localProduct.images.length; i++) {
          const image = localProduct.images[i];
          
          try {
            const imageResponse = await fetch(`${productionUrl}/api/products/${productionProduct.id}/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin@walnut.com',
              },
              body: JSON.stringify({
                imageUrl: image.imageUrl,
                altText: image.altText || `${localProduct.brand} ${localProduct.model} - Image ${i + 1}`,
                isPrimary: image.isPrimary || i === 0,
                sortOrder: image.sortOrder || i + 1
              }),
            });

            if (imageResponse.ok) {
              const uploadedImage = await imageResponse.json();
              console.log(`   ✅ Image ${i + 1} uploaded: ${uploadedImage.id}`);
              uploadedImages++;
            } else {
              const errorText = await imageResponse.text();
              console.log(`   ❌ Image ${i + 1} failed: ${imageResponse.status} - ${errorText}`);
            }
          } catch (error) {
            console.log(`   ❌ Image ${i + 1} error: ${error.message}`);
          }
        }
      } else {
        console.log(`   ⚠️ No images found for ${localProduct.brand} ${localProduct.model}`);
      }
    }

    console.log(`\n🎊 Image upload completed!`);
    console.log(`📊 Total images processed: ${totalImages}`);
    console.log(`✅ Successfully uploaded: ${uploadedImages}`);
    console.log(`❌ Failed uploads: ${totalImages - uploadedImages}`);

  } catch (error) {
    console.error('❌ Image upload fix failed:', error.message);
  }
}

// Run the fix
fixProductionImages().catch(console.error);
