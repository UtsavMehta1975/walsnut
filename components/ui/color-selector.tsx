'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface ColorVariant {
  id: string
  sku: string
  colorName: string
  colorCode: string
  imageUrl: string
  isAvailable: boolean
}

interface ColorSelectorProps {
  variants: ColorVariant[]
  selectedVariant: ColorVariant | null
  onVariantSelect: (variant: ColorVariant) => void
  className?: string
}

export function ColorSelector({ 
  variants, 
  selectedVariant, 
  onVariantSelect, 
  className = '' 
}: ColorSelectorProps) {
  const [hoveredVariant, setHoveredVariant] = useState<string | null>(null)

  if (variants.length <= 1) {
    return null // Don't show selector if only one variant
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <h4 className="font-medium text-gray-900">Color:</h4>
        {selectedVariant && (
          <span className="text-sm text-gray-600">
            {selectedVariant.colorName}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onVariantSelect(variant)}
            onMouseEnter={() => setHoveredVariant(variant.id)}
            onMouseLeave={() => setHoveredVariant(null)}
            disabled={!variant.isAvailable}
            className={`
              relative w-12 h-12 rounded-lg border-2 transition-all duration-200
              ${selectedVariant?.id === variant.id 
                ? 'border-yellow-500 ring-2 ring-yellow-200' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${!variant.isAvailable 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:scale-105'
              }
            `}
            title={`${variant.colorName} - ${variant.sku}`}
          >
            {/* Color Preview */}
            <div 
              className="w-full h-full rounded-md bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${variant.imageUrl})`,
                backgroundSize: 'cover'
              }}
            />
            
            {/* Selected Indicator */}
            {selectedVariant?.id === variant.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            
            {/* Hover Tooltip */}
            {hoveredVariant === variant.id && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {variant.colorName}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
              </div>
            )}
            
            {/* Out of Stock Overlay */}
            {!variant.isAvailable && (
              <div className="absolute inset-0 bg-gray-400 bg-opacity-50 rounded-md flex items-center justify-center">
                <div className="w-6 h-0.5 bg-gray-600 rotate-45"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="text-xs text-gray-500">
          SKU: {selectedVariant.sku}
        </div>
      )}
    </div>
  )
}

// Utility function to extract color variants from product images
export function extractColorVariants(images: Array<{
  id: string
  imageUrl: string
  altText?: string
  variantSku?: string
  colorName?: string
  colorCode?: string
  isSelectable?: boolean
}>): ColorVariant[] {
  return images
    .filter(img => img.isSelectable !== false)
    .map((img, index) => ({
      id: img.id,
      sku: img.variantSku || `VARIANT-${index + 1}`,
      colorName: img.colorName || `Variant ${index + 1}`,
      colorCode: img.colorCode || `VAR${index + 1}`,
      imageUrl: img.imageUrl,
      isAvailable: true // You can add stock logic here
    }))
}
