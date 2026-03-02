import { NextResponse } from 'next/server'
import { getAllSecrets } from '@/lib/aws-secrets'

export async function GET() {
  try {
    const secrets = await getAllSecrets()
    const clientId = secrets.FYERS_APP_ID // Use APP_ID (format: xxx-100)
    const secretId = secrets.FYERS_SECRET_ID
    const redirectUri = secrets.FYERS_REDIRECT_URI || 'https://project-manager-blue-three.vercel.app/'
    
    if (!clientId || !secretId) {
      return NextResponse.json({
        error: 'FYERS_APP_ID or FYERS_SECRET_ID not found in Parameter Store'
      }, { status: 400 })
    }
    
    // Generate auth code URL
    const authUrl = `https://api-t1.fyers.in/api/v3/generate-authcode?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=sample_state`
    
    return NextResponse.json({
      authUrl,
      instructions: [
        '1. Visit the authUrl above',
        '2. Login to Fyers (if not already)',
        '3. You will be redirected to your redirect URI with a code parameter',
        '4. Copy the code from the URL and use /api/test/fyers/token to exchange for access token'
      ],
      note: 'This is a one-time setup. After getting access token, save it to Parameter Store as FYERS_ACCESS_TOKEN'
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({
      error: err.message || 'Unknown error'
    }, { status: 500 })
  }
}
