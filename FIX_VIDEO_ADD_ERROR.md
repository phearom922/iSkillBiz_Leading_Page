# Fix: Error 500 เมื่อเพิ่ม YouTube Video

## ปัญหา

เมื่อพยายามเพิ่ม YouTube video ใน admin dashboard เกิด error:
- `POST http://localhost:3001/api/videos 500 (Internal Server Error)`
- Error message: "Failed to add video"

## สาเหตุ

1. **ขาด validation**: Backend ไม่ได้ validate required fields (`section_id`, `video_url`)
2. **Error handling ไม่ดี**: Frontend ไม่ได้แสดง error message จาก backend
3. **UX ไม่ดี**: ต้องพิมพ์ Section UUID แทนที่จะเลือกจาก dropdown

## การแก้ไขที่ทำไปแล้ว

### 1. Backend (`backend/src/videos/videos.service.ts`)

✅ เพิ่ม validation:
- ตรวจสอบว่า `video_url` มีหรือไม่
- ตรวจสอบว่า `section_id` มีหรือไม่
- ตรวจสอบว่า extract video ID สำเร็จหรือไม่
- Set default values (`is_active: true`, `order: 0`)

✅ เพิ่ม error logging:
- Log ข้อมูลที่ได้รับ
- Log error details

### 2. Backend Controller (`backend/src/videos/videos.controller.ts`)

✅ เพิ่ม error handling:
- Try-catch block
- Console logging

### 3. Frontend (`components/admin/VideoManager.tsx`)

✅ ปรับปรุง error handling:
- แสดง error message จาก backend
- Client-side validation

✅ ปรับปรุง UI:
- เปลี่ยน Section ID input เป็น dropdown
- แสดง section name และ type ใน dropdown
- Fallback เป็น text input ถ้าไม่มี sections

### 4. Videos Page (`app/(admin)/admin/videos/page.tsx`)

✅ เพิ่มการ fetch sections:
- Fetch sections list จาก backend
- ส่ง sections ไปให้ VideoManager

## วิธีใช้งาน

1. ไปที่หน้า "Videos" ใน admin dashboard
2. กด "+ Add Video"
3. เลือก Section จาก dropdown (แทนการพิมพ์ UUID)
4. ใส่ YouTube URL
5. ใส่ Title (optional)
6. กด "Add Video"

## ตรวจสอบ Error

ถ้ายังเกิด error:

1. **ตรวจสอบ Backend Logs**:
   - ดู terminal ที่รัน `npm run start:dev` ใน backend directory
   - ดู error message ที่แสดง

2. **ตรวจสอบ Browser Console**:
   - เปิด DevTools (F12) → Console tab
   - ดู error message

3. **ตรวจสอบ Network Tab**:
   - เปิด DevTools (F12) → Network tab
   - หา request `/api/videos`
   - ดู Response ว่ามี error message อะไร

## Common Errors

### Error: "video_url is required"
- **สาเหตุ**: ไม่ได้ใส่ YouTube URL
- **แก้ไข**: ใส่ YouTube URL ใน form

### Error: "section_id is required"
- **สาเหตุ**: ไม่ได้เลือก section
- **แก้ไข**: เลือก section จาก dropdown

### Error: "Invalid YouTube URL"
- **สาเหตุ**: YouTube URL ไม่ถูกต้อง
- **แก้ไข**: ตรวจสอบ URL format:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`

### Error: "Failed to create video: ..."
- **สาเหตุ**: Database error (เช่น foreign key constraint)
- **แก้ไข**: 
  - ตรวจสอบว่า section_id ถูกต้อง
  - ตรวจสอบ Supabase database

## Testing

1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `npm run dev`
3. Login to admin dashboard
4. ไปที่หน้า Videos
5. ลองเพิ่ม video:
   - เลือก section จาก dropdown
   - ใส่ YouTube URL: `https://www.youtube.com/watch?v=3m6OTzoYQDE`
   - ใส่ title (optional)
   - กด Add Video

## หมายเหตุ

- Section dropdown จะแสดงเฉพาะ sections ที่ fetch จาก backend
- ถ้าไม่มี sections จะแสดง text input แทน
- Video ID จะถูก extract อัตโนมัติจาก YouTube URL

