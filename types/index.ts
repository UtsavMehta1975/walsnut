import { User, Product, Order, Category, Review, WatchWishlist } from '@prisma/client'

// Database Models with Relations
export type UserWithOrders = User & {
  orders: Order[]
  wishlistItems: WatchWishlist[]
  reviews: Review[]
}

export type ProductWithImages = Product & {
  images: {
    id: string
    imageUrl: string
    altText: string | null
    isPrimary: boolean
    sortOrder: number
  }[]
  category: Category | null
  reviews: Review[]
  _count: {
    reviews: number
    wishlistItems: number
  }
}

export type ProductWithDetails = Product & {
  images: {
    id: string
    imageUrl: string
    altText: string | null
    isPrimary: boolean
    sortOrder: number
  }[]
  category: Category | null
  reviews: (Review & {
    user: {
      name: string | null
    }
  })[]
  _count: {
    reviews: number
    wishlistItems: number
  }
}

export type OrderWithItems = Order & {
  orderItems: {
    id: string
    quantity: number
    priceAtTimeOfPurchase: number
    product: {
      id: string
      brand: string
      model: string
      images: {
        imageUrl: string
        isPrimary: boolean
      }[]
    }
  }[]
  user: {
    name: string | null
    email: string
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface SignUpFormData {
  name: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

export interface SignInFormData {
  email: string
  password: string
}

export interface ProductFormData {
  brand: string
  model: string
  referenceNumber?: string
  description: string
  price: number
  previousPrice?: number
  condition: 'NEW' | 'PRE_OWNED' | 'VINTAGE'
  year?: number
  gender: 'MENS' | 'WOMENS' | 'UNISEX'
  movement: 'AUTOMATIC' | 'MANUAL' | 'QUARTZ'
  caseMaterial: string
  bandMaterial: string
  waterResistance?: string
  diameter?: string
  authenticityStatus: 'PENDING' | 'VERIFIED' | 'CERTIFIED'
  stockQuantity: number
  isFeatured: boolean
  categoryId?: string
}

export interface CheckoutFormData {
  email: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

// Filter Types
export interface ProductFilters {
  brand?: string[]
  priceRange?: [number, number]
  condition?: string[]
  gender?: string[]
  movement?: string[]
  caseMaterial?: string[]
  bandMaterial?: string[]
  category?: string
  search?: string
  sortBy?: 'price' | 'newest' | 'popularity' | 'name'
  sortOrder?: 'asc' | 'desc'
}

// Cart Types
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity?: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Wishlist Types
export interface WishlistItem {
  id: string
  productId: string
  brand: string
  model: string
  price: number
  imageUrl: string
  addedAt: Date
}

// Analytics Types
export interface SalesAnalytics {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topSellingProducts: {
    productId: string
    brand: string
    model: string
    totalSold: number
    revenue: number
  }[]
  salesByPeriod: {
    period: string
    sales: number
    orders: number
  }[]
}

export interface InventoryAnalytics {
  totalProducts: number
  totalValue: number
  lowStockProducts: {
    productId: string
    brand: string
    model: string
    stockQuantity: number
  }[]
  stockByCategory: {
    category: string
    count: number
    value: number
  }[]
}

// Cloudinary Types
export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

// Stripe Types
export interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

// NextAuth Types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      phone?: string | null
      image?: string | null
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    phone?: string | null
    image?: string | null
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    image?: string | null
  }
}

