import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Real Google Drive API integration
async function fetchGoogleDriveImages(folderId: string): Promise<any[]> {
  try {
    // For now, we'll use a public folder approach
    // In production, you'd need Google Drive API credentials
    
    // Method 1: Try to fetch from public folder (if folder is shared publicly)
    const publicFolderUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&key=${process.env.GOOGLE_DRIVE_API_KEY || 'demo'}&pageSize=1000`
    
    // Method 2: If no API key, try to parse the folder content from the sharing page
    // This is a fallback method for development
    
    if (process.env.GOOGLE_DRIVE_API_KEY) {
      // Real API call
      const response = await fetch(publicFolderUrl)
      if (response.ok) {
        const data = await response.json()
        return data.files || []
      }
    }
    
    // Fallback: Parse the folder content from the sharing page
    // This will work for public folders without API keys
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`
    const htmlResponse = await fetch(folderUrl)
    
    if (htmlResponse.ok) {
      const html = await htmlResponse.text()
      
      // Extract image information from the HTML
      const images: any[] = []
      
      // Look for image patterns in the HTML
      const imageMatches = html.match(/\["([^"]+\.(jpg|jpeg|png|gif))",\s*"([^"]+)",\s*"([^"]+)"/g)
      
      if (imageMatches) {
        imageMatches.forEach((match, index) => {
          const parts = match.match(/\["([^"]+\.(jpg|jpeg|png|gif))",\s*"([^"]+)",\s*"([^"]+)"/)
          if (parts) {
            const fileName = parts[1]
            const fileId = parts[3] || `img_${index + 1}`
            
            images.push({
              id: fileId,
              name: fileName,
              thumbnailLink: `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`,
              webContentLink: `https://drive.google.com/uc?export=view&id=${fileId}`,
              mimeType: 'image/jpeg'
            })
          }
        })
      }
      
      return images
    }
    
    return []
  } catch (error) {
    console.error('Error fetching Google Drive images:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const email = authHeader.replace('Bearer ', '')
    const adminUser = await db.user.findFirst({
      where: {
        email: email,
        role: 'ADMIN'
      }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { folderId } = body

    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      )
    }

    // Fetch images in real-time from Google Drive
    const images = await fetchGoogleDriveImages(folderId)
    
    if (images.length === 0) {
      return NextResponse.json({
        images: [],
        message: 'No images found in folder or folder is not accessible'
      })
    }

    return NextResponse.json({
      images,
      totalCount: images.length,
      message: `Successfully fetched ${images.length} images from Google Drive`
    })

  } catch (error) {
    console.error('Browse folder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
