# Vercel Deployment Guide - Safari Buddy

## Architecture Overview

This project uses a **split deployment approach**:
- **Frontend (Next.js)**: Deployed on Vercel
- **Backend (FastAPI)**: Deployed separately (Railway, Render, or Heroku)

## Why Split Deployment?

Vercel is optimized for frontend frameworks like Next.js but has limitations for Python backends:
- Limited serverless function execution time (10s on free tier)
- No persistent connections to PostgreSQL
- Cold starts affect API performance

## Frontend Deployment (Next.js on Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update API endpoint** in frontend to point to production backend:

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Go to [Vercel Dashboard](https://vercel.com/new)**

3. **Import your GitHub repository**:
   - Click "Add New" → "Project"
   - Select your `safari` repository
   - Vercel will auto-detect Next.js

4. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave default (.next)
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app/api`
   - `NEXTAUTH_URL` = `https://your-vercel-domain.vercel.app`
   - `NEXTAUTH_SECRET` = (generate with `openssl rand -base64 32`)

6. **Deploy**: Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Navigate to frontend
cd frontend

# Deploy
vercel --prod

# Follow prompts to configure project
```

### Step 3: Configure Custom Domain (Optional)

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Backend Deployment Options

### Option 1: Railway (Recommended for Python)

1. **Go to [Railway.app](https://railway.app/)**

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**:
   - Root Directory: `backend`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   
4. **Add Environment Variables**:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your_passkey
   MPESA_ENVIRONMENT=production
   PORT=8000
   ```

5. **Deploy Database**:
   - Add PostgreSQL plugin in Railway
   - Copy DATABASE_URL to your service

6. **Get Backend URL**:
   - Copy the generated domain (e.g., `https://your-app.up.railway.app`)
   - Update `NEXT_PUBLIC_API_URL` in Vercel

### Option 2: Render

1. **Go to [Render.com](https://render.com/)**

2. **Create Web Service**:
   - Connect GitHub repository
   - Name: `safaribuddy-backend`
   - Root Directory: `backend`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL Database**:
   - Create new PostgreSQL instance
   - Copy Internal Database URL

4. **Configure Environment Variables** (same as Railway)

5. **Deploy**

### Option 3: Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create safaribuddy-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set FRONTEND_URL=https://your-vercel-domain.vercel.app
heroku config:set MPESA_CONSUMER_KEY=your_key
# ... add all other env vars

# Create Procfile in backend/
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > backend/Procfile

# Deploy
git subtree push --prefix backend heroku main
```

## Post-Deployment Steps

### 1. Update CORS Settings

Ensure `backend/app/config.py` or `main.py` includes your Vercel domain:

```python
origins = [
    "https://your-vercel-domain.vercel.app",
    "https://safaribuddy.com",  # if you have custom domain
    "http://localhost:3000",
]
```

### 2. Database Migrations

Run migrations on production database:

```bash
# For Railway/Render (use their CLI)
railway run alembic upgrade head

# For Heroku
heroku run alembic upgrade head -a safaribuddy-backend
```

### 3. Test M-PESA Integration

1. **Update M-PESA Callback URL** in your code:
   ```python
   callback_url = f"{settings.BACKEND_URL}/api/payments/callback"
   ```

2. **For Production**: Apply for Daraja API Go-Live on Safaricom Developer Portal

3. **Test Payment Flow**:
   - Create a booking
   - Initiate payment with Kenyan test number: 254708374149
   - Check STK push on phone
   - Verify callback processing

### 4. Configure Monitoring

Add error tracking and monitoring:

**For Backend:**
- [Sentry](https://sentry.io/) for error tracking
- Railway/Render built-in logs

**For Frontend:**
- Vercel Analytics (built-in)
- [LogRocket](https://logrocket.com/) for session replay

## Environment Variables Checklist

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`

### Backend (Railway/Render/Heroku)
- [ ] `DATABASE_URL`
- [ ] `SECRET_KEY`
- [ ] `FRONTEND_URL`
- [ ] `MPESA_CONSUMER_KEY`
- [ ] `MPESA_CONSUMER_SECRET`
- [ ] `MPESA_SHORTCODE`
- [ ] `MPESA_PASSKEY`
- [ ] `MPESA_ENVIRONMENT`
- [ ] `PORT` (set by platform automatically)

## Troubleshooting

### Frontend Issues

**Build Fails:**
```bash
# Check Node version (should be 18+)
node --version

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**API Calls Fail:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS configuration on backend
- Inspect Network tab in browser DevTools

### Backend Issues

**Database Connection:**
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`
- Check database is accessible from hosting platform
- Test connection locally first

**M-PESA Callbacks Not Working:**
- Ensure callback URL is publicly accessible (no localhost)
- Check backend logs for incoming requests
- Verify endpoint is not protected by authentication
- Test with ngrok locally first

**Cold Starts:**
- Use Railway/Render paid tier for always-on instances
- Implement health check endpoint
- Consider serverless warm-up functions

## Quick Deploy Commands

### Deploy Frontend
```bash
cd frontend
vercel --prod
```

### Deploy Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Update Both
```bash
# Commit changes
git add .
git commit -m "Update: deployment fixes"
git push

# Vercel auto-deploys on push
# Railway auto-deploys on push (if configured)
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Safaricom Daraja API](https://developer.safaricom.co.ke/)

## Cost Estimates

### Free Tier (Good for MVP/Testing)
- **Vercel**: Free (100GB bandwidth, unlimited requests)
- **Railway**: $5/month credit (includes PostgreSQL)
- **Render**: Free tier available (spins down after 15min inactive)

### Production (Recommended)
- **Vercel Pro**: $20/month (team features, analytics)
- **Railway**: ~$10-20/month (depends on usage)
- **Neon PostgreSQL**: Free tier or ~$19/month (with compute)

**Total**: ~$20-40/month for production-ready setup

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Railway/Render
3. ✅ Configure environment variables
4. ✅ Run database migrations
5. ✅ Test complete booking + payment flow
6. ✅ Set up custom domain (optional)
7. ✅ Configure monitoring and error tracking
8. ✅ Apply for M-PESA production credentials

Good luck with your deployment! 🚀
