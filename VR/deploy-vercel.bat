@echo off
echo Deploying Project Sentinel to Vercel...

echo Installing Vercel CLI...
npm install -g vercel

echo Building project...
npm run build

echo Deploying to Vercel...
vercel --prod

echo Deployment complete!
echo Check your Vercel dashboard for the live URL