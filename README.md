# Lamha Optics Booking Wizard

A modern, responsive booking wizard for Lamha Optics with RTL/LTR support, built with Next.js 14+, TypeScript, and Tailwind CSS.

## 🚀 Features

- **4-Step Booking Wizard**: Service Selection → Date & Time → Patient Info → Confirmation
- **RTL/LTR Support**: Automatic direction detection for Arabic and English
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Smooth Animations**: Framer Motion transitions between steps
- **State Persistence**: Session storage to preserve booking data
- **Type-Safe**: Full TypeScript support
- **Form Validation**: React Hook Form + Zod validation

## 📦 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with sessionStorage persistence
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Lucide React icons
- **Date Utilities**: date-fns
- **Utilities**: clsx + tailwind-merge

## 🗂️ Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   └── layout/
│       └── SplitLayout.tsx       # Split-screen layout with RTL/LTR support
├── lib/
│   ├── types.ts                 # TypeScript interfaces and enums
│   └── utils.ts                 # Utility functions (cn helper)
├── store/
│   └── bookingStore.ts          # Zustand state management
└── styles/
    └── globals.css              # Global styles
```

## 📝 File Descriptions

### `src/lib/types.ts`

Defines all TypeScript interfaces and constants:

- `UserDetails`: Patient information
- `BookingState`: Wizard state shape
- `TIME_SLOTS`: Available booking times (3:00 PM - 12:00 AM)
- `AVAILABLE_DAYS`: Excludes Sunday
- `SERVICES`: Available services
- `BookingStep`: Enum for wizard steps

### `src/store/bookingStore.ts`

Zustand store with actions:

- `setStep()`: Navigate between wizard steps
- `setService()`: Select service
- `setDate()`: Select booking date
- `setTime()`: Select booking time
- `setUserDetails()`: Save patient information
- `nextStep()` / `prevStep()`: Navigation helpers
- `reset()`: Clear all data
- Persists to `sessionStorage` automatically

### `src/components/layout/SplitLayout.tsx`

Reusable layout component:

- Split-screen design (image + content)
- Automatic RTL/LTR switching
- Smooth fade + slide animations
- Mobile responsive (stacks on small screens)
- Props: `imageSrc`, `children`, `title`, `subtitle`, `direction`

## 🎨 Usage Example

```tsx
import { SplitLayout } from "@/components/layout/SplitLayout";
import { useBookingStore } from "@/store/bookingStore";

export default function ServiceSelection() {
  const { service, setService, nextStep } = useBookingStore();

  return (
    <SplitLayout
      imageSrc="/images/eye-exam.jpg"
      title="Select a Service"
      subtitle="Choose the service you need"
      direction="ltr"
    >
      <div className="space-y-4">{/* Your content here */}</div>
    </SplitLayout>
  );
}
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd lamha

# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📱 RTL/LTR Implementation

The layout automatically detects direction based on:

1. Props passed to component (`direction` prop)
2. Document's `dir` attribute
3. Document's `lang` attribute (checks for "ar")

For Arabic content:

```tsx
<SplitLayout direction="rtl" {...props}>
  {/* Content automatically flips */}
</SplitLayout>
```

## 🔄 State Management Example

```tsx
"use client";

import { useBookingStore } from "@/store/bookingStore";

export function BookingForm() {
  const { service, date, time, step, setService, setDate, setTime, nextStep } =
    useBookingStore();

  return <div>{/* Form JSX */}</div>;
}
```

## 🎬 Animation Features

- **Fade In/Out**: Content transitions smoothly between steps
- **Slide Up**: Initial step appears with upward motion
- **Scale**: Images scale in elegantly
- **Staggered Delays**: Title → Subtitle → Content progression

## ✅ TypeScript Support

All types are strictly enforced:

- `Service` union type from `SERVICES` constant
- `TimeSlot` union type from `TIME_SLOTS` constant
- `BookingStep` enum for type-safe step navigation
- `UserDetails` interface for form data

## 🛠️ Development Tips

1. **Add a New Step**: Update `BookingStep` enum and increase step limit in store
2. **Customize Colors**: Modify Tailwind classes in components
3. **Change Animation Speed**: Update transition `duration` in variants
4. **Add Validation**: Use Zod schemas with React Hook Form
5. **Persist More Data**: Extend `BookingState` interface in `types.ts`

## 📄 License

Proprietary - Lamha Optics
