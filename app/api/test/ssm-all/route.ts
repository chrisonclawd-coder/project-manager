import { NextResponse } from 'next/server'
import { SSMClient, DescribeParametersCommand } from '@aws-sdk/client-ssm'

export async function GET() {
  const client = new SSMClient({ region: 'ap-south-1' })
  
  try {
    const results = []
    let nextToken: string | undefined
    
    do {
      const command = new DescribeParametersCommand({
        MaxResults: 50,
        NextToken: nextToken
      })
      const response = await client.send(command)
      
      results.push(...(response.Parameters?.map(p => ({
        Name: p.Name,
        Type: p.Type,
        KeyId: p.KeyId
      })) || []))
      
      nextToken = response.NextToken
    } while (nextToken)
    
    return NextResponse.json({
      total: results.length,
      parameters: results
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({
      error: err.message || 'Unknown error'
    }, { status: 500 })
  }
}
