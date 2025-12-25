# Dynamic Sections System - คู่มือการใช้งาน

## สรุปการเปลี่ยนแปลง

ระบบได้ถูกปรับโครงสร้างใหม่เพื่อให้ง่ายต่อการจัดการ โดยแต่ละ section สามารถมี:
1. **Title + Description** (ข้อความ)
2. **YouTube Videos** (หลายคลิปได้, แสดงเป็น grid)
3. **Images** (หลายรูปได้)

## โครงสร้างใหม่

### 1. DynamicSection Component
- Component ใหม่ที่แสดง Title/Description, YouTube videos (grid), และ Images
- ไฟล์: `components/sections/DynamicSection.tsx`
- รองรับการแสดงผลแบบยืดหยุ่น:
  - ถ้ามี 1 คลิป: แสดงเต็มขนาด
  - ถ้ามี 2 คลิป: แสดง 2 columns
  - ถ้ามี 3 คลิปขึ้นไป: แสดง 3 columns

### 2. Enhanced Section Editor
- Editor ใหม่ที่รวมการจัดการ Title/Description, Videos, และ Images ในที่เดียว
- ไฟล์: `components/admin/EnhancedSectionEditor.tsx`
- มี 3 tabs:
  - **Title & Description**: แก้ไขข้อความ
  - **YouTube Videos**: เพิ่ม/ลบ videos
  - **Images**: อัปโหลด/ลบ images

### 3. Add Section Feature
- สามารถเพิ่ม section ใหม่ได้จาก admin dashboard
- กำหนดชื่อ, type, และ order ได้
- ไฟล์: `app/(admin)/admin/sections/page.tsx`

## วิธีใช้งาน

### เพิ่ม Section ใหม่

1. ไปที่ `/admin/sections`
2. คลิก "Add Section"
3. ใส่ข้อมูล:
   - **Section Name**: ชื่อ section (เช่น "About Us", "Features")
   - **Type**: เลือก type (text, hero, youtube, image)
   - **Order**: ลำดับการแสดง (ตัวเลขน้อยแสดงก่อน)
4. คลิก "Create Section"

### แก้ไข Section

1. ไปที่ `/admin/sections`
2. คลิก "Edit" บน section ที่ต้องการ
3. แก้ไขข้อมูลใน 3 tabs:

#### Tab 1: Title & Description
- ใส่ Title (หัวข้อ)
- ใส่ Description (คำอธิบาย)
- คลิก "Save Changes"

#### Tab 2: YouTube Videos
- คลิก "Add Video"
- ใส่ YouTube URL
- คลิก "Add Video"
- ลบ video: คลิก X บน video ที่ต้องการลบ

#### Tab 3: Images
- เลือกไฟล์ภาพ
- ใส่ Alt Text (optional)
- คลิก "Upload"
- ลบ image: คลิก X บน image ที่ต้องการลบ

### จัดการลำดับ Section

- ใช้ field **Order** เมื่อสร้าง section
- ตัวเลขน้อยแสดงก่อน
- สามารถแก้ไข order ได้โดยแก้ไข section

## Layout

### ส่วนที่ 1: Title + Description
- แสดงตรงกลาง
- Title: ขนาดใหญ่, ตัวหนา
- Description: ขนาดกลาง, สีเทา

### ส่วนที่ 2: YouTube Videos
- แสดงเป็น grid:
  - 1 คลิป: แสดงเต็มขนาด (center, 2/3 width)
  - 2 คลิป: แสดง 2 columns
  - 3 คลิปขึ้นไป: แสดง 3 columns

### ส่วนที่ 3: Images
- แสดงเป็น grid 3 columns
- รูปภาพแสดงแบบ aspect-video

## Database Structure

### Sections Table
```sql
- id: UUID
- name: TEXT (ชื่อ section)
- type: TEXT (text, hero, youtube, image)
- order: INTEGER (ลำดับการแสดง)
- is_active: BOOLEAN (แสดง/ซ่อน)
```

### Section Content Table
```sql
- id: UUID
- section_id: UUID (FK to sections)
- field_name: TEXT (title, description)
- content: TEXT (เนื้อหา)
- language: TEXT (km, en)
```

### YouTube Videos Table
```sql
- id: UUID
- section_id: UUID (FK to sections)
- video_url: TEXT (YouTube URL)
- video_id: TEXT (extracted video ID)
- order: INTEGER (ลำดับ)
- is_active: BOOLEAN
```

### Images Table
```sql
- id: UUID
- section_id: UUID (FK to sections)
- image_url: TEXT (URL ของภาพ)
- alt_text: TEXT (alt text)
- type: TEXT (logo, dashboard, hero, other)
```

## API Endpoints

### Sections
- `GET /api/sections` - ดึง sections ทั้งหมด
- `POST /api/sections` - สร้าง section ใหม่
- `GET /api/sections/:id` - ดึง section ตาม ID
- `PUT /api/sections/:id` - แก้ไข section
- `DELETE /api/sections/:id` - ลบ section
- `PUT /api/sections/:id/content` - แก้ไข content

### Videos
- `GET /api/videos?section_id={id}` - ดึง videos ของ section
- `POST /api/videos` - เพิ่ม video
- `DELETE /api/videos/:id` - ลบ video

### Images
- `GET /api/images?section_id={id}` - ดึง images ของ section
- `POST /api/images/upload` - อัปโหลด image
- `DELETE /api/images/:id` - ลบ image

## ตัวอย่างการใช้งาน

### สร้าง Section พร้อม Content

1. **สร้าง Section**:
   - Name: "About Us"
   - Type: "text"
   - Order: 1

2. **เพิ่ม Title & Description**:
   - Title: "เกี่ยวกับเรา"
   - Description: "เราเป็นบริษัทที่ให้บริการ..."

3. **เพิ่ม YouTube Video** (optional):
   - URL: "https://www.youtube.com/watch?v=..."

4. **เพิ่ม Images** (optional):
   - อัปโหลดรูปภาพ

### Section ที่มีแค่ Images

1. สร้าง section
2. ข้าม Title & Description
3. ไปที่ tab Images
4. อัปโหลดรูปภาพ

### Section ที่มีแค่ Videos

1. สร้าง section
2. ข้าม Title & Description
3. ไปที่ tab Videos
4. เพิ่ม YouTube videos

## หมายเหตุ

- **Hero Section** และ **Pricing** ยังคงใช้ components เดิม (ไม่ใช้ DynamicSection)
- Sections อื่นๆ จะแสดงตาม order ที่กำหนด
- ถ้า section ไม่มี content ใดๆ จะไม่แสดงบนหน้าเว็บ
- Layout spacing ยังคงเหมือนเดิม

## Migration

หากต้องการ migrate sections เดิม:

1. สร้าง section ใหม่ใน admin dashboard
2. คัดลอก content จาก section เดิม
3. เพิ่ม videos และ images (ถ้ามี)
4. ตั้งค่า order ให้ถูกต้อง
5. ทดสอบการแสดงผล

