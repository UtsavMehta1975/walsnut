/**
 * Email Service for sending OTPs
 * Supports multiple providers: Resend, NodeMailer, SendGrid, etc.
 */

interface EmailProvider {
  name: string
  sendEmail: (to: string, subject: string, html: string) => Promise<boolean>
}

/**
 * Resend Implementation (Recommended - Modern, Simple)
 * Sign up: https://resend.com/
 */
async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error('❌ Resend API key not configured')
      return false
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Walnut <noreply@walnut.com>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    if (response.ok) {
      console.log('✅ Email sent via Resend:', to)
      return true
    } else {
      const error = await response.text()
      console.error('❌ Resend email failed:', error)
      return false
    }
  } catch (error) {
    console.error('❌ Resend email error:', error)
    return false
  }
}

/**
 * SendGrid Implementation
 */
async function sendViaSendGrid(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const apiKey = process.env.SENDGRID_API_KEY

    if (!apiKey) {
      console.error('❌ SendGrid API key not configured')
      return false
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: process.env.EMAIL_FROM || 'noreply@walnut.com',
          name: 'Walnut',
        },
        subject: subject,
        content: [{ type: 'text/html', value: html }],
      }),
    })

    if (response.ok) {
      console.log('✅ Email sent via SendGrid:', to)
      return true
    } else {
      const error = await response.text()
      console.error('❌ SendGrid email failed:', error)
      return false
    }
  } catch (error) {
    console.error('❌ SendGrid email error:', error)
    return false
  }
}

/**
 * Console Log (Development/Testing)
 */
async function sendViaConsole(to: string, subject: string, html: string): Promise<boolean> {
  console.log('\n📧 ===== EMAIL MESSAGE (DEVELOPMENT) =====')
  console.log(`📬 To: ${to}`)
  console.log(`📝 Subject: ${subject}`)
  console.log(`📄 HTML Content:\n${html}`)
  console.log('==========================================\n')
  return true
}

/**
 * Generate OTP Email HTML Template
 */
function generateOTPEmailHTML(otp: string, purpose: string = 'verification'): string {
  return `
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
      text-align: center;
    }
    .otp-box {
      background: #f9f9f9;
      border: 2px dashed #FCD34D;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #F59E0B;
      margin: 10px 0;
    }
    .info {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      background: #f9f9f9;
      padding: 20px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .warning {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 15px;
      margin: 20px 0;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🕐 Walnut Watches</h1>
    </div>
    <div class="content">
      <h2>Verify Your ${purpose === 'signup' ? 'Account' : 'Email'}</h2>
      <p class="info">Enter this code to complete your ${purpose}:</p>
      
      <div class="otp-box">
        <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
        <div class="otp-code">${otp}</div>
        <p style="margin: 0; color: #999; font-size: 12px;">Valid for 5 minutes</p>
      </div>

      <div class="warning">
        <strong>⚠️ Security Note:</strong><br>
        Never share this code with anyone. Walnut team will never ask for your OTP.
      </div>

      <p class="info">
        If you didn't request this code, please ignore this email or contact our support team.
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
}

/**
 * Main email sending function
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER || 'console'

  console.log(`📤 Sending email via ${provider} to ${to}`)

  try {
    switch (provider.toLowerCase()) {
      case 'resend':
        return await sendViaResend(to, subject, html)
      
      case 'sendgrid':
        return await sendViaSendGrid(to, subject, html)
      
      case 'console':
      default:
        return await sendViaConsole(to, subject, html)
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return false
  }
}

/**
 * Send OTP via Email (convenience function)
 */
export async function sendOTPViaEmail(email: string, otp: string, purpose: string = 'verification'): Promise<boolean> {
  const subject = `Your Walnut Verification Code: ${otp}`
  const html = generateOTPEmailHTML(otp, purpose)
  
  return sendEmail(email, subject, html)
}

