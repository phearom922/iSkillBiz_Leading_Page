# Troubleshooting Guide

## Login Issues

### Error: "missing email or phone"

**Possible Causes:**
1. Backend server is not running
2. Email or password fields are empty
3. User doesn't exist in Supabase Auth

**Solutions:**

1. **Check Backend is Running:**
   ```bash
   cd backend
   npm run start:dev
   ```
   You should see: `🚀 NestJS Backend running on http://localhost:3001`

2. **Verify User Exists in Supabase Auth:**
   - Go to Supabase Dashboard → Authentication → Users
   - Check if your user exists
   - If not, create one:
     - Click "Add user" or "Invite user"
     - Enter email: `admin@iskillbiz.com`
     - Enter password
     - Check "Auto Confirm User"
     - Click "Create user"
     - Copy the User ID

3. **Link User to admin_users Table:**
   - Go to Table Editor → `admin_users`
   - Update the record to use the User ID from step 2:
   ```sql
   UPDATE admin_users 
   SET id = '<user-id-from-auth>'
   WHERE email = 'admin@iskillbiz.com';
   ```

4. **Check Environment Variables:**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Verify backend has `SUPABASE_SERVICE_ROLE_KEY` set

### Error: "Cannot connect to backend server"

**Solution:**
1. Make sure backend is running:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Check if port 3001 is available:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :3001
   ```

3. Verify `NEXT_PUBLIC_API_URL` in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Error: "User is not an admin"

**Solution:**
The user exists in Supabase Auth but not in `admin_users` table.

1. Get the User ID from Authentication → Users
2. Insert or update in `admin_users`:
   ```sql
   INSERT INTO admin_users (id, email, role) 
   VALUES ('<user-id>', 'admin@iskillbiz.com', 'admin')
   ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
   ```

### Error: "Invalid credentials"

**Possible Causes:**
1. Wrong password
2. User doesn't exist in Supabase Auth
3. Email doesn't match

**Solutions:**
1. Verify password in Supabase Auth
2. Reset password if needed:
   - Go to Authentication → Users
   - Click on user
   - Click "Reset password"
3. Make sure email matches exactly (case-sensitive)

## Backend Issues

### Backend won't start

**Check:**
1. All dependencies installed:
   ```bash
   cd backend
   npm install
   ```

2. Environment variables set in `backend/.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   JWT_SECRET=...
   ```

3. Port 3001 is not in use

### CORS Errors

**Solution:**
Check `FRONTEND_URL` in backend `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

## Database Issues

### Tables don't exist

**Solution:**
Run migrations in Supabase SQL Editor:
1. `001_initial_schema.sql`
2. `002_rls_policies.sql`
3. `003_seed_data.sql`

### RLS Policy Errors

**Solution:**
Make sure you ran `002_rls_policies.sql` after creating tables.

## Quick Checklist

- [ ] Backend is running on port 3001
- [ ] Frontend is running on port 3000
- [ ] Supabase project is created
- [ ] Database migrations are run
- [ ] User exists in Supabase Auth
- [ ] User exists in `admin_users` table with matching ID
- [ ] Environment variables are set correctly
- [ ] Storage bucket `images` is created

