// Upload additional 7 products
const additionalProducts = [
  {
    brand: "ADIDAS",
    model: "Retro Digital",
    price: 650,
    previousPrice: 1000,
    description: "ADIDAS Retro - Stylish digital watches with sleek, bold black, and classy finishes for every look. Digital Display, Time, Date, Day, Month, Year, Hour, Stopwatch, Alarm, Light, Metal Strap, Retro-inspired square dial for a classic look, St steel screwed back & Pressing lock, water resistance, Comfortable for everyday wear.",
    images: [
      "https://lh3.googleusercontent.com/d/1xw8eWfZeruV_PIpNHw4Bo4-EYYZVRLyT",
      "https://lh3.googleusercontent.com/d/1lwjRktqEtFq3chnglUOiIJhcPUF0zFl9",
      "https://lh3.googleusercontent.com/d/1aYlQiIhbHRCFlyipZngACBhTxAehdVTV",
      "https://lh3.googleusercontent.com/d/1C0Gmz025Cr2aTwP7sW22AK8ohoRIvBsO"
    ]
  },
  {
    brand: "CASIO",
    model: "Retro Women's",
    price: 600,
    previousPrice: 923,
    description: "Casio Retro watches For women's - This Casio watch blends a classic digital display with a stylish rose-gold mesh strap for a perfect mix of retro charm and modern elegance. Digital Display, Alarm Function, Stopwatch, WR & Backlight/Light, St steel screwed back & Megnet lock, Retro Design – Classic square case with a vintage Casio look.",
    images: [
      "https://lh3.googleusercontent.com/d/1_Wr00f1N8WgoV_hsZYMO-GEGn0lwIq60",
      "https://lh3.googleusercontent.com/d/1WJqmB7j5gkpxlc6sA-BX140FO2fW45jg",
      "https://lh3.googleusercontent.com/d/1JFWMhsspHduOWxTvo-YaJTEwSaRVG9gw"
    ]
  },
  {
    brand: "CASIO",
    model: "G-Shock G1513",
    price: 600,
    previousPrice: 923,
    description: "G-Shock Casio G1513 - This G-Shock watch combines rugged durability with a sleek digital design for everyday toughness. Digital Display, Shock Resistant Build, Water Resistance, Multiple Modes, Backlight / Illumination, Durable Resin Strap, 12/24-Hour Format, Battery Powered Quartz Movement, St steel screwed back & lock.",
    images: [
      "https://lh3.googleusercontent.com/d/1Q_l7ifa1MiuHPuxtJVazSyMZQmHV9ReJ",
      "https://lh3.googleusercontent.com/d/1xI34YUuFprDEdw6tg7ooGdNWvZKdznVe",
      "https://lh3.googleusercontent.com/d/16b-1X5t7zogQlU5lbxr4pDmYKgIqSBMT"
    ]
  },
  {
    brand: "GUCCI",
    model: "Elegant Women's",
    price: 750,
    previousPrice: 1154,
    description: "GUCCI For her - These sleek Gucci-inspired watches showcase elegant design and timeless sophistication with their vibrant dials and polished metallic straps. Quartz movement, Adjustable strap with a secure clasp mechanism, Fashion-forward, suitable for both casual and formal occasions, st steel back.",
    images: [
      "https://lh3.googleusercontent.com/d/17A7i_B6k2urpDzQRJwxQvXhBANkvT9TG",
      "https://lh3.googleusercontent.com/d/1gz0W0Pb-3-EEbZjwenw2HpSi8rZZlEWm",
      "https://lh3.googleusercontent.com/d/1QA3_mQI21jUMjg4O5L2Xosr07gV-lplg"
    ]
  },
  {
    brand: "RADO",
    model: "Captain Cook",
    price: 1050,
    previousPrice: 1615,
    description: "Rado Captain Cook - This Rado Captain Cook exudes bold elegance with its sturdy bezel, and classy leather strap. For men's - Quartz movement, All chronographs working, Date window, Sunburst dial, Luminous h&m, St steel back & Lock.",
    images: [
      "https://lh3.googleusercontent.com/d/1M7qU3j5UHrMkQvZMFUwwI7ewZL-jlq6B",
      "https://lh3.googleusercontent.com/d/1AbilYDxScjWrCx3Slqm2GFZcHrl9ovXo",
      "https://lh3.googleusercontent.com/d/1qjWiwkoBC92LhDt1DKACwKdYoEiaXvji",
      "https://lh3.googleusercontent.com/d/1mRSx6HqOGqZX33mLjNGAhHn-HRO57ROt",
      "https://lh3.googleusercontent.com/d/1UF2dJZ2oblG5TqA-W540rfVj4QsteB_P",
      "https://lh3.googleusercontent.com/d/1hAxfn2cWiP_e7WYRMsUcCFFwpQXqYiLD"
    ]
  },
  {
    brand: "RADO",
    model: "Hyperchrome",
    price: 1350,
    previousPrice: 2077,
    description: "RADO Hyperchrome - A masterpiece of elegance. Quartz movement, All chronographs working, Date working, Luminous hands, High-Gloss Bezel, Two tone matt/shine Premium quality metal bracelet, St steel back & Bfly lock.",
    images: [
      "https://lh3.googleusercontent.com/d/1hYAxr_NiumXSbf3GwjLE__y74bXjRbL0",
      "https://lh3.googleusercontent.com/d/1LP9Su2USnOyoQBzHchDaK13RCEVke6r0"
    ]
  },
  {
    brand: "TOMMY HILFIGER",
    model: "Classic Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Tommy Hilfiger Classic Collection - Premium timepiece with elegant design and reliable performance. Perfect blend of style and functionality for modern professionals.",
    images: [
      "https://lh3.googleusercontent.com/d/1wYKLvezq84fVUUz4Ha4WeNEphKja0VRj",
      "https://lh3.googleusercontent.com/d/1goqOkdDNN0s6fI7gBrNQWcblDFZNeSU4",
      "https://lh3.googleusercontent.com/d/1YrmAwGdGLuNpbjyCtF1NqtcSA_p_S9Cd",
      "https://lh3.googleusercontent.com/d/1e-qQxVmGxB6iG86j93TEMXh0uV30Hf8M"
    ]
  }
];

async function uploadAdditionalProducts() {
  console.log('🚀 Starting additional product upload...');
  
  for (let i = 0; i < additionalProducts.length; i++) {
    const product = additionalProducts[i];
    console.log(`\n📦 Uploading ${i + 1}/${additionalProducts.length}: ${product.brand} ${product.model}`);
    
    try {
      // Create product
      const productResponse = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin@walnut.com',
        },
        body: JSON.stringify({
          brand: product.brand,
          model: product.model,
          referenceNumber: `${product.brand}-${Date.now()}`,
          price: product.price,
          previousPrice: product.previousPrice,
          condition: 'NEW',
          year: 2024,
          gender: 'UNISEX',
          description: product.description,
          stockQuantity: 50,
          specifications: {
            case: 'Stainless Steel',
            bracelet: 'Stainless Steel',
            waterResistance: '50m',
            diameter: '42mm'
          },
          authenticity: {
            guaranteed: true
          }
        }),
      });

      if (!productResponse.ok) {
        throw new Error(`Product creation failed: ${productResponse.statusText}`);
      }

      const createdProduct = await productResponse.json();
      console.log(`✅ Product created: ${createdProduct.id}`);

      // Add images
      for (let j = 0; j < product.images.length; j++) {
        const imageUrl = product.images[j];
        const imageResponse = await fetch(`http://localhost:3000/api/products/${createdProduct.id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin@walnut.com',
          },
          body: JSON.stringify({
            imageUrl: imageUrl,
            altText: `${product.brand} ${product.model} - Image ${j + 1}`,
            isPrimary: j === 0,
            sortOrder: j + 1
          }),
        });

        if (imageResponse.ok) {
          console.log(`✅ Image ${j + 1} added`);
        } else {
          console.log(`❌ Image ${j + 1} failed`);
        }
      }

      console.log(`🎉 ${product.brand} ${product.model} uploaded successfully!`);

    } catch (error) {
      console.error(`❌ Error uploading ${product.brand} ${product.model}:`, error.message);
    }
  }

  console.log('\n🎊 Additional products upload completed!');
}

// Run the upload
uploadAdditionalProducts().catch(console.error);
