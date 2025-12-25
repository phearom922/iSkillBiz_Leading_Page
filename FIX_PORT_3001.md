# Fix: Port 3001 Already in Use

## Problem
```
Error: listen EADDRINUSE: address already in use :::3001
```

## Solution Options

### Option 1: Stop the Process Using Port 3001 (Recommended)

**Using Command Line:**
```bash
# Find the process
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Using Task Manager:**
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Go to "Details" tab
3. Find the process using port 3001 (look for "node.exe" or PID 23768)
4. Right-click → End Task

### Option 2: Change Backend Port

Edit `backend/.env`:
```env
NESTJS_PORT=3002
```

Then update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Option 3: Find and Stop All Node Processes

```bash
# Find all node processes
tasklist | findstr node.exe

# Kill all node processes (be careful!)
taskkill /IM node.exe /F
```

## After Fixing

Restart the backend:
```bash
cd backend
npm run start:dev
```

## Note

The process using port 3001 is likely a previous instance of the NestJS backend that didn't shut down properly. This is common during development.

