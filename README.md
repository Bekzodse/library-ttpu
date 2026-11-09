# Smart Dormitory — Tashkent Perfect University

React + Vite asosida tayyorlangan ko‘k-oq rangli landing page UI.

## Ishga tushirish

1. Node.js o‘rnatilganini tekshiring: `node -v`
2. Terminalda loyiha papkasiga kiring.
3. Paketlarni o‘rnating:

   ```bash
   npm install
   ```

4. Development serverni ishga tushiring:

   ```bash
   npm run dev
   ```

5. Terminal ko‘rsatgan manzilni brauzerda oching (odatda `http://localhost:5173`).

## Build

```bash
npm run build
```

## Muhim

- Bu hozircha frontend demo.
- Booking formasi brauzerda validatsiya qiladi, lekin ma'lumotlarni backendga yubormaydi.
- Xona narxlari, mavjudlik, manzil, telefon va email demo matn sifatida kiritilgan. Universitet ma'muriyati bilan tasdiqlab, haqiqiy ma'lumotlarga almashtiring.
- Rasmlar internetdan yuklanadi; ularni o‘zingizning tasdiqlangan yotoqxona rasmlaringiz bilan almashtiring.
- 3D Tour bo‘limi Three.js asosidagi scroll-driven kampus sayohati, alohida xona interyerlari va xona ichida 360° navigatsiyani o‘z ichiga oladi.
- Tour assetlari `public/images/` ichida `d1`–`d6`, `room1`–`room3`, `b1`–`b3`, `k1`–`k3` va `l1`–`l3` nomlari bilan, `.png`, `.jpg`, `.jpeg` yoki `.webp` formatlarida manifest orqali yuklanadi.
- Hozirgi asset auditida `d5` topilmadi; u ataylab fallback bilan almashtirilmaydi va brauzer konsolida missing asset sifatida ko‘rsatiladi.
