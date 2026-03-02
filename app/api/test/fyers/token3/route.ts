import { NextRequest, NextResponse } from 'next/server'
import { getAllSecrets } from '@/lib/aws-secrets'

export async function POST(request: NextRequest) {
  try {
    const { authCode } = await request.json()
    
    if (!authCode) {
      return NextResponse.json({ error: 'authCode required' }, { status: 400 })
    }
    
    const secrets = await getAllSecrets()
    const clientId = secrets.FYERS_APP_ID
    const secretKey = secrets.FYERS_SECRET_ID
    
    if (!clientId || !secretKey) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }
    
    // Direct HTTP call
    const response = await fetch('https://api-t1.fyers.in/api/v3/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        auth_code: authCode,
        client_id: clientId,
        secret_key: secretKey,
        redirect_uri: 'https://project-manager-blue-three.vercel.app/'
      })
    })
    
    const data = await response.json()
    
    if (data.access_token) {
      return NextResponse.json({
        success: true,
        accessToken: data.access_token,
        message: 'Add to Parameter Store: FYERS_ACCESS_TOKEN=' + data.access_token
      })
    } else {
      return NextResponse.json({ error: data.message || 'Failed', details: data }, { status: 400 })
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 })
  }
}
