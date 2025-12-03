# Stationery Donation — Frontend (Vite + React + Tailwind + Framer Motion)

Single-page frontend project to collect stationery donation info and open a WhatsApp message to an admin phone number.

## Features
- Hero section with CTA
- Donation form with validation (React Hook Form)
- Opens WhatsApp with pre-filled message to admin number
- Mobile-first responsive design
- Framer Motion micro-interactions
- Accessible form fields and error messages

## Tech
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Hook Form
- Lucide Icons

## Setup (local)
1. Ensure Node 18+ and npm installed.
2. Install dependencies:
```bash
npm install
```
3. Run development server:
```bash
npm run dev
```
4. Visit `http://localhost:5173` by default.

## Change admin number
Open `src/components/DonationForm.jsx` and edit the `ADMIN_WHATSAPP` constant near the top:
```js
const ADMIN_WHATSAPP = "+94771234567"
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- This project is frontend-only; it opens WhatsApp web or the WhatsApp app (mobile) with a pre-filled message for admin coordination.
- The UI uses a trust-based blue/green palette; adjust in `tailwind.config.cjs`.
