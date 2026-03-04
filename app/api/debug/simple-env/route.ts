import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tavilyKey = process.env.TAVILY_API_KEY
  const exaKey = process.env.EXA_API_KEY

  console.log('TAVILY_API_KEY:', tavilyKey ? 'SET' : 'NOT_SET')
  console.log('EXA_API_KEY:', exaKey ? 'SET' : 'NOT_SET')
  console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('API_KEY') || k.includes('TAVILY') || k.includes('EXA')))

  return NextResponse.json({
    tavilyKey: tavilyKey ? 'SET' : 'NOT_SET',
    exaKey: exaKey ? 'SET' : 'NOT_SET',
    allEnvVars: Object.keys(process.env).filter(k => k.includes('API_KEY') || k.includes('TAVILY') || k.includes('EXA')),
    nodeEnv: process.env.NODE_ENV,
  })
}
