"use client";

import { useState, useEffect, useMemo } from "react";
import { format, addMonths, subMonths, isSameDay, isSunday, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfToday, isSameMonth } from "date-fns";
import { arSA } from "date-fns/locale";
import { useBookingStore } from "@/store/bookingStore";
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { TIME_SLOTS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SplitLayout } from "@/components/layout/SplitLayout";

// =========================================================
// 📅 DATE TIME SELECTION STEP
// =========================================================
export function DateTimeStep() {
  // 1. Store Hooks
  const { bookingId, date, time, setDate, setTime, nextStep, prevStep } = useBookingStore();
  
  // 2. Local State for Availability
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // 3. Date Calculations
  const effectiveDate = useMemo(() => {
    return date ? (typeof date === "string" ? new Date(date) : date) : null;
  }, [date]);
  
  const [currentMonth, setCurrentMonth] = useState<Date>(effectiveDate || new Date());
  
  // Initialize date if empty
  useEffect(() => {
    if (!effectiveDate) setDate(new Date());
  }, [effectiveDate, setDate]);

  // =========================================================
  // 🔄 FETCH BOOKED SLOTS FROM API
  // =========================================================
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!effectiveDate) return;
      
      setIsLoadingSlots(true);
      try {
        // Format date as YYYY-MM-DD for the API query
        const dateString = format(effectiveDate, 'yyyy-MM-dd');
        const excludeParam = bookingId ? `&excludeId=${bookingId}` : '';
        const res = await fetch(`/api/book?date=${dateString}${excludeParam}`);
        const data = await res.json();
        
        if (data.success && Array.isArray(data.bookedSlots)) {
          setBookedSlots(data.bookedSlots);
        } else {
          setBookedSlots([]);
        }
      } catch (error) {
        console.error("Failed to fetch slots", error);
        setBookedSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [effectiveDate, bookingId]);

  // =========================================================
  // 🗓️ CALENDAR LOGIC
  // =========================================================
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  }).filter((day) => {
    // Filter out Sundays and past days
    if (isSunday(day)) return false;
    if (isSameMonth(day, new Date())) {
      return !isBefore(day, startOfToday());
    }
    return !isBefore(day, startOfMonth(new Date()));
  });

  const isSlotBooked = (checkTime: string) => {
    return bookedSlots.includes(checkTime);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    if (!isBefore(newMonth, startOfMonth(new Date()))) {
      setCurrentMonth(newMonth);
    }
  };

  return (
    <SplitLayout
      imageSrc="/images/Step-2.webp"
      title={<span className="text-xl md:text-4xl">حجز الموعد</span>}
      subtitle="اختر اليوم والوقت المناسب لك"
    >
      <div className="w-full space-y-4 pt-2 max-w-sm mx-auto">
        
        {/* ================================================= */}
        {/* 📆 DATE SELECTION SECTION */}
        {/* ================================================= */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
            <CalendarIcon className="w-4 h-4 text-[#349998]" />
            <span className="text-sm font-bold text-slate-800">التاريخ :</span>
          </div>

          {/* Month Navigation Header */}
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
            <button 
              onClick={prevMonth} 
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-full transition-all text-slate-600 disabled:opacity-30" 
              disabled={isSameMonth(currentMonth, new Date())}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs text-[#349998]">
              {format(currentMonth, "MMMM yyyy", { locale: arSA })}
            </span>
            <button 
              onClick={nextMonth} 
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-full transition-all text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Days Horizontal Slider */}
          <div className="relative">
            <div 
              className="flex gap-2 overflow-x-auto pb-2 pt-1 px-1 scrollbar-hide snap-x" 
              style={{ direction: 'rtl' }}
            >
              {daysInMonth.map((day, idx) => {
                const isSelected = effectiveDate ? isSameDay(effectiveDate, day) : false;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setDate(day);
                      setTime(null); // Reset time when date changes
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[50px] h-[60px] rounded-xl border-2 transition-all snap-center shadow-xs",
                      isSelected 
                        ? "border-[#349998] bg-[#349998] text-white shadow-teal-50 scale-105" 
                        : "border-slate-100 bg-white text-slate-600 hover:border-[#349998]/30 hover:bg-slate-50"
                    )}
                  >
                    <span className="text-[10px] font-medium opacity-80">{format(day, "EEE", { locale: arSA })}</span>
                    <span className="text-sm font-bold">{format(day, "d")}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ⏰ TIME SELECTION SECTION */}
        {/* ================================================= */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
            <Clock className="w-4 h-4 text-[#349998]" />
            <span className="text-sm font-bold text-slate-800">الوقت :</span>
          </div>

          {!effectiveDate ? (
            <div className="h-[100px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px] text-center">
              يرجى اختيار التاريخ أولاً
            </div>
          ) : isLoadingSlots ? (
            <div className="h-[100px] flex items-center justify-center bg-slate-50 rounded-xl">
               <Loader2 className="w-6 h-6 animate-spin text-[#349998]" />
            </div>
          ) : (
            <div className="grid grid-cols-4 lg:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {TIME_SLOTS.map((slot) => {
                const isBooked = isSlotBooked(slot);
                const isSelected = time === slot;

                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setTime(slot)}
                    className={cn(
                      "py-2 px-1 rounded-lg text-[11px] font-medium transition-all border",
                      isBooked 
                        ? "bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed opacity-50 decoration-slate-400 line-through" 
                        : isSelected
                          ? "bg-[#349998] text-white border-[#349998] shadow-xs"
                          : "bg-white text-slate-700 border-slate-100 hover:border-[#349998] hover:shadow-xs"
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-5 mt-2 pt-2 border-t border-slate-100">
          <button
            onClick={prevStep}
            className="flex-1 py-3.5 px-4 mt-2 rounded-xl border border-slate-200 text-slate-600 text-xl font-bold hover:bg-slate-50 hover:border-[#4C90A3] transition-colors"
          >
            رجوع
          </button>
          <button
            onClick={nextStep}
            disabled={!effectiveDate || !time}
            className="flex-1 py-3.5 px-4 mt-2 rounded-xl bg-[#349998] text-white text-xl font-bold hover:bg-[#2c8180] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-50 transition-all"
          >
            المتابعة
          </button>
        </div>
      </div>
    </SplitLayout>
  );
}