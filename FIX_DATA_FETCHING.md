# Fix Data Fetching - แก้ไขการดึงข้อมูลจาก Database

## ปัญหาที่พบ

1. **ข้อมูลไม่แสดงผล**: ข้อมูลที่เปลี่ยนแปลงใน admin dashboard ไม่แสดงบนหน้าเว็บ
2. **Videos และ Images ไม่แสดง**: Videos และ Images ที่เพิ่มใน admin dashboard ไม่ถูกดึงมาแสดง
3. **Content fields ไม่แสดง**: Title และ Description ที่แก้ไขไม่แสดงผล

## การแก้ไข

### 1. เพิ่ม Logging ใน API Route (`app/api/content/route.ts`)

- เพิ่ม console.log เพื่อแสดงจำนวน sections, videos, images
- Log แต่ละ section พร้อมจำนวน content, videos, images

```typescript
console.log(`📦 Section "${section.name}":`, {
  contentCount: sectionContent.length,
  videosCount: sectionVideos.length,
  imagesCount: sectionImages.length,
});
```

### 2. เพิ่ม Logging ใน useContent Hook (`lib/hooks/useContent.ts`)

- Log จำนวน sections, videos, images, pricing ที่ดึงมา
- Log แต่ละ section พร้อมรายละเอียด content

```typescript
console.log(`✅ Content fetched:`, {
  sections: data.sections.length,
  videos: data.videos?.length || 0,
  images: data.images?.length || 0,
  pricing: data.pricing?.length || 0,
});
```

### 3. เพิ่ม Logging ใน ContentProvider (`components/ContentProvider.tsx`)

- Log เมื่อดึง videos และ images
- Log เมื่อ section ไม่พบ

```typescript
const filteredVideos = content.videos.filter((v: any) => v.section_id === section.id);
console.log(`📹 Videos for "${sectionName}": ${filteredVideos.length} videos found`);
```

### 4. เพิ่ม Logging ใน DynamicSection (`components/sections/DynamicSection.tsx`)

- Log สถานะของ section (found, active, content)
- Log จำนวน videos และ images

```typescript
console.log(`📋 DynamicSection "${sectionName}":`, {
  hasTitle,
  hasDescription,
  hasVideos,
  hasImages,
  videosCount: videos.length,
  imagesCount: images.length,
});
```

## วิธีตรวจสอบ

### 1. เปิด Browser Console (F12)

จะเห็น logs:
- `🔄 Fetching content from /api/content...`
- `✅ Content fetched: { sections: X, videos: Y, images: Z }`
- `📋 "Section Name": { contentFields: X, videos: Y, images: Z }`
- `📹 Videos for "Section Name": X videos found`
- `🖼️ Images for "Section Name": X images found`
- `📋 DynamicSection "Section Name": { hasTitle, hasDescription, hasVideos, hasImages }`

### 2. ตรวจสอบ Network Tab

- ไปที่ Network tab
- ดู request `/api/content`
- ตรวจสอบ response ว่ามี sections, videos, images หรือไม่

### 3. ตรวจสอบ Database

- ไปที่ Supabase Dashboard
- ตรวจสอบว่า sections มี `is_active = true`
- ตรวจสอบว่า videos และ images มี `section_id` ที่ถูกต้อง
- ตรวจสอบว่า section_content มี `field_name` และ `language` ที่ถูกต้อง

## การทำงานของระบบ

### 1. API Route (`/api/content`)

1. ดึง sections ที่ `is_active = true` เรียงตาม `order`
2. ดึง section_content ทั้งหมด
3. ดึง videos ที่ `is_active = true`
4. ดึง images ทั้งหมด
5. จัดกลุ่ม content, videos, images ตาม `section_id`

### 2. ContentProvider

1. ใช้ `getSection(sectionName)` เพื่อหา section
2. ใช้ `getSectionContent(sectionName, fieldName, language)` เพื่อดึง content
3. ใช้ `getVideos(sectionName)` เพื่อดึง videos ของ section
4. ใช้ `getImages(sectionName)` เพื่อดึง images ของ section

### 3. DynamicSection

1. ตรวจสอบว่า section มีอยู่และ active
2. ดึง title, description, videos, images
3. แสดงผลตามลำดับ:
   - Title + Description (ถ้ามี)
   - YouTube Videos (grid ตามจำนวน)
   - Images (grid 3 columns)

## Troubleshooting

### ปัญหา: ข้อมูลไม่แสดง

**ตรวจสอบ:**
1. เปิด Console ดู logs
2. ตรวจสอบว่า section มี `is_active = true`
3. ตรวจสอบว่า section มี content (title, description, videos, หรือ images)
4. ตรวจสอบว่า Supabase configuration ถูกต้อง (`.env.local`)

### ปัญหา: Videos ไม่แสดง

**ตรวจสอบ:**
1. ดู logs: `📹 Videos for "Section Name": X videos found`
2. ตรวจสอบว่า videos มี `section_id` ที่ถูกต้อง
3. ตรวจสอบว่า videos มี `is_active = true`
4. ตรวจสอบว่า section name ตรงกับ database

### ปัญหา: Images ไม่แสดง

**ตรวจสอบ:**
1. ดู logs: `🖼️ Images for "Section Name": X images found`
2. ตรวจสอบว่า images มี `section_id` ที่ถูกต้อง
3. ตรวจสอบว่า `image_url` ถูกต้อง
4. ตรวจสอบว่า section name ตรงกับ database

### ปัญหา: Title/Description ไม่แสดง

**ตรวจสอบ:**
1. ดู logs: `⚠️ Content item not found: SectionName.fieldName (km)`
2. ตรวจสอบว่า section_content มี `field_name` = "title" หรือ "description"
3. ตรวจสอบว่า section_content มี `language` = "km"
4. ตรวจสอบว่า section_content มี `section_id` ที่ถูกต้อง

## หมายเหตุ

- **Realtime Updates**: ระบบจะอัปเดตอัตโนมัติเมื่อมีการเปลี่ยนแปลงใน database (ทุก 30 วินาที)
- **Caching**: ใช้ `cache: "no-store"` เพื่อป้องกัน browser caching
- **Order**: Sections จะแสดงตาม `order` (น้อยไปมาก)

