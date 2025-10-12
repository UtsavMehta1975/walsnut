import { formatPhoneNumber } from './otp'

/**
 * SMS Service Configuration
 * Supports multiple providers: Twilio, MSG91, Fast2SMS, etc.
 */

interface SMSProvider {
  name: string
  sendSMS: (phone: string, message: string) => Promise<boolean>
}

/**
 * Fast2SMS Implementation (Popular in India)
 * Sign up: https://www.fast2sms.com/
 * Get API Key from dashboard
 */
async function sendViaTwilio(phone: string, message: string): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      console.error('❌ Twilio credentials not configured')
      return false
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: fromNumber,
          Body: message,
        }),
      }
    )

    if (response.ok) {
      console.log('✅ SMS sent via Twilio:', phone)
      return true
    } else {
      const error = await response.text()
      console.error('❌ Twilio SMS failed:', error)
      return false
    }
  } catch (error) {
    console.error('❌ Twilio SMS error:', error)
    return false
  }
}

/**
 * Fast2SMS Implementation (India)
 */
async function sendViaFast2SMS(phone: string, message: string): Promise<boolean> {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY

    if (!apiKey) {
      console.error('❌ Fast2SMS API key not configured')
      return false
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'v3',
        sender_id: 'WALNUT',
        message: message,
        language: 'english',
        flash: 0,
        numbers: formatPhoneNumber(phone).replace(/^\+91/, ''), // Remove +91 if present
      }),
    })

    const data = await response.json()

    if (data.return === true) {
      console.log('✅ SMS sent via Fast2SMS:', phone)
      return true
    } else {
      console.error('❌ Fast2SMS failed:', data)
      return false
    }
  } catch (error) {
    console.error('❌ Fast2SMS error:', error)
    return false
  }
}

/**
 * MSG91 Implementation (India)
 */
async function sendViaMSG91(phone: string, message: string): Promise<boolean> {
  try {
    const authKey = process.env.MSG91_AUTH_KEY
    const senderId = process.env.MSG91_SENDER_ID || 'WALNUT'

    if (!authKey) {
      console.error('❌ MSG91 auth key not configured')
      return false
    }

    const cleanPhone = formatPhoneNumber(phone).replace(/^\+91/, '') // Remove +91

    const response = await fetch(
      `https://api.msg91.com/api/v5/flow/`,
      {
        method: 'POST',
        headers: {
          'authkey': authKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flow_id: process.env.MSG91_FLOW_ID || '',
          sender: senderId,
          mobiles: `91${cleanPhone}`, // Add 91 country code
          message: message,
        }),
      }
    )

    const data = await response.json()

    if (data.type === 'success') {
      console.log('✅ SMS sent via MSG91:', phone)
      return true
    } else {
      console.error('❌ MSG91 failed:', data)
      return false
    }
  } catch (error) {
    console.error('❌ MSG91 error:', error)
    return false
  }
}

/**
 * Console Log (Development/Testing)
 */
async function sendViaConsole(phone: string, message: string): Promise<boolean> {
  console.log('\n📱 ===== SMS MESSAGE (DEVELOPMENT) =====')
  console.log(`📞 To: ${phone}`)
  console.log(`💬 Message: ${message}`)
  console.log('=======================================\n')
  return true
}

/**
 * Main SMS sending function
 * Automatically selects provider based on environment variables
 */
export async function sendSMS(phone: string, otp: string): Promise<boolean> {
  const message = `Your Walnut verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`

  const cleanPhone = formatPhoneNumber(phone)

  // Add +91 if not present (for Indian numbers)
  let formattedPhone = cleanPhone
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+91' + formattedPhone
  }

  // Select provider based on environment
  const provider = process.env.SMS_PROVIDER || 'console'

  console.log(`📤 Sending SMS via ${provider} to ${formattedPhone}`)

  try {
    switch (provider.toLowerCase()) {
      case 'twilio':
        return await sendViaTwilio(formattedPhone, message)
      
      case 'fast2sms':
        return await sendViaFast2SMS(formattedPhone, message)
      
      case 'msg91':
        return await sendViaMSG91(formattedPhone, message)
      
      case 'console':
      default:
        return await sendViaConsole(formattedPhone, message)
    }
  } catch (error) {
    console.error('❌ SMS sending failed:', error)
    return false
  }
}

/**
 * Send OTP via SMS (convenience function)
 */
export async function sendOTPViaSMS(phone: string, otp: string): Promise<boolean> {
  return sendSMS(phone, otp)
}

