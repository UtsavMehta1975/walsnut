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
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id: productId } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState('BLACK')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
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
          sku: p.sku || 'N/A'
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
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((imageUrl, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={`${product.name} - View ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                  />
                </div>
              ))}
            </div>
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
          <h2 className="text-2xl font-bold text-black mb-6">Product Specifications :</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="prose max-w-none">
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
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Key Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-black">Exclusivity:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Limited editions or unique designs that make the watch a statement piece</li>
                      <li>Often comes with a luxury box, certificates of authenticity, and sometimes a warranty.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Collection:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Manufactured by a renowned luxury brand, known for exceptional design, precision, and exclusivity.</li>
                      <li>Often comes with a signature logo or emblem that represents quality and sophistication.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Premium Materials:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>Case:</strong> Often crafted from stainless steel, titanium, or even precious metals like gold or platinum for enhanced durability and luxury appeal.</li>
                      <li><strong>Dial:</strong> May feature polished or textured finishes, with markers and hands made from high-quality metals like 18K gold, stainless steel, or even diamond accents.</li>
                      <li><strong>Crystal:</strong> Usually made from scratch-resistant sapphire crystal, which offers clarity and resistance to damage.</li>
                      <li><strong>Strap:</strong> Leather, stainless steel, or even exotic materials like alligator leather or rubber, designed for comfort and longevity.</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-black">Water Resistance:</h4>
                    <p className="text-gray-600">Most luxury watches are water-resistant to varying depths, making them suitable for everyday wear and light water exposure.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Sleek and Timeless Design:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>The design is often minimalist and elegant, with a classic appeal that works for both formal and casual occasions.</li>
                      <li>May feature complications such as date, day, or moon phase displays, adding functionality to its aesthetic.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Precision and Accuracy:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Known for impeccable timekeeping, with Swiss or Japanese movement providing high precision.</li>
                      <li>Generally subjected to rigorous testing and calibration to ensure accuracy and performance.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-black mb-4">Ideal for:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Those who appreciate refined aesthetics, cutting-edge craftsmanship, and the art of horology.</li>
                <li>Watch collectors or enthusiasts looking for a reliable, stylish, and exclusive timepiece.</li>
                <li>Gift-giving for special occasions such as anniversaries, promotions, or milestone celebrations.</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-gray-800">
                The Luxury Branded 7A Watch represents a perfect fusion of form and function, capturing the essence of luxury with every tick.
              </p>
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
      
      <Footer />
    </div>
  )
}
