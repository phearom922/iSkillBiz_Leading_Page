# YouTube Videos - Admin Control Only

## สรุปการเปลี่ยนแปลง

ทุก section ที่ใช้ YouTube videos ตอนนี้จะดึงข้อมูลจาก Admin Dashboard เท่านั้น ไม่มี hardcode fallback videos อีกต่อไป

## Sections ที่แก้ไข

### 1. **Why iskillbiz** (`components/sections/WhyIskillsbiz.tsx`)
- ✅ ลบ fallback video ออก
- ✅ ดึง video จาก admin dashboard เท่านั้น
- ✅ แสดงข้อความ "No video available" หากไม่มี video

### 2. **Differentiation** (`components/sections/Differentiation.tsx`)
- ✅ ลบ fallback video ออก
- ✅ เปลี่ยน field names จาก `headline`/`subheadline` เป็น `title`/`description`
- ✅ ดึง video จาก admin dashboard เท่านั้น
- ✅ แสดงข้อความ "No video available" หากไม่มี video

### 3. **Pain Points** (`components/sections/PainPoints.tsx`)
- ✅ ลบ fallback videos array ออก
- ✅ เปลี่ยน field names จาก `headline`/`subheadline` เป็น `title`/`description`
- ✅ ดึง videos จาก admin dashboard เท่านั้น
- ✅ แสดงข้อความ "No videos available" หากไม่มี videos

### 4. **Solution Steps** (`components/sections/SolutionSteps.tsx`)
- ✅ ลบ fallback videos array ออก
- ✅ เปลี่ยน field names จาก `headline`/`subheadline` เป็น `title`/`description`
- ✅ ดึง videos จาก admin dashboard เท่านั้น
- ✅ แสดงข้อความ "No videos available" หากไม่มี videos

### 5. **FAQ** (`components/sections/FAQ.tsx`)
- ✅ ลบ fallback video ออก
- ✅ เปลี่ยน field names จาก `headline`/`subheadline` เป็น `title`/`description`
- ✅ ดึง video จาก admin dashboard เท่านั้น
- ✅ แสดงข้อความ "No video available" หากไม่มี video

## วิธีใช้งาน

### เพิ่ม/แก้ไข YouTube Videos

1. **ไปที่ Admin Dashboard**: `/admin/videos`
2. **เลือก Section**: เลือก section ที่ต้องการ (Why iskillbiz, Differentiation, Pain Points, Solution Steps, FAQ)
3. **เพิ่ม Video**: 
   - คลิก "Add Video"
   - ใส่ YouTube URL
   - เลือก Section จาก dropdown
   - คลิก "Save"
4. **แก้ไข Video**: คลิก "Edit" บน video ที่ต้องการแก้ไข
5. **ลบ Video**: คลิก "Delete" บน video ที่ต้องการลบ

### Sections ที่รองรับ Videos

- **Why iskillbiz**: 1 video
- **Differentiation**: 1 video
- **Pain Points**: 3 videos (แสดงใน grid 3 columns)
- **Solution Steps**: 1-3 videos (แสดงตามจำนวน: 1 = center, 2 = 2 columns, 3+ = 3 columns)
- **FAQ**: 1 video

## หมายเหตุ

- **ไม่มี Fallback Videos**: หากไม่มี videos ใน database จะแสดงข้อความ "No video available" แทน
- **ต้องเพิ่ม Videos ใน Admin Dashboard**: ทุก video ต้องเพิ่มผ่าน admin dashboard ก่อนจะแสดงบนหน้าเว็บ
- **Field Names**: เปลี่ยนจาก `headline`/`subheadline` เป็น `title`/`description` ให้สอดคล้องกับ sections อื่นๆ

## Database Structure

Videos เก็บใน table `youtube_videos`:
- `id`: UUID
- `section_id`: Foreign key ไปยัง `sections` table
- `video_url`: YouTube URL (full URL)
- `video_id`: YouTube video ID (extracted automatically)
- `order`: ลำดับการแสดง
- `is_active`: สถานะ active/inactive

## API Endpoints

- `GET /api/videos` - ดึง videos ทั้งหมด
- `GET /api/videos?section_id={id}` - ดึง videos ของ section
- `POST /api/videos` - เพิ่ม video ใหม่
- `PUT /api/videos/:id` - แก้ไข video
- `DELETE /api/videos/:id` - ลบ video

