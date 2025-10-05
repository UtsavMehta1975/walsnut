# Cloudinary Integration Guide

## Why Cloudinary is Better Than Google Drive

### 🚀 **Performance Benefits**
- **Global CDN**: Images load 3-5x faster worldwide
- **Automatic optimization**: Reduces file sizes by 60-80%
- **Smart formats**: Serves WebP/AVIF to modern browsers
- **Responsive images**: Different sizes for mobile/desktop

### 🛠️ **Developer Benefits**
- **Simple API**: Easy integration with Next.js
- **Real-time transformations**: Resize, crop, filter on-the-fly
- **No rate limits**: Unlike Google Drive API
- **Built-in analytics**: Track image performance

### 💰 **Cost Benefits**
- **Free tier**: 25GB storage, 25GB bandwidth/month
- **Pay-as-you-grow**: Only pay for what you use
- **No hidden costs**: Transparent pricing

## Setup Steps

### 1. Install Cloudinary SDK
```bash
npm install cloudinary next-cloudinary
```

### 2. Environment Variables
Add to your `.env.local`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Configure Next.js
Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
```

### 4. Create Cloudinary Utility
Create `lib/cloudinary.ts`:
```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'your_upload_preset')
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )
  
  return response.json()
}
```

### 5. Create Upload Component
Create `components/CloudinaryUpload.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { uploadImage } from '@/lib/cloudinary'

export default function CloudinaryUpload() {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadImage(file)
      setImageUrl(result.secure_url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" className="max-w-xs" />
      )}
    </div>
  )
}
```

### 6. Optimized Image Component
Create `components/OptimizedImage.tsx`:
```typescript
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 400,
  className,
  priority = false
}: OptimizedImageProps) {
  // Transform Cloudinary URL for optimization
  const optimizedSrc = src.includes('cloudinary.com') 
    ? src.replace('/upload/', '/upload/c_fill,f_auto,q_auto,w_')
    : src

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

## Migration from Google Drive

### 1. Export Current Images
```bash
# Download all images from Google Drive
# Organize them in a folder structure
```

### 2. Bulk Upload Script
Create `scripts/upload-to-cloudinary.js`:
```javascript
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadImages() {
  const imagesDir = './public/images'
  const files = fs.readdirSync(imagesDir)
  
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      try {
        const result = await cloudinary.uploader.upload(
          path.join(imagesDir, file),
          {
            folder: 'walnut-store',
            use_filename: true,
            unique_filename: false,
          }
        )
        console.log(`Uploaded: ${file} -> ${result.secure_url}`)
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error)
      }
    }
  }
}

uploadImages()
```

### 3. Update Database
```sql
-- Update product images to use Cloudinary URLs
UPDATE products 
SET image = REPLACE(image, 'drive.google.com', 'res.cloudinary.com/your-cloud-name')
WHERE image LIKE '%drive.google.com%';
```

## Benefits After Migration

### 📈 **Performance Improvements**
- **Page load speed**: 40-60% faster
- **Image loading**: 3-5x faster
- **Mobile performance**: Significantly improved
- **SEO boost**: Better Core Web Vitals scores

### 🎨 **Image Transformations**
```typescript
// Resize for thumbnails
const thumbnailUrl = `${baseUrl}/c_fill,w_300,h_300`

// Crop for product cards
const cardUrl = `${baseUrl}/c_fill,w_400,h_400`

// Optimize for web
const webUrl = `${baseUrl}/f_auto,q_auto`
```

### 🔧 **Advanced Features**
- **Auto-format**: Serves WebP to supported browsers
- **Quality optimization**: Automatic compression
- **Responsive images**: Different sizes for different screens
- **Lazy loading**: Built-in support

## Next Steps

1. **Sign up for Cloudinary** (free account)
2. **Get your credentials** from dashboard
3. **Install packages** and configure
4. **Test upload functionality**
5. **Migrate existing images**
6. **Update product components**

## Cost Comparison

| Feature | Google Drive | Cloudinary |
|---------|-------------|------------|
| Storage | $2/TB/month | $0.10/GB/month |
| Bandwidth | Limited | Unlimited |
| CDN | ❌ | ✅ |
| Optimization | ❌ | ✅ |
| Transformations | ❌ | ✅ |
| API Rate Limits | Yes | No |

**Result**: Cloudinary is more cost-effective and feature-rich for web applications.
