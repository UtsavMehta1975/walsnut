import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email }
    })

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store token in VerificationToken table
    await db.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires: resetTokenExpiry
      }
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    // Send email
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
      color: black;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      background: #F59E0B;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .warning {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      background: #f9f9f9;
      padding: 20px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🕐 Walnut Watches</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hi ${user.name || 'there'},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <center>
        <a href="${resetUrl}" class="button">Reset Password</a>
      </center>

      <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
      <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
        ${resetUrl}
      </p>

      <div class="warning">
        <strong>⚠️ Important:</strong><br>
        • This link will expire in 1 hour<br>
        • If you didn't request this, please ignore this email<br>
        • Your password won't change until you create a new one
      </div>

      <p style="color: #666; font-size: 14px;">
        If you're having trouble, contact our support team at thewalnutstore01@gmail.com
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Walnut Watches. All rights reserved.</p>
      <p>Premium Timepieces for the Discerning Collector</p>
    </div>
  </div>
</body>
</html>
    `

    const emailSent = await sendEmail(
      email,
      'Reset Your Walnut Password',
      emailHTML
    )

    if (!emailSent) {
      console.warn('⚠️ Email failed to send, but token was created')
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}


