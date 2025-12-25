# ⚠️ URGENT: Fix - หน้า Landing Page ไม่แสดงการเปลี่ยนแปลง

## 🔴 ปัญหาหลัก

**ไม่มีไฟล์ `.env.local`** ทำให้ Supabase ไม่สามารถเชื่อมต่อกับ database ได้!

จาก terminal logs:
```
⚠️ Supabase environment variables are missing. Using dummy client.
⚠️ No sections found for: Hero Section
```

## ✅ วิธีแก้ไข (ทำทันที!)

### ขั้นตอนที่ 1: สร้างไฟล์ `.env.local`

1. สร้างไฟล์ใหม่ชื่อ `.env.local` ใน root directory (ที่เดียวกับ `package.json`)

2. คัดลอกเนื้อหานี้ไปใส่:

```env
# Supabase Configuration
# ไปที่: https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api
# เพื่อหา URL และ Keys

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### ขั้นตอนที่ 2: หา Supabase Credentials

1. ไปที่ **Supabase Dashboard**: https://app.supabase.com
2. เลือกโปรเจกต์ของคุณ (iSkillBiz)
3. ไปที่ **Settings** → **API**
4. คัดลอก:
   - **Project URL** → ใส่ใน `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → ใส่ใน `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ขั้นตอนที่ 3: Restart Server

**สำคัญมาก!** หลังจากสร้าง `.env.local` แล้ว:

1. **หยุด Next.js server** (กด `Ctrl + C` ใน terminal)
2. **Start ใหม่**: `npm run dev`
3. **Refresh หน้าเว็บ** (กด `Ctrl + Shift + R`)

## 🔍 ตรวจสอบว่าแก้ไขสำเร็จ

หลังจาก restart แล้ว ดู terminal logs:

**✅ สำเร็จ:**
- ไม่เห็น `⚠️ Supabase environment variables are missing`
- เห็น `✅ Content fetched: {...}` ใน browser console

**❌ ยังไม่สำเร็จ:**
- ยังเห็น `⚠️ Supabase environment variables are missing`
- ตรวจสอบว่า:
  1. ไฟล์ `.env.local` อยู่ใน root directory
  2. ชื่อไฟล์ถูกต้อง (มีจุด `.` ด้านหน้า)
  3. ไม่มี space หรือ typo ในชื่อตัวแปร
  4. Restart server แล้ว

## 📝 ตัวอย่างไฟล์ `.env.local` ที่ถูกต้อง

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.example
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚨 ถ้ายังไม่ทำงาน

1. **ตรวจสอบว่า Supabase Database มีข้อมูลหรือไม่:**
   - ไปที่ Supabase Dashboard → Table Editor
   - ตรวจสอบว่า `sections` และ `section_content` มีข้อมูล

2. **ตรวจสอบ Network Tab:**
   - เปิด Browser DevTools (F12)
   - ไปที่ Network tab
   - Refresh หน้าเว็บ
   - หา request `/api/content`
   - ดู response ว่ามีข้อมูลหรือไม่

3. **ตรวจสอบ Console Logs:**
   - เปิด Browser DevTools (F12)
   - ไปที่ Console tab
   - ดูว่ามี error อะไรหรือไม่

## 📌 หมายเหตุ

- ไฟล์ `.env.local` จะถูก ignore โดย git (ไม่ถูก commit)
- อย่าลืม restart server หลังจากแก้ไข `.env.local`
- ถ้าใช้ Supabase หลายโปรเจกต์ ตรวจสอบว่าใช้ credentials ที่ถูกต้อง

