"use client";

import React from "react";
import { useBookingStore } from "@/store/bookingStore";
import { BookingStep } from "@/lib/types";
import { ServiceSelectionStep } from "@/components/steps/ServiceSelectionStep";
import { DateTimeStep } from "@/components/steps/DateTimeStep";
import { PatientInfoStep } from "@/components/steps/PatientInfoStep";
import { ConfirmationStep } from "@/components/steps/ConfirmationStep";
import { useHydration } from "@/hooks/useHydration";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import { Loader2 } from "lucide-react"; 

export default function Home() {
  // 1. Call all Hooks at the very beginning (no conditions are allowed before them).
  const step = useBookingStore((s) => s.step);
  const isHydrated = useHydration();

  // 2. Step definition function (instead of excessive if statements)
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

  // 3. Loading State condition—placed right here, after the Hooks
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#349998] animate-spin" />
      </div>
    );
  }

  // 4. Display the Home Page
  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50/50 flex flex-col items-center justify-start pt-6 pb-12">
      {/* Progress Indicator */}
      <div className="w-full mb-4">
        <ProgressIndicator current={step} />
      </div>

      {/* Current Step Content */}
      <div className="w-full px-4 flex-1 flex items-start justify-center">
        {renderStep()}
      </div>
    </main>
  );
}