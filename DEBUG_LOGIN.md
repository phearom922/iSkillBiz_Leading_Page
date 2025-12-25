# Debug Login Issues

## Problem: Login button does nothing / page stays still

## Possible Causes

### 1. Backend Not Running
- Check if NestJS backend is running on port 3001
- Run: `cd backend && npm run start:dev`
- Check terminal for errors

### 2. CORS Issues
- Backend must allow requests from `http://localhost:3000`
- Check `backend/src/main.ts` CORS configuration

### 3. Network Error
- Open browser DevTools → Console tab
- Look for error messages
- Check Network tab for failed requests

### 4. Environment Variables
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Check `backend/.env` has all required variables

### 5. Middleware Blocking
- Middleware checks for token in cookies
- After login, token is stored in both localStorage and cookies
- If redirect fails, try manual navigation

## Debug Steps

1. **Open Browser Console** (F12)
2. **Try to login**
3. **Check console logs:**
   - `🔐 Attempting login to: ...`
   - `📡 Response status: ...`
   - `📦 Response data: ...`
   - `✅ Token stored, redirecting...`

4. **Check Network Tab:**
   - Look for `/api/auth/login` request
   - Check status code (should be 200)
   - Check response body

5. **Check Backend Terminal:**
   - Look for request logs
   - Check for errors

## Quick Fixes

### Fix 1: Check Backend is Running
```bash
cd backend
npm run start:dev
```

### Fix 2: Check Environment Variables
```bash
# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend .env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
```

### Fix 3: Clear Browser Cache
- Clear localStorage: `localStorage.clear()`
- Clear cookies
- Hard refresh: `Ctrl+Shift+R`

### Fix 4: Manual Redirect Test
After login, manually navigate to:
```
http://localhost:3000/admin/dashboard
```

## Common Errors

### "Cannot connect to backend server"
- Backend not running
- Wrong port (should be 3001)
- CORS not configured

### "Authentication failed"
- Wrong email/password
- User not in Supabase Auth
- User not in admin_users table

### "Failed to verify admin status"
- `SUPABASE_SERVICE_ROLE_KEY` not set in backend
- RLS policy blocking query

### Page redirects back to login
- Token not stored in cookie
- Middleware not seeing token
- Try manual navigation

