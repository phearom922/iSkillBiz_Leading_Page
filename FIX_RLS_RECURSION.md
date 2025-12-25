# Fix: Infinite Recursion in admin_users RLS Policy

## Problem
Error: "infinite recursion detected in policy for relation 'admin_users'"

## Cause
The RLS policy was checking `admin_users` table while querying `admin_users` table itself, creating a circular reference.

## Solution

### Step 1: Update RLS Policy

Run this SQL in Supabase SQL Editor:

```sql
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admin users can view admin_users" ON admin_users;

-- Create a simpler policy that doesn't cause recursion
CREATE POLICY "Admin users can view admin_users"
    ON admin_users FOR SELECT
    USING (
        -- Allow if user is authenticated and viewing their own record
        auth.uid() IS NOT NULL
        AND id = auth.uid()
    );
```

### Step 2: Verify Service Role Key is Set

Make sure `backend/.env` has:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to get it:**
1. Go to Supabase Dashboard
2. Settings → API
3. Find **"service_role secret"** (NOT anon key!)
4. Copy the full key
5. Paste in `backend/.env`

### Step 3: Restart Backend

```bash
cd backend
# Stop server (Ctrl+C)
npm run start:dev
```

### Step 4: Try Login Again

The backend uses service role key which **automatically bypasses all RLS policies**, so it can read `admin_users` without any policy issues.

## Why This Works

- **Service role key** = Full database access, bypasses ALL RLS
- **Anon key** = Subject to RLS policies
- Backend should use **service role key** for admin operations
- Frontend uses **anon key** (subject to RLS)

## Important Notes

⚠️ **Service role key is SECRET** - never expose it in frontend code!
- ✅ Use in backend only
- ✅ Keep in `backend/.env` (not committed to git)
- ❌ Never use in frontend/Next.js code

