import { NextRequest, NextResponse } from 'next/server'
import { getAllSecrets } from '@/lib/aws-secrets'

export async function POST(request: NextRequest) {
  try {
    const { authCode } = await request.json()
    
    if (!authCode) {
      return NextResponse.json({
        error: 'authCode is required'
      }, { status: 400 })
    }
    
    const secrets = await getAllSecrets()
    const clientId = secrets.FYERS_CLIENT_ID
    const secretId = secrets.FYERS_SECRET_ID
    const redirectUri = secrets.FYERS_REDIRECT_URI || 'https://project-manager-blue-three.vercel.app/'
    
    if (!clientId || !secretId) {
      return NextResponse.json({
        error: 'FYERS_CLIENT_ID or FYERS_SECRET_ID not found'
      }, { status: 400 })
    }
    
    // Exchange auth code for access token
    const response = await fetch('https://api-t1.fyers.in/api/v3/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        auth_code: authCode,
        client_id: clientId,
        secret_key: secretId,
        redirect_uri: redirectUri
      })
    })
    
    const data = await response.json()
    
    if (data.code === 200) {
      return NextResponse.json({
        success: true,
        accessToken: data.access_token,
        message: 'Save this access token to Parameter Store as FYERS_ACCESS_TOKEN',
        note: 'Add to Parameter Store: FYERS_ACCESS_TOKEN=' + data.access_token
      })
    } else {
      return NextResponse.json({
        error: data.message || 'Failed to get access token',
        details: data
      }, { status: 400 })
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({
      error: err.message || 'Unknown error'
    }, { status: 500 })
  }
}
