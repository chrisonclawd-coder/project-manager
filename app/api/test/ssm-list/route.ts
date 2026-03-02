import { NextResponse } from 'next/server'
import { SSMClient, DescribeParametersCommand } from '@aws-sdk/client-ssm'

export async function GET() {
  const client = new SSMClient({ region: 'ap-south-1' })
  
  try {
    const command = new DescribeParametersCommand({
      MaxResults: 10
    })
    const response = await client.send(command)
    return NextResponse.json({
      parameters: response.Parameters?.map(p => p.Name) || []
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({
      error: err.message || 'Unknown error'
    }, { status: 500 })
  }
}
