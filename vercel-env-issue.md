# Vercel Deployment Issues - 2026-03-04 11:31 UTC

## Current Status

**Deployed commits:**
- 48edb0a - Fix TypeScript error in agent-messages route
- 5744d24 - Force rebuild to pick up env vars

**Environment Variable Status:**
- TAVILY_API_KEY - ❌ NOT deployed yet
- EXA_API_KEY - ❌ NOT deployed yet

**Issue:**
Even though user added TAVILY_API_KEY and EXA_API_KEY to Vercel environment variables, they are not showing up in the running deployment.

## Root Cause

Vercel environment variables only apply to **new deployments**. The current deployment (commit 48edb0a and earlier) doesn't have the env vars yet.

## Solution Required

The user needs to verify environment variables are added correctly:

### 1. Check Vercel Environment Variables

Go to: https://vercel.com/chrisonclawd-coder/project-manager/settings/environment-variables

Verify these are present:
- ✅ TAVILY_API_KEY (value: your_actual_key)
- ✅ EXA_API_KEY (value: 1ebbc5df-97b0-4597-9555-ea9d28b7a6cd)

### 2. Check Environment Scope

Make sure variables are set for:
- ✅ Production
- ✅ Preview (optional, but recommended)
- ✅ Development (if applicable)

### 3. Trigger New Deployment

After adding vars, Vercel should auto-deploy. If not:

```bash
# Trigger new deployment
cd /home/clawdonaws/.openclaw/workspace/project-manager
echo "# Deployment $(date)" >> .env
git add .env
git commit -m "Trigger deployment for env vars"
git push
```

### 4. Verify Deployment

After 1-2 minutes:
```bash
# Check if env vars are loaded
curl "https://project-manager-blue-three.vercel.app/api/xmax/research"
```

Should return results, not "TAVILY_API_KEY missing".

## Common Issues

1. **Added to wrong environment** - Make sure vars are in Production, not just Preview
2. **Typo in variable name** - Must be exact: TAVILY_API_KEY (not TAVILY_KEY, TAVILY, etc.)
3. **Empty value** - Variable exists but value is empty
4. **Deployment failed** - Check Vercel dashboard for build errors

## What to Do

1. Go to Vercel dashboard → Settings → Environment Variables
2. Verify TAVILY_API_KEY is present with correct value
3. Check recent deployments for errors
4. If deployment failed, trigger new build

## Alternative: Use Vercel CLI

If UI is problematic, use CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Add env var to production
vercel env add TAVILY_API_KEY production

# Trigger new deployment
vercel --prod
```

