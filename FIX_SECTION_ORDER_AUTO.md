# Fix Section Order Auto - จัดเรียง Order อัตโนมัติ

## ปัญหาที่พบ

- Order ของ sections ไม่ต่อเนื่องกัน (เช่น 1, 2, 6, 7, 8, 9, 11, 12, 14, 15)
- เมื่อสร้าง section ใหม่ต้องใส่ order เอง
- ไม่มีวิธีจัดเรียง order ใหม่ทั้งหมดให้ต่อเนื่องกัน

## การแก้ไข

### 1. เพิ่มปุ่ม "Reorder All"

- ปุ่ม "Reorder All" เพื่อจัดเรียง order ใหม่ทั้งหมดให้ต่อเนื่องกัน (1, 2, 3, 4, ...)
- ใช้ icon `RefreshCw` จาก Lucide
- แสดง loading state เมื่อกำลัง reorder

### 2. Auto Order สำหรับ Section ใหม่

- เมื่อสร้าง section ใหม่ order จะถูกตั้งค่าอัตโนมัติเป็น `maxOrder + 1`
- ลบ input field order ออกจาก form สร้าง section ใหม่
- แสดงข้อความ "Order will be set automatically (max + 1)"

### 3. การทำงาน

#### Reorder All
1. คลิกปุ่ม "Reorder All"
2. ยืนยันการจัดเรียง
3. ระบบจะ:
   - เรียง sections ตาม order ปัจจุบัน
   - อัปเดต order ให้ต่อเนื่องกัน (1, 2, 3, 4, ...)
   - อัปเดตทุก sections พร้อมกัน

#### สร้าง Section ใหม่
1. คลิก "Add Section"
2. ใส่ชื่อ section และเลือก type
3. Order จะถูกตั้งค่าอัตโนมัติเป็น `maxOrder + 1`
4. คลิก "Create Section"

## ตัวอย่าง

### ก่อน Reorder
```
Hero Section: order 1
Why iskillbiz: order 2
Features: order 6
Multi-Platform Support: order 7
Use Cases: order 8
Social Proof: order 9
Feature Comparison: order 11
Upsell Blocks: order 12
Get Started: order 14
Final CTA: order 15
```

### หลัง Reorder
```
Hero Section: order 1
Why iskillbiz: order 2
Features: order 3
Multi-Platform Support: order 4
Use Cases: order 5
Social Proof: order 6
Feature Comparison: order 7
Upsell Blocks: order 8
Get Started: order 9
Final CTA: order 10
```

### สร้าง Section ใหม่
- ถ้ามี sections 10 อัน (order สูงสุด = 10)
- Section ใหม่จะได้ order = 11 อัตโนมัติ

## UI Components

### Header
```
[Sections Title] [Reorder All Button] [Add Section Button]
```

### Reorder All Button
- สีเทา (gray-600)
- Icon: RefreshCw
- Text: "Reorder All"
- Tooltip: "จัดเรียง order ใหม่ทั้งหมดให้ต่อเนื่องกัน (1, 2, 3, ...)"

### Create Section Form
- **Section Name**: Input field
- **Type**: Dropdown (text, hero, youtube, image)
- **Order**: ไม่มี (จะถูกตั้งค่าอัตโนมัติ)
- ข้อความ: "Order will be set automatically (max + 1)"

## API Endpoints

ใช้ endpoint ที่มีอยู่แล้ว:
- `PUT /api/sections/:id` - อัปเดต order

```json
{
  "order": 1
}
```

## หมายเหตุ

- **Auto Order**: Section ใหม่จะได้ order อัตโนมัติเป็น `maxOrder + 1`
- **Reorder All**: จัดเรียง order ใหม่ทั้งหมดให้ต่อเนื่องกัน
- **Confirmation**: มี confirmation dialog ก่อน reorder
- **Batch Update**: อัปเดตทุก sections พร้อมกันด้วย `Promise.all`

## วิธีใช้งาน

1. **จัดเรียง Order ใหม่ทั้งหมด**:
   - คลิกปุ่ม "Reorder All"
   - ยืนยันการจัดเรียง
   - Order จะถูกจัดเรียงใหม่ให้ต่อเนื่องกัน (1, 2, 3, ...)

2. **สร้าง Section ใหม่**:
   - คลิก "Add Section"
   - ใส่ชื่อ section และเลือก type
   - Order จะถูกตั้งค่าอัตโนมัติ
   - คลิก "Create Section"

3. **ตรวจสอบผลลัพธ์**:
   - Sections จะถูกเรียงตาม order ที่ต่อเนื่องกัน
   - หน้าเว็บจะแสดง sections ตาม order ที่ถูกต้อง

