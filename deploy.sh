#!/bin/bash

# Safari Buddy Deployment Script

echo "🚀 Safari Buddy Deployment Helper"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy Frontend to Vercel
echo ""
echo "📦 Deploying Frontend to Vercel..."
echo "-----------------------------------"
cd frontend
vercel --prod

echo ""
echo "✅ Frontend deployed to Vercel!"
echo ""
echo "📝 Next Steps:"
echo "1. Deploy backend to Railway/Render/Heroku"
echo "2. Get your backend URL"
echo "3. Update NEXT_PUBLIC_API_URL in Vercel environment variables"
echo "4. Redeploy frontend if needed: cd frontend && vercel --prod"
echo ""
echo "📚 Full deployment guide: See VERCEL_DEPLOYMENT.md"
