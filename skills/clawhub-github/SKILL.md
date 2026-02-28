# GitHub Skill

This skill helps manage GitHub repositories securely using the GitHub API instead of storing credentials locally.

## How It Works

1. The skill connects to GitHub via OAuth
2. You authorize the skill in your browser
3. The skill receives a temporary access token
4. All GitHub operations are performed through this token
5. The token auto-expires after use

## Usage

When you need to interact with GitHub:

```
Use clawhub.github skill to push code to GitHub repository "article-to-flashcards"
```

The skill will:
1. Ask for repository details
2. Connect to GitHub
3. Authorize via OAuth
4. Perform the requested operation
5. Report results

## Security

- No credentials stored locally
- Temporary tokens only
- All actions logged
- Can be revoked anytime

## Commands

### Push Code

```
Push code from local directory to GitHub repository "article-to-flashcards" on GitHub
```

### Create Repository

```
Create GitHub repository "article-to-flashcards" on GitHub
```

### Create Branch

```
Create branch "feature/x-strategy" in repository "article-to-flashcards" on GitHub
```

### Pull Request

```
Create pull request from "feature/x-strategy" to "main" in repository "article-to-flashcards" on GitHub
```

### Install

To install:
1. Clone this skill to your skills directory
2. Enable it in your OpenClaw config
3. Use it when you need GitHub access

---

*Created for secure GitHub operations*
