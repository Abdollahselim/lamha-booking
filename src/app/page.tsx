"use client";

import React from "react";
import { Loader2 } from "lucide-react"; // ✅ Fixed: Added missing import
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import { ServiceSelectionStep } from "@/components/steps/ServiceSelectionStep";
import { DateTimeStep } from "@/components/steps/DateTimeStep";
import { PatientInfoStep } from "@/components/steps/PatientInfoStep";
import { ConfirmationStep } from "@/components/steps/ConfirmationStep";
import { useBookingStore } from "@/store/bookingStore";
import { BookingStep } from "@/lib/types";
import { useHydration } from "@/hooks/useHydration";

export default function Home() {
  // 1. Always call Hooks at the top level (No conditions before this!)
  const step = useBookingStore((s) => s.step);
  const isHydrated = useHydration();

  // 2. Helper function to render steps
  const renderStep = () => {
    switch (step) {
      case BookingStep.SERVICE_SELECTION:
        return <ServiceSelectionStep />;
      case BookingStep.DATE_TIME:
        return <DateTimeStep />;
      case BookingStep.PATIENT_INFO:
        return <PatientInfoStep />;
      case BookingStep.CONFIRMATION:
        return <ConfirmationStep />;
      default:
        return <ServiceSelectionStep />;
    }
  };

  // 3. Conditional Rendering (LOADING STATE)
  // This must come AFTER all hooks are declared
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#349998] animate-spin" />
      </div>
    );
  }

  // 4. Main Render
  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50/50 flex flex-col items-center justify-start pt-6 pb-12">
      <div className="w-full mb-4">
        <ProgressIndicator current={step} />
      </div>

      <div className="w-full px-4 flex-1 flex items-start justify-center">
        {renderStep()}
      </div>
    </main>
  );
}