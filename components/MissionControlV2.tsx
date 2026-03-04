type Shell = {
  panel: string
  panelMuted: string
  textSoft: string
  textMuted: string
}

export default function MissionControlV2({ shell, section = 'all' }: { shell: Shell; section?: string }) {
  const actionItems = [
    'Approve MDify v1.0.4 release (6 users waiting)',
    'Post today’s 3 X + 3 Reddit campaigns',
    'Review Guardskills scan report (last scan: clean)',
    'Assign next roadmap task to Architect',
    'Check Expense Tracker — March burn rate trending +12%',
  ]

  const show = (id: string) => section === 'all' || section === id

  return (
    <div className="space-y-4">
      <div className={`border p-5 ${shell.panel}`}>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">🚀 OpenClaw Mission Control (Read-Only) — v2</h1>
        <p className={`text-xs mt-2 tracking-[0.14em] ${shell.textSoft}`}>MODERN MONOCHROMATIC • SHADOWS • SMOOTH ANIMATIONS</p>
      </div>

      {show('home') && (
        <div className={`border p-5 ${shell.panel}`}>
          <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>1. HOME</h2>
          <p className="text-sm mb-3">Hello Chris 👋 Welcome back to your command center. You’re running strong.</p>
          <div className="space-y-1 text-sm">{actionItems.map(item => <p key={item} className={shell.textMuted}>• {item}</p>)}</div>
        </div>
      )}

      {show('products') && (
        <div className={`border p-5 ${shell.panel}`}>
          <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>2. PRODUCTS</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
            <div className={`border p-4 ${shell.panelMuted}`}><p className="font-semibold">MDify — Chrome Extension</p><p className={shell.textMuted}>Version: 1.0.3 • Users: 6 • Rating: 0 reviews</p></div>
            <div className={`border p-4 ${shell.panelMuted}`}><p className="font-semibold">Guardskills — npm Package</p><p className={shell.textMuted}>Version: 1.2.1 • Status: Stable & production-ready</p></div>
          </div>
        </div>
      )}

      {show('team') && (
        <div className={`border p-5 ${shell.panel}`}>
          <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>3. MY TEAM</h2>
          <p className="text-sm mb-2">CEO: Chrisly</p>
          <p className={`text-sm ${shell.textMuted}`}>Architect → Developer → QA → DevOps → Manual Tester</p>
          <p className={`text-sm mt-2 ${shell.textMuted}`}>Task #47 “MDify dark mode toggle” → QA stage (2 days in cycle)</p>
        </div>
      )}

      {show('x-growth') && (
        <div className={`border p-5 ${shell.panel}`}>
          <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>4. X GROWTH</h2>
          <p className={`text-sm ${shell.textMuted}`}>Daily engagement prompts and viral starters ready.</p>
        </div>
      )}

      {show('kpis') && (
        <div className={`border p-5 ${shell.panel}`}>
          <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>5. ANALYTICS & KPIS</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div className={`border p-3 ${shell.panelMuted}`}><p className={shell.textSoft}>MDify Users</p><p>6 (+6)</p></div>
            <div className={`border p-3 ${shell.panelMuted}`}><p className={shell.textSoft}>Guardskills</p><p>1.2.1</p></div>
            <div className={`border p-3 ${shell.panelMuted}`}><p className={shell.textSoft}>X Followers</p><p>+12</p></div>
            <div className={`border p-3 ${shell.panelMuted}`}><p className={shell.textSoft}>Cycle Time</p><p>4.2d</p></div>
            <div className={`border p-3 ${shell.panelMuted}`}><p className={shell.textSoft}>Burn</p><p>$487</p></div>
          </div>
        </div>
      )}

      {show('roadmap') && (
        <div className={`border p-5 ${shell.panel}`}>
          <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>6. ROADMAP & MILESTONES</h2>
          {[['MDify 2.0 (AI auto-summarize)',45],['Guardskills v2 (ClawHub native)',20],['First $100 MRR',0]].map(([name,value]) => (
            <div key={String(name)} className="mb-3 text-sm"><div className="flex justify-between"><span className={shell.textMuted}>{name}</span><span className={shell.textSoft}>{value}%</span></div><div className="h-2 bg-zinc-800 rounded mt-1"><div className="h-full bg-zinc-300 rounded transition-all duration-300" style={{width:`${value}%`}} /></div></div>
          ))}
        </div>
      )}

      {show('feedback') && <div className={`border p-5 ${shell.panel}`}><h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>7. FEEDBACK & COMMUNITY</h2><p className={`text-sm ${shell.textMuted}`}>• “This MDify extension is actually useful” — @user (yesterday)</p><p className={`text-sm ${shell.textMuted}`}>• No negative reviews yet (6 users, all silent = opportunity)</p></div>}

      {show('news') && <div className={`border p-5 ${shell.panel}`}><h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>8. DAILY NEWS & TRENDS</h2>{['Node.js Security Best Practices 2026 — Lock every dependency.','Top 9 AI Extension Security Platforms — LayerX, SquareX…','22 Best Chrome Extensions for Developers 2026 — MDify should be on this list soon.','Browser security visibility gap widening in 2026.','Gemini 3.1 killing it in UI tasks (opportunity for MDify).'].map(item => <p key={item} className={`text-sm ${shell.textMuted}`}>• {item}</p>)}</div>}

      {show('goals') && <div className={`border p-5 ${shell.panel}`}><h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>9. GOALS & PROGRESS TRACKER</h2><p className={`text-sm ${shell.textMuted}`}>Growth OKR: 100 MDify users by Apr 30 → 6%</p><p className={`text-sm ${shell.textMuted}`}>Product OKR: Guardskills production badge → 70%</p><p className={`text-sm ${shell.textMuted}`}>Personal: Ship weekly → 8-week streak 🔥</p></div>}

      {show('activity') && <div className={`border p-5 ${shell.panel}`}><h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>10. ACTIVITY LOGS & HISTORY</h2><p className={`text-sm ${shell.textMuted}`}>• Mar 04 — Published 3 X + 3 Reddit posts</p><p className={`text-sm ${shell.textMuted}`}>• Mar 03 — Guardskills scanned 8 repos (all SAFE)</p><p className={`text-sm ${shell.textMuted}`}>• Mar 02 — MDify updated to 1.0.3</p><p className={`text-sm ${shell.textMuted}`}>• Mar 01 — Expense: Vercel bill $29</p></div>}

      {show('security') && <div className={`border p-5 ${shell.panel}`}><h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>11. SECURITY MONITOR</h2><p className={`text-sm ${shell.textMuted}`}>Last full scan: <span className="text-emerald-400">4 hours ago → ALL CLEAR</span></p><p className={`text-sm ${shell.textMuted}`}>Repos protected: 3</p><p className={`text-sm ${shell.textMuted}`}>Vulnerabilities blocked this month: 0</p></div>}

      {show('expense') && <div className={`border p-5 ${shell.panel}`}><h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>12. EXPENSE TRACKER</h2><p className={`text-sm ${shell.textMuted}`}>Total spent: $487</p><p className={`text-sm ${shell.textMuted}`}>Budget remaining: $113 (of $600)</p><p className={`text-sm ${shell.textMuted}`}>Hosting: $92 • Marketing: $180 • Tools: $65 • Misc: $150</p><p className="text-amber-400 text-sm mt-2">Projection: runway limit in 9 weeks. Time to ship MDify paid tier.</p></div>}
    </div>
  )
}
