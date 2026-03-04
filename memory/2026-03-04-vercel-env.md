## 2026-03-04 11:31 UTC

### Vercel Environment Variables Not Deployed

**Issue:**
User added TAVILY_API_KEY and EXA_API_KEY to Vercel environment variables, but they're not showing up in deployed app. Research feed still shows "TAVILY_API_KEY missing".

**Root Cause:**
Vercel environment variables only apply to **new deployments** after they're added. The current production deployment (commit 5744d24) was built before the env vars were added.

**What I Did:**
- Fixed TypeScript error in agent-messages/route.ts
- Added AgentMessage interface for proper typing
- Pushed fix (commit 48edb0a)
- Triggered forced rebuild (commit 5744d24)
- Created troubleshooting document (vercel-env-issue.md)

**Deployed Code:**
- ✅ Fix hydration error
- ✅ Add expandable sidebar
- ✅ Support Vercel env vars (hybrid AWS/Env)
- ✅ Fix TypeScript error

**Environment Variable Status:**
- TAVILY_API_KEY - ❌ Not yet deployed
- EXA_API_KEY - ❌ Not yet deployed

**Required Actions:**

1. **Verify env vars in Vercel dashboard:**
   - Go to: https://vercel.com/chrisonclawd-coder/project-manager/settings/environment-variables
   - Check: TAVILY_API_KEY (exact spelling)
   - Check: EXA_API_KEY (exact spelling)
   - Verify: Both have correct values

2. **Check environment scope:**
   - Production: ✅ Required
   - Preview: ✅ Recommended

3. **Trigger new deployment:**
   - Vercel should auto-deploy when env vars are added
   - If not: make small commit to trigger build

4. **Verify deployment:**
   - Check https://project-manager-blue-three.vercel.app/api/xmax/research
   - Should show results, not "TAVILY_API_KEY missing"

**Commands for Reference:**

```bash
# Check if env vars are loaded (wait 1-2 min after push)
curl "https://project-manager-blue-three.vercel.app/api/xmax/research"

# If still missing, trigger new deployment
cd /home/clawdonaws/.openclaw/workspace/project-manager
echo "# Deploy $(date)" >> .env
git add .env
git commit -m "Trigger deployment for env vars"
git push

# Alternative: Use Vercel CLI
vercel env add TAVILY_API_KEY production
vercel --prod
```

**Note:**
The user is frustrated with repeated manual checking. Going forward, I will:
1. Check deployment automatically with curl
2. Fix issues without asking
3. Push fixes automatically
4. Repeat until deployment works

**Next step:**
User needs to verify TAVILY_API_KEY is properly set in Vercel environment variables. Once confirmed, I will trigger new deployment and verify it works automatically.

