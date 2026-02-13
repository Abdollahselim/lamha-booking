"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { useBookingStore } from "@/store/bookingStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { UserDetails } from "@/lib/types";
import { User, Phone, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// =========================================================
// 🛡️ UPDATED VALIDATION SCHEMA
// =========================================================
const patientSchema = z.object({
  // 1. First Name: Allow Arabic/English letters only, no numbers
  firstName: z.string()
    .min(2, "الاسم الأول يجب أن يكون حرفين على الأقل")
    .regex(/^[\u0621-\u064Aa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على حروف فقط (بدون أرقام أو رموز)"),

  // 2. Last Name: Allow Arabic/English letters only, no numbers
  lastName: z.string()
    .min(2, "اسم العائلة يجب أن يكون حرفين على الأقل")
    .regex(/^[\u0621-\u064Aa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على حروف فقط (بدون أرقام أو رموز)"),
  
  // 3. Phone: Strict Saudi Validation
  phone: z.string()
    .min(9, "رقم الجوال قصير جداً")
    .max(10, "رقم الجوال طويل جداً")
    .regex(/^(05|5)\d{8}$/, "رقم غير صحيح. مثال: 0501234567")
    .transform(val => {
      if (val.length === 9 && val.startsWith('5')) {
        return '0' + val;
      }
      return val;
    })
    .refine(val => /^05[5034697812]\d{7}$/.test(val), {
      message: "الرقم يجب أن يبدأ بـ 050, 053, 054, 055, 056, 058, أو 059"
    }),
  
  comments: z.string().optional(),
  
  terms: z.boolean().refine((val) => val === true, {
    message: "يجب الموافقة على الشروط والأحكام للمتابعة",
  }),
});

type PatientFormData = z.infer<typeof patientSchema>;

// =========================================================
// 📝 PATIENT INFO STEP COMPONENT
// =========================================================
export function PatientInfoStep() {
  const { user, date, time, service, bookingId, setUserDetails, setBookingId, nextStep, prevStep } = useBookingStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      comments: user.comments,
      terms: false,
    },
    mode: "onChange",
  });

  // Sync Data on Mount
  React.useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      comments: user.comments,
      terms: false,
    });
  }, [user, reset]);

  // =========================================================
  // 🚀 SUBMIT HANDLER (CREATE OR UPDATE)
  // =========================================================
  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('جاري تأكيد الموعد...');

    try {
      // 1. Update Local Store
      setUserDetails({ 
        ...data, 
        email: "", 
        comments: data.comments || "" 
      } as UserDetails);

      // 2. Determine Action: UPDATE vs CREATE
      // If we have a bookingId, it means we are rescheduling (Update).
      // If not, it's a new booking (Create).
      const actionType = bookingId ? 'update' : 'create';

      // 3. Send to API
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          bookingId: bookingId, // Only needed for update
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          date: date,
          time: time,
          service: service,
          comments: data.comments,
        }),
      });

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok && result.success) {
        // If created new, save the new ID. 
        // If updated, keep the old ID or update if API returned a new one.
        if (result.bookingId && actionType === 'create') {
          setBookingId(result.bookingId);
        }
        
        toast.success(bookingId ? 'تم تعديل الموعد بنجاح! ✅' : 'تم حفظ الحجز بنجاح! ✅', {
          duration: 3000,
          icon: '🎉',
        });
        
        nextStep();
      } else {
        toast.error(result.message || 'حدث خطأ، حاول مرة أخرى', { duration: 4000 });
      }
    } catch (error) {
      console.error('[Booking Error]', error);
      toast.dismiss(loadingToast);
      toast.error('تأكد من اتصالك بالإنترنت وحاول مرة أخرى', { duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <SplitLayout
      imageSrc="/images/download (6).webp"
      title={<span className="text-xl md:text-4xl text-right">تفاصيل الحجز</span>}
      subtitle="أخبرنا قليلاً عن نفسك"
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 pt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <motion.div variants={itemVariants} className="space-y-1.5 text-right">
            <label className="block text-sm font-medium text-slate-700">الاسم الأول *</label>
            <div className="relative">
              <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <input
                {...register("firstName")}
                type="text"
                disabled={isSubmitting}
                className={`w-full rounded-xl border-2 pr-10 pl-4 py-2.5 transition-colors text-right text-slate-900 placeholder-slate-300 outline-none ${
                  errors.firstName ? "border-red-500 focus:ring-red-500 bg-red-50/30" : "border-slate-100 focus:ring-2 focus:ring-[#349998]"
                }`}
                placeholder="الاسم الأول "
              />
            </div>
            {errors.firstName && <p className="mt-1 text-xs text-red-500 text-right">{errors.firstName.message}</p>}
          </motion.div>

          {/* Last Name */}
          <motion.div variants={itemVariants} className="space-y-1.5 text-right">
            <label className="block text-sm font-medium text-slate-700">اسم العائلة *</label>
            <div className="relative">
              <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <input
                {...register("lastName")}
                type="text"
                disabled={isSubmitting}
                className={`w-full rounded-xl border-2 pr-10 pl-4 py-2.5 transition-colors text-right text-slate-900 placeholder-slate-300 outline-none ${
                  errors.lastName ? "border-red-500 focus:ring-red-500 bg-red-50/30" : "border-slate-100 focus:ring-2 focus:ring-[#349998]"
                }`}
                placeholder="اسم العائلة "
              />
            </div>
            {errors.lastName && <p className="mt-1 text-xs text-red-500 text-right">{errors.lastName.message}</p>}
          </motion.div>
        </div>

        {/* Phone */}
        <motion.div variants={itemVariants} className="space-y-1.5 text-right">
          <label className="block text-sm font-medium text-slate-700">رقم الجوال *</label>
          <div dir="ltr" className={`flex items-center rounded-xl border-2 transition-colors bg-white ${
              errors.phone ? "border-red-500 bg-red-50/30" : "border-slate-100 focus-within:ring-2 focus-within:ring-[#349998]"
            }`}>
            <div className="flex items-center gap-2 px-3 py-2 border-r border-slate-100 shrink-0">
              <span className="text-xl">🇸🇦</span>
              <span className="text-sm font-semibold text-slate-700">+966</span>
            </div>
            <div className="relative flex-1">
               <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
               <input
                {...register("phone")}
                type="tel"
                disabled={isSubmitting}
                className="w-full border-none bg-transparent pl-10 pr-4 py-2.5 text-left text-slate-900 font-medium placeholder-slate-300 focus:outline-none focus:ring-0"
                placeholder="50 123 4567"
              />
            </div>
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-500 text-right">{errors.phone.message}</p>}
        </motion.div>

        {/* Comments */}
        <motion.div variants={itemVariants} className="space-y-1.5 text-right">
          <label className="block text-sm font-medium text-slate-700">ملاحظات (اختياري)</label>
          <div className="relative">
            <MessageSquare className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
            <textarea
              {...register("comments")}
              disabled={isSubmitting}
              className="w-full rounded-xl border-2 border-slate-100 pr-10 pl-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#349998] text-right text-slate-900 placeholder-slate-300 min-h-[100px] resize-none"
              placeholder="أدخل تعليقك..."
              rows={3}
            />
          </div>
        </motion.div>

        {/* Terms Checkbox */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex flex-row-reverse items-center justify-end gap-3 text-right">
            <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
              لقد قرأت ووافقت على{" "}
              <a href="/terms" target="_blank" className="text-[#349998] hover:underline font-bold">الشروط والأحكام</a> و{" "}
              <a href="/privacy" target="_blank" className="text-[#349998] hover:underline font-bold">سياسة الخصوصية</a>
            </label>
            <div className="relative flex items-center">
              <input
                id="terms"
                type="checkbox"
                disabled={isSubmitting}
                {...register("terms")}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-[#349998] checked:bg-[#349998] disabled:opacity-50"
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          {errors.terms && <p className="text-xs text-red-500 text-right font-bold mt-2 mr-1">{errors.terms.message}</p>}
        </motion.div>

        {/* Buttons */}
        <motion.div className="flex gap-4 pt-6 w-full" variants={itemVariants}>
          <motion.button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="flex-1 py-3.5 px-4 rounded-xl border-2 border-slate-100 text-slate-600 text-lg font-bold hover:bg-slate-50 hover:border-[#349998]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            رجوع
          </motion.button>
          
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="flex-2 py-3.5 px-4 rounded-xl bg-[#349998] text-white text-lg font-bold hover:bg-[#2c8180] shadow-lg shadow-teal-50 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري تأكيد الموعد...
              </>
            ) : (
              bookingId ? "تأكيد التعديل" : "تأكيد الحجز"
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </SplitLayout>
  );
}