# แก้ไขให้แสดงเฉพาะภาษา Khmer (km)

## สรุปการเปลี่ยนแปลง

### 1. แก้ไข Migration Files

#### `supabase/migrations/003_seed_data.sql`
- เปลี่ยน Hero Section content จาก `en` เป็น `km` ทั้งหมด
- ตอนนี้ Hero Section มีเฉพาะภาษา Khmer

#### `supabase/migrations/004_add_missing_content.sql`
- ลบ content ภาษา `en` ออกทั้งหมด
- เหลือเฉพาะภาษา `km` สำหรับทุก section

### 2. แก้ไข SectionEditor Component

#### `components/admin/SectionEditor.tsx`
- เพิ่มการกรองให้แสดงเฉพาะ content ที่มี `language === 'km'`
- ตอนนี้ editor จะแสดงเฉพาะช่อง Khmer เท่านั้น

```typescript
// Filter to show only Khmer (km) language
const contentFields = (section.section_content || []).filter((item: any) => item.language === 'km');
```

## Sections ที่มี Content Fields

### Text Sections (มี content fields):
1. **Hero Section** - headline, subheadline, cta_primary, cta_primary_link, cta_secondary, cta_secondary_link
2. **Why iskillbiz** - title, description
3. **Multi-Platform Support** - title, description
4. **Features** - title, description
5. **Use Cases** - title, description
6. **Social Proof** - title, description
7. **Feature Comparison** - title, description
8. **Upsell Blocks** - title, description
9. **Get Started** - title, description
10. **Final CTA** - title, description, cta_primary, cta_primary_link, cta_secondary, cta_secondary_link

### YouTube Sections (ไม่มี content fields - ใช้ videos แทน):
1. **Differentiation** - ใช้ YouTube videos
2. **Pain Points** - ใช้ YouTube videos
3. **Solution Steps** - ใช้ YouTube videos
4. **FAQ** - ใช้ YouTube videos

### Pricing Section:
- จัดการผ่านหน้า Pricing Management แยกต่างหาก

## วิธีใช้งาน

1. **รัน Migration:**
   ```sql
   -- ใน Supabase SQL Editor
   -- รัน migration 004_add_missing_content.sql
   ```

2. **ตรวจสอบใน Admin Dashboard:**
   - ไปที่ `/admin/sections`
   - คลิก Edit บน section ที่ต้องการ
   - ตอนนี้จะเห็นเฉพาะช่อง (km) เท่านั้น

3. **สำหรับ YouTube Sections:**
   - ไปที่ `/admin/videos` เพื่อจัดการ YouTube videos
   - เลือก section ที่ต้องการ (Differentiation, Pain Points, Solution Steps, FAQ)

## หมายเหตุ

- Sections ที่เป็น type `youtube` จะไม่แสดง content fields ใน Section Editor
- ใช้ Video Manager (`/admin/videos`) เพื่อจัดการ YouTube videos สำหรับ sections เหล่านี้
- ทุก content field ตอนนี้เป็นภาษา Khmer (km) เท่านั้น

