# 🚀 GitHub Pages Deployment Setup

## The Error You're Seeing
```
Error: Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions
```

## 🔧 How to Fix GitHub Pages

### Step 1: Enable GitHub Pages
1. Go to your repository on GitHub: `https://github.com/anjanaaa/task-app`
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)

### Step 2: Configure Pages Source
1. Under **Source**, select **"GitHub Actions"** (not "Deploy from a branch")
2. Click **Save**

### Step 3: Add Repository Secrets
1. Go to **Settings > Secrets and variables > Actions**
2. Add these secrets:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key

### Step 4: Trigger Deployment
1. Make any small commit to main branch
2. Push to trigger the GitHub Actions workflow
3. Check **Actions** tab to see deployment progress

## 🌐 Expected Result
Once configured, your app will be available at:
`https://anjanaaa.github.io/task-app`

## 🔍 Troubleshooting
- If Pages is not available, make sure your repository is public
- Check the Actions tab for detailed error logs
- Verify the secrets are properly set
- Ensure the repository has GitHub Actions enabled

## ✅ Manual Verification
You can test the build locally:
```bash
npm run build
npm run serve
```

The app should work at `http://localhost:3000`
