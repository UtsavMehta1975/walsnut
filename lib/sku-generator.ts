// SKU Generator for Product Image Variants
export interface VariantInfo {
  brand: string
  model: string
  colorName: string
  colorCode: string
  imageIndex: number
}

// Color mapping for common watch colors
const COLOR_MAPPINGS: Record<string, { name: string; code: string }> = {
  'black': { name: 'Black', code: 'BLK' },
  'silver': { name: 'Silver', code: 'SLV' },
  'gold': { name: 'Gold', code: 'GLD' },
  'white': { name: 'White', code: 'WHT' },
  'blue': { name: 'Blue', code: 'BLU' },
  'red': { name: 'Red', code: 'RED' },
  'green': { name: 'Green', code: 'GRN' },
  'brown': { name: 'Brown', code: 'BRN' },
  'gray': { name: 'Gray', code: 'GRY' },
  'grey': { name: 'Gray', code: 'GRY' },
  'pink': { name: 'Pink', code: 'PNK' },
  'purple': { name: 'Purple', code: 'PRP' },
  'orange': { name: 'Orange', code: 'ORG' },
  'yellow': { name: 'Yellow', code: 'YLW' },
  'rose': { name: 'Rose Gold', code: 'RSG' },
  'steel': { name: 'Stainless Steel', code: 'STS' },
  'titanium': { name: 'Titanium', code: 'TTN' },
  'ceramic': { name: 'Ceramic', code: 'CRM' },
  'leather': { name: 'Leather', code: 'LTH' },
  'rubber': { name: 'Rubber', code: 'RBR' },
  'fabric': { name: 'Fabric', code: 'FAB' },
  'mesh': { name: 'Mesh', code: 'MSH' },
  'chain': { name: 'Chain', code: 'CHN' },
  'bracelet': { name: 'Bracelet', code: 'BRL' }
}

// Generate SKU for a product image variant
export function generateVariantSku(variantInfo: VariantInfo): string {
  const { brand, model, colorCode, imageIndex } = variantInfo
  
  // Clean brand and model names
  const cleanBrand = brand.replace(/[^A-Z0-9]/gi, '').substring(0, 4).toUpperCase()
  const cleanModel = model.replace(/[^A-Z0-9]/gi, '').substring(0, 3).toUpperCase()
  
  // Generate unique number (timestamp + index)
  const uniqueNumber = `${Date.now().toString().slice(-6)}${imageIndex.toString().padStart(2, '0')}`
  
  return `${cleanBrand}-${cleanModel}-${colorCode}-${uniqueNumber}`
}

// Detect color from image URL or alt text
export function detectColorFromImage(imageUrl: string, altText?: string): { name: string; code: string } {
  const text = `${imageUrl} ${altText || ''}`.toLowerCase()
  
  // Check for color keywords
  for (const [keyword, colorInfo] of Object.entries(COLOR_MAPPINGS)) {
    if (text.includes(keyword)) {
      return colorInfo
    }
  }
  
  // Default fallback
  return { name: 'Standard', code: 'STD' }
}

// Generate variant info for a product image
export function generateVariantInfo(
  brand: string,
  model: string,
  imageUrl: string,
  altText?: string,
  imageIndex: number = 0
): VariantInfo {
  const colorInfo = detectColorFromImage(imageUrl, altText)
  
  return {
    brand,
    model,
    colorName: colorInfo.name,
    colorCode: colorInfo.code,
    imageIndex
  }
}

// Generate SKU for multiple images of the same product
export function generateVariantSkus(
  brand: string,
  model: string,
  images: Array<{ url: string; altText?: string }>
): Array<{ sku: string; colorName: string; colorCode: string }> {
  return images.map((image, index) => {
    const variantInfo = generateVariantInfo(brand, model, image.url, image.altText, index)
    const sku = generateVariantSku(variantInfo)
    
    return {
      sku,
      colorName: variantInfo.colorName,
      colorCode: variantInfo.colorCode
    }
  })
}

// Example usage:
// const skus = generateVariantSkus('CASIO', 'VINTAGE', [
//   { url: 'https://...', altText: 'Casio Vintage Black' },
//   { url: 'https://...', altText: 'Casio Vintage Silver' },
//   { url: 'https://...', altText: 'Casio Vintage Gold' }
// ])
// Result: [
//   { sku: 'CASI-VIN-BLK-12345601', colorName: 'Black', colorCode: 'BLK' },
//   { sku: 'CASI-VIN-SLV-12345602', colorName: 'Silver', colorCode: 'SLV' },
//   { sku: 'CASI-VIN-GLD-12345603', colorName: 'Gold', colorCode: 'GLD' }
// ]
