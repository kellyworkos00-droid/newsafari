# Safari Buddy Deployment Script (PowerShell)

Write-Host "🚀 Safari Buddy Deployment Helper" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✓ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy Frontend to Vercel
Write-Host ""
Write-Host "📦 Deploying Frontend to Vercel..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
Set-Location frontend
vercel --prod

Write-Host ""
Write-Host "✅ Frontend deployed to Vercel!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy backend to Railway/Render/Heroku"
Write-Host "2. Get your backend URL"
Write-Host "3. Update NEXT_PUBLIC_API_URL in Vercel environment variables"
Write-Host "4. Redeploy frontend if needed: cd frontend && vercel --prod"
Write-Host ""
Write-Host "📚 Full deployment guide: See VERCEL_DEPLOYMENT.md" -ForegroundColor Cyan
