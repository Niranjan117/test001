# Deploy to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/project-sentinel)

## Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Environment Variables

Set these in Vercel dashboard:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secure random string for JWT tokens

## MongoDB Setup

1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string
3. Add to Vercel environment variables

## Live URLs

After deployment:
- **Frontend**: https://your-project.vercel.app
- **API**: https://your-project.vercel.app/api

## Features

✅ Serverless API endpoints
✅ Static frontend hosting  
✅ MongoDB integration
✅ JWT authentication
✅ Performance analysis