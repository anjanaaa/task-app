# Supabase Setup Guide

This guide will help you set up Supabase for your React Task Manager app.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in your project details:
   - Name: `task-manager` (or any name you prefer)
   - Database Password: Create a strong password (save this!)
   - Region: Choose the closest to your location
6. Click "Create new project"
7. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to the project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" in the settings menu
4. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (the `anon` key under "Project API keys")

## Step 3: Configure Environment Variables

1. In your project root, create a `.env` file
2. Add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual credentials from Step 2

## Step 4: Set Up the Database

1. In your Supabase dashboard, click on "SQL Editor" in the sidebar
2. Click "New query"
3. Copy and paste the contents of `database-schema.sql` from this project
4. Click "Run" to execute the SQL

This will create:
- A `tasks` table with all necessary columns
- Proper indexes for performance
- Row Level Security policies
- An auto-updating `updated_at` column

## Step 5: Test the Connection

1. Make sure your React app is running (`npm start`)
2. Open your browser to `http://localhost:3000`
3. Try adding a new task
4. Check your Supabase dashboard under "Table Editor" > "tasks" to see if the task was saved

## Step 6: Enable Real-time (Optional)

1. In your Supabase dashboard, go to "Database" > "Replication"
2. Find the `tasks` table and toggle "Enable"
3. This allows real-time updates across multiple browser tabs/devices

## Security Notes

- The current setup allows all operations on tasks (good for development)
- For production, consider adding user authentication and row-level security
- Never commit your `.env` file to version control

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure your `.env` file is in the project root
- Restart your React development server after creating/updating `.env`
- Check that variable names start with `REACT_APP_`

### Tasks not saving
- Check browser console for errors
- Verify your credentials in Supabase dashboard
- Make sure you ran the database schema SQL

### Real-time updates not working
- Enable replication for the `tasks` table in Supabase dashboard
- Check browser console for WebSocket connection errors

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
