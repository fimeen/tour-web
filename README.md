# Hushwood Journeys

เว็บแอปจองทัวร์ธรรมชาติแบบฟูลสแตกที่ออกแบบด้วยบรรยากาศป่าเชิงภาพยนตร์ ระบบ UI โค้งมน และแอนิเมชันจาก Framer Motion

## ฟีเจอร์หลัก

- หน้าแรกแบบ cinematic forest พร้อม parallax และ scroll reveal
- หน้ารวมทัวร์ที่กรองตามความยากและระยะเวลาได้
- หน้ารายละเอียดทัวร์พร้อม gallery, itinerary, highlights และข้อมูลไกด์
- ขั้นตอนจอง 4 ขั้น: วันที่ → จำนวนผู้เดินทาง → ข้อมูลส่วนตัว → ตรวจสอบและยืนยัน
- ระบบเข้าสู่ระบบด้วย Manus OAuth และหน้า My journeys
- แบบฟอร์มติดต่อที่บันทึกข้อมูลผ่าน backend
- Journey Desk สำหรับผู้ดูแล พร้อมอัปเดตสถานะ reservation
- Responsive layout, reduced-motion support และ keyboard accessibility

## เทคโนโลยี

React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Express, tRPC, Drizzle ORM, MySQL/TiDB, Vitest และ Manus OAuth

## เริ่มต้นใช้งาน

```bash
pnpm install
pnpm dev
```

ระบบต้องใช้ environment variables จากแพลตฟอร์ม Manus หรือค่าที่เทียบเท่าสำหรับ `DATABASE_URL`, OAuth และ session configuration ห้าม commit ไฟล์ `.env` หรือ credentials ลง repository

## ฐานข้อมูล

Schema อยู่ใน `drizzle/schema.ts` และ migration ที่สร้างไว้แล้วอยู่ในโฟลเดอร์ `drizzle/`

```bash
pnpm db:push
```

## ตรวจสอบคุณภาพ

```bash
pnpm check
pnpm test
pnpm build
```

Vitest ครอบคลุม input validation, authentication, role authorization, booking, contact, tour data และ controlled error paths

## โครงสร้างสำคัญ

| Path | หน้าที่ |
|---|---|
| `client/src/pages/` | หน้าเว็บทั้งหมด |
| `client/src/components/` | UI และ layout components |
| `server/routers.ts` | typed tRPC procedures |
| `server/db.ts` | database query helpers |
| `drizzle/schema.ts` | tours, bookings และ contact messages schema |
| `server/*.test.ts` | Vitest test suites |

ภาพท่องเที่ยวถูกอ้างอิงผ่าน managed storage URLs จึงไม่เก็บไฟล์ media ขนาดใหญ่ไว้ใน repository
