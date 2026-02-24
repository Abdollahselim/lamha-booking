"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isBefore, 
  startOfToday, 
  isSameMonth
  // getDay // <--  NORMAL MODE: Uncomment this after Ramadan
} from "date-fns";
import { arSA } from "date-fns/locale";
import { useBookingStore } from "@/store/bookingStore";
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SplitLayout } from "@/components/layout/SplitLayout";

// =========================================================
// DATE TIME SELECTION STEP
// =========================================================
export function DateTimeStep() {
  //  NORMAL MODE: Add `bookingId` back to the destructured object after Ramadan
  const { date, time, setDate, setTime, nextStep, prevStep } = useBookingStore();
  
  //  NORMAL MODE: Uncomment these two lines after Ramadan
  // const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  // const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  //  RAMADAN MODE: Fake loading state (always false) to fix ESLint unused warning
  const isLoadingSlots = false;

  // Memoize effective date
  const effectiveDate = useMemo(() => {
    return date ? (typeof date === "string" ? new Date(date) : date) : null;
  }, [date]);
  
  const [currentMonth, setCurrentMonth] = useState<Date>(effectiveDate || new Date());
  
  // Default to today if no date is selected
  useEffect(() => {
    if (!effectiveDate) setDate(new Date());
  }, [effectiveDate, setDate]);

  // =========================================================
  // DYNAMIC TIME SLOT GENERATION
  // =========================================================
  /** Format an hour and minute into an Arabic 12-hour string (e.g. "5:00 م"). */
  const formatTime = (h: number, m: number): string => {
    const d = new Date();
    d.setHours(h, m, 0);
    return format(d, "h:mm a", { locale: arSA });
  };

  const availableTimeSlots = useMemo(() => {
    if (!effectiveDate) return [];
    const slots: string[] = [];

    // =========================================================
    //  RAMADAN HOURS MODE (مواعيد رمضان)
    // =========================================================
    // 1️ الشفت الأول: 3:00 م إلى 5:00 م
    for (let hour = 15; hour <= 17; hour++) {
      if (hour === 17) {
         slots.push(formatTime(hour, 0)); // 5:00 م
      } else {
         slots.push(formatTime(hour, 0));
         slots.push(formatTime(hour, 30));
      }
    }

    // 2️ الشفت الثاني: 8:30 م إلى 3:00 ص
    slots.push(formatTime(20, 30)); // 8:30 م
    for (let hour = 21; hour <= 23; hour++) {
      slots.push(formatTime(hour, 0));
      slots.push(formatTime(hour, 30));
    }
    // بعد منتصف الليل
    for (let hour = 0; hour <= 3; hour++) {
       if (hour === 3) {
          slots.push(formatTime(hour, 0)); // 3:00 ص
       } else {
          slots.push(formatTime(hour, 0));
          slots.push(formatTime(hour, 30));
       }
    }
    return slots;

    // =========================================================
    //  NORMAL HOURS MODE (COMMENTED OUT FOR RAMADAN)
    // =========================================================
    /*
    const dayOfWeek = getDay(effectiveDate); // 0 = Sunday, 5 = Friday
    const startHour = dayOfWeek === 5 ? 16 : 15;
    const endHour = 23;

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(formatTime(hour, 0));  // :00 slot
      slots.push(formatTime(hour, 30)); // :30 slot
    }
    return slots;
    */

  }, [effectiveDate]);

  // =========================================================
  // FETCH BOOKED SLOTS
  // =========================================================
  //  RAMADAN MODE: API FETCHING IS DISABLED TO ALLOW CONCURRENT BOOKINGS
  
  /* ---  NORMAL MODE FETCHING (COMMENTED OUT FOR RAMADAN) ---
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!effectiveDate) return;
      
      setIsLoadingSlots(true);
      try {
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
  ------------------------------------------------------------- */

  // =========================================================
  // CALENDAR LOGIC
  // =========================================================
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  }).filter((day) => {
    if (isSameMonth(day, new Date())) {
      return !isBefore(day, startOfToday());
    }
    return !isBefore(day, startOfMonth(new Date()));
  });

  //  RAMADAN MODE: Always return false
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSlotBooked = (checkTime: string) => false;

  /* ---  NORMAL MODE CHECK (COMMENTED OUT FOR RAMADAN) ---
  const isSlotBooked = (checkTime: string) => {
    return bookedSlots.includes(checkTime);
  };
  -------------------------------------------------------- */

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    if (!isBefore(newMonth, startOfMonth(new Date()))) {
      setCurrentMonth(newMonth);
    }
  };

  // =========================================================
  // RENDER UI
  // =========================================================
  return (
    <SplitLayout
      imageSrc="/images/lamha-2.webp"
      title={<span className="text-xl md:text-4xl">حجز الموعد</span>}
      subtitle="اختر اليوم والوقت المناسب لك"
    >
      <div className="w-full space-y-6 pt-2 max-w-sm mx-auto">
        
        {/* DATE SELECTION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
            <CalendarIcon className="w-5 h-5 text-[#349998]" />
            <span className="text-base font-bold text-slate-800">التاريخ :</span>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={prevMonth} 
              className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed" 
              disabled={isSameMonth(currentMonth, new Date())}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-[#349998]">
              {format(currentMonth, "MMMM yyyy", { locale: arSA })}
            </span>
            <button 
              onClick={nextMonth} 
              className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <div 
              className="flex gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide snap-x" 
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
                      "flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-2xl border transition-all snap-center",
                      isSelected 
                        ? "border-[#349998] bg-[#349998] text-white shadow-md shadow-teal-100 scale-105" 
                        : "border-slate-100 bg-white text-slate-600 hover:border-[#349998]/50 hover:bg-slate-50"
                    )}
                  >
                    <span className="text-[11px] font-medium opacity-80">{format(day, "EEE", { locale: arSA })}</span>
                    <span className="text-lg font-bold">{format(day, "d")}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TIME SELECTION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
            <Clock className="w-5 h-5 text-[#349998]" />
            <span className="text-base font-bold text-slate-800">الوقت :</span>
          </div>

          {!effectiveDate ? (
            <div className="h-[120px] flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm text-center">
              يرجى اختيار التاريخ أولاً لعرض المواعيد
            </div>
          ) : isLoadingSlots ? (
            <div className="h-[120px] flex items-center justify-center bg-slate-50 rounded-2xl">
               <Loader2 className="w-8 h-8 animate-spin text-[#349998]" />
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-3 gap-2.5 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot) => {
                  const isBooked = isSlotBooked(slot);
                  const isSelected = time === slot;

                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setTime(slot)} 
                      className={cn(
                        "py-2.5 px-2 rounded-xl text-xs font-bold transition-all border",
                        isBooked 
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed decoration-slate-400 line-through opacity-60"
                          : isSelected
                            ? "bg-[#349998] text-white border-[#349998] shadow-md ring-2 ring-teal-100 ring-offset-1"
                            : "bg-white text-slate-700 border-slate-200 hover:border-[#349998] hover:text-[#349998]"
                      )}
                    >
                      {slot}
                    </button>
                  );
                })
              ) : (
                 <div className="col-span-4 text-center py-8 text-slate-500 text-sm">
                   لا توجد مواعيد متاحة لهذا اليوم
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={prevStep}
            className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            رجوع
          </button>
          <button
            onClick={nextStep}
            disabled={!effectiveDate || !time}
            className="flex-[2_2_0%] py-3.5 rounded-xl bg-[#349998] text-white font-bold hover:bg-[#2a7d7c] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-100 transition-all hover:-translate-y-0.5"
          >
            المتابعة
          </button>
        </div>
      </div>
    </SplitLayout>
  );
}