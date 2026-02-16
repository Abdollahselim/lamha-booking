"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBookingStore } from "@/store/bookingStore";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { MapPin, Calendar as CalendarIcon, Clock, Eye, CheckCircle, CalendarPlus, ExternalLink, XCircle, RefreshCw, Loader2 } from "lucide-react";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { BookingStep } from "@/lib/types";

// =========================================================
// CONFIRMATION STEP (SUCCESS / CANCEL / RESCHEDULE)
// =========================================================
export function ConfirmationStep() {
  // 1. Get Store Data
  const { date, time, service, user, bookingId, setStep } = useBookingStore();
  
  // 2. Local State
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const effectiveDate = date ? (typeof date === "string" ? new Date(date) : date) : null;

  // Helper: Generate Google Calendar Link
  const getGoogleCalendarLink = () => {
    if (!effectiveDate || !time) return "#";
    const title = `موعد ${service} - نظارات لمحة`;
    const details = `مرحباً ${user.firstName}، هذا تذكير بموعدك في نظارات لمحة.`;
    const location = "نظارات لمحة، حي الياسمين، الرياض";
    
    const startDate = format(effectiveDate, "yyyyMMdd");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${startDate}/${startDate}`;
  };

  // =========================================================
  // HANDLER: CANCEL OR RESCHEDULE
  // =========================================================
  const handleAction = async (actionType: 'reschedule' | 'cancel') => {
    // A. Reschedule Logic (Client Side Only)
    // We just move the user back to Date Step. The update happens upon re-submission.
    if (actionType === 'reschedule') {
      setStep(BookingStep.DATE_TIME);
      return;
    }

    // B. Cancel Logic (Server Side)
    if (!bookingId) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          bookingId: bookingId,
        }),
      });

      if (response.ok) {
        setIsCancelled(true);
      } else {
        alert("تعذر إلغاء الحجز، يرجى الاتصال بخدمة العملاء.");
      }
    } catch (error) {
      console.error("Error cancelling:", error);
      alert("تأكد من اتصالك بالإنترنت.");
    } finally {
      setIsLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // =========================================================
  // VIEW 1: CANCELLED STATE
  // =========================================================
  if (isCancelled) {
    return (
      <SplitLayout
        imageSrc="/images/lamha-2.webp"
        title={<span className="text-2xl font-bold text-red-600">تم إلغاء الموعد</span>}
        subtitle="تم إلغاء حجزك بنجاح. نتمنى رؤيتك قريباً."
      >
        <div className="flex flex-col items-center justify-center py-10 space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10" />
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            حجز موعد جديد
          </button>
        </div>
      </SplitLayout>
    );
  }

  // =========================================================
  // VIEW 2: SUCCESS STATE (DEFAULT)
  // =========================================================
  return (
    <SplitLayout
      imageSrc="/images/lamha-1.webp"
      title={
        <div className="flex flex-col items-center lg:items-center gap-2 w-full">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-13 h-13 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-1"
          >
            <CheckCircle className="w-7 h-7" />
          </motion.div>
          <span className="text-2xl md:text-3xl font-bold text-slate-900 text-center lg:text-right">
            تم حجز الموعد بنجاح!
          </span>
        </div>
      }
      subtitle={
        <div className="w-full flex justify-center">
          <p className="text-center text-slate-500 text-sm md:text-base max-w-[280px] md:max-w-none">
            شكراً {user.firstName}، تم تأكيد حجزك لدينا.
          </p>
        </div>
      }
    >
      <div className="w-full max-w-lg mx-auto space-y-4 pt-2 flex flex-col items-center">
        
        {/* Details Card */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-5 w-full shadow-sm"
        >
          {/* Location */}
          <div className="flex flex-row-reverse items-start gap-4 text-right justify-start group">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-[#349998]" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] text-slate-400 font-medium pb-1">الفرع</p>
              <a 
                href="https://maps.app.goo.gl/ZbjwC5RWZnhMgcbCA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-[#349998] text-sm hover:underline transition-all block"
              >
                نظارات لمحة - حي الياسمين، الرياض
              </a>
            </div>
          </div>

          <div className="h-px bg-slate-200/60 w-full" />

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-row-reverse items-start gap-3 text-right justify-start">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-[#349998]" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-slate-400 font-medium pb-1">التاريخ</p>
                <p className="font-bold text-slate-800 text-sm">
                  {effectiveDate ? format(effectiveDate, "EEEE, d MMMM", { locale: arSA }) : "-"}
                </p>
              </div>
            </div>

            <div className="flex flex-row-reverse items-start gap-3 text-right justify-start">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#349998]" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-slate-400 font-medium pb-1">الوقت</p>
                <p className="font-bold text-slate-800 text-sm" dir="ltr">{time}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200/60 w-full" />

          {/* Service Section */}
          <div className="flex flex-row-reverse items-center gap-4 text-right justify-start">
            <div className="w-10 h-10 bg-[#349998]/10 rounded-xl flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-[#349998]" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] text-slate-400 font-medium pb-1">الخدمة</p>
              <p className="font-bold text-slate-800 text-sm">{service}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="w-full flex flex-col items-center space-y-4"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          {/* 1. Add to Calendar (Primary) */}
          <a 
            href={getGoogleCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-center"
          >
            <CalendarPlus className="w-5 h-5" />
            إضافة إلى التقويم
          </a>

          {/* 2. Cancel / Reschedule Row */}
          <div className="flex gap-4 w-full justify-center">
            {/* Reschedule Button */}
            <button 
              onClick={() => handleAction('reschedule')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm hover:border-slate-200 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              إعادة جدولة
            </button>

            {/* Cancel Button */}
            <button 
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-red-50/50 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              إلغاء الموعد
            </button>
          </div>

          {/* 3. Go to Store */}
          <footer className="pt-6 text-center w-full">
            <a 
              href="https://lamhaoptics.com" 
              className="inline-flex items-center gap-2 text-[#349998] hover:text-[#2c8180] font-bold transition-colors group"
            >
              <span className="border-b-2 border-[#349998]/20 group-hover:border-[#349998] text-base">الذهاب إلى المتجر الإلكتروني</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </footer>
        </motion.div>

      </div>
    </SplitLayout>
  );
}