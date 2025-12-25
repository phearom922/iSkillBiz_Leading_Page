# Fix Section Order - แก้ไขการจัดลำดับ Sections

## ปัญหาที่พบ

- ไม่สามารถแก้ไข order ของ sections ได้ใน admin dashboard
- ไม่มีวิธีจัดเรียง sections ใหม่

## การแก้ไข

### 1. เพิ่มฟีเจอร์แก้ไข Order ใน Table

- **Inline Editing**: คลิกที่ order number เพื่อแก้ไขโดยตรง
- **Move Up/Down Buttons**: ปุ่มลูกศรขึ้น/ลงเพื่อสลับตำแหน่งกับ section ที่อยู่ติดกัน
- **Auto-save**: บันทึกอัตโนมัติเมื่อกด Enter หรือคลิกออกจาก input field

### 2. ฟีเจอร์ที่เพิ่ม

#### Inline Order Editing
- คลิกที่ icon แก้ไข (Edit) ข้าง order number
- ใส่ตัวเลขใหม่
- กด Enter เพื่อบันทึก หรือ Escape เพื่อยกเลิก
- บันทึกอัตโนมัติเมื่อคลิกออกจาก input field

#### Move Up/Down
- ปุ่มลูกศรขึ้น (↑): ย้าย section ขึ้น 1 ตำแหน่ง
- ปุ่มลูกศรลง (↓): ย้าย section ลง 1 ตำแหน่ง
- สลับ order กับ section ที่อยู่ติดกันอัตโนมัติ

### 3. การทำงาน

1. **แก้ไข Order โดยตรง**:
   - คลิก Edit icon ข้าง order number
   - ใส่ตัวเลขใหม่
   - กด Enter หรือคลิกออกจาก field
   - ระบบจะอัปเดต order ใน database

2. **Move Up**:
   - คลิกปุ่มลูกศรขึ้น
   - Section จะสลับ order กับ section ที่อยู่ด้านบน
   - อัปเดตทั้ง 2 sections พร้อมกัน

3. **Move Down**:
   - คลิกปุ่มลูกศรลง
   - Section จะสลับ order กับ section ที่อยู่ด้านล่าง
   - อัปเดตทั้ง 2 sections พร้อมกัน

## UI Components

### Order Column
```
[Order Number] [↑] [Edit Icon]
              [↓]
```

- **Order Number**: แสดง order ปัจจุบัน
- **Arrow Up (↑)**: ย้ายขึ้น
- **Arrow Down (↓)**: ย้ายลง
- **Edit Icon**: แก้ไข order โดยตรง

### Inline Edit Mode
```
[Input Field] [Loading Spinner]
```

- **Input Field**: ใส่ตัวเลขใหม่
- **Loading Spinner**: แสดงเมื่อกำลังอัปเดต

## API Endpoints

ใช้ endpoint ที่มีอยู่แล้ว:
- `PUT /api/sections/:id` - อัปเดต order

```json
{
  "order": 5
}
```

## หมายเหตุ

- **Order Sorting**: Sections จะถูกเรียงตาม order (น้อยไปมาก) อัตโนมัติ
- **Validation**: Order ต้องเป็นตัวเลข
- **Auto-refresh**: หลังจากอัปเดต order จะ refresh sections list อัตโนมัติ
- **Error Handling**: หากอัปเดตไม่สำเร็จ จะ revert order value กลับไปเป็นค่าเดิม

## วิธีใช้งาน

1. **แก้ไข Order โดยตรง**:
   - ไปที่ `/admin/sections`
   - คลิก Edit icon ข้าง order number
   - ใส่ตัวเลขใหม่
   - กด Enter หรือคลิกออกจาก field

2. **Move Up/Down**:
   - คลิกปุ่มลูกศรขึ้น/ลง
   - Section จะสลับตำแหน่งกับ section ที่อยู่ติดกัน

3. **ตรวจสอบผลลัพธ์**:
   - Sections จะถูกเรียงใหม่ตาม order
   - หน้าเว็บจะแสดง sections ตาม order ที่กำหนด

