# CI/CD Pipeline Setup Guide

This guide explains the GitHub Actions CI/CD pipeline setup for the React Task Manager app.

## 🚀 Pipeline Overview

The CI/CD pipeline consists of 5 main jobs:

### 1. **Build and Test** 🔧
- **Triggers**: Every push to `main`/`develop` and all pull requests
- **Node versions**: Tests on both Node.js 18.x and 20.x
- **Steps**:
  - Install dependencies
  - Run linter (ESLint)
  - Run tests with coverage
  - Build the application
  - Upload build artifacts

### 2. **Security Audit** 🔒
- **Triggers**: After successful build
- **Steps**:
  - Run `npm audit` for known vulnerabilities
  - Check dependencies with `audit-ci`
  - Fail if moderate+ severity issues found

### 3. **Deploy to GitHub Pages** 🌐
- **Triggers**: Only on pushes to `main` branch
- **Steps**:
  - Build production version
  - Deploy to GitHub Pages
  - Available at: `https://anjanaaa.github.io/task-app`

### 4. **Performance Testing** ⚡
- **Triggers**: Only on pull requests
- **Steps**:
  - Run Lighthouse CI tests
  - Check performance, accessibility, SEO scores
  - Minimum thresholds:
    - Performance: 80%
    - Accessibility: 90%
    - Best Practices: 80%
    - SEO: 80%

### 5. **Notifications** 📢
- **Triggers**: After all jobs complete
- **Steps**:
  - Send success/failure notifications
  - Provide deployment status

## ⚙️ Required GitHub Secrets

To set up the pipeline, add these secrets in your GitHub repository:

### Navigate to: `Settings` → `Secrets and variables` → `Actions`

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase Dashboard → Settings → API |

### Adding Secrets:
1. Go to your GitHub repository
2. Click `Settings` tab
3. Click `Secrets and variables` → `Actions`
4. Click `New repository secret`
5. Add each secret with the exact name and value

## 📦 Additional Workflows

### Dependency Updates
- **File**: `.github/workflows/dependency-update.yml`
- **Schedule**: Every Monday at 9 AM UTC
- **Purpose**: Automatically update dependencies and create PRs
- **Manual trigger**: Available via GitHub Actions tab

## 🛠️ Local Development Scripts

New npm scripts added for development:

```bash
# Testing
npm run test:coverage    # Run tests with coverage report
npm run test:ci         # Run tests in CI mode

# Code Quality
npm run lint            # Check code with ESLint
npm run lint:fix        # Fix ESLint issues automatically
npm run format          # Format code with Prettier
npm run format:check    # Check if code is formatted

# Performance
npm run analyze         # Analyze bundle size
npm run serve           # Serve production build locally
npm run lighthouse      # Run Lighthouse performance tests
```

## 🌐 GitHub Pages Setup

### Automatic Setup (Recommended)
The pipeline will automatically configure GitHub Pages when you push to `main`.

### Manual Setup (If needed)
1. Go to repository `Settings` → `Pages`
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` (created automatically by the workflow)
4. Folder: `/ (root)`

## 🔍 Monitoring Your Pipeline

### View Pipeline Status
1. Go to your repository on GitHub
2. Click the `Actions` tab
3. See all workflow runs and their status

### Build Status Badge
Add this to your README.md to show build status:

```markdown
![CI/CD Pipeline](https://github.com/anjanaaa/task-app/actions/workflows/ci-cd.yml/badge.svg)
```

## 🚨 Troubleshooting

### Common Issues

**❌ Build fails with "Missing environment variables"**
- Solution: Add Supabase secrets to GitHub repository secrets

**❌ Deployment fails**
- Check GitHub Pages is enabled in repository settings
- Verify the workflow has `pages: write` permissions

**❌ Tests fail**
- Check if tests pass locally first: `npm test`
- Review error logs in GitHub Actions tab

**❌ Security audit fails**
- Run `npm audit` locally to see vulnerabilities
- Update dependencies: `npm update`
- Fix with: `npm audit fix`

**❌ Performance tests fail**
- Check Lighthouse scores locally: `npm run lighthouse`
- Optimize app performance to meet thresholds
- Consider adjusting thresholds in `lighthouserc.js`

### Performance Optimization Tips

If Lighthouse tests fail, try these optimizations:

1. **Image optimization**: Use WebP format, compress images
2. **Code splitting**: Implement React lazy loading
3. **Bundle analysis**: Run `npm run analyze` to find large dependencies
4. **Caching**: Ensure proper cache headers
5. **Accessibility**: Add alt tags, ARIA labels, proper heading structure

## 🎯 Pipeline Features

### ✅ What the Pipeline Does
- ✅ **Continuous Integration**: Every code change is tested
- ✅ **Multi-environment testing**: Tests on multiple Node.js versions
- ✅ **Security scanning**: Checks for vulnerabilities
- ✅ **Performance monitoring**: Lighthouse CI integration
- ✅ **Automatic deployment**: Deploys to GitHub Pages on main branch
- ✅ **Code quality**: ESLint and Prettier integration
- ✅ **Dependency management**: Automated security updates
- ✅ **Artifact storage**: Stores build outputs for download

### 🔄 Workflow Triggers
- **Push to main**: Full CI/CD pipeline + deployment
- **Push to develop**: CI/CD pipeline (no deployment)
- **Pull requests**: CI/CD pipeline + performance testing
- **Schedule**: Weekly dependency updates
- **Manual**: Can trigger workflows manually

## 📈 Next Steps

1. **Enable GitHub Pages** in repository settings
2. **Add repository secrets** for Supabase
3. **Push to main branch** to trigger first deployment
4. **Monitor pipeline** in Actions tab
5. **View deployed app** at your GitHub Pages URL

Your app will be automatically deployed and available to the world! 🌍
