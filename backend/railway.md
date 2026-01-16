# Railway/Render Deployment Configuration

# This file tells Railway/Render how to deploy the backend

## Railway Configuration
# Railway automatically detects Python and uses requirements.txt
# Start command: uvicorn main:app --host 0.0.0.0 --port $PORT

## Render Configuration  
# Build Command: pip install -r requirements.txt
# Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

## Required Environment Variables
# - DATABASE_URL
# - SECRET_KEY
# - FRONTEND_URL
# - MPESA_CONSUMER_KEY
# - MPESA_CONSUMER_SECRET
# - MPESA_SHORTCODE
# - MPESA_PASSKEY
# - MPESA_ENVIRONMENT
