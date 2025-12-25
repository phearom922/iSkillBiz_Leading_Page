# Start Backend Server

## Problem
Error: `ERR_CONNECTION_REFUSED` when accessing admin dashboard or sections page.

## Solution: Start NestJS Backend

### Quick Start

1. **Open a new terminal window**

2. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

3. **Start the backend server:**
   ```bash
   npm run start:dev
   ```

4. **Wait for the server to start:**
   You should see:
   ```
   🚀 NestJS Backend running on http://localhost:3001
   ```

### Verify Backend is Running

1. **Check in browser:**
   Open: `http://localhost:3001/api/sections`
   
   Should see JSON response (even if empty array `[]`)

2. **Check in terminal:**
   ```bash
   netstat -ano | findstr :3001
   ```
   
   Should see `LISTENING` status

### Common Issues

#### Issue 1: Port 3001 Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Issue 2: Missing Environment Variables
**Error:** `Missing Supabase configuration`

**Solution:**
Create `backend/.env` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-key-min-32-characters
NESTJS_PORT=3001
FRONTEND_URL=http://localhost:3000
```

#### Issue 3: Dependencies Not Installed
**Error:** `Cannot find module`

**Solution:**
```bash
cd backend
npm install
```

### Running Both Servers

You need **TWO terminal windows**:

**Terminal 1 - Frontend (Next.js):**
```bash
npm run dev
```
Runs on: `http://localhost:3000`

**Terminal 2 - Backend (NestJS):**
```bash
cd backend
npm run start:dev
```
Runs on: `http://localhost:3001`

### After Starting Backend

1. **Refresh the admin dashboard** in your browser
2. **Check browser console** - errors should be gone
3. **Stats should load** - numbers should appear instead of 0

## Notes

- Backend must be running for admin dashboard to work
- Frontend can work without backend (but admin features won't work)
- Both servers can run simultaneously on different ports

