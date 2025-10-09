# UPI Payment App Integration Guide

## 🎯 Overview

The Walnut Store now features direct UPI app integration for mobile users! When customers checkout on mobile devices, they can tap their preferred UPI app (PhonePe, Google Pay, Paytm, FamPay) and the app will open automatically for instant payment.

## ✨ Features

### Mobile-Specific UPI Apps
- **PhonePe** - Purple gradient button
- **Google Pay** - Blue gradient button  
- **Paytm** - Cyan gradient button
- **FamPay** - Yellow/Orange gradient button
- **Other UPI Apps** - Generic UPI for BHIM, Amazon Pay, etc.

### User Experience
1. Customer selects UPI as payment method
2. **On Mobile**: Beautiful app buttons appear
3. Customer taps their preferred app
4. App opens automatically with payment pre-filled
5. Customer completes payment in their app
6. Returns to website for order confirmation

### Desktop Experience
- UPI app buttons don't show on desktop
- Desktop users continue with existing Cashfree payment flow
- Responsive design ensures optimal experience on all devices

## 🔧 Setup Instructions

### Step 1: Get Your UPI Merchant ID

You need a UPI merchant/business account. Options:

**Option A: Paytm for Business**
1. Create account at https://business.paytm.com/
2. Get verified as a business
3. Your UPI ID will be like: `yourstore@paytm`

**Option B: PhonePe for Business**
1. Create account at https://business.phonepe.com/
2. Complete business verification
3. Your UPI ID will be like: `yourstore@ybl`

**Option C: Google Pay for Business**
1. Create account at https://pay.google.com/business
2. Get your UPI merchant ID
3. Format: `yourstore@okaxis` or similar

**Option D: Your Bank's UPI**
- Most banks provide UPI IDs for businesses
- Contact your bank for a business UPI ID

### Step 2: Add to Environment Variables

**For Production (Vercel):**

Add these to your Vercel project:
```
NEXT_PUBLIC_UPI_ID=yourstore@paytm
NEXT_PUBLIC_UPI_MERCHANT_NAME=Walnut Store
```

**For Local Development:**

Add to `.env.local`:
```
NEXT_PUBLIC_UPI_ID=yourstore@paytm
NEXT_PUBLIC_UPI_MERCHANT_NAME=Walnut Store
```

### Step 3: Test on Mobile

1. Deploy to Vercel (or use local dev on mobile)
2. Add product to cart
3. Go to checkout
4. Select "UPI" as payment method
5. You should see the app buttons appear!
6. Tap an app to test the deep link

## 📱 How It Works

### UPI Deep Links

The system generates UPI deep links in this format:
```
upi://pay?pa=merchant@upi&pn=MerchantName&am=1000.00&cu=INR&tn=Order123&mc=5411
```

### App-Specific Deep Links

Different apps use slightly different URL schemes:

- **PhonePe**: `phonepe://pay?...`
- **Google Pay**: `tez://upi/pay?...`
- **Paytm**: `paytmmp://pay?...`
- **FamPay**: `fampay://upi/pay?...`
- **Generic UPI**: `upi://pay?...` (works with BHIM, etc.)

### Mobile Detection

The component automatically detects mobile devices using:
- User agent detection
- Screen size detection (≤768px)
- Only shows UPI apps on mobile
- Desktop users don't see the buttons

## 🎨 Design Features

### Beautiful Gradient Cards
Each payment app has its own brand colors:
- **PhonePe**: Purple gradient (`from-purple-600 to-purple-800`)
- **Google Pay**: Blue gradient (`from-blue-500 to-blue-700`)
- **Paytm**: Cyan gradient (`from-cyan-500 to-blue-600`)
- **FamPay**: Yellow gradient (`from-yellow-400 to-orange-500`)

### Interactive Effects
- ✅ Hover scale effect (scales to 105%)
- ✅ Active press effect (scales to 95%)
- ✅ Shimmer overlay on hover
- ✅ Shadow elevation on hover
- ✅ Smooth transitions (200ms)

### Visual Feedback
- 🛒 Success toast when app opens
- 💡 Fallback toast if app doesn't open
- ⏳ Loading toast while opening
- ✅ Amount prominently displayed

## 📊 Components Created

### 1. `components/checkout/upi-apps.tsx`
Main UPI apps component with:
- Mobile detection
- Deep link generation
- Payment app buttons
- Toast notifications
- Amount display

### 2. Updated `app/checkout/page.tsx`
- Import UPIApps component
- Show UPIApps when UPI selected on mobile
- Pass order details and amount

### 3. Updated Environment Files
- Added `NEXT_PUBLIC_UPI_ID`
- Added `NEXT_PUBLIC_UPI_MERCHANT_NAME`

## 🔐 Security Considerations

### UPI Deep Links Are Secure
- ✅ No sensitive data in URL
- ✅ Payment happens in the banking app
- ✅ UPI's built-in security (PIN, biometrics)
- ✅ Transaction can't be modified by user

### What's Sent in Deep Link
- ✅ Merchant UPI ID (public anyway)
- ✅ Merchant name
- ✅ Amount (visible to customer)
- ✅ Order ID (for reference)
- ❌ NO customer details
- ❌ NO sensitive information

## 🧪 Testing Guide

### Test on Android Device

1. **Install UPI apps** you want to test:
   - PhonePe
   - Google Pay
   - Paytm
   - FamPay

2. **Test the flow**:
   - Add product to cart on mobile
   - Go to checkout
   - Fill shipping info
   - Select "UPI" payment method
   - Tap PhonePe button
   - PhonePe app should open with payment details

3. **What to verify**:
   - ✅ App opens automatically
   - ✅ Amount is correct
   - ✅ Merchant name shows
   - ✅ Order ID appears in notes
   - ✅ Can complete or cancel payment

### Test on iPhone (iOS)

**Note**: iOS handles deep links differently:
- Google Pay works with `tez://`
- Paytm works with `paytmmp://`
- PhonePe works with `phonepe://`
- Generic `upi://` might not work on iOS

**iOS Testing Checklist**:
- Test each app individually
- Verify app opens correctly
- Check if payment details are pre-filled

### Test on Desktop

Desktop users should:
- ❌ NOT see UPI app buttons
- ✅ Continue with Cashfree payment flow
- ✅ Have all payment options via Cashfree

## 💡 Best Practices

### For Customers

**Clear Instructions**:
1. Select UPI payment method
2. Choose your payment app
3. Complete payment in the app
4. Return to website for confirmation

**Timeout Handling**:
- If app doesn't open, customer can try another app
- Generic UPI button as fallback
- Customer can always switch to other payment methods

### For Admins

**Monitor Payments**:
- UPI payments are instant
- Check your UPI merchant dashboard
- Match order IDs with UPI transaction IDs
- Handle payment confirmations manually until webhook is set up

## 🚀 Future Enhancements

### Possible Improvements
1. **Add actual payment app logos** (replace emojis with SVG logos)
2. **UPI Intent API** for better Android integration
3. **Payment status webhook** from UPI apps
4. **QR Code option** for desktop UPI payments
5. **Save preferred UPI app** for returning customers
6. **Payment timeout detection**

### Payment Verification
Currently, payment verification needs to be done manually:
1. Customer completes payment in app
2. You verify payment in your UPI merchant dashboard
3. Manually mark order as paid
4. Send confirmation email

**Future**: Implement payment webhook to automatically verify and confirm orders.

## ⚠️ Important Notes

### UPI ID Required
- You MUST set `NEXT_PUBLIC_UPI_ID` in Vercel for this to work
- Without it, the default placeholder will be used
- Get a business UPI ID from Paytm Business, PhonePe Business, or your bank

### Mobile-Only Feature
- UPI app buttons only appear on mobile devices
- Desktop users won't see them
- This is intentional - desktop uses Cashfree

### Deep Link Limitations
- Apps must be installed for deep links to work
- If app not installed, nothing happens
- That's why we provide multiple app options
- Generic UPI as fallback for other apps

## 📚 Resources

- [UPI Deep Link Specification](https://www.npci.org.in/what-we-do/upi/upi-specification)
- [PhonePe Business](https://business.phonepe.com/)
- [Paytm for Business](https://business.paytm.com/)
- [Google Pay for Business](https://pay.google.com/business)

## 🆘 Troubleshooting

### App Doesn't Open
**Cause**: Deep link format or app not installed  
**Solution**: Try another app or use generic UPI button

### Wrong Amount Shows
**Cause**: Amount calculation error  
**Solution**: Check total calculation in checkout page

### Payment Completed But Order Not Confirmed
**Cause**: No payment verification webhook  
**Solution**: Manually verify and confirm orders

### Desktop Shows UPI Apps
**Cause**: Mobile detection not working  
**Solution**: Check browser console for `isMobile` value

---

## ✅ What's Working Now

After deployment:

✅ **Mobile users** see beautiful payment app buttons  
✅ **One-tap payment** - App opens with details pre-filled  
✅ **Multiple app support** - PhonePe, GPay, Paytm, FamPay, Others  
✅ **Smooth UX** - Toasts guide users through the flow  
✅ **Desktop unchanged** - Existing Cashfree flow works  
✅ **Responsive** - Adapts to screen size  

Your customers now have the **fastest payment experience possible** on mobile! 🚀

---

*Last Updated: October 9, 2025*

