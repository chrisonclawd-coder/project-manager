import { NextResponse } from 'next/server'
import { SSMClient, GetParameterCommand, GetParametersByPathCommand } from '@aws-sdk/client-ssm'

export async function GET() {
  const client = new SSMClient({ region: 'ap-south-1' })
  
  try {
    // Try getting parameters by path
    const pathCommand = new GetParametersByPathCommand({
      Path: '/mission-control',
      Recursive: true,
      WithDecryption: true
    })
    const pathResponse = await client.send(pathCommand)
    
    return NextResponse.json({
      path: '/mission-control',
      parameters: pathResponse.Parameters?.map(p => ({ 
        name: p.Name, 
        type: p.Type 
      })) || []
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({
      error: err.message || 'Unknown error'
    }, { status: 500 })
  }
}
