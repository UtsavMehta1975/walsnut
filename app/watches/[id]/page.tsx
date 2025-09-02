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
import { ShoppingCart, Heart, ArrowLeft, Clock } from 'lucide-react'

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
      } catch {
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-yellow-400">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/watches" className="text-gray-700 hover:text-yellow-400">
                  Men Watch
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
            </div>
            
            {/* Image Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((imageUrl, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'border-yellow-400 bg-yellow-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - View ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:opacity-75 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-black">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold inline-block">
                {product.discount}% off
              </div>
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-600">
              <strong>SKU:</strong> {product.sku}
            </div>

            {/* Color Options */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">COLOR: {selectedColor}</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
              >
                Buy it now
              </Button>
            </div>

            {/* Sale Ending Timer */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-red-600" />
                <p className="text-red-600 font-semibold">
                  Sale Ending In: 24:59:45
                </p>
              </div>
            </div>

            {/* Pickup Availability */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-center">Couldn't load pickup availability</p>
              <Button variant="outline" className="w-full mt-2">
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-black mb-6">Product Specifications</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            {/* Product Description */}
            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed">
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
            
            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-black">Basic Information:</h4>
                  <ul className="list-none space-y-2 text-gray-600">
                    <li><strong>Brand:</strong> {product.brand}</li>
                    <li><strong>Model:</strong> {product.model}</li>
                    {product.referenceNumber && (
                      <li><strong>Reference:</strong> {product.referenceNumber}</li>
                    )}
                    <li><strong>Condition:</strong> {product.condition}</li>
                    <li><strong>Year:</strong> {product.year}</li>
                    <li><strong>Stock:</strong> {product.stockQuantity} available</li>
                  </ul>
                </div>
                
                {product.specifications && (
                  <div>
                    <h4 className="font-semibold text-black">Technical Details:</h4>
                    <ul className="list-none space-y-2 text-gray-600">
                      {product.specifications.movement && (
                        <li><strong>Movement:</strong> {product.specifications.movement}</li>
                      )}
                      {product.specifications.case && (
                        <li><strong>Case:</strong> {product.specifications.case}</li>
                      )}
                      {product.specifications.dial && (
                        <li><strong>Dial:</strong> {product.specifications.dial}</li>
                      )}
                      {product.specifications.bracelet && (
                        <li><strong>Bracelet:</strong> {product.specifications.bracelet}</li>
                      )}
                      {product.specifications.waterResistance && (
                        <li><strong>Water Resistance:</strong> {product.specifications.waterResistance}</li>
                      )}
                      {product.specifications.powerReserve && (
                        <li><strong>Power Reserve:</strong> {product.specifications.powerReserve}</li>
                      )}
                      {product.specifications.diameter && (
                        <li><strong>Diameter:</strong> {product.specifications.diameter}</li>
                      )}
                      {product.specifications.thickness && (
                        <li><strong>Thickness:</strong> {product.specifications.thickness}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {product.authenticity && (
                  <div>
                    <h4 className="font-semibold text-black">Authenticity & Warranty:</h4>
                    <ul className="list-none space-y-2 text-gray-600">
                      <li>
                        <strong>Guaranteed:</strong> 
                        <span className={product.authenticity.guaranteed ? 'text-green-600' : 'text-red-600'}>
                          {product.authenticity.guaranteed ? ' ✓ Yes' : ' ✗ No'}
                        </span>
                      </li>
                      <li>
                        <strong>Certificate:</strong> 
                        <span className={product.authenticity.certificate ? 'text-green-600' : 'text-red-600'}>
                          {product.authenticity.certificate ? ' ✓ Yes' : ' ✗ No'}
                        </span>
                      </li>
                      <li>
                        <strong>Service History:</strong> 
                        <span className={product.authenticity.serviceHistory ? 'text-green-600' : 'text-red-600'}>
                          {product.authenticity.serviceHistory ? ' ✓ Yes' : ' ✗ No'}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-black">Features:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Premium Swiss/Japanese craftsmanship</li>
                    <li>High-quality materials and finishing</li>
                    <li>Precision timekeeping</li>
                    <li>Elegant design suitable for all occasions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-black mb-6">Recently Viewed Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={`Related Product ${index}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-black mb-2">Related Watch {index}</h3>
                  <p className="text-gray-600 text-sm mb-2">BLACK - Rs. 2,299.00</p>
                  <p className="text-gray-600 text-sm mb-3">BLUE - Rs. 2,299.00</p>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    Add to cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
                </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
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
              <div className="flex justify-center mt-4 space-x-2">
                {product.images.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-yellow-400' 
                        : 'border-gray-400 hover:border-gray-300'
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
