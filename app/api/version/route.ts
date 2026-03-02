import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CURRENT_VERSION = '2026-02-26'
const GITHUB_REPO = 'chrisonclawd-coder/project-manager'

export async function GET() {
  try {
    // Try to fetch latest release from GitHub
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Mission-Control'
        }
      }
    )
    
    let latestVersion = CURRENT_VERSION
    let updateAvailable = false
    
    if (response.ok) {
      const data = await response.json()
      latestVersion = data.tag_name?.replace('v', '') || CURRENT_VERSION
      
      // Compare dates
      updateAvailable = latestVersion > CURRENT_VERSION
    }
    
    return NextResponse.json({
      current: CURRENT_VERSION,
      latest: latestVersion,
      updateAvailable,
      repo: `https://github.com/${GITHUB_REPO}`
    })
  } catch (error) {
    // Return current version if check fails
    return NextResponse.json({
      current: CURRENT_VERSION,
      latest: CURRENT_VERSION,
      updateAvailable: false,
      error: 'Could not check for updates'
    })
  }
}
