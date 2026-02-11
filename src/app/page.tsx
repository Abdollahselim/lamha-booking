"use client";

import { useBookingStore } from "@/store/bookingStore";
import { BookingStep } from "@/lib/types";
import { ServiceSelectionStep } from "@/components/steps/ServiceSelectionStep";
import { DateTimeStep } from "@/components/steps/DateTimeStep";
import { PatientInfoStep } from "@/components/steps/PatientInfoStep";
import { ConfirmationStep } from "@/components/steps/ConfirmationStep";
import { useEffect, useState } from "react";
import ProgressIndicator from "@/components/ui/ProgressIndicator";

export default function Home() {
  const step = useBookingStore((s) => s.step);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  let CurrentStep: React.ReactNode = null;
  if (step === BookingStep.SERVICE_SELECTION) CurrentStep = <ServiceSelectionStep />;
  if (step === BookingStep.DATE_TIME) CurrentStep = <DateTimeStep />;
  if (step === BookingStep.PATIENT_INFO) CurrentStep = <PatientInfoStep />;
  if (step === BookingStep.CONFIRMATION) CurrentStep = <ConfirmationStep />;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50/50 flex flex-col items-center justify-start pt-6 pb-12">
      <div className="w-full mb-4">
        <ProgressIndicator current={step} />
      </div>

      <div className="w-full px-4 flex-1 flex items-start justify-center">
        {CurrentStep}
      </div>
    </main>
  );
}