#!/bin/bash

# Local MySQL Setup Script for Development
# This script sets up MySQL locally on your Mac

echo "🚀 Setting up Local MySQL Database for Development"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "📦 MySQL not found. Installing via Homebrew..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Install MySQL
    brew install mysql
    
    # Start MySQL service
    brew services start mysql
else
    echo "✅ MySQL is already installed"
    
    # Start MySQL service if not running
    if ! brew services list | grep mysql | grep started > /dev/null; then
        echo "🔄 Starting MySQL service..."
        brew services start mysql
    else
        echo "✅ MySQL service is already running"
    fi
fi

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 3

# Create database and user
echo "🗄️ Creating database and user..."
mysql -u root << 'EOF'
CREATE DATABASE IF NOT EXISTS walnut_db;
CREATE USER IF NOT EXISTS 'utsav'@'localhost' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON walnut_db.* TO 'utsav'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Local MySQL setup complete!"
    echo ""
    echo "📋 Local Connection Details:"
    echo "   Host: localhost"
    echo "   Port: 3306"
    echo "   Database: walnut_db"
    echo "   Username: utsav"
    echo "   Password: YourStrongPassword"
    echo ""
    echo "🔗 Local Connection String:"
    echo "   mysql://utsav:YourStrongPassword@localhost:3306/walnut_db"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Copy env-local.example to .env.local"
    echo "   2. Run: npx prisma generate"
    echo "   3. Run: npx prisma db push"
    echo "   4. Run: npm run dev"
else
    echo "❌ Failed to create database and user"
    echo "Please check MySQL installation and try again"
fi
