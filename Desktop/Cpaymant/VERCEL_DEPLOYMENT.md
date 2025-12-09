# Vercel Deployment Guide

## Quick Setup

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository: `Shubhamitsingh/Cpayment`

2. **Configure Project Settings**
   - **Framework Preset**: Leave as "Other" or "Create React App"
   - **Root Directory**: Leave as `./` (root of repository)
   - **Build Command**: `npm run build` (automatically set by vercel.json)
   - **Output Directory**: `client/build` (automatically set by vercel.json)
   - **Install Command**: `npm run install-all` (automatically set by vercel.json)

3. **Environment Variables** (if needed)
   - Add any environment variables in Vercel dashboard
   - For API URLs, you may need to set:
     - `REACT_APP_API_URL` (if you need to point to a separate backend)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your React app

## Important Notes

### Backend API
Your Express server (`server/index.js`) is **not** deployed with this configuration. The current setup only deploys the React frontend.

**Options for Backend:**
1. **Deploy Backend Separately**: Deploy the Express server to a service like:
   - Railway
   - Render
   - Heroku
   - DigitalOcean
   - Or any Node.js hosting service

2. **Use Vercel Serverless Functions**: Convert your Express routes to Vercel serverless functions (more complex)

3. **Update API Calls**: If deploying backend separately, update API calls in:
   - `client/src/App.js`
   - `client/src/components/AdminSettings.js`
   
   Change from:
   ```javascript
   fetch('/api/payments')
   ```
   
   To:
   ```javascript
   fetch('https://your-backend-url.com/api/payments')
   ```

### After Deployment

1. **Check Build Logs**: If deployment fails, check the build logs in Vercel dashboard
2. **Verify Routes**: All routes should redirect to `index.html` (SPA routing)
3. **Test API Calls**: Make sure API endpoints are accessible

## Troubleshooting

### 404 Error
- ✅ **Fixed**: Added `vercel.json` with proper rewrites
- Make sure "Root Directory" is set to `./` in Vercel settings
- Verify build command runs successfully

### Build Fails
- Check that `node_modules` are installed (install-all script handles this)
- Verify React build completes successfully
- Check Vercel build logs for specific errors

### API Not Working
- Backend needs to be deployed separately
- Update API URLs in frontend code to point to backend URL
- Or set up CORS on backend to allow Vercel domain

