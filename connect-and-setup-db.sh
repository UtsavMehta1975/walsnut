#!/bin/bash

# Complete Database Setup Script
# This script connects to your Contabo server and sets up MySQL

echo "🚀 Setting up MySQL Database on Contabo Server"
echo "Server: vmi12803069 (185.196.21.112)"
echo ""

# Step 1: Connect to server and run MySQL setup
echo "📡 Connecting to server and setting up MySQL..."
ssh root@185.196.21.112 << 'EOF'
# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install MySQL Server
echo "🗄️ Installing MySQL Server..."
apt install mysql-server -y

# Start and enable MySQL service
echo "🔄 Starting MySQL service..."
systemctl start mysql
systemctl enable mysql

# Create database and user (non-interactive)
echo "👤 Creating database and user..."
mysql -u root << 'MYSQL_EOF'
CREATE DATABASE IF NOT EXISTS walnut_db;
CREATE USER IF NOT EXISTS 'utsav'@'%' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON walnut_db.* TO 'utsav'@'%';
FLUSH PRIVILEGES;
SHOW DATABASES;
MYSQL_EOF

# Configure MySQL to accept remote connections
echo "🌐 Configuring MySQL for remote connections..."
sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Restart MySQL service
echo "🔄 Restarting MySQL service..."
systemctl restart mysql

# Check MySQL status
echo "✅ Checking MySQL status..."
systemctl status mysql --no-pager

echo "🎉 MySQL setup complete on server!"
EOF

# Step 2: Test connection from local machine
echo ""
echo "🧪 Testing database connection from local machine..."
mysql -h 185.196.21.112 -u utsav -pYourStrongPassword -e "SHOW DATABASES;"

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    echo ""
    echo "📋 Connection Details:"
    echo "   Host: 185.196.21.112"
    echo "   Port: 3306"
    echo "   Database: walnut_db"
    echo "   Username: utsav"
    echo "   Password: YourStrongPassword"
    echo ""
    echo "🔗 Connection String:"
    echo "   mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Copy env-contabo.example to .env.local"
    echo "   2. Update the MYSQL_URL in .env.local"
    echo "   3. Run: npx prisma generate"
    echo "   4. Run: npx prisma db push"
    echo "   5. Run: npm run dev"
else
    echo "❌ Database connection failed!"
    echo "Please check the server setup and try again."
fi
