# Revert Hero Section Script (PowerShell)
# This script reverts the hero section back to the original version

Write-Host "🔄 Reverting hero section to original version..." -ForegroundColor Yellow

# Restore original hero section
Copy-Item "components/home/hero-section-backup.tsx" "components/home/hero-section.tsx" -Force

# Restore original main page
Copy-Item "app/page-backup.tsx" "app/page.tsx" -Force

Write-Host "✅ Hero section reverted successfully!" -ForegroundColor Green
Write-Host "📝 Original files restored:" -ForegroundColor Cyan
Write-Host "   - components/home/hero-section.tsx" -ForegroundColor White
Write-Host "   - app/page.tsx" -ForegroundColor White
Write-Host ""
Write-Host "🚀 You can now test the original version" -ForegroundColor Green
