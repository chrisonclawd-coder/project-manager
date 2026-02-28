# Dev Team Pipeline

## Overview
Structured development workflow with 4 distinct roles. Each role has specific responsibilities and exit criteria.

## Roles

### 1. Developer
- Implements features and fixes
- Validates locally before passing to QA
- Must ensure code compiles and basic tests pass

### 2. QA Engineer
- Functional testing
- Edge case validation
- Regression checks
- **Exit criteria**: All tests pass, no critical defects

### 3. DevOps Engineer
- Validates build
- Pushes to GitHub
- Deploys to Vercel/production
- **Exit criteria**: Successful deployment

### 4. Manual Tester
- Production validation
- Real-world scenario testing
- UX verification
- **Exit criteria**: No issues found in production

## Pipeline Flow

```
Developer → QA → DevOps → Manual Tester
    ↑          ↓        ↓          ↓
    ←←←←←← Loop back if issues ←←←←
```

## Loop Rules

- **QA finds defect** → Back to Developer
- **Manual Tester finds issue** → Back to QA → Developer
- **Continue looping** until Manual Tester approves

## Usage

When Robin asks for a coding task:
1. Use `sessions_spawn` to create subagents
2. Run through pipeline: Developer → QA → DevOps → Manual Tester
3. Report completion to Robin

## Model
All subagents use: `kilocode/minimax/minimax-m2.5:free`
