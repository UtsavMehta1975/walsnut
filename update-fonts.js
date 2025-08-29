const fs = require('fs');
const path = require('path');

// Files that need font updates
const filesToUpdate = [
  'app/watches/page.tsx',
  'app/watches/[id]/page.tsx',
  'app/cart/page.tsx',
  'app/wishlist/page.tsx',
  'app/account/page.tsx',
  'app/contact/page.tsx',
  'app/brands/page.tsx',
  'app/admin/page.tsx',
  'app/privacy-policy/page.tsx',
  'app/terms-of-service/page.tsx',
  'app/refund-policy/page.tsx',
  'app/shipping-policy/page.tsx'
];

// Font replacement mappings
const fontReplacements = [
  { from: 'font-serif font-bold', to: 'lato-black' },
  { from: 'font-serif font-semibold', to: 'lato-bold' },
  { from: 'font-serif', to: 'lato-bold' }
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    fontReplacements.forEach(replacement => {
      if (content.includes(replacement.from)) {
        content = content.replace(new RegExp(replacement.from, 'g'), replacement.to);
        updated = true;
        console.log(`Updated ${replacement.from} to ${replacement.to} in ${filePath}`);
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔄 Updating font references to Lato...\n');

filesToUpdate.forEach(file => {
  updateFile(file);
});

console.log('\n✅ Font update complete!');


