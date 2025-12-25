# Admin Dashboard Restructure - สรุปการปรับโครงสร้าง

## สรุปการเปลี่ยนแปลง

ระบบได้ถูกปรับโครงสร้างใหม่เพื่อให้ง่ายต่อการจัดการข้อมูลและลำดับ sections โดย:

1. **ใช้ order จาก database สำหรับทุก sections** (รวม special sections)
2. **ปรับปรุง admin dashboard** ให้แสดงลำดับและ preview
3. **เพิ่ม drag-and-drop** สำหรับเรียงลำดับ
4. **รวมการจัดการข้อมูล** ให้อยู่ในที่เดียว

## การเปลี่ยนแปลงที่สำคัญ

### 1. Frontend - การแสดงผล Sections

#### สร้าง SectionRenderer Component
- **ไฟล์:** `components/SectionRenderer.tsx`
- **หน้าที่:** รับ section object และ render component ที่เหมาะสม
- **รองรับ:**
  - Special sections: Hero, Pricing, GetStarted, FinalCTA, UseCases, SocialProof
  - Dynamic sections: DynamicSection (สำหรับ sections อื่นๆ)

#### ปรับ app/page.tsx
- **เปลี่ยนจาก:** Hardcode sections (Hero, GetStarted, Pricing, FinalCTA)
- **เปลี่ยนเป็น:** ดึง sections จาก database และแสดงตาม order
- **ใช้:** `SectionRenderer` เพื่อ render sections ทั้งหมดตาม order

#### ปรับ components/DynamicSections.tsx
- **เปลี่ยนจาก:** Filter special sections ออก
- **เปลี่ยนเป็น:** แสดงทุก sections ตาม order (รวม special sections)
- **ใช้:** `SectionRenderer` เพื่อ render sections

### 2. Admin Dashboard - Sections Management

#### เพิ่ม Drag-and-Drop
- **ใช้:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **ไฟล์:** `components/admin/DraggableSectionRow.tsx`
- **ฟีเจอร์:**
  - ลากแถวเพื่อเรียงลำดับ
  - อัปเดต order อัตโนมัติเมื่อ drag-and-drop
  - แสดง drag handle (GripVertical icon)

#### เพิ่ม Preview Section
- **แสดง:** ลำดับการแสดงผลแบบ visual
- **แสดง:** ชื่อ sections ตาม order
- **แสดง:** Status (active/inactive)
- **แสดง:** จำนวน videos และ images ของแต่ละ section
- **Toggle:** สามารถซ่อน/แสดง preview ได้

#### ปรับปรุง EnhancedSectionEditor
- **เพิ่ม:** Section Information Preview
  - แสดง Section Name, Type, Order, Status
  - แสดงจำนวน Videos และ Images
- **ปรับปรุง:** UI ให้ชัดเจนขึ้น

#### รวมการจัดการข้อมูล
- **แสดง:** จำนวน videos และ images ในตาราง sections
- **แสดง:** จำนวน videos และ images ใน preview
- **จัดการ:** Videos และ Images ใน EnhancedSectionEditor (มีอยู่แล้ว)

## ไฟล์ที่สร้างใหม่

1. **`components/SectionRenderer.tsx`**
   - Component สำหรับ render sections ตาม type
   - รองรับ special sections และ dynamic sections

2. **`components/admin/DraggableSectionRow.tsx`**
   - Component สำหรับ drag-and-drop
   - แสดงข้อมูล section พร้อม actions

## ไฟล์ที่แก้ไข

1. **`app/page.tsx`**
   - เปลี่ยนเป็น client component
   - ใช้ order จาก database แทน hardcode
   - ใช้ `SectionRenderer` เพื่อ render sections

2. **`components/DynamicSections.tsx`**
   - แสดงทุก sections ตาม order (ไม่ filter special sections)
   - ใช้ `SectionRenderer` เพื่อ render sections

3. **`app/(admin)/admin/sections/page.tsx`**
   - เพิ่ม drag-and-drop ด้วย `@dnd-kit`
   - เพิ่ม preview section
   - ดึง videos และ images count
   - ใช้ `DraggableSectionRow` component

4. **`components/admin/EnhancedSectionEditor.tsx`**
   - เพิ่ม Section Information Preview
   - แสดงข้อมูล section (name, type, order, status, videos, images)

## Dependencies ที่เพิ่ม

- `@dnd-kit/core` - สำหรับ drag-and-drop
- `@dnd-kit/sortable` - สำหรับ sortable lists
- `@dnd-kit/utilities` - สำหรับ utilities

## ผลลัพธ์

### Frontend
- ✅ ทุก sections แสดงตาม order จาก database
- ✅ ไม่มี hardcoded sections
- ✅ Special sections ใช้ข้อมูลจาก database

### Admin Dashboard
- ✅ มี drag-and-drop สำหรับเรียงลำดับ
- ✅ มี preview ของลำดับการแสดงผล
- ✅ การจัดการข้อมูลอยู่ในที่เดียว
- ✅ UI ชัดเจนและเข้าใจง่าย

### การจัดการ
- ✅ จัดการ sections, content, videos, images ได้ในที่เดียว
- ✅ เรียงลำดับได้ง่ายด้วย drag-and-drop
- ✅ เห็น preview ของลำดับการแสดงผลทันที
- ✅ เห็นจำนวน videos และ images ของแต่ละ section

## วิธีใช้งาน

### เรียงลำดับ Sections
1. ไปที่ `/admin/sections`
2. ลากแถว section ที่ต้องการย้าย
3. ปล่อยที่ตำแหน่งใหม่
4. Order จะถูกอัปเดตอัตโนมัติ

### ดู Preview
1. ไปที่ `/admin/sections`
2. คลิก "Show Preview" เพื่อดูลำดับการแสดงผล
3. Preview จะแสดง sections ที่ active เท่านั้น

### จัดการ Content
1. คลิก "Edit" บน section ที่ต้องการ
2. แก้ไขใน 3 tabs:
   - **Title & Description**: ใส่ข้อความ
   - **YouTube Videos**: เพิ่ม/ลบ videos
   - **Images**: อัปโหลด/ลบ images
3. ดู Section Information Preview เพื่อดูข้อมูล section

## หมายเหตุ

- **Order Management:** Order ถูกจัดการจาก database ทั้งหมด
- **Special Sections:** Hero, Pricing, GetStarted, FinalCTA, UseCases, SocialProof ใช้ components ของตัวเอง แต่แสดงตาม order จาก database
- **Drag-and-Drop:** ใช้ `@dnd-kit` ซึ่งเป็น library ที่ทันสมัยและมีประสิทธิภาพ
- **Preview:** แสดงเฉพาะ sections ที่ active เท่านั้น

