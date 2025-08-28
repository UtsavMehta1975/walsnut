'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Star, Edit, Trash2, Save, X as CloseIcon, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import { OptimizedImage } from '@/components/OptimizedImage'

interface ProductImage {
  id: string
  productId: string
  cloudinaryPublicId: string
  imageUrl: string
  altText: string
  isPrimary: boolean
  sortOrder: number
  createdAt: string
}

interface AdminImageManagerProps {
  productId: string
  className?: string
}

export default function AdminImageManager({ productId, className }: AdminImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [editAltText, setEditAltText] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newAltText, setNewAltText] = useState('')
  const [isAddingImage, setIsAddingImage] = useState(false)

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${productId}/images`)
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        toast.error('Failed to fetch images')
      }
    } catch (error) {
      toast.error('Failed to fetch images')
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  // Fetch images on component mount
  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: newImageUrl.trim(),
          altText: newAltText.trim() || 'Product image',
          isPrimary: images.length === 0, // First image is primary
          sortOrder: images.length
        }),
      })

      if (response.ok) {
        const newImage = await response.json()
        setImages([...images, newImage])
        setNewImageUrl('')
        setNewAltText('')
        setIsAddingImage(false)
        toast.success('Image added successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add image')
      }
    } catch (error) {
      toast.error('Failed to add image')
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPrimary: true
        }),
      })

      if (response.ok) {
        // Update local state
        setImages(images.map(img => ({
          ...img,
          isPrimary: img.id === imageId
        })))
        toast.success('Primary image updated!')
      } else {
        toast.error('Failed to update primary image')
      }
    } catch (error) {
      toast.error('Failed to update primary image')
    }
  }

  const handleUpdateAltText = async (imageId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          altText: editAltText
        }),
      })

      if (response.ok) {
        setImages(images.map(img => 
          img.id === imageId ? { ...img, altText: editAltText } : img
        ))
        setEditingImage(null)
        setEditAltText('')
        toast.success('Alt text updated!')
      } else {
        toast.error('Failed to update alt text')
      }
    } catch (error) {
      toast.error('Failed to update alt text')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId))
        toast.success('Image deleted successfully!')
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)

    // Update sort order
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      sortOrder: index
    }))

    setImages(updatedImages)

    // Update sort order in database
    try {
      await Promise.all(updatedImages.map(img => 
        fetch(`/api/products/${productId}/images/${img.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sortOrder: img.sortOrder
          }),
        })
      ))
    } catch (error) {
      toast.error('Failed to update image order')
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Product Images</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingImage(!isAddingImage)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image URL
          </Button>
        </div>

        {/* Add new image form */}
        {isAddingImage && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <Input
                  type="text"
                  placeholder="Description of the image"
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddImage} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingImage(false)
                    setNewImageUrl('')
                    setNewAltText('')
                  }}
                >
                  <CloseIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Images list */}
        <div className="space-y-3">
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No images added yet.</p>
              <p className="text-sm">Click &quot;Add Image URL&quot; to add your first image.</p>
            </div>
          ) : (
            images.map((image, index) => (
              <div
                key={image.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-white"
              >
                {/* Drag handle */}
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                
                {/* Image preview */}
                <div className="flex-shrink-0">
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="w-16 h-16 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Error'
                    }}
                  />
                </div>

                {/* Image info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {image.isPrimary && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">Order: {image.sortOrder + 1}</span>
                  </div>
                  
                  {editingImage === image.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editAltText}
                        onChange={(e) => setEditAltText(e.target.value)}
                        className="flex-1"
                        size={1}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateAltText(image.id)}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingImage(null)
                          setEditAltText('')
                        }}
                      >
                        <CloseIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 truncate">
                      {image.altText || 'No description'}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 truncate">
                    {image.imageUrl}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  {!image.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(image.id)}
                      title="Set as primary"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingImage(image.id)
                      setEditAltText(image.altText)
                    }}
                    title="Edit alt text"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteImage(image.id)}
                    title="Delete image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Use free image hosting services like Pexels, Unsplash, or Pixabay for fast-loading images. 
            The first image you add will automatically be set as the primary image.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
