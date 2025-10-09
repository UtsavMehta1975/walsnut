# 🔍 UPI Payment Debugging Guide

## How to Debug UPI Payment Flow

### Step 1: Open Browser Console

**On Mobile Chrome:**
1. Open Chrome
2. Go to: `chrome://inspect`
3. OR use Desktop Chrome → Connect phone via USB → Remote debugging

**On Desktop (for testing):**
1. Press `F12` or `Cmd+Option+I`
2. Go to "Console" tab

### Step 2: Reproduce the Issue

1. Go to checkout page
2. Select "UPI" payment method
3. Click any UPI app button (PhonePe, GPay, etc.)
4. Watch the console logs

### Step 3: Check the Logs

**SUCCESS PATTERN (Expected):**
```
🚀 Starting UPI payment via Cashfree payment page
💰 Amount: 5999
📱 App selected: PhonePe
📝 Creating order...
📡 Order API response status: 200
✅ Order created successfully: clxxx...
💳 Calling UPI payment API...
📡 UPI API response status: 200
✅ UPI payment response: {...}
✅ Payment session ID obtained: session_xxx...
📱 Loading Cashfree SDK...
✅ Cashfree SDK ready
🔧 Initializing Cashfree instance...
✅ Cashfree instance created
🌐 Return URL: https://...
🎫 Payment Session ID: session_xxx...
🚀 Opening Cashfree checkout...
✅ Cashfree checkout initiated!
```

**Then:** Cashfree payment page should open!

### Step 4: Common Issues & Solutions

#### Issue 1: Order Creation Fails
**Logs show:**
```
📝 Creating order...
📡 Order API response status: 500
❌ Order creation failed: ...
```

**Solution:**
- Check if user is authenticated
- Check database connection
- Check `/api/orders` endpoint
- Verify cart has items

#### Issue 2: UPI API Fails
**Logs show:**
```
✅ Order created successfully
💳 Calling UPI payment API...
📡 UPI API response status: 500
❌ UPI payment init failed: ...
```

**Solution:**
- Check Cashfree credentials in Vercel environment variables
- Verify `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY`
- Check backend logs in Vercel

#### Issue 3: No Payment Session ID
**Logs show:**
```
✅ UPI payment response: {success: true, ...}
❌ No payment session ID in response
```

**Solution:**
- Check Cashfree API response format
- Verify Cashfree account is active
- Check if UPI is enabled in Cashfree dashboard

#### Issue 4: Cashfree SDK Fails
**Logs show:**
```
📱 Loading Cashfree SDK...
❌ Failed to load Cashfree SDK
```

**Solution:**
- Check internet connection
- Try different network
- Verify URL: https://sdk.cashfree.com/js/v3/cashfree.js

#### Issue 5: Checkout Doesn't Open
**Logs show:**
```
✅ Cashfree checkout initiated!
[But nothing happens]
```

**Solution:**
- Check if popup blocker is active
- Try allowing popups for your site
- Check Cashfree dashboard for order status

### Step 5: Send Me the Logs

If it's still not working, send me:

1. **Complete console logs** (copy all logs from start to error)
2. **Error message** (if any)
3. **What you see** (blank screen? error? nothing?)
4. **Network tab** (check if APIs are called)

### Step 6: Check Network Tab

1. In DevTools, click "Network" tab
2. Click UPI button
3. Check these requests:
   - `POST /api/orders` - Should be 200 OK
   - `POST /api/payments/upi-collect` - Should be 200 OK
   - `GET cashfree.js` - Should be 200 OK

### Quick Tests

**Test 1: Is Cashfree SDK Loading?**
```javascript
// In console, type:
console.log(window.Cashfree)
// Should show: function or object
```

**Test 2: Can We Create Order?**
```javascript
// In console, type:
fetch('/api/orders', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    items: [],
    totalAmount: 100,
    shippingAddress: 'Test',
    paymentMethod: 'upi'
  })
}).then(r => r.json()).then(console.log)
```

**Test 3: Environment Variables Set?**
```javascript
// Check in console
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL)
```

---

## 🎯 Most Likely Issues

### 1. Order Creation Failing
- Check if you're on checkout page with items in cart
- Verify user authentication
- Check database connection

### 2. Cashfree Credentials Missing
- Go to Vercel → Your Project → Settings → Environment Variables
- Verify these exist:
  - `CASHFREE_APP_ID`
  - `CASHFREE_SECRET_KEY`
  - `NEXT_PUBLIC_APP_URL`

### 3. Popup Blocked
- Browser may be blocking Cashfree popup
- Check for popup blocker icon in address bar
- Allow popups for your site

---

## 📞 Next Steps

**After testing:**
1. Open browser console
2. Click UPI button
3. Copy ALL console logs
4. Send me the logs
5. I'll identify the exact issue immediately!

---

Last Updated: October 9, 2025

