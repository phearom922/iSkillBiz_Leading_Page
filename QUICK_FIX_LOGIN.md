# Quick Fix for Login Issue

## Problem
Error: "User is not an admin" even though user exists in both Supabase Auth and admin_users table.

## Root Cause
The backend needs `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS policies when querying the `admin_users` table.

## Solution

### Step 1: Create Backend Environment File

Create `backend/.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-random-secret-key-min-32-characters-long
NESTJS_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Step 2: Get Service Role Key

1. Go to Supabase Dashboard → Settings → API
2. Find **"service_role"** key (NOT the anon key!)
3. Copy it to `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`

⚠️ **Important**: Service role key has full access - keep it secret!

### Step 3: Restart Backend

```bash
cd backend
# Stop current server (Ctrl+C)
npm run start:dev
```

### Step 4: Try Login Again

- Email: `admin@iskillbiz.com`
- Password: `admin@1234`

## Verification

After setting `SUPABASE_SERVICE_ROLE_KEY`, the backend will:
1. ✅ Authenticate with Supabase Auth (using service role)
2. ✅ Query `admin_users` table (bypassing RLS)
3. ✅ Generate JWT token
4. ✅ Allow login

## Why This Happens

- RLS policies protect `admin_users` table
- Service role key bypasses RLS (needed for backend operations)
- Without service role key, backend can't read `admin_users` table
- Result: "User is not an admin" error even though user exists

