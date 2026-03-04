// AWS Secrets Helper - Fetch from Parameter Store or Environment Variables
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const client = new SSMClient({ region: 'ap-south-1' })

// Map parameter names to environment variable names
const PARAM_TO_ENV: Record<string, string> = {
  '/mission-control/TWELVEDATA_API_KEY': 'TWELVEDATA_API_KEY',
  '/mission-control/FYERS_API_KEY': 'FYERS_API_KEY',
  '/mission-control/FYERS_APP_ID': 'FYERS_APP_ID',
  '/mission-control/FYERS_ACCESS_TOKEN': 'FYERS_ACCESS_TOKEN',
  '/mission-control/TAVILY_API_KEY': 'TAVILY_API_KEY',
  '/mission-control/EXA_API_KEY': 'EXA_API_KEY',
}

export async function getSecret(paramName: string): Promise<string | null> {
  // First try environment variable (for Vercel)
  const envVar = PARAM_TO_ENV[paramName]
  if (envVar && process.env[envVar]) {
    return process.env[envVar] || null
  }

  // Fall back to AWS Parameter Store (for VPS)
  try {
    const command = new GetParameterCommand({
      Name: paramName,
      WithDecryption: true
    })
    const response = await client.send(command)
    return response.Parameter?.Value || null
  } catch (error) {
    console.error(`Failed to get ${paramName}:`, error)
    return null
  }
}

export async function getAllSecrets(): Promise<Record<string, string>> {
  const secrets: Record<string, string> = {}

  // First check environment variables (for Vercel)
  for (const [param, envVar] of Object.entries(PARAM_TO_ENV)) {
    const value = process.env[envVar]
    if (value !== undefined && value !== null && value !== '') {
      // Store with env var name for consistent key access
      secrets[envVar] = value
      console.log(`Env var ${envVar}: FOUND`)
    } else {
      console.log(`Env var ${envVar}: NOT FOUND`)
    }
  }

  // If we have env vars, return those (Vercel mode)
  if (Object.keys(secrets).length > 0) {
    console.log('Using environment variables for secrets')
    console.log('Secrets found:', Object.keys(secrets))
    return secrets
  }

  // Otherwise, fall back to AWS Parameter Store (VPS mode)
  console.log('Falling back to AWS Parameter Store')
  const params = Object.keys(PARAM_TO_ENV)
  for (const param of params) {
    const value = await getSecret(param)
    if (value) {
      // Store with env var name for consistent key access
      const envVar = PARAM_TO_ENV[param]
      if (envVar) {
        secrets[envVar] = value
      }
    }
  }

  return secrets
}
