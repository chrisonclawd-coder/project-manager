#!/usr/bin/env node

const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm')

const client = new SSMClient({ region: 'ap-south-1' })

async function getSecret(paramName) {
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

async function main() {
  console.log('\n🔑 Fetching secrets from AWS Parameter Store...\n')

  const params = [
    { param: '/mission-control/TAVILY_API_KEY', env: 'TAVILY_API_KEY' },
    { param: '/mission-control/EXA_API_KEY', env: 'EXA_API_KEY' },
    { param: '/mission-control/TWELVEDATA_API_KEY', env: 'TWELVEDATA_API_KEY' },
    { param: '/mission-control/FYERS_API_KEY', env: 'FYERS_API_KEY' },
    { param: '/mission-control/FYERS_APP_ID', env: 'FYERS_APP_ID' },
    { param: '/mission-control/FYERS_ACCESS_TOKEN', env: 'FYERS_ACCESS_TOKEN' },
  ]

  for (const { param, env } of params) {
    const value = await getSecret(param)
    if (value) {
      console.log(`${env}=${value}`)
    } else {
      console.log(`# ${env}=Not found in AWS Parameter Store`)
    }
  }

  console.log('\n✅ Copy these to Vercel Environment Variables')
  console.log('   https://vercel.com/chrisonclawd-coder/project-manager/settings/environment-variables\n')
}

main().catch(console.error)
