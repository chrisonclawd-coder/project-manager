// AWS Secrets Helper - Fetch from Parameter Store
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm')

const client = new SSMClient({ region: process.env.AWS_REGION || 'ap-south-1' })

async function getAllSecrets() {
  try {
    // Try individual parameters first, then fallback to combined
    const secrets = {}
    
    // First, try to get the combined parameter
    try {
      const command = new GetParameterCommand({
        Name: 'mission-control',
        WithDecryption: true
      })
      const response = await client.send(command)
      
      if (response.Parameter?.Value) {
        // Parse semicolon-separated key=value pairs
        const pairs = response.Parameter.Value.split(';')
        for (const pair of pairs) {
          const [key, value] = pair.split('=')
          if (key && value) {
            secrets[key.trim()] = value.trim()
          }
        }
        console.log('Parsed combined secrets from mission-control')
      }
    } catch (e) {
      console.log('No combined parameter, trying individual keys')
    }
    
    return secrets
  } catch (error) {
    console.error('Failed to fetch secrets:', error)
    return {}
  }
}

module.exports = { getAllSecrets }
