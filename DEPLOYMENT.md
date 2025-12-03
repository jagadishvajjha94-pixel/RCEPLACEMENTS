# RCE Career Hub - Deployment Guide

> 📖 **For a complete step-by-step deployment guide, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)**

## Overview
This guide covers deploying the RCE Career Hub application to Vercel or other hosting platforms.

## Prerequisites
- Node.js 18+ installed locally
- Git repository initialized
- Vercel account (for Vercel deployment)
- Environment variables configured

## Local Setup

### 1. Install Dependencies
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

**Note:** The `--legacy-peer-deps` flag is required due to React 19 peer dependency conflicts with some packages (e.g., vaul).

### 2. Configure Environment Variables
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your actual values
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Building for Production

### Build the Application
\`\`\`bash
npm run build
\`\`\`

### Test Production Build Locally
\`\`\`bash
npm run start
\`\`\`

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Deploy:
\`\`\`bash
vercel
\`\`\`

3. Follow the prompts and set environment variables in the Vercel dashboard.

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables
6. Click "Deploy"

## Deployment to Other Platforms

### Heroku
\`\`\`bash
heroku create your-app-name
git push heroku main
heroku config:set NEXT_PUBLIC_APP_URL=https://your-app-name.herokuapp.com
\`\`\`

### Docker (for custom hosting)
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next .next
COPY public public

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

## Environment Variables for Production

### Required Variables
\`\`\`
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
\`\`\`

### Optional Variables (for full functionality)
\`\`\`
# OpenAI API (for AI chatbot features)
OPENAI_API_KEY=sk-your-openai-api-key

# Supabase (if using database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (if using Prisma/PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication (if using NextAuth)
NEXTAUTH_SECRET=generate_a_strong_secret
NEXTAUTH_URL=https://your-domain.com
\`\`\`

**Note:** The application currently works with mock data, so database variables are optional. AI chatbot features require `OPENAI_API_KEY`.

## Post-Deployment Checklist

- [ ] Set all environment variables in hosting platform
- [ ] Enable HTTPS/SSL
- [ ] Configure custom domain
- [ ] Set up monitoring and error tracking
- [ ] Configure database backups
- [ ] Set up email notifications
- [ ] Test all authentication flows
- [ ] Verify API endpoints
- [ ] Check mobile responsiveness
- [ ] Monitor performance metrics

## Performance Optimization

### Image Optimization
- Images are pre-optimized in the project
- Use Next.js Image component where possible

### Code Splitting
- Route-based code splitting is automatic
- Dynamic imports are used for large components

### Caching Strategy
- Static assets: 1 year cache
- API routes: 60-second cache
- HTML pages: No-cache (revalidate on each request)

## Monitoring & Debugging

### Enable Monitoring
1. Set up Vercel Analytics
2. Configure error tracking (Sentry, LogRocket)
3. Monitor Core Web Vitals

### Common Issues

**Build fails with memory error:**
- Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

**Static generation timeout:**
- Increase timeout in vercel.json: `"buildCommand": "next build --experimental-app-dir"`

**API routes not working:**
- Verify API route file names follow `route.ts` convention
- Check CORS settings for external API calls

## Rolling Back

### Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Click "...  more" on previous deployment
5. Select "Promote to Production"

## Support

For deployment issues:
- Check [Next.js Documentation](https://nextjs.org/docs)
- Review [Vercel Documentation](https://vercel.com/docs)
- Check application logs in your hosting platform

---

**Last Updated:** 2025-11-02
**Application:** RCE Career Hub
**Framework:** Next.js 16
**Hosting:** Vercel (Primary)
