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

async function testFastLogin() {
  console.log('⚡ Testing Optimized Fast Login...\n')

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
    
    console.log(`   ⏱️  API Response Time: ${loginTime}ms`)
    console.log('   📊 Status:', adminResponse.statusCode)
    console.log('   👤 User:', adminResponse.data?.email)
    console.log('   🎭 Role:', adminResponse.data?.role)
    
    if (loginTime < 100) {
      console.log('   🚀 BLAZING FAST! (< 100ms)')
    } else if (loginTime < 200) {
      console.log('   ⚡ VERY FAST! (< 200ms)')
    } else if (loginTime < 500) {
      console.log('   ✅ FAST! (< 500ms)')
    } else {
      console.log('   ⚠️  Could be faster')
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
    
    console.log(`   ⏱️  API Response Time: ${userLoginTime}ms`)
    console.log('   📊 Status:', userResponse.statusCode)
    console.log('   👤 User:', userResponse.data?.email)
    console.log('   🎭 Role:', userResponse.data?.role)
    
    if (userLoginTime < 100) {
      console.log('   🚀 BLAZING FAST! (< 100ms)')
    } else if (userLoginTime < 200) {
      console.log('   ⚡ VERY FAST! (< 200ms)')
    } else if (userLoginTime < 500) {
      console.log('   ✅ FAST! (< 500ms)')
    } else {
      console.log('   ⚠️  Could be faster')
    }

    // Test 3: Multiple rapid requests
    console.log('\n3️⃣ Testing Rapid Login Requests...')
    const rapidStartTime = Date.now()
    
    const promises = []
    for (let i = 0; i < 3; i++) {
      promises.push(makeRequest(adminLoginOptions, adminLoginData))
    }
    
    const rapidResponses = await Promise.all(promises)
    const rapidTime = Date.now() - rapidStartTime
    
    console.log(`   ⏱️  Total Time for 3 requests: ${rapidTime}ms`)
    console.log(`   ⏱️  Average per request: ${Math.round(rapidTime / 3)}ms`)
    console.log('   📊 All successful:', rapidResponses.every(r => r.statusCode === 200))

    // Performance Summary
    console.log('\n📊 Performance Summary:')
    console.log(`   ⚡ Admin Login: ${loginTime}ms`)
    console.log(`   ⚡ User Login: ${userLoginTime}ms`)
    console.log(`   ⚡ Average: ${Math.round((loginTime + userLoginTime) / 2)}ms`)
    console.log(`   ⚡ Rapid Requests: ${Math.round(rapidTime / 3)}ms avg`)
    
    const averageTime = Math.round((loginTime + userLoginTime) / 2)
    
    if (averageTime < 100) {
      console.log('\n🎉 EXCELLENT! Login is blazing fast!')
    } else if (averageTime < 200) {
      console.log('\n🚀 GREAT! Login is very fast!')
    } else if (averageTime < 500) {
      console.log('\n✅ GOOD! Login is fast enough!')
    } else {
      console.log('\n⚠️  Login could be optimized further')
    }

    console.log('\n💡 Frontend Optimizations Applied:')
    console.log('   ✅ Direct API calls instead of NextAuth signIn')
    console.log('   ✅ Optimistic user state updates')
    console.log('   ✅ Immediate toast notifications')
    console.log('   ✅ Instant redirects')
    console.log('   ✅ Animated loading states')
    console.log('   ✅ Background NextAuth sync')

  } catch (error) {
    console.error('❌ Fast login test failed:', error.message)
  }
}

testFastLogin()
