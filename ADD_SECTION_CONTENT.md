# เพิ่ม Content Fields ให้ Sections ที่ยังไม่มี

## ปัญหา

เมื่อกด Edit section แล้วหน้าเว็บว่างเปล่า เพราะ section นั้นยังไม่มี `section_content` ใน database

## วิธีแก้ไข

### วิธีที่ 1: ใช้ Migration (แนะนำ)

1. ไปที่ Supabase Dashboard → SQL Editor
2. เปิดไฟล์ `supabase/migrations/004_add_missing_content.sql`
3. Copy SQL ทั้งหมด
4. Paste ใน SQL Editor
5. กด Run

### วิธีที่ 2: ใช้ Table Editor

1. ไปที่ Supabase Dashboard → Table Editor → `section_content`
2. กด "Insert" → "Insert row"
3. ใส่ข้อมูล:
   - `section_id`: คัดลอกจาก console logs (Section ID)
   - `field_name`: เช่น "title", "description"
   - `content`: เนื้อหาที่ต้องการ
   - `language`: "km" หรือ "en"
4. Repeat สำหรับแต่ละ field ที่ต้องการ

### วิธีที่ 3: ใช้ SQL โดยตรง

```sql
-- เพิ่ม content fields สำหรับ "Why iskillbiz"
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ('1cb87030-b1a5-4792-84cd-32e87b48ebc3', 'title', 'Why Choose iskillbiz?', 'en'),
    ('1cb87030-b1a5-4792-84cd-32e87b48ebc3', 'title', 'ហេតុអ្វីបានជាត្រូវជ្រើសរើស iskillbiz?', 'km'),
    ('1cb87030-b1a5-4792-84cd-32e87b48ebc3', 'description', 'We are not just another chatbot tool...', 'en'),
    ('1cb87030-b1a5-4792-84cd-32e87b48ebc3', 'description', 'យើងមិនមែនគ្រាន់តែជាឧបករណ៍ Chatbot...', 'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;
```

**หมายเหตุ:** แทนที่ `'1cb87030-b1a5-4792-84cd-32e87b48ebc3'` ด้วย Section ID จริงจาก console logs

## Sections ที่ Migration จะเพิ่ม Content

Migration `004_add_missing_content.sql` จะเพิ่ม content fields ให้:

1. ✅ **Why iskillbiz** - title, description (en, km)
2. ✅ **Multi-Platform Support** - title, description (en, km)
3. ✅ **Features** - title, description (en, km)
4. ✅ **Use Cases** - title, description (en, km)
5. ✅ **Social Proof** - title, description (en, km)
6. ✅ **Feature Comparison** - title, description (en, km)
7. ✅ **Upsell Blocks** - title, description (en, km)
8. ✅ **Get Started** - title, description (en, km)
9. ✅ **Final CTA** - title, description, cta_primary, cta_primary_link, cta_secondary, cta_secondary_link (en, km)

## Sections ที่ไม่ต้องมี Content

Sections เหล่านี้เป็น type `youtube` หรือ `pricing` ไม่ต้องมี content fields:
- **Differentiation** (youtube) - ใช้ YouTube videos แทน
- **Pain Points** (youtube) - ใช้ YouTube videos แทน
- **Solution Steps** (youtube) - ใช้ YouTube videos แทน
- **FAQ** (youtube) - ใช้ YouTube videos แทน
- **Pricing** (pricing) - ใช้ pricing_plans table แทน

## หลังจากเพิ่ม Content

1. Refresh หน้า admin dashboard
2. กด Edit section อีกครั้ง
3. ควรเห็น form fields แล้ว

## ตรวจสอบ

1. ไปที่ Supabase Dashboard → Table Editor → `section_content`
2. Filter โดย `section_id` = Section ID ที่ต้องการ
3. ตรวจสอบว่ามี records หรือไม่

