import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
    const googleSecret = process.env.GOOGLE_CLIENT_SECRET || ''
    const nextAuthUrl = process.env.NEXTAUTH_URL || ''
    
    // Check if values are placeholder/invalid
    const isGoogleClientIdValid = googleClientId && 
      !googleClientId.includes('your-google-client-id') && 
      googleClientId.includes('.apps.googleusercontent.com')
    
    const isGoogleSecretValid = googleSecret && 
      !googleSecret.includes('your-google-client-secret') && 
      (googleSecret.startsWith('GOCSPX-') || googleSecret.length > 20)
    
    return NextResponse.json({
      hasGoogleClientId: !!googleClientId,
      googleClientIdValid: isGoogleClientIdValid,
      googleClientIdPreview: googleClientId ? 
        (isGoogleClientIdValid ? 
          `${googleClientId.substring(0, 20)}...` : 
          'Placeholder value detected') : 
        'Not set',
      
      hasGoogleSecret: !!googleSecret,
      googleSecretValid: isGoogleSecretValid,
      
      hasNextAuthUrl: !!nextAuthUrl,
      nextAuthUrl: nextAuthUrl || 'Not set',
      
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      
      hasDatabase: !!process.env.MYSQL_URL,
      
      overallStatus: isGoogleClientIdValid && isGoogleSecretValid ? 
        'ready' : 'needs_configuration',
      
      message: isGoogleClientIdValid && isGoogleSecretValid ?
        '✅ Google OAuth is configured correctly!' :
        '⚠️ Google OAuth credentials need to be configured. Visit /debug-oauth for instructions.'
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { error: 'Failed to check environment' },
      { status: 500 }
    )
  }
}
