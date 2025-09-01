#!/bin/bash
# Revert Hero Section Script
# This script reverts the hero section back to the original version

echo "🔄 Reverting hero section to original version..."

# Restore original hero section
cp components/home/hero-section-backup.tsx components/home/hero-section.tsx

# Restore original main page
cp app/page-backup.tsx app/page.tsx

echo "✅ Hero section reverted successfully!"
echo "📝 Original files restored:"
echo "   - components/home/hero-section.tsx"
echo "   - app/page.tsx"
echo ""
echo "🚀 You can now test the original version"
