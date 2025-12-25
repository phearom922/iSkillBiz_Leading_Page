# Environment Variables Setup

## ⚠️ สำคัญ: ต้องมี 2 ไฟล์ `.env.local`

1. **Root directory** (สำหรับ Next.js frontend) - `/.env.local`
2. **Backend directory** (สำหรับ NestJS backend) - `/backend/.env.local`

## Quick Fix for "Missing Supabase environment variables" Error

Create a file named `.env.local` in the **root directory** (ที่เดียวกับ `package.json`) with the following content:

```env
# Supabase Configuration
# Get these from: https://supabase.com/dashboard → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NestJS Backend
NESTJS_PORT=3001
JWT_SECRET=your-random-secret-key-min-32-characters-long
FRONTEND_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## How to Get Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## After Creating .env.local

1. **Restart your Next.js dev server** (stop with Ctrl+C, then run `npm run dev` again)
2. The app should now load without errors
3. If you haven't set up Supabase yet, the app will use fallback static content

## 📁 โครงสร้างไฟล์

```
Static_SaaS_Landing_Page/
├── .env.local          ← สำหรับ Next.js frontend (ต้องมี!)
├── package.json
├── backend/
│   └── .env.local      ← สำหรับ NestJS backend (ต้องมี!)
└── ...
```

**หมายเหตุ:** ถ้าคุณมีไฟล์ `.env.local` ใน `backend/` แล้ว ให้ copy เนื้อหาไปสร้างไฟล์ใหม่ใน root directory ด้วย!

## Note

The app has been updated to handle missing environment variables gracefully. It will:
- Show a warning in the console
- Use fallback static content
- Still allow you to develop the frontend

But for full functionality (Admin Dashboard, dynamic content), you need to set up Supabase properly.

