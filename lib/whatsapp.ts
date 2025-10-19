import { formatPhoneNumber } from './otp'

interface WhatsAppSendResult {
  success: boolean
  error?: string
}

/**
 * Send OTP via WhatsApp Cloud API
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */
export async function sendOTPViaWhatsApp(phone: string, otp: string): Promise<WhatsAppSendResult> {
  try {
    const token = process.env.META_WHATSAPP_TOKEN
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID
    const templateName = process.env.META_TEMPLATE_NAME || 'otp_verification'
    const templateLang = process.env.META_TEMPLATE_LANG || 'en_US'

    if (!token || !phoneNumberId) {
      return { success: false, error: 'WhatsApp credentials not configured' }
    }

    const to = formatPhoneNumber(phone).replace(/^\+/, '')

    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`

    // Use a template message of type "AUTHENTICATION" with a single parameter (OTP)
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: templateLang },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: otp }
            ]
          }
        ]
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ WhatsApp send failed:', errorText)
      return { success: false, error: errorText }
    }

    console.log('✅ WhatsApp OTP sent:', phone)
    return { success: true }
  } catch (error: any) {
    console.error('❌ WhatsApp error:', error)
    return { success: false, error: error?.message || 'Unknown error' }
  }
}


