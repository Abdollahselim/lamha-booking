"use client";

import React from "react";
import { motion } from "framer-motion";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { useBookingStore } from "@/store/bookingStore";

/**
 * Step 1: Service Selection
 * User selects the type of service they need
 */
export function ServiceSelectionStep() {
  // 1. تصحيح هام: لازم نستدعي setService عشان نقدر نستخدمها تحت
  const { nextStep, setService, setBookingId } = useBookingStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // تأكد إن الصورة دي موجودة في public/images/map.png
  const mapUrl = "/images/map.png"; 
  const googleMapsUrl = "https://maps.app.goo.gl/ZbjwC5RWZnhMgcbCA";

  return (
    <SplitLayout 
      imageSrc="/images/Step-1.webp"
      title={<></>} // العنوان مخفي في الليأوت عشان إحنا حاطينه جوه التصميم تحت
    >
      <motion.div
        className="w-full space-y-4 pt-2 pb-2 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Promo Section - AT THE TOP */}
        <motion.div 
          className="text-center pb-6 space-y-2"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-slate-900">
            فحص نظر <span className="text-red-500">مجاناً</span>
          </h1>
          <p className="text-base text-slate-600">
            للعملاء بعمر 12 عاماً وما فوق
          </p>
        </motion.div>

        {/* Branch Info */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-900 font-bold text-center leading-relaxed text-[0.9rem]"
        >
          فـــــــرع لمحة للبصريات, حي اليــــــــاسمين, الريــــــــاض
        </motion.p>

        {/* Map Visualization - Interactive */}
        <motion.div 
          variants={itemVariants}
          className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm group cursor-pointer"
        >
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            <img 
              src={mapUrl}
              alt="Branch Location"
              // لو الصورة مش موجودة، استخدم صورة احتياطية عشان الشكل ما يبوظش
              onError={(e) => e.currentTarget.src = "https://media.wired.com/photos/59269cd37034dc5f91becd64/master/w_2560%2Cc_limit/GoogleMapTA.jpg"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Click to open overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                اضغط لفتح الخريطة 📍
              </span>
            </div>
          </a>
        </motion.div>

        {/* Action Button */}
        <motion.button
          onClick={() => {
            setBookingId(""); // Clear any previous ID when starting fresh
            setService("فحص نظر عام");
            nextStep();
          }}
          className="w-full rounded-lg bg-[#4C90A3] mt-6 py-3.5 font-bold text-white text-xl shadow-lg transition-all hover:bg-[#3B707E] active:scale-95"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          variants={itemVariants}
        >
          أحجز الآن
        </motion.button>
      </motion.div>
    </SplitLayout>
  );
}
