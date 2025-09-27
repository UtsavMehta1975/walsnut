#!/bin/bash

# MySQL Setup Script for Contabo Server
# Server: vmi12803069 (185.196.21.112)
# This script should be run on the server via VNC console

echo "🚀 Setting up MySQL on Contabo Server..."

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

# Secure MySQL installation
echo "🔒 Securing MySQL installation..."
mysql_secure_installation

# Create database and user
echo "👤 Creating database and user..."
mysql -u root -p << EOF
CREATE DATABASE walnut_db;
CREATE USER 'utsav'@'%' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON walnut_db.* TO 'utsav'@'%';
FLUSH PRIVILEGES;
SHOW DATABASES;
EOF

# Configure MySQL to accept remote connections
echo "🌐 Configuring MySQL for remote connections..."
sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Restart MySQL service
echo "🔄 Restarting MySQL service..."
systemctl restart mysql

# Check MySQL status
echo "✅ Checking MySQL status..."
systemctl status mysql

echo "🎉 MySQL setup complete!"
echo "📋 Connection details:"
echo "   Host: 185.196.21.112"
echo "   Port: 3306"
echo "   Database: walnut_db"
echo "   Username: utsav"
echo "   Password: YourStrongPassword"
echo ""
echo "🔗 Connection string:"
echo "   mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db"
