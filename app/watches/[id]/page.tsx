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
import { ShoppingCart, Heart, ArrowLeft, Clock, Sparkles, TrendingUp, ChevronUp, ChevronDown, Check } from 'lucide-react'
import { ColorSelector, extractColorVariants, ColorVariant } from '@/components/ui/color-selector'
import { DeliveryCheck } from '@/components/ui/delivery-check'
import { MobileBottomNav } from '@/components/ui/mobile-top-nav'
import toast from 'react-hot-toast'

interface ProductImage {
  id: string
  imageUrl: string
  altText?: string
  isPrimary: boolean
  sortOrder: number
  variantSku?: string
  colorName?: string
  colorCode?: string
  isSelectable?: boolean
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
  images?: ProductImage[]
  description: string
  sku: string
  // Add specifications and other fields
  brand: string
  model: string
  referenceNumber?: string
  condition: string
  year: number
  stockQuantity: number
  gender: string
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
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [carouselScrollTop, setCarouselScrollTop] = useState(0)
  const [allProducts, setAllProducts] = useState<any[]>([])
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
        console.log('📦 [PRODUCT] Raw product data:', p)
        console.log('📸 [PRODUCT] Raw images:', p.images)
        
        // Ensure images exist and have URLs
        const validImages = (p.images || []).filter((img: any) => img && img.imageUrl)
        console.log('📸 [PRODUCT] Valid images found:', validImages.length)
        
        const primary = validImages.find((img: any) => img.isPrimary) || validImages[0]
        const imageUrl = primary?.imageUrl || '/web-banner.png'
        
        // Map images properly with all fields
        const mappedImages = validImages.map((img: any) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          altText: img.altText || `${p.brand} ${p.model}`,
          isPrimary: img.isPrimary || false,
          sortOrder: img.sortOrder || 0,
          colorName: img.colorName || null,
          colorCode: img.colorCode || null,
          variantSku: img.variantSku || null,
          isSelectable: img.isSelectable !== false
        }))
        
        console.log('📸 [PRODUCT] Mapped images:', mappedImages)
        
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
          images: mappedImages.length > 0 ? mappedImages : undefined,
          description: p.description || 'No description available for this product.',
          sku: p.sku || 'N/A',
          brand: p.brand || 'N/A',
          model: p.model || 'N/A',
          condition: p.condition || 'New',
          year: p.year || 2023,
          stockQuantity: p.stockQuantity || 0,
          gender: p.gender || 'UNISEX',
          specifications: p.specifications,
          authenticity: p.authenticity
        }
        
        console.log('✅ [PRODUCT] Product mapped successfully')
        console.log('📸 [PRODUCT] Final images in product:', mapped.images)
        setProduct(mapped)
        setIsImageLoading(true) // Reset image loading state when product changes
        
        // Fetch related products after main product is loaded
        fetchRelatedProducts(p.brand, p.price, p.id)
        
        // Fetch all products for navigation
        fetchAllProducts()
      } catch {
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const fetchAllProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100&sortBy=createdAt&sortOrder=desc')
      if (!res.ok) return
      
      const json = await res.json()
      const data = Array.isArray(json?.data) ? json.data : json
      setAllProducts(data)
    } catch (error) {
      console.error('Error fetching all products:', error)
    }
  }

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
      // Use currently viewed image variant
      const currentImage = product.images?.[selectedImageIndex]
      const variantSku = selectedVariant?.sku || currentImage?.variantSku || product.sku
      const colorName = selectedVariant?.colorName || currentImage?.colorName || null
      const variantName = colorName 
        ? `${product.name} - ${colorName}`
        : product.name
      
      console.log('🛒 [ADD TO CART] Adding product with variant')
      console.log('🛒 [ADD TO CART] Variant SKU:', variantSku)
      console.log('🛒 [ADD TO CART] Color Name:', colorName)
      console.log('🛒 [ADD TO CART] Variant Name:', variantName)
      console.log('🛒 [ADD TO CART] Image:', currentImage?.imageUrl || product.image)
      
      addToCart({
        id: product.id,
        name: variantName,
        price: product.price,
        image: currentImage?.imageUrl || product.image,
        variantSku: variantSku,
        selectedColor: colorName || ''
      })
      
      // Show success toast with cart icon
      toast.success(`${variantName} added to cart!`, {
        duration: 3000,
        icon: '🛒',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      })
    }
  }

  const handleBuyNow = () => {
    if (product) {
      // Use currently viewed image variant
      const currentImage = product.images?.[selectedImageIndex]
      const variantSku = selectedVariant?.sku || currentImage?.variantSku || product.sku
      const colorName = selectedVariant?.colorName || currentImage?.colorName || null
      const variantName = colorName 
        ? `${product.name} - ${colorName}`
        : product.name
      
      console.log('⚡ [BUY NOW] Buying product with variant')
      console.log('⚡ [BUY NOW] Variant:', variantName)
      console.log('⚡ [BUY NOW] Color:', colorName)
      
      addToCart({
        id: product.id,
        name: variantName,
        price: product.price,
        image: currentImage?.imageUrl || product.image,
        variantSku: variantSku,
        selectedColor: colorName || ''
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

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleImageError = () => {
    setIsImageLoading(false)
  }

  const scrollCarousel = (direction: 'up' | 'down') => {
    const carousel = document.getElementById('image-carousel')
    if (carousel) {
      const scrollAmount = 80 // Height of one thumbnail + gap
      const newScrollTop = direction === 'up' 
        ? Math.max(0, carousel.scrollTop - scrollAmount)
        : Math.min(carousel.scrollHeight - carousel.clientHeight, carousel.scrollTop + scrollAmount)
      
      carousel.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      })
      setCarouselScrollTop(newScrollTop)
    }
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        {/* Minimal Breadcrumb - Hide on mobile */}
        <nav className="hidden lg:flex mb-6" aria-label="Breadcrumb">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images - NEW LAYOUT: Main on Top, Thumbnails Below */}
          <div className="space-y-4">
            {/* Main Image - Full Size on Top */}
            <div className="w-full relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden" style={{ paddingBottom: '100%' }}>
              {/* Image Loader */}
              {isImageLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading image...</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 p-4">
                {(() => {
                  const currentImage = product.images?.[selectedImageIndex]
                  const imageSrc = currentImage?.imageUrl || product.image || '/web-banner.png'
                  
                  console.log('🖼️ [RENDER] Rendering main image')
                  console.log('🖼️ [RENDER] Selected index:', selectedImageIndex)
                  console.log('🖼️ [RENDER] Current image object:', currentImage)
                  console.log('🖼️ [RENDER] Image URL:', imageSrc)
                  console.log('🖼️ [RENDER] Product.image fallback:', product.image)
                  
                  return (
                    <Image
                      src={imageSrc}
                      alt={selectedVariant ? `${product.name} - ${selectedVariant.colorName}` : product.name}
                      fill
                      className="object-contain cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setShowImageModal(true)}
                      onLoad={() => {
                        console.log('✅ [IMAGE] Loaded successfully:', imageSrc)
                        handleImageLoad()
                      }}
                      onError={(e) => {
                        console.error('🔴 [IMAGE] Failed to load:', imageSrc)
                        console.error('🔴 [IMAGE] Error event:', e)
                        handleImageError()
                      }}
                      priority
                      unoptimized
                    />
                  )
                })()}
              </div>
              
              {/* Selected Variant Badge */}
              {selectedVariant && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedVariant.colorName}
                </div>
              )}
              
              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Carousel - Horizontal Below Main Image */}
            {product.images && product.images.length > 1 && (
              <div className="w-full">
                <div className="relative">
                  <div 
                    className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    id="thumbnail-carousel"
                  >
                    {product.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => {
                          console.log('👆 [CLICK] Thumbnail clicked:', index, image)
                          setSelectedImageIndex(index)
                          setIsImageLoading(true)
                          
                          // Set variant info when clicking thumbnail
                          if (image.colorName || image.variantSku) {
                            const variant = {
                              id: image.id,
                              sku: image.variantSku || `${product.sku}-${image.colorCode || index + 1}`,
                              colorName: image.colorName || `View ${index + 1}`,
                              colorCode: image.colorCode || `V${index + 1}`,
                              imageUrl: image.imageUrl,
                              isAvailable: true
                            }
                            setSelectedVariant(variant)
                            setSelectedColor(image.colorName || '')
                            console.log('✅ [VARIANT] Selected variant:', variant)
                          } else {
                            // Clear variant if no color info
                            setSelectedVariant(null)
                            console.log('ℹ️ [VARIANT] No color info, variant cleared')
                          }
                        }}
                        className={`
                          relative flex-shrink-0 w-20 h-20 overflow-hidden cursor-pointer transition-all border-2 rounded-lg bg-white
                          ${selectedImageIndex === index 
                            ? 'border-black shadow-lg scale-105' 
                            : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                          }
                        `}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={image.imageUrl}
                            alt={image.altText || `View ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized
                            onError={(e) => {
                              console.error('Thumbnail failed to load:', image.imageUrl)
                              const img = e.target as HTMLImageElement
                              img.src = '/web-banner.png'
                            }}
                          />
                        </div>
                        {/* Check mark for selected */}
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <div className="bg-yellow-500 rounded-full p-1 shadow-lg">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        
                        {/* Color name label on thumbnail if exists */}
                        {image.colorName && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent py-1 px-1">
                            <p className="text-xs text-white font-medium text-center truncate">
                              {image.colorName}
                            </p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Details - Helios Style */}
          <div className="space-y-8">
            {/* Brand and Collection */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                {product.brand}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.model}
                {selectedVariant && (
                  <span className="text-xl lg:text-2xl font-normal text-gray-600 ml-2">
                    - {selectedVariant.colorName}
                  </span>
                )}
              </h1>
              {product.referenceNumber && (
                <div className="text-sm text-gray-600">
                  {product.gender === 'MENS' ? 'Men' : product.gender === 'WOMENS' ? 'Women' : product.gender} | {product.referenceNumber}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-900">
                {product.stockQuantity > 0 ? 'In stock' : 'Out of stock'}
              </span>
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {product.sku}
            </div>

            {/* Price - Helios Style */}
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.discount > 0 && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <div className="inline-block">
                  <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Color Variants - Show only if products have color names */}
            {product.images && product.images.some((img: ProductImage) => img.colorName) && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-black mb-3 uppercase tracking-wide">
                  Select Color
                  {selectedVariant && <span className="ml-2 text-gray-600 normal-case">- {selectedVariant.colorName}</span>}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.images
                    ?.filter((img: ProductImage) => img.colorName && img.isSelectable !== false)
                    .map((image: ProductImage, index: number) => {
                      const actualIndex = product.images?.findIndex((img: ProductImage) => img.id === image.id) ?? 0
                      const isSelected = selectedImageIndex === actualIndex
                      const variantSku = image.variantSku || `${product.sku}-${image.colorCode || index + 1}`
                      const colorName = image.colorName || `Variant ${index + 1}`
                      
                      return (
                        <button
                          key={image.id}
                          onClick={() => {
                            setSelectedImageIndex(actualIndex)
                            setSelectedVariant({
                              id: image.id,
                              sku: variantSku,
                              colorName: colorName,
                              colorCode: image.colorCode || `VAR${index + 1}`,
                              imageUrl: image.imageUrl,
                              isAvailable: true
                            })
                            setSelectedColor(colorName)
                            setIsImageLoading(true)
                          }}
                          className={`
                            group relative w-16 h-16 rounded-lg border-2 transition-all duration-200 overflow-hidden bg-white
                            ${isSelected 
                              ? 'border-yellow-500 ring-2 ring-yellow-200 scale-110' 
                              : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                            }
                          `}
                          title={colorName}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={getOptimizedImageUrl(image.imageUrl)}
                              alt={`${product.name} - ${colorName}`}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized
                              onError={(e) => {
                                console.error('Color swatch failed to load:', image.imageUrl)
                                const img = e.target as HTMLImageElement
                                img.src = '/web-banner.png'
                              }}
                            />
                          </div>
                          
                            {/* Selected Indicator */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                              <div className="bg-yellow-500 rounded-full p-1 shadow-lg">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Color Name Label */}
                          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-1 px-1 
                            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            <p className="text-xs text-white font-medium text-center truncate">
                              {colorName}
                            </p>
                          </div>
                        </button>
                      )
                    })
                  }
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click to see product in different colors
                </p>
              </div>
            )}

            {/* Fallback Color Options - Clean buttons */}
            {(!product.images || product.images.length <= 1) && product.colors.length > 0 && (
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

            {/* Action Buttons - Helios Style */}
            <div className="space-y-4 pt-6">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-4 text-base font-semibold rounded-lg"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="w-full bg-white text-black border-2 border-black hover:bg-gray-50 transition-colors py-4 text-base font-semibold rounded-lg"
              >
                Buy Now
              </Button>
            </div>

            {/* Delivery Check */}
            <div className="pt-6">
              <DeliveryCheck 
                variant="product"
                onPinCodeValidated={(data) => {
                  console.log('📦 Delivery available:', data)
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Link href="/watches">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Watches
                  </Button>
                </Link>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // Navigate to previous product (if available)
                      const currentIndex = allProducts.findIndex(p => p.id === product.id)
                      if (currentIndex > 0) {
                        window.location.href = `/watches/${allProducts[currentIndex - 1].id}`
                      }
                    }}
                    disabled={allProducts.findIndex(p => p.id === product.id) === 0}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // Navigate to next product (if available)
                      const currentIndex = allProducts.findIndex(p => p.id === product.id)
                      if (currentIndex < allProducts.length - 1) {
                        window.location.href = `/watches/${allProducts[currentIndex + 1].id}`
                      }
                    }}
                    disabled={allProducts.findIndex(p => p.id === product.id) === allProducts.length - 1}
                  >
                    Next
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Badges - Helios Style */}
            <div className="pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-medium">100% Genuine Products</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-medium">Buy With Trust</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-medium">Secure Payment</span>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Options</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Standard Delivery</span>
                  <span className="font-medium">Available at 25000+ Pincode</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Free delivery and returns</span>
                  <span className="font-medium text-green-600">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description - Helios Style */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: product.description
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>')
                    }} />
                  ) : (
                    <p>Introducing {product.brand} {product.model}, a premium timepiece from the {product.brand} collection. This brand hailing from Italy, this time piece exemplifies the quality found across {product.brand} watches, featuring {product.specifications?.movement || 'Quartz'} movement and a durable case. Its distinctive design adds a modern touch, while offering water resistance and premium materials. The elegant dial ensures timeless sophistication, backed by our warranty for your peace of mind.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Premium {product.specifications?.movement || 'Quartz'} Movement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{product.specifications?.case || 'Stainless Steel'} Case</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Water Resistant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Authentic {product.brand} Design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Warranty Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications - Helios Style */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium text-gray-900">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium text-gray-900">{product.model}</span>
                </div>
                {product.referenceNumber && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Reference</span>
                    <span className="font-medium text-gray-900">{product.referenceNumber}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium text-gray-900">{product.gender === 'MENS' ? 'Men' : product.gender === 'WOMENS' ? 'Women' : product.gender}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-medium text-gray-900">{product.condition}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium text-gray-900">{product.year}</span>
                </div>
              </div>
            </div>
            
            {/* Dial & Case */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Dial & Case</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Case Shape</span>
                  <span className="font-medium text-gray-900">Round</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Case Material</span>
                  <span className="font-medium text-gray-900">{product.specifications?.case || 'Stainless Steel'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Dial Type</span>
                  <span className="font-medium text-gray-900">Analog</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Movement</span>
                  <span className="font-medium text-gray-900">{product.specifications?.movement || 'Quartz'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Water Resistance</span>
                  <span className="font-medium text-gray-900">{product.specifications?.waterResistance || '50 m'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Warranty</span>
                  <span className="font-medium text-gray-900">2+24 Months</span>
                </div>
              </div>
            </div>

            {/* Strap */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Strap</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Strap Material</span>
                  <span className="font-medium text-gray-900">{product.specifications?.bracelet || 'Stainless Steel'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Strap Type</span>
                  <span className="font-medium text-gray-900">Bracelet</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Strap Width</span>
                  <span className="font-medium text-gray-900">20 MM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Case Size</span>
                  <span className="font-medium text-gray-900">{product.specifications?.diameter || '42 MM'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Case Thickness</span>
                  <span className="font-medium text-gray-900">{product.specifications?.thickness || '12 mm'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Brand's Country</span>
                  <span className="font-medium text-gray-900">Italy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More from Brand Section - Helios Style */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">More from {product.brand}</h2>
            <Link href="/watches">
              <Button variant="outline" className="text-gray-900 border-gray-300 hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium rounded-lg">
                View All
              </Button>
            </Link>
          </div>
          
          {isLoadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="group cursor-pointer"
                  onClick={() => handleRelatedProductClick(relatedProduct.id)}
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={relatedProduct.imageUrl}
                        alt={`${relatedProduct.brand} ${relatedProduct.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {relatedProduct.brand}
                      </div>
                      <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {relatedProduct.model}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        {relatedProduct.previousPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(relatedProduct.previousPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover More Premium Watches</h3>
                <p className="text-gray-600 mb-6">Explore our complete collection of luxury timepieces from {product.brand} and other premium brands.</p>
                <Link href="/watches">
                  <Button className="bg-black text-white hover:bg-gray-800 transition-colors px-8 py-3 text-base font-semibold rounded-lg">
                    Browse Collection
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal - Vertical Carousel Style */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full flex gap-4">
            {/* Mini Carousel - Left Side */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col space-y-2 max-h-[80vh] overflow-y-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 overflow-hidden transition-all border-2 rounded ${
                      selectedImageIndex === index 
                        ? 'border-white shadow-lg' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || `${product.name} - View ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Modal Image */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-light z-10 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
              >
                ×
              </button>
              <Image
                src={product.images?.[selectedImageIndex]?.imageUrl || product.image}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeSection="watches" />
       
      <Footer />
    </div>
  )
}
