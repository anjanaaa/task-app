# 🔐 Google Authentication Setup Guide

This guide will help you set up Google authentication for your React task app using Supabase.

## 📋 Prerequisites

- Supabase project with authentication enabled
- Google Cloud Console account
- React app with Supabase client configured

## 🚀 Step 1: Configure Google OAuth in Google Cloud Console

### 1.1 Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**
5. Choose **Web application** as the application type
6. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### 1.2 Enable Google+ API

1. Go to **APIs & Services** > **Library**
2. Search for **Google+ API**
3. Click **Enable**

## 🔧 Step 2: Configure Supabase Authentication

### 2.1 Add Google Provider

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and click **Enable**
5. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
6. Click **Save**

### 2.2 Configure Redirect URLs

1. In **Authentication** > **URL Configuration**
2. Set **Site URL** to your app's URL (e.g., `https://yourdomain.com`)
3. Add redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)

## 🗄️ Step 3: Update Database Schema

### 3.1 Add User ID Column

1. Go to **Table Editor** > **tasks**
2. Add a new column:
   - **Name**: `user_id`
   - **Type**: `uuid`
   - **Default Value**: Leave empty
   - **Is Nullable**: `false`

### 3.2 Enable Row Level Security

1. In **Table Editor** > **tasks**
2. Click **RLS** tab
3. Toggle **Enable RLS** to **ON**

### 3.3 Create RLS Policies

Run the SQL commands from `database-schema.sql` in the **SQL Editor**:

```sql
-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tasks
CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tasks
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own tasks
CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_created ON tasks(user_id, created_at DESC);
```

## 🌐 Step 4: Update Environment Variables

### 4.1 Local Development

Update your `.env` file:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 4.2 Production

Add these secrets to your GitHub repository:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## 🧪 Step 5: Test the Integration

### 5.1 Start the App

```bash
npm start
```

### 5.2 Test Authentication Flow

1. Open your app in the browser
2. You should see the login screen
3. Click "Continue with Google"
4. Complete Google OAuth flow
5. You should be redirected back to your app
6. Verify you can see your user info in the header
7. Test creating, editing, and deleting tasks

## 🔍 Troubleshooting

### Common Issues

#### 1. "Invalid redirect URI" Error
- Check that your redirect URIs match exactly in both Google Cloud Console and Supabase
- Ensure no trailing slashes or extra characters

#### 2. "Provider not enabled" Error
- Verify Google provider is enabled in Supabase Authentication > Providers
- Check that you've saved the provider configuration

#### 3. Tasks not loading
- Verify RLS policies are correctly set up
- Check that `user_id` column exists in tasks table
- Ensure user is properly authenticated

#### 4. CORS Issues
- Add your domain to Supabase Auth > URL Configuration
- Check that Site URL is correctly set

### Debug Steps

1. Check browser console for errors
2. Verify Supabase client configuration
3. Check network tab for failed requests
4. Verify environment variables are loaded
5. Check Supabase logs for authentication errors

## 📱 Mobile Considerations

For mobile apps or PWA:
- Add mobile redirect URIs to Google OAuth
- Consider using deep linking for mobile authentication
- Test on various devices and browsers

## 🔒 Security Best Practices

1. **Never expose client secrets** in frontend code
2. **Use HTTPS** in production
3. **Implement proper error handling** for auth failures
4. **Add rate limiting** for authentication attempts
5. **Regularly rotate** OAuth credentials
6. **Monitor authentication logs** for suspicious activity

## 🎯 Next Steps

After successful setup:
1. Add user profile management
2. Implement email verification
3. Add social login options (GitHub, Facebook, etc.)
4. Set up user roles and permissions
5. Add audit logging for user actions

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React Context API Documentation](https://reactjs.org/docs/context.html)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
