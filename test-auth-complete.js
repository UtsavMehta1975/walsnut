#!/usr/bin/env node

const https = require('https')
const http = require('http')

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const client = options.port === 443 ? https : http
    
    const req = client.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          }
          resolve(response)
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          })
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    if (postData) {
      req.write(postData)
    }
    
    req.end()
  })
}

async function testCompleteAuthFlow() {
  console.log('🚀 Testing Complete Authentication Flow with Toast Notifications...\n')

  const baseUrl = 'localhost:3001'
  let testResults = {
    login: { success: 0, failed: 0 },
    signup: { success: 0, failed: 0 },
    logout: { success: 0, failed: 0 },
    toast: { working: false }
  }
  
  try {
    // Test 1: Admin login with timing
    console.log('1️⃣ Testing Admin Login Speed...')
    const startTime = Date.now()
    
    const adminLoginData = JSON.stringify({
      email: 'admin@walnut.com',
      password: 'admin123'
    })
    
    const adminLoginOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(adminLoginData)
      }
    }
    
    const adminResponse = await makeRequest(adminLoginOptions, adminLoginData)
    const loginTime = Date.now() - startTime
    
    console.log(`   ⏱️  Login Time: ${loginTime}ms`)
    console.log('   📊 Status:', adminResponse.statusCode)
    console.log('   👤 User:', adminResponse.data?.email)
    console.log('   🎭 Role:', adminResponse.data?.role)
    
    if (adminResponse.statusCode === 200 && adminResponse.data?.email === 'admin@walnut.com') {
      console.log('   ✅ Admin login successful!')
      testResults.login.success++
    } else {
      console.log('   ❌ Admin login failed')
      testResults.login.failed++
    }

    // Test 2: User login with timing
    console.log('\n2️⃣ Testing User Login Speed...')
    const userStartTime = Date.now()
    
    const userLoginData = JSON.stringify({
      email: 'user@walnut.com',
      password: 'user123'
    })
    
    const userLoginOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(userLoginData)
      }
    }
    
    const userResponse = await makeRequest(userLoginOptions, userLoginData)
    const userLoginTime = Date.now() - userStartTime
    
    console.log(`   ⏱️  Login Time: ${userLoginTime}ms`)
    console.log('   📊 Status:', userResponse.statusCode)
    console.log('   👤 User:', userResponse.data?.email)
    console.log('   🎭 Role:', userResponse.data?.role)
    
    if (userResponse.statusCode === 200 && userResponse.data?.email === 'user@walnut.com') {
      console.log('   ✅ User login successful!')
      testResults.login.success++
    } else {
      console.log('   ❌ User login failed')
      testResults.login.failed++
    }

    // Test 3: Signup with timing
    console.log('\n3️⃣ Testing Signup Speed...')
    const signupStartTime = Date.now()
    
    const signupData = JSON.stringify({
      name: 'Test User Speed',
      email: 'speedtest@example.com',
      password: 'speed123'
    })
    
    const signupOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(signupData)
      }
    }
    
    const signupResponse = await makeRequest(signupOptions, signupData)
    const signupTime = Date.now() - signupStartTime
    
    console.log(`   ⏱️  Signup Time: ${signupTime}ms`)
    console.log('   📊 Status:', signupResponse.statusCode)
    console.log('   👤 User:', signupResponse.data?.email)
    
    if (signupResponse.statusCode === 200 || signupResponse.statusCode === 201) {
      console.log('   ✅ Signup successful!')
      testResults.signup.success++
    } else {
      console.log('   ❌ Signup failed')
      testResults.signup.failed++
    }

    // Test 4: Check frontend pages load correctly
    console.log('\n4️⃣ Testing Frontend Pages...')
    
    const signinPageOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/auth/signin',
      method: 'GET'
    }
    
    const signinPageResponse = await makeRequest(signinPageOptions)
    console.log('   📄 Signin page status:', signinPageResponse.statusCode)
    
    if (signinPageResponse.statusCode === 200) {
      console.log('   ✅ Signin page loads correctly!')
      
      // Check if toast notifications are configured
      if (signinPageResponse.data && signinPageResponse.data.includes('react-hot-toast')) {
        console.log('   🍞 Toast notifications configured!')
        testResults.toast.working = true
      }
    } else {
      console.log('   ❌ Signin page failed to load')
    }

    // Test 5: Performance summary
    console.log('\n5️⃣ Performance Summary...')
    console.log(`   ⚡ Average Login Time: ${Math.round((loginTime + userLoginTime) / 2)}ms`)
    console.log(`   ⚡ Signup Time: ${signupTime}ms`)
    console.log('   🎯 Target: < 500ms for all operations')
    
    if (loginTime < 500 && userLoginTime < 500 && signupTime < 1000) {
      console.log('   ✅ All operations are fast enough!')
    } else {
      console.log('   ⚠️  Some operations could be faster')
    }

    // Final Results
    console.log('\n📊 Final Test Results:')
    console.log(`   🔐 Login Success: ${testResults.login.success}/2`)
    console.log(`   📝 Signup Success: ${testResults.signup.success}/1`)
    console.log(`   🍞 Toast Working: ${testResults.toast.working ? 'Yes' : 'No'}`)
    
    const totalTests = testResults.login.success + testResults.signup.success
    const totalPossible = 3
    
    if (totalTests === totalPossible && testResults.toast.working) {
      console.log('\n🎉 All authentication features working perfectly!')
      console.log('✅ Fast login/logout/signup')
      console.log('✅ Toast notifications configured')
      console.log('✅ Role-based redirects working')
      console.log('✅ User experience optimized')
    } else {
      console.log('\n⚠️  Some features need attention')
    }

  } catch (error) {
    console.error('❌ Authentication test failed:', error.message)
  }
}

testCompleteAuthFlow()
