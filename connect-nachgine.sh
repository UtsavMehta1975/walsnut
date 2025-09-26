#!/bin/bash

# Contabo Server Connection Script for nachgine
# Server: vmi12803069 (185.196.21.112)
# Username: root
# Password: 456321@QWSAzx or 456321QWSAzx

echo "🔗 Connecting to nachgine server (vmi12803069)..."
echo "Server IP: 185.196.21.112"
echo "Username: root"
echo ""

# Try connecting with password authentication
echo "Attempting SSH connection..."
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no root@185.196.21.112

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Connection failed. Possible reasons:"
    echo "1. Server might be stopped"
    echo "2. SSH service not running"
    echo "3. Firewall blocking connection"
    echo ""
    echo "📋 Next steps:"
    echo "1. Check if server is running in Contabo control panel"
    echo "2. Try accessing via Contabo web console"
    echo "3. Contact Contabo support if needed"
fi
