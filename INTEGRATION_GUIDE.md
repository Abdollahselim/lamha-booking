# Integration Guide - Lamha Optics Booking Wizard

## Overview

This is a complete, production-ready booking wizard scaffold built with Next.js 14+. All core logic is in place; you can start using it immediately or extend it further.

## Quick Start

### 1. View the Project

```bash
cd d:\3bdullah\My_GitHub\lamha
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Use Individual Steps

Import and use steps in your pages:

```tsx
// src/app/page.tsx
"use client";

import { useBookingStore } from "@/store/bookingStore";
import { BookingStep } from "@/lib/types";
import { ServiceSelectionStep } from "@/components/steps/ServiceSelectionStep";
import { DateTimeStep } from "@/components/steps/DateTimeStep";
import { PatientInfoStep } from "@/components/steps/PatientInfoStep";
import { ConfirmationStep } from "@/components/steps/ConfirmationStep";

export default function Home() {
  const { step } = useBookingStore();

  return (
    <div>
      {step === BookingStep.SERVICE_SELECTION && <ServiceSelectionStep />}
      {step === BookingStep.DATE_TIME && <DateTimeStep />}
      {step === BookingStep.PATIENT_INFO && <PatientInfoStep />}
      {step === BookingStep.CONFIRMATION && <ConfirmationStep />}
    </div>
  );
}
```

## State Management

### Access Store

```tsx
import { useBookingStore } from "@/store/bookingStore";

export function MyComponent() {
  // Read state
  const { service, date, time, user, step } = useBookingStore();

  // Update state
  const { setService, setDate, setTime, setUserDetails, nextStep } =
    useBookingStore();

  return (
    <button onClick={() => setService("Eye Examination")}>
      Select Service
    </button>
  );
}
```

### State Shape

```typescript
{
  service: string; // Selected service name
  date: Date | null; // Selected date
  time: string | null; // Selected time slot (e.g., "3:00 PM")
  user: {
    firstName: string; // Patient first name
    lastName: string; // Patient last name
    phone: string; // Patient phone number
    email: string; // Patient email
    comments: string; // Additional notes
  }
  step: number; // Current wizard step (0-3)
}
```

## Customization

### 1. Change Colors

Update Tailwind classes in components:

```tsx
// Change primary color from blue to indigo
// In SplitLayout.tsx
className = "bg-indigo-600 hover:bg-indigo-700";

// In step components
className = "border-indigo-500 bg-indigo-50";
```

### 2. Modify Time Slots

Edit `src/lib/types.ts`:

```typescript
export const TIME_SLOTS = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  // ... add your slots
] as const;
```

### 3. Add More Services

Edit `src/lib/types.ts`:

```typescript
export const SERVICES = [
  "Eye Examination",
  "Contact Lens Fitting",
  "Frame Selection",
  "Lens Adjustment",
  "Repair & Maintenance",
  "Your New Service", // Add here
] as const;
```

### 4. Change Animation Speed

In `SplitLayout.tsx`:

```tsx
transition: {
  duration: 0.5,  // Change this value (in seconds)
  ease: "easeOut",
}
```

### 5. Add New Steps

1. Create new component in `src/components/steps/`
2. Update `BookingStep` enum in `types.ts`
3. Update `prevStep()` limit in store if needed
4. Import and render in your page

## API Integration

### Send Booking to Backend

Modify `ConfirmationStep.tsx`:

```tsx
const handleConfirm = async () => {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service,
        date,
        time,
        user,
      }),
    });

    if (response.ok) {
      setIsConfirmed(true);
      setTimeout(() => reset(), 3000);
    }
  } catch (error) {
    console.error("Booking failed:", error);
  }
};
```

Create `src/app/api/bookings/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  // Validate data
  if (!data.service || !data.date || !data.time || !data.user) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Send email, save to database, etc.
  console.log("Booking received:", data);

  return NextResponse.json(
    { id: "booking_123", status: "confirmed" },
    { status: 201 },
  );
}
```

## Form Validation

The `PatientInfoStep` uses Zod for validation. Add custom rules:

```tsx
const patientSchema = z.object({
  firstName: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z\s]*$/, "Only letters allowed"),
  lastName: z.string().min(2).max(50),
  phone: z.string().regex(/^(?:\+966|0)[0-9]{9}$/, "Invalid Saudi phone"),
  email: z.string().email(),
  comments: z.string().max(500, "Max 500 characters"),
});
```

## RTL/LTR Implementation

### Set Direction Globally

In `src/app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      {" "}
      {/* or "en" / "ltr" */}
      <body>{children}</body>
    </html>
  );
}
```

### Per-Component Direction

```tsx
<SplitLayout
  direction="rtl" // or "ltr"
  {...props}
>
  {children}
</SplitLayout>
```

## Styling with Tailwind

Add custom Tailwind utilities in `src/app/globals.css`:

```css
@layer components {
  .btn-primary {
    @apply rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700;
  }

  .card {
    @apply rounded-lg border-2 border-slate-200 bg-white p-4;
  }
}
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Lamha Optics
```

Use in components:

```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Type Safety

All types exported from `src/lib/types.ts`:

```tsx
import {
  type BookingState,
  type UserDetails,
  type Service,
  type TimeSlot,
  BookingStep,
  SERVICES,
  TIME_SLOTS,
  AVAILABLE_DAYS,
} from "@/lib/types";
```

## Testing

Create tests in `__tests__` folder:

```tsx
// src/__tests__/store.test.ts
import { renderHook, act } from "@testing-library/react";
import { useBookingStore } from "@/store/bookingStore";

describe("Booking Store", () => {
  it("should update service", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setService("Eye Examination");
    });

    expect(result.current.service).toBe("Eye Examination");
  });
});
```

## Performance Optimization

### 1. Code Splitting

Components already split for route-level optimization.

### 2. Image Optimization

Use Next.js Image component:

```tsx
import Image from "next/image";

<Image src={imageSrc} alt="Booking wizard" width={800} height={600} priority />;
```

### 3. Lazy Loading

```tsx
import dynamic from "next/dynamic";

const PatientInfoStep = dynamic(
  () => import("@/components/steps/PatientInfoStep"),
  { loading: () => <p>Loading...</p> },
);
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t lamha-booking .
docker run -p 3000:3000 lamha-booking
```

## Troubleshooting

### State Not Persisting

Check browser sessionStorage in DevTools → Application tab

### Animations Not Smooth

Ensure Framer Motion is installed:

```bash
npm list framer-motion
```

### TypeScript Errors

Run type check:

```bash
npx tsc --noEmit
```

## Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## Next Development Priorities

1. ✅ Core wizard scaffold
2. ⬜ Email notifications
3. ⬜ Calendar view
4. ⬜ Admin dashboard
5. ⬜ Payment integration
6. ⬜ SMS reminders
7. ⬜ Multi-language support
8. ⬜ Booking analytics

---

**Ready to build! Happy coding! 🚀**
