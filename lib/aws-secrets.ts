// AWS Secrets Helper - Fetch from Parameter Store
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const client = new SSMClient({ region: 'ap-south-1' }) // Adjust region as needed

export async function getSecret(paramName: string): Promise<string | null> {
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
  const params = [
    '/mission-control/TWELVEDATA_API_KEY',
    '/mission-control/FYERS_API_KEY',
    '/mission-control/FYERS_APP_ID',
    '/mission-control/FYERS_ACCESS_TOKEN',
    '/mission-control/TAVILY_API_KEY',
    '/mission-control/EXA_API_KEY',
  ]
  
  const secrets: Record<string, string> = {}
  
  for (const param of params) {
    const value = await getSecret(param)
    if (value) {
      secrets[param] = value
    }
  }
  
  return secrets
}
