'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { getOptimizedImageUrl } from '@/lib/image-utils'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cart-store'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ShoppingCart, Heart, ArrowLeft, Clock, Sparkles, TrendingUp } from 'lucide-react'

interface ProductImage {
  id: string
  imageUrl: string
  isPrimary: boolean
  sortOrder: number
}

interface RelatedProduct {
  id: string
  brand: string
  model: string
  referenceNumber?: string
  price: number
  previousPrice?: number
  condition: string
  year: number
  imageUrl: string
  images?: ProductImage[]
  stockQuantity: number
  description: string
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  colors: string[]
  category: string
  image: string
  images: string[]
  description: string
  sku: string
  // Add specifications and other fields
  brand: string
  model: string
  referenceNumber?: string
  condition: string
  year: number
  stockQuantity: number
  specifications?: {
    movement?: string
    case?: string
    dial?: string
    bracelet?: string
    waterResistance?: string
    powerReserve?: string
    diameter?: string
    thickness?: string
  }
  authenticity?: {
    guaranteed?: boolean
    certificate?: boolean
    serviceHistory?: boolean
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id: productId } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  const [selectedColor, setSelectedColor] = useState('BLACK')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/products/${productId}`)
        if (!res.ok) {
          setProduct(null)
          setIsLoading(false)
          return
        }
        const p = await res.json()
        const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
        const imageUrl = primary?.imageUrl ? getOptimizedImageUrl(primary.imageUrl) : '/web-banner.png'
        const allImages = p.images?.map((img: any) => getOptimizedImageUrl(img.imageUrl)) || [imageUrl]
        const mapped: Product = {
          id: p.id,
          name: `${p.brand} ${p.model}`,
          price: Number(p.price) || 0,
          originalPrice: p.previousPrice ? Number(p.previousPrice) : Number(p.price) || 0,
          discount: p.previousPrice && Number(p.previousPrice) > Number(p.price)
            ? Math.round(((Number(p.previousPrice) - Number(p.price)) / Number(p.previousPrice)) * 100)
            : 0,
          colors: [],
          category: p.category?.name || 'luxury',
          image: imageUrl,
          images: allImages,
          description: p.description || 'No description available for this product.',
          sku: p.sku || 'N/A',
          brand: p.brand || 'N/A',
          model: p.model || 'N/A',
          condition: p.condition || 'New',
          year: p.year || 2023,
          stockQuantity: p.stockQuantity || 0,
          specifications: p.specifications,
          authenticity: p.authenticity
        }
        setProduct(mapped)
        
        // Fetch related products after main product is loaded
        fetchRelatedProducts(p.brand, p.price, p.id)
      } catch {
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const fetchRelatedProducts = async (brand: string, price: number, excludeId: string) => {
    try {
      setIsLoadingRelated(true)
      
      // Fetch products from the same brand, similar price range, or premium featured products
      const res = await fetch(`/api/products?limit=8&sortBy=createdAt&sortOrder=desc`)
      if (!res.ok) return
      
      const json = await res.json()
      const data = Array.isArray(json?.data) ? json.data : json
      
      // Filter and prioritize related products
      const filtered = data
        .filter((p: any) => p.id !== excludeId) // Exclude current product
        .sort((a: any, b: any) => {
          // Priority 1: Same brand
          if (a.brand === brand && b.brand !== brand) return -1
          if (b.brand === brand && a.brand !== brand) return 1
          
          // Priority 2: Similar price range (±30%)
          const aPriceDiff = Math.abs(Number(a.price) - price) / price
          const bPriceDiff = Math.abs(Number(b.price) - price) / price
          if (aPriceDiff < 0.3 && bPriceDiff >= 0.3) return -1
          if (bPriceDiff < 0.3 && aPriceDiff >= 0.3) return 1
          
          // Priority 3: Featured products
          if (a.isFeatured && !b.isFeatured) return -1
          if (b.isFeatured && !a.isFeatured) return 1
          
          // Priority 4: Newest first
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        .slice(0, 4) // Take top 4
      
      const mapped: RelatedProduct[] = filtered.map((p: any) => {
        const primary = p.images?.find((img: any) => img.isPrimary) || p.images?.[0]
        return {
          id: p.id,
          brand: p.brand,
          model: p.model,
          referenceNumber: p.referenceNumber,
          price: Number(p.price) || 0,
          previousPrice: p.previousPrice ? Number(p.previousPrice) : null,
          condition: p.condition || 'NEW',
          year: p.year || 2024,
          imageUrl: primary?.imageUrl ? getOptimizedImageUrl(primary.imageUrl) : '/web-banner.png',
          images: p.images || [],
          stockQuantity: p.stockQuantity || 0,
          description: p.description || ''
        }
      })
      
      setRelatedProducts(mapped)
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setIsLoadingRelated(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      })
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      })
      window.location.href = '/checkout'
    }
  }

  const handleRelatedProductClick = (productId: string) => {
    window.location.href = `/watches/${productId}`
  }

  const handleRelatedProductAddToCart = (relatedProduct: RelatedProduct) => {
    addToCart({
      id: relatedProduct.id,
      name: `${relatedProduct.brand} ${relatedProduct.model}`,
      price: relatedProduct.price,
      image: relatedProduct.imageUrl
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/watches">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                Back to Watches
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Minimal Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-black transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <Link href="/watches" className="text-gray-500 hover:text-black transition-colors">
                Watches
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <span className="text-black font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images - Minimal Gallery */}
          <div className="space-y-4">
            {/* Main Image - Sharp corners, no borders */}
            <div className="aspect-square overflow-hidden bg-white">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setShowImageModal(true)}
              />
            </div>
            
            {/* Image Gallery - All images visible, minimal design */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((imageUrl, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-black' 
                        : 'hover:opacity-80'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - View ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Minimal, Clean */}
          <div className="space-y-6">
            {/* Product Name - Clean typography */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-light text-black leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price - Minimal display */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl lg:text-3xl font-light text-black">
                  {formatPrice(product.price)}
                </span>
                {product.discount > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <div className="inline-block">
                  <span className="text-sm text-red-600 font-medium">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* SKU - Subtle */}
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              SKU: {product.sku}
            </div>

            {/* Color Options - Clean buttons */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-black mb-3 uppercase tracking-wide">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-sm font-medium transition-all rounded-none ${
                        selectedColor === color
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity - Minimal selector */}
            <div>
              <h3 className="text-sm font-medium text-black mb-3 uppercase tracking-wide">Quantity</h3>
              <div className="flex items-center border border-gray-200 rounded-none">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors rounded-none"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-200 text-center min-w-[60px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors rounded-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons - Aesthetic, minimal */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-3 text-sm font-medium uppercase tracking-wide rounded-none"
              >
                Add to cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="w-full bg-white text-black border border-black hover:bg-gray-50 transition-colors py-3 text-sm font-medium uppercase tracking-wide rounded-none"
              >
                Buy now
              </Button>
            </div>

            {/* Stock Status - Clean info */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>
                  {product.stockQuantity > 0 
                    ? `${product.stockQuantity} in stock` 
                    : 'Out of stock'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description - Clean, minimal */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-medium text-black mb-6 uppercase tracking-wide">Description</h2>
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed text-sm">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: product.description
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>')
                }} />
              ) : (
                <p>No detailed description available for this product.</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Specifications - Minimal grid */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-medium text-black mb-6 uppercase tracking-wide">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-black mb-3 uppercase tracking-wide">Basic Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Brand</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model</span>
                    <span className="font-medium">{product.model}</span>
                  </div>
                  {product.referenceNumber && (
                    <div className="flex justify-between">
                      <span>Reference</span>
                      <span className="font-medium">{product.referenceNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Condition</span>
                    <span className="font-medium">{product.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year</span>
                    <span className="font-medium">{product.year}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {product.specifications && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-black mb-3 uppercase tracking-wide">Technical Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {product.specifications.movement && (
                    <div className="flex justify-between">
                      <span>Movement</span>
                      <span className="font-medium">{product.specifications.movement}</span>
                    </div>
                  )}
                  {product.specifications.case && (
                    <div className="flex justify-between">
                      <span>Case</span>
                      <span className="font-medium">{product.specifications.case}</span>
                    </div>
                  )}
                  {product.specifications.dial && (
                    <div className="flex justify-between">
                      <span>Dial</span>
                      <span className="font-medium">{product.specifications.dial}</span>
                    </div>
                  )}
                  {product.specifications.bracelet && (
                    <div className="flex justify-between">
                      <span>Bracelet</span>
                      <span className="font-medium">{product.specifications.bracelet}</span>
                    </div>
                  )}
                  {product.specifications.waterResistance && (
                    <div className="flex justify-between">
                      <span>Water Resistance</span>
                      <span className="font-medium">{product.specifications.waterResistance}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Products You May Like Section - Kept as requested */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-medium text-black uppercase tracking-wide">Other Products You May Like</h2>
            <Link href="/watches">
              <Button variant="outline" className="text-black border-black hover:bg-black hover:text-white transition-colors text-sm font-medium uppercase tracking-wide rounded-none">
                View All
              </Button>
            </Link>
          </div>
          
          {isLoadingRelated ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-gray-100 animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="group cursor-pointer"
                  onClick={() => handleRelatedProductClick(relatedProduct.id)}
                >
                  <div className="relative aspect-square overflow-hidden mb-3">
                    <Image
                      src={relatedProduct.imageUrl}
                      alt={`${relatedProduct.brand} ${relatedProduct.model}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-black group-hover:text-gray-600 transition-colors">
                      {relatedProduct.brand} {relatedProduct.model}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.previousPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(relatedProduct.previousPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Discover More Premium Watches</h3>
              <p className="text-gray-600 mb-4 text-sm">Explore our complete collection of luxury timepieces</p>
              <Link href="/watches">
                <Button className="bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium uppercase tracking-wide rounded-none">
                  Browse Collection
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal - Minimal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-light z-10 w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <div className="relative">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex justify-center mt-6 space-x-3">
                {product.images.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 overflow-hidden transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-white' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - View ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
       
      <Footer />
    </div>
  )
}
