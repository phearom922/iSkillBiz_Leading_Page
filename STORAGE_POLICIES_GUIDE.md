# คู่มือการตั้ง Storage Policies ใน Supabase

## วิธีที่ 1: ใช้ SQL Editor (แนะนำ - ง่ายและรวดเร็ว)

### ขั้นตอน:
1. เปิด Supabase Dashboard → ไปที่ **SQL Editor**
2. คัดลอก SQL จากไฟล์ `supabase/migrations/007_storage_policies.sql`
3. วางใน SQL Editor และกด **Run**
4. ตรวจสอบผลลัพธ์ว่าสร้าง policies สำเร็จ

---

## วิธีที่ 2: ใช้ UI ใน Dashboard (สำหรับผู้ที่ต้องการควบคุมมากขึ้น)

### ขั้นตอนการสร้าง Policies สำหรับ Bucket "IMAGES":

#### 1. เปิด Storage Policies
- ไปที่ **Storage** → **Policies** tab
- เลือก bucket **IMAGES**

#### 2. สร้าง Policy สำหรับ SELECT (Public Read Access)

**คลิก "New policy" ใต้ IMAGES bucket**

**Policy Name:** `Public can view images`

**Allowed Operation:** `SELECT`

**Policy Definition (SQL):**
```sql
(bucket_id = 'images')
```

**Target roles:** เลือก `anon` และ `authenticated`

**คลิก "Review" → "Save policy"**

---

#### 3. สร้าง Policy สำหรับ INSERT (Upload Images)

**คลิก "New policy" อีกครั้ง**

**Policy Name:** `Service role can upload images`

**Allowed Operation:** `INSERT`

**Policy Definition (SQL):**
```sql
(bucket_id = 'images')
```

**Target roles:** เลือก `authenticated` และ `service_role`

**คลิก "Review" → "Save policy"**

---

#### 4. สร้าง Policy สำหรับ DELETE (Delete Images)

**คลิก "New policy" อีกครั้ง**

**Policy Name:** `Service role can delete images`

**Allowed Operation:** `DELETE`

**Policy Definition (SQL):**
```sql
(bucket_id = 'images')
```

**Target roles:** เลือก `authenticated` และ `service_role`

**คลิก "Review" → "Save policy"**

---

#### 5. สร้าง Policy สำหรับ UPDATE (Update Images)

**คลิก "New policy" อีกครั้ง**

**Policy Name:** `Service role can update images`

**Allowed Operation:** `UPDATE`

**Policy Definition (SQL):**
```sql
(bucket_id = 'images')
```

**Target roles:** เลือก `authenticated` และ `service_role`

**คลิก "Review" → "Save policy"**

---

## วิธีที่ 3: ใช้ SQL Script (แนะนำที่สุด)

### รัน SQL นี้ใน SQL Editor:

```sql
-- สร้าง bucket ถ้ายังไม่มี
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- ลบ policies เก่าถ้ามี (ถ้าต้องการเริ่มใหม่)
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update images" ON storage.objects;

-- Policy 1: Public Read Access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: Upload (สำหรับ authenticated users และ service role)
CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Policy 3: Delete
CREATE POLICY "Service role can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Policy 4: Update
CREATE POLICY "Service role can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');
```

---

## ตรวจสอบว่า Policies ทำงาน

### หลังจากสร้าง policies แล้ว:

1. **ตรวจสอบใน Dashboard:**
   - ไปที่ Storage → Policies
   - ควรเห็น policies ทั้ง 4 ตัวใต้ bucket IMAGES

2. **ทดสอบ Upload:**
   - ลอง upload image ผ่าน admin panel
   - ควรจะ upload สำเร็จโดยไม่มี error

3. **ตรวจสอบ Logs:**
   - ไปที่ Logs → API Logs
   - ดูว่ามี error หรือไม่

---

## หมายเหตุสำคัญ

### Service Role Key
- Backend ใช้ `SUPABASE_SERVICE_ROLE_KEY` ซึ่งจะ **bypass RLS policies อัตโนมัติ**
- แต่ถ้า policies ไม่ถูกต้อง อาจมีปัญหาได้
- ตรวจสอบว่า backend `.env` มี `SUPABASE_SERVICE_ROLE_KEY` ตั้งค่าไว้

### Public vs Private Bucket
- Bucket `images` ควรตั้งเป็น **PUBLIC** เพื่อให้สามารถเข้าถึงรูปภาพได้โดยตรง
- ถ้าเป็น PRIVATE จะต้องใช้ signed URLs

### Troubleshooting

**ถ้ายังมี error "new row violates row-level security policy":**

1. ตรวจสอบว่า policies ถูกสร้างแล้ว
2. ตรวจสอบว่า bucket `images` มีอยู่จริง
3. ตรวจสอบว่า `SUPABASE_SERVICE_ROLE_KEY` ถูกตั้งค่าใน backend
4. Restart backend server
5. ลอง upload อีกครั้ง

---

## Quick Fix (Copy & Paste)

รัน SQL นี้ใน Supabase SQL Editor:

```sql
-- Quick fix: สร้าง policies ทั้งหมดในครั้งเดียว
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update images" ON storage.objects;

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Service role can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

CREATE POLICY "Service role can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');
```

