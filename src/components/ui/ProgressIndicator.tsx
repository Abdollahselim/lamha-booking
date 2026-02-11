"use client";

import React from "react";
import { useBookingStore } from "@/store/bookingStore";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  current?: number;
};

export default function ProgressIndicator({ current }: Props) {
  const storeStep = useBookingStore((s) => s.step);
  const activeStep = typeof current === "number" ? current : storeStep;

  const steps = [
    { title: "نوع الفحص", id: 0 },
    { title: "التاريخ والوقت", id: 1 },
    { title: "معلوماتي", id: 2 },
    { title: "تأكيد الحجز", id: 3 },
  ];

  return (
    <div className="max-w-3xl mx-auto pt-2 pb-8 px-4 md:px-6" dir="rtl">
      {/* Desktop Layout: Title and Stepper in one row */}
      <div className="hidden md:flex items-center justify-between gap-12">
        <h2 className="text-xl font-bold text-gray-950 whitespace-nowrap">
          حجز فحص نظر
        </h2>
        
        <div className="relative flex-1 flex items-center justify-between">
          <StepperInternal steps={steps} activeStep={activeStep} />
        </div>
      </div>

      {/* Mobile Layout: Stacked Title/X row and Stepper below */}
      <div className=" md:hidden">
        

        <div className="relative flex items-center justify-between px-5">
          <StepperInternal steps={steps} activeStep={activeStep} />
        </div>
      </div>
    </div>
  );
}

function StepperInternal({ steps, activeStep }: { steps: { title: string, id: number }[], activeStep: number }) {
  return (
    <>
      {/* Background Track */}
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" />
      
      {/* Progress Fill */}
      <motion.div 
        className="absolute right-0 top-1/2 h-px -translate-y-1/2 bg-[#4C90A3] origin-right"
        initial={false}
        animate={{ 
          width: `${(activeStep / (steps.length - 1)) * 100}%` 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Steps */}
      {steps.map((step) => {
        const isActive = step.id === activeStep;
        const isCompleted = step.id < activeStep;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            {/* Dot */}
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isActive || isCompleted ? "#4C90A3" : "#D1D5DB",
                scale: isActive ? 1.1 : 1,
              }}
              className="w-[10px] h-[10px] rounded-full cursor-pointer shadow-none transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="active-dot-glow"
                  className="absolute inset-0 rounded-full bg-[#4C90A3]/30"
                  initial={{ scale: 1 }}
                  animate={{ scale: 2 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    repeatType: "reverse" 
                  }}
                />
              )}
            </motion.div>

            {/* Label */}
            <motion.span
              animate={{
                color: isActive ? "#4C90A3" : "#A1A1AA",
                fontWeight: isActive ? "700" : "500",
                opacity: isActive || isCompleted ? 1 : 0.8
              }}
              className="absolute top-6 text-[12px] whitespace-nowrap text-center"
            >
              {step.title}
            </motion.span>
          </div>
        );
      })}
    </>
  );
}
