#!/usr/bin/env python3
import re

# Read the file
with open('/home/clawdonaws/.openclaw/workspace/reddit-tracker-v2.py', 'r') as f:
    content = f.read()

# Fix the broken f-strings
content = re.sub(
    r'print\(f"\\\\n📊 Digest message:\n\{message\}\)',
    r'print(f"\\n📊 Digest message:\\n{message}")',
    content
)

content = re.sub(
    r'print\(f"\\\\n💬 Feedback message:\n\{feedback_msg\}\)',
    r'print(f"\\n💬 Feedback message:\\n{feedback_msg}")',
    content
)

# Write back
with open('/home/clawdonaws/.openclaw/workspace/reddit-tracker-v2.py', 'w') as f:
    f.write(content)

print('Fixed f-strings')
