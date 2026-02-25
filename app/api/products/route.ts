import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const packages = ['guardskills', 'mdify']
  const results = await Promise.all(
    packages.map(async (pkg) => {
      try {
        const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg}`)
        const data = await res.json()
        return { package: pkg, downloads: data.downloads || 0 }
      } catch {
        return { package: pkg, downloads: 0 }
      }
    })
  )
  return NextResponse.json(results)
}
