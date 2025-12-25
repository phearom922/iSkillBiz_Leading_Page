# Admin User Setup Guide

## Problem: "Invalid credentials" Error

The login requires the user to exist in **both**:
1. Supabase Authentication (Auth → Users)
2. `admin_users` table (Database)

## Solution: Create User in Supabase Auth

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** or **"Invite user"**
4. Enter:
   - **Email**: `admin@iskillbiz.com` (or your email)
   - **Password**: Choose a strong password
   - **Auto Confirm User**: ✅ Check this (so user can login immediately)
5. Click **"Create user"**
6. **Copy the User ID** that's generated
7. Go to **Table Editor** → `admin_users`
8. Update the existing record:
   - Set `id` to the User ID from step 6
   - Or create a new record with that User ID

### Option 2: Via SQL (If user already exists in Auth)

If you already have a user in Supabase Auth:

1. Go to **Authentication** → **Users**
2. Find your user and **copy the User ID** (UUID)
3. Go to **SQL Editor** and run:

```sql
-- Update existing admin_users record
UPDATE admin_users 
SET id = '<user-id-from-auth>'
WHERE email = 'admin@iskillbiz.com';

-- Or insert new record if needed
INSERT INTO admin_users (id, email, role) 
VALUES ('<user-id-from-auth>', 'admin@iskillbiz.com', 'admin')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
```

### Option 3: Create Both via SQL (Advanced)

```sql
-- First, create user in auth.users (this requires service role)
-- Note: This is complex, better to use Supabase Dashboard

-- Then link to admin_users
INSERT INTO admin_users (id, email, role) 
VALUES ('<user-id>', 'admin@iskillbiz.com', 'admin')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
```

## Verify Setup

1. Check **Authentication** → **Users**: User should exist
2. Check **Table Editor** → `admin_users`: Record should exist with matching `id`
3. Try logging in again

## Troubleshooting

**Still getting "Invalid credentials"?**

1. **Check backend is running**: 
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Check environment variables** in `backend/.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (important for backend!)

3. **Check user password**: Make sure you're using the password you set in Supabase Auth

4. **Check user ID matches**: The `id` in `admin_users` must match the `id` in `auth.users`

## Quick Test

After setup, you should be able to:
1. Go to http://localhost:3000/admin/login
2. Enter email: `admin@iskillbiz.com`
3. Enter password: (the one you set in Supabase Auth)
4. Click "Sign in"
5. Should redirect to `/admin/dashboard`

