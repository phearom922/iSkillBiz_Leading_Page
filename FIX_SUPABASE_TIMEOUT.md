# แก้ไขปัญหา Supabase Connection Timeout

## ปัญหาที่พบ

จาก terminal output พบ:
1. **ConnectTimeoutError**: Connection timeout เมื่อพยายามเชื่อมต่อ Supabase (10 seconds)
2. **Warning**: "No sections found" - เนื่องจากไม่สามารถเชื่อมต่อ Supabase ได้

## สาเหตุ

1. **Network Issues**: 
   - Internet connection ช้า
   - Firewall หรือ proxy block การเชื่อมต่อ
   - Supabase service อาจไม่สามารถเข้าถึงได้

2. **Configuration Issues**:
   - `.env.local` อาจไม่มีหรือไม่ถูกต้อง
   - Supabase URL อาจไม่ถูกต้อง
   - Missing environment variables

3. **Timeout Too Short**:
   - Default timeout (10 seconds) อาจไม่พอสำหรับ network ที่ช้า

## การแก้ไข

### 1. เพิ่ม Timeout Configuration

เพิ่ม timeout เป็น 15 seconds ใน `lib/supabase/server.ts`:

```typescript
global: {
  fetch: (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    return fetch(url, {
      ...options,
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeoutId);
    });
  },
}
```

### 2. ปรับปรุง Error Handling

ใน `app/api/content/route.ts`:
- ตรวจสอบ configuration ก่อนสร้าง client
- Handle timeout errors แยกต่างหาก
- Return 503 (Service Unavailable) สำหรับ timeout errors

### 3. ตรวจสอบ Configuration

ตรวจสอบว่า `.env.local` มี:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## วิธีตรวจสอบ

1. **ตรวจสอบ `.env.local`**:
   ```bash
   cat .env.local
   ```

2. **ตรวจสอบ Supabase URL**:
   - ไปที่ Supabase Dashboard
   - Settings → API
   - Copy URL และ Anon Key

3. **ทดสอบ Connection**:
   ```bash
   curl https://your-project.supabase.co/rest/v1/
   ```

## หมายเหตุ

- หากยังมีปัญหา timeout อาจต้อง:
  - ตรวจสอบ network connection
  - ตรวจสอบ firewall/proxy settings
  - ลองใช้ Supabase URL อื่น (ถ้ามี)
  - ตรวจสอบว่า Supabase project ยัง active อยู่

- Frontend จะใช้ fallback static content หาก Supabase ไม่สามารถเชื่อมต่อได้

