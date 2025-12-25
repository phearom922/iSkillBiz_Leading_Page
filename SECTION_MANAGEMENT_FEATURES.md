# Section Management Features

## สรุปฟีเจอร์ที่เพิ่ม

### 1. Toggle Show/Hide Section
- **ปุ่ม Show/Hide**: เปลี่ยนสถานะ `is_active` ของ section
- **ไอคอน**: 
  - 👁️ `Eye` สำหรับ section ที่แสดง (Visible)
  - 👁️‍🗨️ `EyeOff` สำหรับ section ที่ซ่อน (Hidden)
- **การทำงาน**: 
  - คลิกปุ่มเพื่อ toggle สถานะ
  - แสดง loading spinner ขณะกำลังอัปเดต
  - แสดง toast notification เมื่อสำเร็จ

### 2. Delete Section
- **ปุ่ม Delete**: ลบ section และ content ทั้งหมด
- **Confirmation Dialog**: 
  - แสดง confirmation dialog ก่อนลบ
  - แจ้งเตือนว่าการลบเป็นแบบถาวรและไม่สามารถย้อนกลับได้
- **การทำงาน**:
  - คลิกปุ่ม Delete
  - ยืนยันการลบ
  - แสดง loading spinner ขณะกำลังลบ
  - แสดง toast notification เมื่อสำเร็จ

### 3. Status Icons
- **คอลัมน์ Status**: แสดงสถานะ section พร้อมไอคอน
  - 👁️ `Eye` (สีเขียว) + "Visible" badge สำหรับ section ที่แสดง
  - 👁️‍🗨️ `EyeOff` (สีเทา) + "Hidden" badge สำหรับ section ที่ซ่อน

### 4. UI Improvements
- **Icons**: ใช้ Lucide React icons
  - `Eye` / `EyeOff` สำหรับ show/hide
  - `Edit` สำหรับแก้ไข
  - `Trash2` สำหรับลบ
  - `Loader2` สำหรับ loading state
- **Responsive**: 
  - แสดงข้อความบนปุ่มในหน้าจอใหญ่ (sm:inline)
  - แสดงเฉพาะไอคอนในหน้าจอเล็ก
- **Loading States**: 
  - Disable ปุ่มขณะกำลังทำงาน
  - แสดง spinner แทนไอคอนปกติ

## API Endpoints ที่ใช้

### Toggle Active Status
```
PUT /api/sections/:id
Body: { is_active: boolean }
Headers: Authorization: Bearer <token>
```

### Delete Section
```
DELETE /api/sections/:id
Headers: Authorization: Bearer <token>
```

## Sections ที่ใช้ใน Landing Page

จาก `app/page.tsx` sections ที่ใช้จริง:
1. Hero Section
2. Why iskillbiz
3. Differentiation
4. Pain Points
5. Solution Steps
6. Use Cases
7. Social Proof
8. Pricing
9. Feature Comparison
10. Upsell Blocks
11. FAQ
12. Get Started
13. Multi-Platform Support
14. Features
15. Final CTA

**หมายเหตุ**: `ProductPreview` ถูก import แต่ไม่ได้ใช้ใน page.tsx - สามารถลบออกได้

## วิธีใช้งาน

1. **Show/Hide Section**:
   - ไปที่ `/admin/sections`
   - คลิกปุ่ม 👁️‍🗨️ (Hide) หรือ 👁️ (Show) ในคอลัมน์ Actions
   - Section ที่ซ่อนจะไม่แสดงใน landing page

2. **Delete Section**:
   - ไปที่ `/admin/sections`
   - คลิกปุ่ม 🗑️ (Delete) ในคอลัมน์ Actions
   - ยืนยันการลบใน confirmation dialog
   - Section และ content ทั้งหมดจะถูกลบถาวร

3. **Edit Section**:
   - คลิกปุ่ม ✏️ (Edit) เพื่อแก้ไข content

## Security

- ทุก action (toggle, delete) ต้องมี authentication token
- Backend ใช้ `JwtAuthGuard` เพื่อป้องกัน unauthorized access
- Delete operation จะลบ section และ related content ทั้งหมด (cascade delete)

## Notes

- Sections ที่ `is_active = false` จะไม่แสดงใน landing page
- การลบ section จะลบ content, videos, และ images ที่เกี่ยวข้องทั้งหมด
- ควรระวังเมื่อลบ section ที่สำคัญ (เช่น Hero Section)

