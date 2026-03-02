import { NextResponse } from 'next/server'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

export async function GET() {
  const client = new SSMClient({ region: 'ap-south-1' })
  
  try {
    const command = new GetParameterCommand({
      Name: 'mission-control',
      WithDecryption: true
    })
    const response = await client.send(command)
    
    return NextResponse.json({
      name: 'mission-control',
      value: response.Parameter?.Value,
      type: response.Parameter?.Type
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({
      error: err.message || 'Unknown error'
    }, { status: 500 })
  }
}
