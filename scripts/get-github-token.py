#!/usr/bin/env python3
import boto3
import os

def get_github_token():
    try:
        ssm = boto3.client('ssm', region_name='ap-south-1')
        response = ssm.get_parameter(Name='mission-control', WithDecryption=True)
        value = response['Parameter']['Value']
        
        # Parse semicolon-separated key=value pairs
        for pair in value.split(';'):
            if '=' in pair:
                key, val = pair.split('=', 1)
                if key.strip() == 'GITHUB_TOKEN':
                    print(val.strip())
                    return
        
        print("")
    except Exception as e:
        print(f"Error: {e}", file=os.sys.stderr)

get_github_token()
