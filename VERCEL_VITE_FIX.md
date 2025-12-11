# Fix: Vercel Next.js Detection Issue for Vite Project

## Problem
Vercel is auto-detecting this project as Next.js because of the `app/` directory structure, but the project uses Vite (not Next.js). This causes the error:
> "No Next.js version detected. Make sure your package.json has 'next' in either 'dependencies' or 'devDependencies'."

## Solution

### Option 1: Manual Framework Override (Recommended)

When importing/creating the project in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your repository
4. **IMPORTANT**: In the **"Framework Preset"** dropdown, manually select **"Other"** (NOT "Next.js")
5. Verify these settings:
   - **Framework Preset:** `Other` ✅
   - **Root Directory:** `./` (or your project root)
   - **Build Command:** `npm run build` (should auto-fill from vercel.json)
   - **Output Directory:** `dist` (should auto-fill from vercel.json)
   - **Install Command:** `npm install --legacy-peer-deps` (should auto-fill from vercel.json)
6. Click **"Deploy"**

### Option 2: Update Existing Project Settings

If the project is already created in Vercel:

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **General**
3. Scroll to **"Framework Preset"**
4. Change from **"Next.js"** to **"Other"**
5. Verify **Build Command** is `npm run build`
6. Verify **Output Directory** is `dist`
7. Save and redeploy

## Current Configuration

The `vercel.json` file is already correctly configured for Vite:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps"
}
```

## Why This Happens

- Vercel auto-detects frameworks based on project structure
- The `app/` directory structure looks like Next.js App Router
- But this project uses Vite (see `vite.config.ts` and `package.json`)
- Vercel tries to build as Next.js but can't find Next.js in `package.json`

## Verification

After fixing:
- ✅ Build should complete successfully
- ✅ Output directory should be `dist/`
- ✅ SPA routing should work (configured in vercel.json rewrites)

## Notes

- The `app/` directory is kept for organizational purposes but the project uses Vite + React Router
- All build settings are correctly configured in `vercel.json`
- You just need to override the auto-detected framework in Vercel dashboard

