#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking project for Vercel deployment...\n');

// Check required files
const requiredFiles = [
  'package.json',
  'next.config.js',
  'vercel.json',
  'prisma/schema.prisma',
  'app/layout.tsx',
  'middleware.ts',
  'public/manifest.json',
  'public/sw.js',
  'public/offline.html'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('\n📦 Checking package.json scripts:');
['dev', 'build', 'start'].forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script} script exists`);
  } else {
    console.log(`❌ ${script} script missing`);
  }
});

// Check dependencies
console.log('\n🔧 Checking critical dependencies:');
const criticalDeps = ['next', 'react', 'react-dom', '@prisma/client', 'next-auth'];
criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

// Check environment variables
console.log('\n🔐 Checking environment variables:');
const envExample = fs.readFileSync('env.example', 'utf8');
const requiredEnvVars = ['MYSQL_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
requiredEnvVars.forEach(envVar => {
  if (envExample.includes(envVar)) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`❌ ${envVar} - MISSING`);
  }
});

console.log('\n🎉 Build check complete!');
console.log('\n📋 Next steps:');
console.log('1. Push code to GitHub');
console.log('2. Connect repository to Vercel');
console.log('3. Set environment variables in Vercel');
console.log('4. Deploy!');
