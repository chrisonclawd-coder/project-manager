import { NextResponse } from 'next/server'
import { getAllSecrets } from '@/lib/aws-secrets'

export async function GET() {
  try {
    const secrets = await getAllSecrets()
    return NextResponse.json({
      success: true,
      keysFound: Object.keys(secrets),
      keys: Object.keys(secrets).map(k => ({ key: k, hasValue: !!secrets[k] }))
    })
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
