import { NextResponse } from 'next/server'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

export async function GET() {
  const client = new SSMClient({ region: 'ap-south-1' })
  
  const testParams = [
    'mission-control/TWELVEDATA_API_KEY',
    '/mission-control/TWELVEDATA_API_KEY',
    'TWELVEDATA_API_KEY',
    '/TWELVEDATA_API_KEY',
    'mission-control'
  ]
  
  const results = []
  
  for (const name of testParams) {
    try {
      const command = new GetParameterCommand({
        Name: name,
        WithDecryption: true
      })
      const response = await client.send(command)
      results.push({ name, found: !!response.Parameter, value: response.Parameter?.Value ? '***' : null })
    } catch (error: unknown) {
      const err = error as { name?: string, message?: string }
      results.push({ name, error: err.message || 'Failed' })
    }
  }
  
  return NextResponse.json({ results })
}
