# Fix WebSocket Errors

## Problem
Console shows multiple WebSocket errors:
```
WebSocket connection to 'wss://dummy.supabase.co/realtime/v1/websocket?apikey=dummy-key&vsn=1.0.0' failed
```

## Cause
The app is using a dummy Supabase client (because environment variables are missing), but the realtime hooks are still trying to subscribe to WebSocket connections.

## Solution

### Option 1: Set Up Supabase (Recommended)

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NESTJS_PORT=3001
JWT_SECRET=your-random-secret-key-min-32-characters
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Get credentials from:**
- Supabase Dashboard → Settings → API
- Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
- Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy "service_role secret" key → `SUPABASE_SERVICE_ROLE_KEY`

### Option 2: Disable Realtime (Temporary)

The code has been updated to automatically skip realtime subscriptions when using dummy client. The WebSocket errors should stop appearing.

## After Setup

1. **Restart Next.js dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Restart NestJS backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

3. **Verify:**
   - No more WebSocket errors in console
   - App loads without Supabase warnings
   - Login works (if backend is configured)

## Note

The WebSocket errors are harmless when using dummy client - they're just failed connection attempts. The app will still work, but dynamic content features won't be available until Supabase is properly configured.

