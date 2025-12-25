# Fix: หน้า Edit Section ว่างเปล่า ไม่มี Form Fields

## ปัญหา

เมื่อกด Edit section แล้วหน้าเว็บว่างเปล่า ไม่มี form fields หรือ content editor แสดง

## สาเหตุที่เป็นไปได้

1. **Section ไม่มี `section_content` ใน database**: Section บางตัว (เช่น "Differentiation") อาจยังไม่มี content fields ใน `section_content` table
2. **Backend ไม่ได้ return `section_content`**: API อาจไม่ได้ fetch `section_content` มา
3. **Data structure ไม่ตรง**: Frontend คาดหวัง `section_content` แต่ backend return เป็น `content` หรือชื่ออื่น

## วิธีแก้ไข

### 1. ตรวจสอบ Console Logs

เปิด Browser Developer Tools (F12) → Console tab และดู logs:

- `✅ Section details fetched: {...}` - ดูว่ามี `section_content` หรือไม่
- `📝 Section content: [...]` - ดูว่ามี content fields หรือไม่
- `📝 SectionEditor - Section data: {...}` - ดูข้อมูล section ที่ส่งมา

### 2. ตรวจสอบ Database

ตรวจสอบว่า section มี content ใน `section_content` table:

1. ไปที่ Supabase Dashboard → Table Editor
2. เปิด table `section_content`
3. Filter โดย `section_id` = ID ของ section ที่ต้องการแก้ไข
4. ตรวจสอบว่ามี records หรือไม่

### 3. เพิ่ม Content Fields ให้ Section

ถ้า section ไม่มี content fields:

**วิธีที่ 1: ใช้ Supabase Dashboard**
1. ไปที่ Table Editor → `section_content`
2. กด "Insert" → "Insert row"
3. ใส่ข้อมูล:
   - `section_id`: UUID ของ section
   - `field_name`: เช่น "title", "description", "video_url"
   - `content`: เนื้อหาที่ต้องการ
   - `language`: "km" หรือ "en"

**วิธีที่ 2: ใช้ SQL**
```sql
-- หา section_id ของ "Differentiation"
SELECT id FROM sections WHERE name = 'Differentiation';

-- เพิ่ม content fields
INSERT INTO section_content (section_id, field_name, content, language) VALUES
  ('<section_id>', 'title', 'Differentiation Title', 'en'),
  ('<section_id>', 'description', 'Differentiation Description', 'en');
```

### 4. ตรวจสอบ Backend Response

ตรวจสอบว่า backend return data ถูกต้อง:

1. เปิด Browser DevTools (F12) → Network tab
2. Refresh หน้าเว็บ
3. หา request ไปที่ `/api/sections/{id}`
4. ดู Response ว่ามี `section_content` หรือไม่

## การแก้ไขที่ทำไปแล้ว

1. ✅ เพิ่ม debug logging ใน `SectionEditor` และ `SectionsPage`
2. ✅ เพิ่ม empty state message เมื่อไม่มี content fields
3. ✅ เพิ่ม console logs เพื่อ debug

## ตัวอย่าง Section ที่มี Content

Section "Hero Section" ควรมี content fields:
- `headline` (km)
- `subheadline` (km)
- `cta_primary` (en)
- `cta_primary_link` (en)
- `cta_secondary` (en)
- `cta_secondary_link` (en)

## ตัวอย่าง Section ที่ไม่มี Content

Section "Differentiation" (type: `youtube`) อาจไม่มี content fields เพราะมันใช้ YouTube videos แทน

## วิธีแก้ไขสำหรับ YouTube Sections

สำหรับ sections ที่เป็น type `youtube`:
1. ไปที่หน้า "Videos" ใน admin dashboard
2. เพิ่ม YouTube videos สำหรับ section นั้น
3. หรือแก้ไข section ให้เป็น type `text` และเพิ่ม content fields

## ถ้ายังไม่ทำงาน

1. ตรวจสอบ Console logs ใน Browser
2. ตรวจสอบ Network tab ว่า API return ข้อมูลหรือไม่
3. ตรวจสอบ Supabase database ว่ามี content หรือไม่
4. ตรวจสอบว่า backend ทำงานอยู่ที่ port 3001

