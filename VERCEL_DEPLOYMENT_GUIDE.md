# 🚀 RCE Career Hub - Complete Vercel Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Optimization Tips](#optimization-tips)

---

## ✅ Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with repository pushed
- ✅ Vercel account (free tier available at [vercel.com](https://vercel.com))
- ✅ Node.js 18+ installed locally (for testing)
- ✅ All code committed and pushed to GitHub

**Repository:** `https://github.com/jagadishvajjha94-pixel/placement_rce`

---

## 🔍 Pre-Deployment Checklist

### 1. Verify Project Structure
- ✅ Next.js 16 project structure is correct
- ✅ `package.json` has all required dependencies
- ✅ `next.config.ts` is properly configured
- ✅ `vercel.json` is optimized for deployment
- ✅ `.gitignore` excludes build files and environment variables

### 2. Test Local Build
```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build

# Test production build locally
npm run start
```

If the build succeeds locally, it should work on Vercel.

### 3. Review Configuration Files

**Current Configuration:**
- ✅ `vercel.json` - Configured with `--legacy-peer-deps` for dependency resolution
- ✅ `next.config.ts` - Optimized for production
- ✅ TypeScript and ESLint configs are properly set up

---

## 🚀 Step-by-Step Deployment

### Method 1: GitHub Integration (Recommended)

#### Step 1: Sign in to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** to connect your GitHub account

#### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find and select your repository: `jagadishvajjha94-pixel/placement_rce`
3. Click **"Import"**

#### Step 3: Configure Project Settings
Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** `Next.js` ✅
- **Root Directory:** `./` (default)
- **Build Command:** `next build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install --legacy-peer-deps` (already in vercel.json)

**Note:** The `--legacy-peer-deps` flag is already configured in `vercel.json` to handle React 19 peer dependency conflicts.

#### Step 4: Set Environment Variables
Before deploying, add environment variables in the **"Environment Variables"** section:

**Required Variables:**
```
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

**Optional Variables (for full functionality):**
```
OPENAI_API_KEY=sk-... (for AI chatbot features)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co (if using Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key (if using Supabase)
SUPABASE_URL=https://your-project.supabase.co (if using Supabase)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (if using Supabase)
DATABASE_URL=postgresql://... (if using Prisma/PostgreSQL)
```

**How to add:**
1. Click **"Environment Variables"** in the project settings
2. Add each variable with its value
3. Select environment: **Production**, **Preview**, and/or **Development**
4. Click **"Save"**

#### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-5 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 4: Set Environment Variables via CLI
```bash
vercel env add NEXT_PUBLIC_APP_URL
vercel env add OPENAI_API_KEY
# Add other variables as needed
```

---

## 🔐 Environment Variables Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Your production URL | `https://placement-rce.vercel.app` |

### Optional Variables

| Variable | Description | When to Use |
|----------|-------------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Required for AI chatbot features |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | When using Supabase database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | When using Supabase database |
| `SUPABASE_URL` | Supabase project URL (server) | When using Supabase server-side |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | When using Supabase server-side |
| `DATABASE_URL` | PostgreSQL connection string | When using Prisma/PostgreSQL |

### Current Project Status

**Data Storage:**
- ✅ Currently using **mock data** (no database required)
- ✅ Can switch to Supabase/PostgreSQL when ready
- ✅ All features work with mock data

**AI Features:**
- ⚠️ AI chatbot requires `OPENAI_API_KEY`
- ⚠️ Without API key, chatbot will show warning but app will work

### Generating Secrets

**For NEXTAUTH_SECRET (if needed):**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 📝 Post-Deployment Configuration

### 1. Verify Deployment
- ✅ Visit your Vercel URL
- ✅ Test the homepage
- ✅ Check all routes (login, student dashboard, admin dashboard)
- ✅ Verify API routes are working

### 2. Configure Custom Domain (Optional)
1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 3. Set Up Monitoring
- ✅ Enable **Vercel Analytics** (free tier available)
- ✅ Monitor **Core Web Vitals**
- ✅ Set up error tracking (optional: Sentry, LogRocket)

### 4. Enable Automatic Deployments
- ✅ Already enabled by default
- ✅ Every push to `main` branch = Production deployment
- ✅ Pull requests = Preview deployments

---

## 🔧 Troubleshooting

### Issue 1: Build Fails with Dependency Error
**Error:** `peer dependency conflict` or `Could not resolve dependency`

**Solution:**
- ✅ Already fixed in `vercel.json` with `--legacy-peer-deps`
- If still occurs, check `package.json` for conflicting versions

### Issue 2: Build Fails with Memory Error
**Error:** `JavaScript heap out of memory`

**Solution:**
Add to `vercel.json`:
```json
{
  "buildCommand": "NODE_OPTIONS=--max-old-space-size=4096 next build"
}
```

### Issue 3: API Routes Not Working
**Error:** 404 on API routes

**Solution:**
- ✅ Verify API routes are in `app/api/` directory
- ✅ Check route file names follow Next.js 13+ App Router convention
- ✅ Ensure route files export `GET`, `POST`, etc. functions

### Issue 4: Environment Variables Not Working
**Error:** `process.env.VARIABLE is undefined`

**Solution:**
- ✅ Ensure variables start with `NEXT_PUBLIC_` for client-side access
- ✅ Add variables in Vercel Dashboard → Settings → Environment Variables
- ✅ Redeploy after adding variables
- ✅ Check variable names for typos

### Issue 5: Images Not Loading
**Error:** Images return 404

**Solution:**
- ✅ Verify images are in `public/` directory
- ✅ Use `/image-name.png` (not `/public/image-name.png`)
- ✅ Check `next.config.ts` has `images: { unoptimized: true }` (already set)

### Issue 6: OpenAI API Errors
**Error:** Chatbot not working

**Solution:**
- ✅ Add `OPENAI_API_KEY` in Vercel environment variables
- ✅ Verify API key is valid and has credits
- ✅ Check API key format: `sk-...`

### Issue 7: Build Timeout
**Error:** Build exceeds time limit

**Solution:**
- ✅ Optimize build by removing unused dependencies
- ✅ Check for large files in repository
- ✅ Consider upgrading Vercel plan for longer build times

---

## ⚡ Optimization Tips

### 1. Performance
- ✅ Images are already optimized with `unoptimized: true` in `next.config.ts`
- ✅ Static assets are cached automatically by Vercel
- ✅ API routes have 60-second cache (configured in `vercel.json`)

### 2. Build Optimization
- ✅ TypeScript errors are ignored during build (for faster builds)
- ✅ ESLint errors are ignored during build
- ✅ Consider enabling strict mode after initial deployment

### 3. Monitoring
- ✅ Enable Vercel Analytics for performance insights
- ✅ Monitor Core Web Vitals in Vercel Dashboard
- ✅ Set up alerts for build failures

### 4. Cost Optimization
- ✅ Free tier includes:
  - 100GB bandwidth/month
  - Unlimited deployments
  - Automatic SSL
  - Preview deployments

---

## 📊 Deployment Status

### Current Configuration
- **Framework:** Next.js 16.0.3
- **React:** 19.2.0
- **Node.js:** 18+ (auto-detected by Vercel)
- **Build Command:** `next build`
- **Install Command:** `npm install --legacy-peer-deps`
- **Output Directory:** `.next`

### Project Features
- ✅ Student Dashboard
- ✅ Admin Dashboard
- ✅ Faculty Dashboard
- ✅ Placement Drives Management
- ✅ Application Tracking
- ✅ AI Chatbot (requires OpenAI API key)
- ✅ Analytics & Reports
- ✅ Document Management

---

## 🎯 Quick Reference

### Deployment Commands
```bash
# Local development
npm run dev

# Build locally
npm run build

# Test production build
npm run start

# Deploy to Vercel (CLI)
vercel --prod
```

### Important URLs
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/jagadishvajjha94-pixel/placement_rce
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs

### Support Resources
- **Vercel Support:** https://vercel.com/support
- **Next.js Discord:** https://nextjs.org/discord
- **GitHub Issues:** Create issue in repository

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Verify homepage loads correctly
- [ ] Test login functionality
- [ ] Check student dashboard
- [ ] Check admin dashboard
- [ ] Verify API routes are working
- [ ] Test AI chatbot (if API key is set)
- [ ] Check mobile responsiveness
- [ ] Verify all environment variables are set
- [ ] Enable Vercel Analytics
- [ ] Set up custom domain (if needed)
- [ ] Configure error tracking (optional)
- [ ] Test all major features
- [ ] Monitor first few deployments for errors

---

## 🎉 Success!

Your RCE Career Hub is now deployed on Vercel! 

**Next Steps:**
1. Share your deployment URL with your team
2. Monitor performance and errors
3. Set up custom domain if needed
4. Configure additional features as needed

**Need Help?**
- Check the troubleshooting section above
- Review Vercel deployment logs
- Check Next.js documentation
- Create an issue in the GitHub repository

---

**Last Updated:** December 2025
**Project:** RCE Career Hub - Placement Portal
**Framework:** Next.js 16
**Deployment Platform:** Vercel

