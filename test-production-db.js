// Test production database connection
async function testProductionDB() {
  console.log('🔍 Testing production database connection...');
  
  try {
    // Test 1: Check if products API is working
    console.log('\n📊 Testing products API...');
    const productsResponse = await fetch('https://www.thewalnutstore.com/api/products?admin=true', {
      headers: {
        'Authorization': 'Bearer admin@walnut.com',
      },
    });

    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`✅ Products API working - Found ${products.length} products`);
      
      // Check for Casio product
      const casioProduct = products.find(p => p.brand === 'CASIO');
      if (casioProduct) {
        console.log(`✅ Casio Vintage found: ${casioProduct.brand} ${casioProduct.model} (₹${casioProduct.price})`);
        console.log(`✅ Images: ${casioProduct.images?.length || 0} images`);
      } else {
        console.log('❌ Casio Vintage not found in production database');
      }
    } else {
      console.log('❌ Products API not working');
    }

    // Test 2: Check database connection
    console.log('\n🔗 Testing database connection...');
    const dbTestResponse = await fetch('https://www.thewalnutstore.com/api/test-db');
    
    if (dbTestResponse.ok) {
      const dbTest = await dbTestResponse.json();
      console.log('✅ Database connection working');
      console.log(`📊 Database status: ${dbTest.status}`);
    } else {
      console.log('❌ Database connection failed');
    }

    // Test 3: Check environment variables
    console.log('\n⚙️ Testing environment variables...');
    const envResponse = await fetch('https://www.thewalnutstore.com/api/env-check');
    
    if (envResponse.ok) {
      const envCheck = await envResponse.json();
      console.log('✅ Environment check working');
      console.log(`🔧 MYSQL_URL configured: ${envCheck.mysqlUrl ? 'Yes' : 'No'}`);
      console.log(`🔧 CASHFREE configured: ${envCheck.cashfree ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Environment check failed');
    }

  } catch (error) {
    console.log(`❌ Error testing production: ${error.message}`);
  }
}

// Run the test
testProductionDB().catch(console.error);
