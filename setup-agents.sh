#!/bin/bash

# Agent Hierarchy Setup Script

echo "🎯 Setting up OpenClaw Agent Hierarchy..."

# Create workspaces
echo "📁 Creating workspaces..."
mkdir -p /home/clawdonaws/.openclaw/workspace/software-dev
mkdir -p /home/clawdonaws/.openclaw/workspace/analysis
mkdir -p /home/clawdonaws/.openclaw/workspace/marketing

# Create README files in each workspace
cat > /home/clawdonaws/.openclaw/workspace/software-dev/README.md << 'EOF'
# Software Development Workspace

## Purpose
Development team workspace for code, builds, and deployments.

## Sub-Agents
- **Developer**: Code implementation
- **QA Engineer**: Testing and validation
- **DevOps Engineer**: CI/CD and deployment
- **Manual Tester**: Production validation
- **Product Architect**: Specs and requirements

## Directories
- `projects/` - Project code
- `tests/` - Test suites
- `build/` - Build artifacts
- `deploy/` - Deployment scripts
EOF

cat > /home/clawdonaws/.openclaw/workspace/analysis/README.md << 'EOF'
# Analysis Workspace

## Purpose
Analysis team workspace for code review, performance, and security.

## Sub-Agents
- **Performance Analyst**: Metrics and optimization
- **Code Reviewer**: Code quality and patterns
- **Security Auditor**: Vulnerability scanning
- **Data Analyst**: Data processing and insights

## Directories
- `reports/` - Analysis reports
- `metrics/` - Performance metrics
- `audits/` - Security audits
- `data/` - Data sets
EOF

cat > /home/clawdonaws/.openclaw/workspace/marketing/README.md << 'EOF'
# Marketing Workspace (xMax)

## Purpose
Marketing team workspace for content, social media, and growth.

## Sub-Agents
- **Social Media Manager**: Twitter/X, Reddit, LinkedIn
- **Content Creator**: Blogs, articles, tutorials
- **Growth Strategist**: Growth hacking and viral mechanics
- **Brand Manager**: Brand voice and guidelines

## Directories
- `content/` - Blog posts and articles
- `social/` - Social media posts and schedules
- `campaigns/` - Marketing campaigns
- `brand/` - Brand guidelines and assets
EOF

echo "✅ Workspaces created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Review the agent hierarchy: cat AGENT-HIERARCHY.md"
echo "2. Review the config: cat AGENT-CONFIG.md"
echo "3. Apply the config to OpenClaw (ask me to do this)"
echo ""
echo "🎉 Setup complete!"
