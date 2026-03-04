import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const envVars = {
    TAVILY_API_KEY: process.env.TAVILY_API_KEY ? 'SET' : 'NOT_SET',
    EXA_API_KEY: process.env.EXA_API_KEY ? 'SET' : 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
  }

  return NextResponse.json({
    message: 'Environment variable check',
    envVars,
    note: 'If TAVILY_API_KEY shows NOT_SET, check Vercel settings. Make sure it is set for Production environment, not just Preview.',
  })
}
