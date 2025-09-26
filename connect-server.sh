#!/bin/bash

# Contabo Server Connection Script
# Server IP: 185.196.21.112

echo "🔗 Connecting to Contabo Server (185.196.21.112)..."

# Try different connection methods
echo "Trying SSH connection on port 22..."
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@185.196.21.112

if [ $? -ne 0 ]; then
    echo "❌ Port 22 failed. Trying port 2222..."
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -p 2222 root@185.196.21.112
fi

if [ $? -ne 0 ]; then
    echo "❌ Port 2222 failed. Trying with ubuntu user..."
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no ubuntu@185.196.21.112
fi

if [ $? -ne 0 ]; then
    echo "❌ All connection attempts failed."
    echo ""
    echo "📋 Next steps to fix this:"
    echo "1. Log into Contabo Control Panel: https://my.contabo.com"
    echo "2. Go to your server (185.196.21.112)"
    echo "3. Check if the server is running"
    echo "4. Add your SSH key:"
    echo "   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEXc5mFn52PV14TQCoEiTAA5m0eC7INM+NuB7bCn1VVC your_email@example.com"
    echo "5. Or enable password authentication"
    echo ""
    echo "🔄 Try running this script again after fixing the server."
fi
