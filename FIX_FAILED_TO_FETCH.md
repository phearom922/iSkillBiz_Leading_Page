# Fix: "Failed to fetch" Error in Sections Page

## Problem
Error: `TypeError: Failed to fetch` เมื่อเข้าหน้า `/admin/sections`

## Root Cause
"Failed to fetch" มักเกิดจาก:
1. **Backend ไม่ทำงาน** - NestJS backend ไม่ได้รันอยู่ที่ port 3001
2. **CORS issue** - Backend ไม่ได้อนุญาต requests จาก frontend
3. **Network error** - ไม่สามารถเชื่อมต่อกับ backend ได้
4. **Wrong API URL** - `NEXT_PUBLIC_API_URL` ไม่ถูกต้อง

## Solution

### 1. ตรวจสอบว่า Backend ทำงานอยู่หรือไม่

**ตรวจสอบใน Terminal:**
```bash
# ดูว่า port 3001 ถูกใช้งานหรือไม่
netstat -ano | findstr :3001
```

**ถ้าไม่มี process ใช้ port 3001:**
```bash
cd backend
npm run start:dev
```

**ควรเห็น:**
```
🚀 NestJS Backend running on http://localhost:3001
```

### 2. ตรวจสอบ Environment Variables

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend `backend/.env`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
NESTJS_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. ตรวจสอบ CORS Configuration

**Backend `backend/src/main.ts`:**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

### 4. ทดสอบ Backend API โดยตรง

เปิด browser ไปที่:
```
http://localhost:3001/api/sections
```

**ควรเห็น JSON response** ถ้า backend ทำงานถูกต้อง

### 5. ตรวจสอบ Browser Console

เปิด Browser DevTools (F12) → Console tab:
- ดู error messages
- ดู network requests ใน Network tab
- ตรวจสอบว่า request ไปที่ URL ถูกต้องหรือไม่

## Debug Steps

1. **เปิด Browser Console** (F12)
2. **ดู Console Logs:**
   - `🔍 Fetching sections from: ...`
   - `📡 Response status: ...`
   - `✅ Sections fetched: ...` หรือ `❌ Error fetching sections: ...`

3. **ตรวจสอบ Network Tab:**
   - ดู request `/api/sections`
   - ตรวจสอบ status code
   - ดู response body

4. **ตรวจสอบ Backend Terminal:**
   - ดู request logs
   - ดู error messages

## Quick Fixes

### Fix 1: Start Backend
```bash
cd backend
npm run start:dev
```

### Fix 2: Check Port Conflict
```bash
# ถ้า port 3001 ถูกใช้งาน
netstat -ano | findstr :3001
# Kill process
taskkill /PID <PID> /F
```

### Fix 3: Restart Both Servers
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run start:dev
```

### Fix 4: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R`
- Clear cache and cookies

## Expected Behavior

หลังจากแก้ไขแล้ว:
- ✅ ไม่มี "Failed to fetch" error
- ✅ Sections list แสดงข้อมูล
- ✅ Console แสดง `✅ Sections fetched: [...]`
- ✅ Network tab แสดง 200 OK

## Notes

- Error handling ได้รับการปรับปรุงแล้ว
- Console logs จะแสดงข้อมูล debug ที่มีประโยชน์
- Empty state จะแสดงเมื่อไม่มี sections หรือเกิด error

