# Lamha Optics — Booking System

A modern, Arabic-first booking wizard for **Lamha Optics** (نظارات لمحة). Customers can book free eye-exam appointments through a 4-step wizard with real-time slot availability, powered by Google Sheets as the backend.

**Live:** [lamha-booking.vercel.app](https://lamha-booking.vercel.app)

---

## Features

- **4-Step Booking Wizard** — Service → Date & Time → Patient Info → Confirmation
- **Real-Time Slot Availability** — booked slots are disabled; reschedule shows own slot as available
- **Arabic RTL Interface** — full right-to-left layout with Arabic locale
- **Google Sheets Backend** — bookings stored and queried via Google Sheets API
- **Session Persistence** — booking state preserved across page reloads (sessionStorage)
- **Responsive Design** — split-screen layout on desktop, stacked on mobile
- **Form Validation** — React Hook Form + Zod with Saudi phone number validation
- **Smooth Animations** — Framer Motion transitions between steps

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | Next.js 16 (App Router)              |
| Language   | TypeScript                           |
| Styling    | Tailwind CSS v4                      |
| State      | Zustand (sessionStorage)             |
| Forms      | React Hook Form + Zod                |
| Animations | Framer Motion                        |
| Backend    | Google Sheets API (via `googleapis`) |
| Icons      | Lucide React                         |
| Dates      | date-fns (Arabic locale)             |
| Deployment | Vercel                               |

## Project Structure

```
src/
├── app/
│   ├── api/book/route.ts        # Booking API (GET availability, POST create/update/cancel)
│   ├── layout.tsx               # Root layout (font, header, footer, toaster)
│   ├── page.tsx                 # Home — renders the booking wizard
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # 404 page
│   ├── loading.tsx              # Global loading spinner
│   ├── privacy/page.tsx         # Privacy policy
│   └── terms/page.tsx           # Terms & conditions
├── components/
│   ├── layout/
│   │   ├── SplitLayout.tsx      # Reusable split-screen layout
│   │   ├── Header.tsx           # Store-branded header
│   │   └── Footer.tsx           # Store-branded footer
│   ├── steps/
│   │   ├── ServiceSelectionStep.tsx
│   │   ├── DateTimeStep.tsx
│   │   ├── PatientInfoStep.tsx
│   │   └── ConfirmationStep.tsx
│   └── ui/
│       └── ProgressIndicator.tsx # Step indicator bar
├── hooks/
│   └── useHydration.ts          # SSR hydration detection hook
├── lib/
│   ├── types.ts                 # TypeScript interfaces, enums, constants
│   └── utils.ts                 # Tailwind class merge utility
└── store/
    └── bookingStore.ts          # Zustand booking state management
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud service account with Sheets API access
- A Google Sheet configured with columns: `BookingID | CustomerID | Status | Date | Time | Service | Name | Phone | Comments`

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your-spreadsheet-id
```

### Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

### Deployment

The project is configured for **Vercel**. Push to the connected Git repository and Vercel will build and deploy automatically. Ensure your environment variables are set in the Vercel dashboard.

## License

Proprietary — Lamha Optics © 2026
