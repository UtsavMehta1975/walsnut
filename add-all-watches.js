const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const watches = [
  // 1. Tissot Gentleman Powermatic 80
  {
    brand: 'Tissot',
    model: 'Gentleman Powermatic 80',
    referenceNumber: 'T1274071104101',
    price: 3299,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `✅ The Tissot Gentleman Powermatic 80 is ergonomic and elegant in any circumstance. It is suitable for business environment & where conventional dress codes apply. ✅

HERITAGE BEAUTY IN WATCHMAKING ❣

The Tissot Gentleman Powermatic 80 represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Gentleman design with a stunning open heart face that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the 3-hand watch with pendulum rotating dial to the stainless steel 3 pink bracelet. The buckle type butterfly clasp showcases Tissot's commitment to precision engineering, while the back open transparent looking machinery provides a fascinating view of the automatic movement.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The 100% premium & reliable automatic Japanese movement machinery provides exceptional timekeeping, while the 41mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tissot Gentleman Powermatic 80 offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 5,
    specifications: {
      movement: '100% Premium & reliable automatic Japanese movement Machinery',
      case: '41mm, stainless steel',
      dial: 'Open Heart Face with 3 hands',
      bracelet: 'Stainless Steel 3 Pink bracelet with Butterfly Clasp',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '41mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 2. Tissot 1853 Couturier
  {
    brand: 'Tissot',
    model: '1853 Couturier',
    referenceNumber: '7AA Premium Collection',
    price: 2199,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Just as time itself is never-ending, so too is Tissot's journey to create the perfect time-piece for the elegant wearing gentleman. ✅

FINEST UPGRADE TO THE BASICS ❣

The Tissot 1853 Couturier represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Couturier design with a stunning chronograph functionality that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the working chronograph with 30 min and 1 min reset to the exclusive looking silver golden dual tone wrist adjustable metal strap. The Tissot brand print easy operated lock showcases Tissot's commitment to precision engineering, while the elegant stainless steel slim silver dial ensures lasting beauty.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The top notch quality stop watch chronograph machinery provides reliable timekeeping, while the 43mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tissot 1853 Couturier offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    specifications: {
      movement: 'Top notch quality stop watch chronograph machinery',
      case: '43mm, black stainless steel body',
      dial: 'Elegant stainless steel slim silver dial',
      bracelet: 'Exclusive looking silver golden dual tone wrist adjustable metal strap',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '43mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 3. ROLEX Submariner SMURF
  {
    brand: 'Rolex',
    model: 'Submariner SMURF',
    referenceNumber: '5A Premium Collection',
    price: 2299,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `ROLEX Submariner SMURF💙

✅ Designed to meet the demands of professional racing drivers embodies the historic and privileged bonds between Rolex and motor sport. ✅

🌟 Rolex Submariner meticulously designed watch with silver bracelet now available & Ready to ship today 🌟

The ROLEX Submariner SMURF represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Submariner design with a stunning blue dial that captures the essence of premium racing heritage.

Every detail has been meticulously crafted to perfection - from the battery operated 12-hour analog with date chronograph to the stainless steel silver luxury bracelet. The luxurious blue dial with rotating bezel showcases Rolex's commitment to precision engineering, while the heavy double buckle lock ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The battery operated heavy smooth movement machinery provides reliable timekeeping, while the 43mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the ROLEX Submariner SMURF offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    specifications: {
      movement: 'Battery operated heavy smooth movement machinery',
      case: '43mm, stainless steel',
      dial: 'Luxurious blue dial with rotating bezel',
      bracelet: 'Stainless steel silver luxury bracelet',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '43mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 4. ROLEX Skeleton Open Heart
  {
    brand: 'ROLEX',
    model: 'Open Heart Two Tone Automatic',
    referenceNumber: '7AA Premium Open Heart',
    price: 2999,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `✅ The Rolex Skeleton Open Heart Is a dazzling masterpiece, blending haute horology with vivid luxury of bold statement opulence and craftsmanship. ✅

CELEBRATE VIBRANT ELEGANCE & UNMATCHED EXCLUSIVITY ❣

The ROLEX Skeleton Open Heart represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Open Heart design with a stunning two-tone aesthetic that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the 3-hand open heart face with diamond Roman digits to the exclusive open heart bezel. The bold steel logo at the dial showcases Rolex's commitment to precision engineering, while the stainless steel oyster steel bracelet dual tone ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The 100% reliable quality smooth automatic movement technology provides exceptional timekeeping, while the 42mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the ROLEX Skeleton Open Heart offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 1,
    specifications: {
      movement: '100% Reliable Quality Smooth Automatic Movement technology',
      case: '42mm, stainless steel',
      dial: '3 Hand Open Heart Face with Diamond Roman Digits',
      bracelet: 'Stainless Steel Oyster steel Bracelet Dual Tone',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '42mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 5. Mont Blanc Classics
  {
    brand: 'Mont Blanc',
    model: 'Classics',
    referenceNumber: '7A Premium Collection',
    price: 2499,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Mont Blanc Classics For Men ❤

Now Available with a premium metal strap with proper brand markings and details 😍

Every man needs a classic Grant for every minute of every day. Rich and polished grey steel make this timepiece stylish enough for formal occasions, but built to withstand everyday use.

The Mont Blanc Classics represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Mont Blanc design with a stunning silver aesthetic that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the rich and polished grey steel case to the premium metal strap with proper brand markings. The all-working chronograph functionality showcases Mont Blanc's commitment to precision engineering, while the 42mm case size offers the perfect balance of presence and elegance.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The quartz movement provides reliable timekeeping, while the mineral glass ensures lasting clarity and durability.

For the gentleman who understands that true luxury lies in the details, the Mont Blanc Classics offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 4,
    specifications: {
      movement: 'Quartz',
      case: '42mm, rich and polished grey steel',
      dial: 'Silver',
      bracelet: 'Premium metal strap with proper brand markings',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '42mm',
      thickness: '12mm'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 6. Patek Philippe Nautilus 5711 Tiffany & Co
  {
    brand: 'Patek Philippe',
    model: 'Nautilus 5711 Tiffany & Co',
    referenceNumber: 'Exclusive Nautilus',
    price: 4499,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Patek Philippe Watches are World-leading luxury horologists represent some of the finest Swiss watchmaking ever known. 💙

🌟 The Patek Philippe Nautilus Tiffany Watch Collection Exclusively Solid & Beautiful Design Now Available

The Patek Philippe Nautilus 5711 Tiffany & Co represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Nautilus design with a stunning Tiffany blue dial that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the original ridged dial to the stainless steel silver case with silver bezel. The 12-hour analog display showcases Patek Philippe's commitment to precision engineering, while the silver steel metal chain strap ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The non-comparable original Japanese battery machinery provides reliable timekeeping, while the 42mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Patek Philippe Nautilus 5711 Tiffany & Co offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 1,
    specifications: {
      movement: 'Non Comparable Original Japanese Battery Machinery',
      case: '42mm, stainless steel silver case',
      dial: 'Tiffany blue dial with original ridged design',
      bracelet: 'Silver steel metal chain strap',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '42mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 7. Tissot LeLocle
  {
    brand: 'Tissot',
    model: 'LeLocle',
    referenceNumber: '7AA Premium Collection',
    price: 3199,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `✅ Tissot LeLocle is the ultimate automatic watch, now combined with the energy of the Powermatic movement and Classic looks. ✅

The Tissot LeLocle represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic LeLocle design with a stunning automatic movement that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the solid copper bezel to the brown leather strap. The 12-hour analog display showcases Tissot's commitment to precision engineering, while the back open machinery provides a fascinating view of the automatic movement.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The fully automatic Japanese movement provides reliable timekeeping, while the scratch-resistant sapphire crystal glass ensures lasting clarity and durability.

For the gentleman who understands that true luxury lies in the details, the Tissot LeLocle offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    specifications: {
      movement: 'Fully automatic Japanese movement',
      case: 'Not specified',
      dial: '12-hour analog display',
      bracelet: 'Brown leather strap',
      waterResistance: 'Water resistant',
      powerReserve: 'Not specified',
      diameter: 'Not specified',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 8. HUBLOT Bugatti Edition
  {
    brand: 'Hublot',
    model: 'Bugatti Edition',
    referenceNumber: '7A Premium Collection',
    price: 2499,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `HUBLOT Bugatti Edition ⌚🔥

✅ A design masterpiece inspired by the engine of the iconic Bugatti supercar — built for those who appreciate power, precision, and bold luxury. ✅

🌟 Limited Edition Timepiece in Black & Gold – Now Ready to Ship! 🌟

The HUBLOT Bugatti Edition represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Bugatti design with a stunning hypercar-inspired skeleton dial that captures the essence of premium motorsport craftsmanship.

Every detail has been meticulously crafted to perfection - from the unique engine block display to the hypercar-inspired dual barrel design. The transparent crystal dial with detailed inner mechanics showcases Hublot's commitment to precision engineering, while the bold rose gold alloy case with Bugatti signature detailing ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The precision movement provides reliable timekeeping, while the 44mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the HUBLOT Bugatti Edition offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    specifications: {
      movement: 'Precision movement',
      case: '44mm, bold rose gold alloy case with Bugatti signature detailing',
      dial: 'Hypercar-inspired skeleton dial with transparent crystal',
      bracelet: 'Durable black silicone strap for sporty comfort',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '44mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 9. Fossil Modern Machine Automatic
  {
    brand: 'Fossil',
    model: 'Modern Machine Automatic',
    referenceNumber: '7AA Premium Collection',
    price: 2999,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `✅ Daring and complex inside and out, our new motion-powered automatic Modern Machine makes an unforgettable impression on your outfit. ✅

The Fossil Modern Machine Automatic represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Fossil design with a stunning automatic movement that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working 24-hour analog to the stainless steel dial. The silver 24mm thick 3-link bracelet showcases Fossil's commitment to precision engineering, while the transparent front & back provides a fascinating view of the automatic movement.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The fully automatic self-wind machine provides reliable timekeeping, while the Japanese automatic engine ensures lasting performance and durability.

For the gentleman who understands that true luxury lies in the details, the Fossil Modern Machine Automatic offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 4,
    specifications: {
      movement: 'Fully automatic self-wind machine, Japanese automatic engine',
      case: '44mm, not specified material',
      dial: 'Stainless steel dial',
      bracelet: 'Silver 24mm thick 3-link bracelet',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '44mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 10. Omega x Swatch Earthphase MoonSwatch
  {
    brand: 'Omega x Swatch',
    model: 'Earth Phase MoonSwatch - Mission to the Moon',
    referenceNumber: '7AA Premium Collection',
    price: 2999,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `✅ Discover the perfect blend of iconic heritage and innovative design with the Omega x Swatch Earthphase MoonSwatch - Mission to the Moon. ✅

IT OFFERS A PLAYFUL YET SOPHISTICATED TWIST ON A CLASSIC. ❣

The Omega x Swatch Earthphase MoonSwatch represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic MoonSwatch design with a stunning chronograph functionality that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the working chronograph with signature Moonwatch hands to the timeless black and white aesthetic. The caseback proudly displays the "Mission to the Moon" showcasing Omega x Swatch's commitment to precision engineering, while the soft & adjustable Velcro strap ensures maximum comfort.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The 100% quality quartz movement chronograph machinery provides reliable timekeeping, while the 42mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Omega x Swatch Earthphase MoonSwatch offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    specifications: {
      movement: '100% Quality Quartz movement Chronograph machinery',
      case: '42mm, not specified material',
      dial: 'Timeless black and white aesthetic',
      bracelet: 'Soft & adjustable Velcro strap',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '42mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 11. Fossil Original Model
  {
    brand: 'Fossil',
    model: 'Original Model',
    referenceNumber: '7AAA Premium Collection',
    price: 2799,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Since its creation, the iconic movement has made history; an integral component of many of FOSSIL most renowned timepieces in the current collection. ♨

The Fossil Original Model represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Fossil design with a stunning skeleton dial that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the 12-hour dial to the brown leather strap. The skeleton dial with open machinery showcases Fossil's commitment to precision engineering, while the full black case ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The automatic movement provides reliable timekeeping, while the 42mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Fossil Original Model offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    specifications: {
      movement: 'Automatic movement',
      case: '42mm, full black case',
      dial: 'Skeleton dial with open machinery',
      bracelet: 'Brown leather strap',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '42mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 12. G-Shock GBM2100A
  {
    brand: 'G-Shock',
    model: 'GBM-2100A',
    referenceNumber: '7AA Premium Collection',
    price: 2099,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Most demanded G-Shock GBM2100A with silver metal body and blue dial in stock 🤩 ❤

The G-Shock GBM2100A represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic G-Shock design with a stunning blue dial that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working stopwatch/day/date digital display to the smart fit fibre strap. The silver metal bezel blue dial showcases G-Shock's commitment to precision engineering, while the easy pin buckled lock ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The digital drive system provides reliable timekeeping, while the 49.3 × 44.4 × 11.8 mm dimensions offer the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the G-Shock GBM2100A offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 5,
    specifications: {
      movement: 'Digital drive system',
      case: '49.3 × 44.4 × 11.8 mm, silver metal body',
      dial: 'Blue dial',
      bracelet: 'Smart fit fibre strap',
      waterResistance: 'Water and impact resistant',
      powerReserve: 'Not specified',
      diameter: '49.3 × 44.4 × 11.8 mm',
      thickness: '11.8mm'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him', 'For Her']
  },

  // 13. Tommy Hilfiger Open Heart Automatic
  {
    brand: 'Tommy Hilfiger',
    model: 'Modern Automatic',
    referenceNumber: '7AA Premium Collection',
    price: 2899,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Tommy Hilfiger Open Heart Automatic 💙💙

✅ A must-have timepiece for all the watch aficionados complemented with buckled strap, this men analog watch from TOMMY HILFIGER will be a perfect pick. ✅

The Tommy Hilfiger Open Heart Automatic represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Tommy Hilfiger design with a stunning open heart movement that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working automatically 24-hour analog to the open front and back machinery. The stainless steel dial showcases Tommy Hilfiger's commitment to precision engineering, while the 22mm premium metal stainless steel belt ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The authentic automatic Japanese engine provides reliable timekeeping, while the 43mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tommy Hilfiger Open Heart Automatic offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    specifications: {
      movement: 'Authentic automatic Japanese engine',
      case: '43mm, not specified material',
      dial: 'Stainless steel dial',
      bracelet: '22mm premium metal stainless steel belt',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '43mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 14. Rolex President's Collection
  {
    brand: 'Rolex',
    model: 'DayDate Oyster Collection',
    referenceNumber: '5A Premium Quality',
    price: 2199,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `✅ The exceptional precision, reliability, legibility and presence of this prestigious model has made it the ultimate status watch. ✅

🌟 An ultimate watch of Prestige, Rolex President's Collection now available & Ready to ship today 🌟

LEADERS & VISIONARY PREMIUM COLLECTION ❣

The Rolex President's Collection represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic DayDate design with a stunning oyster collection aesthetic that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the working 12-hour analog with day & date indicator to the brown blue green dial. The royal digit indicators showcase Rolex's commitment to precision engineering, while the 3-link gold metal bracelet ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The smooth battery operated movement machinery provides reliable timekeeping, while the 41mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Rolex President's Collection offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    specifications: {
      movement: 'Smooth battery operated movement machinery',
      case: '41mm, not specified material',
      dial: 'Brown blue green dial with royal digit indicators',
      bracelet: '3-link gold metal bracelet',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '41mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 15. Tissot T-Classic
  {
    brand: 'Tissot',
    model: 'T-Classic',
    referenceNumber: '7A Premium Collection',
    price: 2699,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Tissot T-Classic T-complication Mechanical Manual-winding Open Dial Men's Watch 😍

The Tissot T-Classic represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic T-Classic design with a stunning open dial that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the automatic movement to the brown leather strap. The white dial showcases Tissot's commitment to precision engineering, while the 42mm case size ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The automatic movement provides reliable timekeeping, while the 12mm case thickness offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tissot T-Classic offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 4,
    specifications: {
      movement: 'Automatic',
      case: '42mm, not specified material',
      dial: 'White',
      bracelet: 'Brown leather strap',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '42mm',
      thickness: '12mm'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 16. Rado Diastar
  {
    brand: 'Rado',
    model: 'Diastar',
    referenceNumber: '5A Grade High Quality',
    price: 2299,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `🔥🔥 SUPER HIGH QUALITY RADO DIASTAR.. IN STOCK 🔥 🔥

The Rado Diastar represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Diastar design with a stunning shaded color designer dials that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the first quality Japan battery movement to the white detailing textured dial. The super high quality AA sapphire crystal glass showcases Rado's commitment to precision engineering, while the full silver steel dial case and back ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The Japan battery movement provides reliable timekeeping, while the super heavy quality full silver metal chain offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Rado Diastar offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    specifications: {
      movement: 'First quality Japan battery movement',
      case: 'Not specified size, full silver steel',
      dial: 'Shaded color designer dials with white detailing textured dial',
      bracelet: 'Super heavy quality full silver metal chain',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: 'Not specified',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 17. G-Shock GM2100
  {
    brand: 'G-Shock',
    model: 'GM-2100-BB-1A',
    referenceNumber: '7AA Premium Collection',
    price: 1999,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Most demanded G-Shock GM2100 with black metal body in stock 🤩 ❤

The G-Shock GM2100 represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic G-Shock design with a stunning black metal body that captures the essence of premium craftsmanship.

Every detail has been meticulously crafted to perfection - from the working stopwatch/day/date digital display to the smart fit fibre strap. The black metal bezel and body showcases G-Shock's commitment to precision engineering, while the easy pin buckled lock ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The digital drive system provides reliable timekeeping, while the 49.3 × 44.4 × 11.8 mm dimensions offer the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the G-Shock GM2100 offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 6,
    specifications: {
      movement: 'Digital drive system',
      case: '49.3 × 44.4 × 11.8 mm, black metal body',
      dial: 'Digital display',
      bracelet: 'Smart fit fibre strap',
      waterResistance: 'Water and impact resistant',
      powerReserve: 'Not specified',
      diameter: '49.3 × 44.4 × 11.8 mm',
      thickness: '11.8mm'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him', 'For Her']
  },

  // 18. ROLEX SKY DWELLER
  {
    brand: 'ROLEX',
    model: 'SKY DWELLER',
    referenceNumber: '336935',
    price: 4499,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `ROLEX SKY DWELLER⚡

Reference : 336935

Rosegold and blue dial 💙

Fully Automatic Premium Machinery 🔥

Oyster And Jubilee Bracelet Both Available

Oyster Perpetual Sky-Dweller in 18 kt rosegold with a blue dial and an Oyster metal bracelet.

STEAL DEAL💰

The ROLEX SKY DWELLER represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Sky-Dweller design with a stunning rosegold and blue dial that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the fully automatic premium machinery to the oyster and jubilee bracelet options. The 18 kt rosegold case showcases Rolex's commitment to precision engineering, while the blue dial ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The fully automatic premium machinery provides reliable timekeeping, while the premium case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the ROLEX SKY DWELLER offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 1,
    specifications: {
      movement: 'Fully automatic premium machinery',
      case: 'Not specified size, 18 kt rosegold',
      dial: 'Blue dial',
      bracelet: 'Oyster and jubilee bracelet both available',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: 'Not specified',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 19. Tissot T-Sports
  {
    brand: 'Tissot',
    model: 'T-Sports 1853',
    referenceNumber: '7AAA Premium Collection',
    price: 2999,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `Feel the need for sophisticated speed when you accelerate your style with T race basic edition.💯

The Tissot T-Sports 1853 represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic T-Sports design with a stunning chronograph functionality that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the date indicator to the 12-hour dial. The working chronograph showcases Tissot's commitment to precision engineering, while the black fibre strap ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The heavy quality automatic movement provides reliable timekeeping, while the 44mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Tissot T-Sports 1853 offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 4,
    specifications: {
      movement: 'Heavy quality automatic movement',
      case: '44mm, round case',
      dial: '12-hour dial with date indicator',
      bracelet: 'Black fibre strap',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '44mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 20. Rolex DateJust36
  {
    brand: 'Rolex',
    model: 'New DateJust36 Perpetual 2023',
    referenceNumber: '7AA Premium Collection - Ref 126233',
    price: 3999,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `❤ Buy Just Premium Quality Rolex DateJust Collection ❤

✅ Few watches have attracted a mythology like that of the New Rolex Oyster Perpetual. This is a Flagship range enhancing the Brands & its Class. ✅

🌟 Rolex Premium Quality New DateJust36 Collection now Available & Ready to ship today 🌟

The Rolex DateJust36 represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic DateJust design with a stunning grey dial that captures the essence of premium Swiss craftsmanship.

Every detail has been meticulously crafted to perfection - from the all working automatically with 24-hour analog to the special grey dial with Roman index number. The pure stainless steel dial & case metal belt showcases Rolex's commitment to precision engineering, while the heavy branding lock ensures secure and comfortable wear.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The definite high quality non-comparable original Japanese smooth automatic movement provides reliable timekeeping, while the 41mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Rolex DateJust36 offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 2,
    specifications: {
      movement: 'Definite high quality non-comparable original Japanese smooth automatic movement',
      case: '41mm, pure stainless steel',
      dial: 'Special grey dial with Roman index number',
      bracelet: 'Stainless steel dual tone silver and gold jubilé bracelet',
      waterResistance: 'Not specified',
      powerReserve: 'Not specified',
      diameter: '41mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  },

  // 21. Seiko Presage Open Heart
  {
    brand: 'Seiko',
    model: 'Presage Cocktail Time Edition',
    referenceNumber: '7AAA Premium Collection',
    price: 3500,
    previousPrice: null,
    condition: 'New',
    year: 2024,
    description: `✅ Seiko – A brand known for its innovation, craftsmanship, and advanced in-house movements, now presents the ultimate statement of elegance with the Seiko Presage Open Heart. ✅

🌟 The Latest Seiko Presage Open Heart Now Available & Ready to Ship! 🌟

✨ Refined Luxury, Timeless Appeal ✨

The Seiko Presage Open Heart represents the pinnacle of luxury watchmaking, designed specifically for those who demand excellence in both form and function. This exceptional timepiece combines the iconic Presage design with a stunning open heart movement that captures the essence of premium Japanese craftsmanship.

Every detail has been meticulously crafted to perfection - from the automatic open heart movement to the semi-skeleton dial with sunburst blue finish. The sapphire crystal glass showcases Seiko's commitment to precision engineering, while the smooth sweep second hand ensures lasting beauty and durability.

This is more than just a timepiece; it's a statement of refined taste and professional achievement. The original Japanese automatic movement provides reliable timekeeping, while the 43mm case size offers the perfect balance of presence and elegance.

For the gentleman who understands that true luxury lies in the details, the Seiko Presage Open Heart offers premium craftsmanship wrapped in an elegant package that speaks volumes about its wearer's discerning taste and appreciation for excellence.`,
    stockQuantity: 3,
    specifications: {
      movement: 'Original Japanese automatic movement',
      case: '43mm, not specified material',
      dial: 'Semi-skeleton dial with sunburst blue finish',
      bracelet: 'High-quality stainless steel bracelet (silver finish)',
      waterResistance: 'Water & splash resistant',
      powerReserve: 'Not specified',
      diameter: '43mm',
      thickness: 'Not specified'
    },
    authenticity: {
      guaranteed: true,
      certificate: true,
      serviceHistory: true
    },
    categories: ['For Him']
  }
];

async function addAllWatches() {
  try {
    console.log('Starting to add all watches to the database...');
    
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
          description: watch.description,
          stockQuantity: watch.stockQuantity,
          specifications: {
            create: {
              movement: watch.specifications.movement,
              case: watch.specifications.case,
              dial: watch.specifications.dial,
              bracelet: watch.specifications.bracelet,
              waterResistance: watch.specifications.waterResistance,
              powerReserve: watch.specifications.powerReserve,
              diameter: watch.specifications.diameter,
              thickness: watch.specifications.thickness
            }
          },
          authenticity: {
            create: {
              guaranteed: watch.authenticity.guaranteed,
              certificate: watch.authenticity.certificate,
              serviceHistory: watch.authenticity.serviceHistory
            }
          }
        }
      });

      console.log(`✅ Successfully added ${watch.brand} ${watch.model} with ID: ${product.id}`);
    }

    console.log('🎉 All watches have been successfully added to the database!');
  } catch (error) {
    console.error('❌ Error adding watches:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addAllWatches();

