# 🔧 Git Repository Setup Guide

This guide will help you initialize and set up this project as a Git repository and push it to GitHub.

## 📋 Prerequisites

- Git installed on your system ([Download Git](https://git-scm.com/downloads))
- GitHub account ([Sign up](https://github.com/join))
- Terminal/Command Prompt access

## 🚀 Quick Setup

### 1. Initialize Git Repository

Open your terminal in the project root directory and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "🚀 Initial commit: Space Station Safety Detection App v2.0"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `space-station-safety-detection`
   - **Description**: `AI-Powered Safety Detection for Space Station Environments using YOLOv8`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### 3. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/space-station-safety-detection.git

# Verify remote was added
git remote -v

# Push code to GitHub (main branch)
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🌿 Branch Strategy

### Creating Feature Branches

```bash
# Create and switch to a new feature branch
git checkout -b feature/new-feature-name

# Make changes, then stage and commit
git add .
git commit -m "✨ Add new feature description"

# Push feature branch to GitHub
git push -u origin feature/new-feature-name
```

### Recommended Branch Names

- `feature/camera-improvements` - For camera feature enhancements
- `feature/batch-processing` - For batch processing updates
- `fix/bug-description` - For bug fixes
- `docs/update-readme` - For documentation updates
- `style/ui-improvements` - For UI/styling changes

## 📝 Commit Message Conventions

Use these emoji prefixes for clear commit history:

- `🚀` `:rocket:` - Initial release or major features
- `✨` `:sparkles:` - New features
- `🐛` `:bug:` - Bug fixes
- `📝` `:memo:` - Documentation
- `💄` `:lipstick:` - UI/styling updates
- `♻️` `:recycle:` - Code refactoring
- `⚡` `:zap:` - Performance improvements
- `🔒` `:lock:` - Security fixes
- `🚧` `:construction:` - Work in progress
- `✅` `:white_check_mark:` - Tests
- `🔧` `:wrench:` - Configuration files

### Examples

```bash
git commit -m "✨ Add camera capture functionality"
git commit -m "🐛 Fix detection bounding box rendering issue"
git commit -m "📝 Update README with new features"
git commit -m "💄 Improve starfield animation performance"
```

## 🔄 Common Git Workflows

### Making Changes

```bash
# Check status of files
git status

# Stage specific files
git add path/to/file.tsx

# Stage all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push
```

### Pulling Latest Changes

```bash
# Pull latest changes from main branch
git pull origin main

# If you're on a feature branch, pull and merge
git checkout main
git pull
git checkout feature/your-branch
git merge main
```

### Viewing History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View with graph
git log --graph --oneline --all
```

## 🏷️ Tagging Releases

```bash
# Create a tag for version 2.0.0
git tag -a v2.0.0 -m "Release version 2.0.0 - Enhanced UI and 100% accuracy"

# Push tag to GitHub
git push origin v2.0.0

# Push all tags
git push --tags
```

## 📦 .gitignore

The `.gitignore` file is already configured to exclude:
- `node_modules/`
- Build outputs (`/build`, `/dist`)
- Environment files (`.env`)
- OS files (`.DS_Store`)
- Editor configs (`.vscode`, `.idea`)
- Logs and temporary files

## 🔐 Managing Secrets

**IMPORTANT**: Never commit sensitive information!

1. Use `.env.example` as a template
2. Create your own `.env` file locally
3. Add real API keys/secrets to `.env`
4. `.env` is already in `.gitignore`

## 🌐 GitHub Pages Deployment (Optional)

To deploy as a GitHub Pages site:

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://YOUR_USERNAME.github.io/space-station-safety-detection",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy to GitHub Pages
npm run deploy
```

## 🆘 Troubleshooting

### Issue: Push rejected

```bash
# If remote has changes you don't have locally
git pull --rebase origin main
git push
```

### Issue: Merge conflicts

```bash
# View files with conflicts
git status

# Edit files to resolve conflicts
# Remove conflict markers (<<<<<<<, =======, >>>>>>>)

# Stage resolved files
git add .

# Complete merge
git commit -m "🔀 Resolve merge conflicts"
```

### Issue: Undo last commit

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes (CAREFUL!)
git reset --hard HEAD~1
```

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ✅ Checklist

Before pushing to GitHub, ensure:

- [ ] All sensitive data is in `.env` (not `.env.example`)
- [ ] `.gitignore` is properly configured
- [ ] Code is tested and working
- [ ] README.md is up to date
- [ ] Commit messages are descriptive
- [ ] No `console.log` or debug code left in
- [ ] Dependencies are properly listed in `package.json`

---

**Happy Coding! 🚀**

For questions or issues, create an issue on GitHub or consult the main [README.md](README.md).
