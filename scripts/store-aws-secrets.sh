#!/bin/bash
# Store API keys in AWS Systems Manager Parameter Store (SecureString)

# Trading Keys
aws ssm put-parameter --name "/mission-control/TWELVEDATA_API_KEY" --value "your_twelve_key" --type SecureString --overwrite
aws ssm put-parameter --name "/mission-control/FYERS_API_KEY" --value "your_fyers_key" --type SecureString --overwrite
aws ssm put-parameter --name "/mission-control/FYERS_APP_ID" --value "your_app_id" --type SecureString --overwrite
aws ssm put-parameter --name "/mission-control/FYERS_ACCESS_TOKEN" --value "your_token" --type SecureString --overwrite

# Research Keys
aws ssm put-parameter --name "/mission-control/TAVILY_API_KEY" --value "your_tavily_key" --type SecureString --overwrite
aws ssm put-parameter --name "/mission-control/EXA_API_KEY" --value "your_exa_key" --type SecureString --overwrite

echo "All keys stored in AWS Parameter Store!"
