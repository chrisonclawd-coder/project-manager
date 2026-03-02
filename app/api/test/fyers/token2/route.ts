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
    const clientId = secrets.FYERS_APP_ID // Use APP_ID (format: xxx-100)
    const secretKey = secrets.FYERS_SECRET_ID
    
    if (!clientId || !secretKey) {
      return NextResponse.json({
        error: 'FYERS_APP_ID or FYERS_SECRET_ID not found'
      }, { status: 400 })
    }
    
    // Use fyers-api-v3 SDK
    const fyers = require('fyers-api-v3').fyersModel
    
    const fyersClient = new fyers({
      client_id: clientId,
      secret_key: secretKey,
      access_token: '', // Empty for auth code exchange
      log_path: ''
    })
    
    // Exchange auth code for access token
    const response = await new Promise((resolve, reject) => {
      fyersClient.setAuthToken(authCode)
      fyersClient.generateAccessToken().then(resolve).catch(reject)
    })
    
    return NextResponse.json({
      success: true,
      response
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({
      error: err.message || 'Unknown error'
    }, { status: 500 })
  }
}
