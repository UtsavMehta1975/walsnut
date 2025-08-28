'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface ProductSpecifications {
  movement: string
  case: string
  dial: string
  bracelet: string
  waterResistance: string
  powerReserve: string
  diameter: string
  thickness: string
}

interface Product {
  id: string
  brand: string
  model: string
  referenceNumber: string
  year: number
  condition: string
  price: number
  previousPrice?: number
  images: Array<{
    id: string
    imageUrl: string
    altText: string
    isPrimary: boolean
  }>
  stockQuantity: number
  description: string
  specifications: ProductSpecifications
  authenticity: {
    guaranteed: boolean
    certificate: boolean
    serviceHistory: boolean
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id: productId } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addItem } = useCartStore()

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        
        // Transform the data to match our interface
        const transformedProduct: Product = {
          id: data.id,
          brand: data.brand,
          model: data.model,
          referenceNumber: data.referenceNumber || '',
          year: data.year || 0,
          condition: data.condition,
          price: parseFloat(data.price),
          previousPrice: data.previousPrice ? parseFloat(data.previousPrice) : undefined,
          images: (data.images || []).map((img: any) => ({
            ...img,
            imageUrl: img.imageUrl?.replace(/\\u0026/g, '&').replace(/\\/g, '') || img.imageUrl
          })),
          stockQuantity: data.stockQuantity,
          description: data.description,
          specifications: {
            movement: data.movement || 'Automatic',
            case: data.caseMaterial || 'Stainless Steel',
            dial: 'Classic dial design',
            bracelet: data.bandMaterial || 'Stainless Steel',
            waterResistance: data.waterResistance || '50m',
            powerReserve: '48 hours',
            diameter: data.diameter || '40mm',
            thickness: '10mm'
          },
          authenticity: {
            guaranteed: data.authenticityStatus === 'CERTIFIED',
            certificate: data.authenticityStatus === 'CERTIFIED',
            serviceHistory: data.authenticityStatus === 'VERIFIED'
          }
        }
        
        setProduct(transformedProduct)
        
        // Fetch related products
        fetchRelatedProducts(data.brand, data.id)
      } else {
        toast.error('Product not found')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const fetchRelatedProducts = async (brand: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/products?brand=${brand}&limit=4`)
      if (response.ok) {
        const data = await response.json()
        const filtered = data.data
          .filter((p: any) => p.id !== excludeId)
          .slice(0, 3)
          .map((p: any) => ({
            id: p.id,
            brand: p.brand,
            model: p.model,
            referenceNumber: p.referenceNumber || '',
            year: p.year || 0,
            condition: p.condition,
            price: parseFloat(p.price),
            previousPrice: p.previousPrice ? parseFloat(p.previousPrice) : undefined,
            images: (p.images || []).map((img: any) => ({
              ...img,
              imageUrl: img.imageUrl?.replace(/\\u0026/g, '&').replace(/\\/g, '') || img.imageUrl
            })),
            stockQuantity: p.stockQuantity,
            description: p.description,
            specifications: {
              movement: p.movement || 'Automatic',
              case: p.caseMaterial || 'Stainless Steel',
              dial: 'Classic dial design',
              bracelet: p.bandMaterial || 'Stainless Steel',
              waterResistance: p.waterResistance || '50m',
              powerReserve: '48 hours',
              diameter: p.diameter || '40mm',
              thickness: '10mm'
            },
            authenticity: {
              guaranteed: p.authenticityStatus === 'CERTIFIED',
              certificate: p.authenticityStatus === 'CERTIFIED',
              serviceHistory: p.authenticityStatus === 'VERIFIED'
            }
          }))
        setRelatedProducts(filtered)
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        imageUrl: product.images[0]?.imageUrl || '',
        stockQuantity: product.stockQuantity,
        quantity: 1
      })
      toast.success('Added to cart!')
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addItem({
        productId: product.id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        imageUrl: product.images[0]?.imageUrl || '',
        stockQuantity: product.stockQuantity,
        quantity: 1
      })
      // Redirect to checkout
      window.location.href = '/checkout'
    }
  }

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/watches">
              <Button>Back to Watches</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-gold-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/watches" className="text-gray-700 hover:text-gold-600">
                  Watches
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.brand} {product.model}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
              <OptimizedImage
                src={product.images[selectedImage]?.imageUrl || product.images[0]?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNDAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2F0Y2ggSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}
                alt={product.images[selectedImage]?.altText || `${product.brand} ${product.model}`}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? 'border-gold-500' : 'border-gray-200'
                    }`}
                  >
                    <OptimizedImage
                      src={image.imageUrl}
                      alt={image.altText || `${product.brand} ${product.model}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand and Model */}
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {product.brand} {product.model}
              </h1>
              {product.referenceNumber && (
                <p className="text-gray-600">Reference: {product.referenceNumber}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.previousPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.previousPrice)}
                  </span>
                )}
              </div>
              {product.previousPrice && (
                <p className="text-green-600 font-medium">
                  Save {formatPrice(product.previousPrice - product.price)}
                </p>
              )}
            </div>

            {/* Condition and Year */}
            <div className="flex items-center space-x-4">
              <Badge variant={product.condition === 'NEW' ? 'default' : 'secondary'}>
                {product.condition.replace('_', ' ')}
              </Badge>
              {product.year && (
                <span className="text-gray-600">Year: {product.year}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-gray-600">
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
                className="w-full bg-gold-600 hover:bg-gold-700 text-white"
              >
                Buy Now
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  variant="outline"
                  className="w-full"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full"
                >
                  Add to Wishlist
                </Button>
              </div>
            </div>

            {/* Authenticity */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Authenticity Guarantee</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">100% Authentic</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Certificate of Authenticity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Service History Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Specifications</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Movement</h4>
                    <p className="text-gray-600">{product.specifications.movement}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Case</h4>
                    <p className="text-gray-600">{product.specifications.case}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dial</h4>
                    <p className="text-gray-600">{product.specifications.dial}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bracelet</h4>
                    <p className="text-gray-600">{product.specifications.bracelet}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Water Resistance</h4>
                    <p className="text-gray-600">{product.specifications.waterResistance}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Power Reserve</h4>
                    <p className="text-gray-600">{product.specifications.powerReserve}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Diameter</h4>
                    <p className="text-gray-600">{product.specifications.diameter}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Thickness</h4>
                    <p className="text-gray-600">{product.specifications.thickness}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/watches/${relatedProduct.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-square overflow-hidden rounded-lg mb-4">
                        <OptimizedImage
                          src={relatedProduct.images[0]?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UmVsYXRlZCBXYXRjaDwvdGV4dD4KPC9zdmc+Cg=='}
                          alt={relatedProduct.images[0]?.altText || `${relatedProduct.brand} ${relatedProduct.model}`}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {relatedProduct.brand} {relatedProduct.model}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{relatedProduct.referenceNumber}</p>
                      <p className="font-bold text-gray-900">{formatPrice(relatedProduct.price)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
