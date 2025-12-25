# Fix: Section Content Update Error 500

## Problem
เมื่อทำการแก้ไขข้อมูลในหน้า Sections แล้วเกิด Error 500 Internal Server Error

## Root Cause
1. **Backend `upsert()` ไม่ทำงาน**: `sections.service.ts` ใช้ `upsert()` แต่ไม่ได้ระบุ conflict resolution ที่ถูกต้อง
2. **Error Handling ไม่ดี**: ไม่มี error logging และ error messages ที่ชัดเจน

## Solution

### 1. แก้ไข `backend/src/sections/sections.service.ts`
- เปลี่ยนจาก `upsert()` เป็น **find -> update or insert** pattern
- ใช้ `maybeSingle()` แทน `single()` เพื่อ handle "not found" case
- เพิ่ม error logging และ error messages ที่ชัดเจน

### 2. แก้ไข `components/admin/SectionEditor.tsx`
- เพิ่ม error handling ที่ดีกว่า
- ตรวจสอบ response status ก่อน process
- แสดง error messages ที่ชัดเจนใน toast

### 3. แก้ไข `backend/src/sections/sections.controller.ts`
- เพิ่ม input validation
- เพิ่ม error logging

## Testing

หลังจากแก้ไขแล้ว:

1. **Restart Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **ทดสอบการแก้ไข:**
   - ไปที่ `/admin/sections`
   - คลิก "Edit" บน section ใดๆ
   - แก้ไขข้อมูล
   - คลิก "Save Changes"
   - ควรจะบันทึกสำเร็จโดยไม่มี error

## Technical Details

### Database Schema
- `section_content` table มี UNIQUE constraint บน `(section_id, field_name, language)`
- ต้องใช้ pattern: หา record ก่อน → ถ้ามีก็ update → ถ้าไม่มีก็ insert

### API Endpoint
- `PUT /api/sections/:id/content`
- Body: `{ fieldName: string, content: string, language?: string }`
- Requires: JWT authentication

## Notes
- Error messages จะแสดงใน browser console และ backend terminal
- ถ้ายังมีปัญหา ให้ตรวจสอบ backend terminal logs

