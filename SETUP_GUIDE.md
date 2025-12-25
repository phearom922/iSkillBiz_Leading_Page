# iSkillBiz Admin Dashboard - Complete Setup Guide

## 🎯 Overview

ระบบ Admin Dashboard สำหรับจัดการ Dynamic Content ของ Landing Page โดยใช้:
- **Supabase**: Database + Authentication + Storage + Realtime
- **NestJS**: Backend API
- **Next.js**: Admin Dashboard + Landing Page

## 📋 Prerequisites

- Node.js 18+ 
- npm หรือ yarn
- Supabase account (ฟรี)

## 🚀 Quick Start

### Step 1: สร้าง Supabase Project

1. ไปที่ https://supabase.com และสร้าง project ใหม่
2. เก็บ URL และ API keys ไว้

### Step 2: Setup Database

1. ไปที่ SQL Editor ใน Supabase Dashboard
2. Run migrations ตามลำดับ:
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_rls_policies.sql
   supabase/migrations/003_seed_data.sql
   ```

3. สร้าง Storage Bucket:
   - ไปที่ Storage → Create bucket
   - Name: `images`
   - Public: ✅ Yes
   - Policies: Public read access

### Step 3: สร้าง Admin User

1. ไปที่ Authentication → Users → Add user
2. สร้าง user ด้วย email/password
3. Copy User ID ที่ได้
4. Run SQL นี้ (แทนที่ `<user-id>` และ `<email>`):
   ```sql
   INSERT INTO admin_users (id, email, role) 
   VALUES ('<user-id>', '<email>', 'admin');
   ```

### Step 4: ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ใน root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# NestJS Backend
NESTJS_PORT=3001
JWT_SECRET=your-random-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 5: Install Dependencies

```bash
# Install Next.js dependencies
npm install

# Install NestJS backend dependencies
cd backend
npm install
cd ..
```

### Step 6: Run Development Servers

**Terminal 1 - Next.js:**
```bash
npm run dev
```

**Terminal 2 - NestJS:**
```bash
cd backend
npm run start:dev
```

### Step 7: เข้าสู่ระบบ Admin

1. เปิดเบราว์เซอร์ไปที่ http://localhost:3000/admin/login
2. Login ด้วย email/password ที่สร้างไว้
3. เริ่มจัดการ content ได้เลย!

## 📁 Project Structure

```
Static_SaaS_Landing_Page/
├── app/
│   ├── (admin)/          # Admin routes (protected)
│   │   └── admin/
│   │       ├── login/    # Login page
│   │       ├── dashboard/
│   │       ├── sections/
│   │       ├── pricing/
│   │       ├── videos/
│   │       └── images/
│   ├── (public)/         # Public landing page
│   └── api/              # Next.js API routes
├── backend/              # NestJS backend
│   └── src/
│       ├── auth/         # JWT authentication
│       ├── sections/     # Sections CRUD
│       ├── pricing/      # Pricing management
│       ├── videos/       # YouTube videos
│       └── images/       # Image upload
├── components/
│   ├── admin/            # Admin components
│   └── sections/        # Landing page sections
├── lib/
│   ├── supabase/         # Supabase clients
│   └── hooks/            # React hooks (useContent, useRealtime)
└── supabase/
    └── migrations/        # Database migrations
```

## 🎨 Features

### Admin Dashboard
- ✅ Login/Logout with JWT
- ✅ Dashboard with statistics
- ✅ Section content editor
- ✅ Pricing plan manager
- ✅ YouTube video manager
- ✅ Image uploader
- ✅ Dark mode support
- ✅ Toast notifications
- ✅ Real-time updates

### Landing Page
- ✅ Dynamic content from Supabase
- ✅ Real-time content updates
- ✅ Fallback to static content
- ✅ All sections support dynamic content

## 🔐 Security

- Admin routes protected with JWT
- Supabase RLS policies
- Service role key only server-side
- Public read access for landing page

## 🐛 Troubleshooting

**Can't login?**
- ตรวจสอบว่า admin user อยู่ใน `admin_users` table
- ตรวจสอบ email/password ถูกต้อง

**Content not loading?**
- ตรวจสอบ Supabase environment variables
- ตรวจสอบว่า migrations รันแล้ว

**Images not uploading?**
- ตรวจสอบ storage bucket permissions
- ตรวจสอบ RLS policies

**Backend not starting?**
- ตรวจสอบ environment variables ทั้งหมด
- ตรวจสอบ port 3001 ไม่ถูกใช้งาน

## 📝 Next Steps

1. Deploy Supabase project (อัตโนมัติ)
2. Deploy NestJS backend (Railway/Render/DigitalOcean)
3. Deploy Next.js frontend (Vercel)
4. ตั้งค่า environment variables ใน production
5. เริ่มจัดการ content!

## 🎉 Done!

ระบบพร้อมใช้งานแล้ว! สามารถเริ่มจัดการ content ผ่าน Admin Dashboard ได้เลย

