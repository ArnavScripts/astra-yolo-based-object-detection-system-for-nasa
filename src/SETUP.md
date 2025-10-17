# 🚀 Setup Guide

This guide will help you set up the Space Station Safety Detection application on your local machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Development](#development)
4. [Building for Production](#building-for-production)
5. [Troubleshooting](#troubleshooting)
6. [Git Workflow](#git-workflow)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** (v18.0.0 or higher)

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (v9.0.0 or higher) or **yarn**
  - Comes with Node.js
  - Verify installation: `npm --version`

### Optional

- **Git** for version control
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## Installation

### Step 1: Clone the Repository

```bash
# If you haven't cloned yet
git clone https://github.com/yourusername/space-station-detection.git
cd space-station-detection
```

### Step 2: Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

This will install all required packages including:

- React 18+
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- Recharts
- Lucide React icons
- shadcn/ui components
- Sonner (toast notifications)

### Step 3: Verify Installation

Check that everything is installed correctly:

```bash
npm list --depth=0
```

## Development

### Starting the Development Server

```bash
npm run dev
```

This will:

- Start the Vite development server
- Open your default browser to `http://localhost:5173`
- Enable hot module replacement (HMR)
- Show any compilation errors in the console

### Development Tips

1. **Auto-refresh**: The app will automatically reload when you save changes
2. **Type checking**: TypeScript will check types in real-time
3. **Console errors**: Check browser console for runtime errors
4. **Network tab**: Use DevTools Network tab to debug API calls

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Building for Production

### Step 1: Create Production Build

```bash
npm run build
```

This will:

- Run TypeScript compiler
- Bundle and minify your code
- Optimize assets
- Output to `dist/` directory

### Step 2: Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### Step 3: Deploy

You can deploy the `dist/` folder to any static hosting service:

#### Vercel

```bash
npm install -g vercel
vercel deploy
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages

Add to `package.json`:

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

Then run:

```bash
npm install gh-pages --save-dev
npm run build
npm run deploy
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Error: Port 5173 is already in use
# Solution: Kill the process or use a different port
PORT=3001 npm run dev
```

#### Module Not Found

```bash
# Error: Cannot find module 'X'
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Solution: Check tsconfig.json and ensure all types are installed
npm install --save-dev @types/react @types/react-dom
```

#### Tailwind Not Working

```bash
# Ensure globals.css is imported in your main file
# Check that @tailwind directives are present
```

### Clear Cache

If you encounter weird issues:

```bash
# Clear npm cache
npm cache clean --force

# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall
npm install
```

## Git Workflow

### Initial Setup

```bash
# Configure git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize repository (if not cloned)
git init
git remote add origin https://github.com/yourusername/space-station-detection.git
```

### Basic Workflow

```bash
# Check status
git status

# Create a new branch
git checkout -b feature/my-new-feature

# Stage changes
git add .

# Commit changes
git commit -m "Add my new feature"

# Push to remote
git push origin feature/my-new-feature
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### Commit Message Guidelines

Follow this format:

```
<type>: <subject>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Example:

```bash
git commit -m "feat: Add detection confidence threshold slider

- Add slider component to settings panel
- Update detection filtering logic
- Add tests for threshold filtering"
```

### Syncing with Remote

```bash
# Fetch latest changes
git fetch origin

# Merge changes from main
git merge origin/main

# Or rebase (cleaner history)
git rebase origin/main

# Push your changes
git push origin your-branch
```

## Environment Variables

Create a `.env` file in the root directory (if needed):

```env
# API Configuration (for future backend integration)
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your_api_key_here

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_HISTORY=true
```

## Project Structure Explained

```
space-station-detection/
├── components/              # React components
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── Header.tsx          # App header
│   ├── DetectionUpload.tsx # Upload interface
│   ├── DetectionResults.tsx# Results display
│   └── ...                 # Other components
├── styles/                 # Global styles
│   └── globals.css        # Tailwind and custom CSS
├── App.tsx                # Main app component
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
├── SETUP.md              # This file
├── CONTRIBUTING.md       # Contribution guidelines
├── LICENSE               # MIT license
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Next Steps

After setup:

1. ✅ Read the [README.md](README.md) for project overview
2. ✅ Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
3. ✅ Explore the codebase
4. ✅ Make your first commit
5. ✅ Open your first Pull Request

## Getting Help

- 📖 [Documentation](README.md)
- 🐛 [Report Issues](https://github.com/yourusername/space-station-detection/issues)
- 💬 [Discussions](https://github.com/yourusername/space-station-detection/discussions)

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Motion Documentation](https://motion.dev/)

---

Happy coding! 🚀 If you encounter any issues, please open an issue on GitHub.
