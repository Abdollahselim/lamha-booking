"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { useBookingStore } from "@/store/bookingStore";

// =========================================================
// 🎨 ANIMATION VARIANTS
// =========================================================
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

// =========================================================
// 📍 COMPONENT: SERVICE SELECTION
// =========================================================
export function ServiceSelectionStep() {
  // 1. Store Hooks
  const { nextStep, setService, setBookingId } = useBookingStore();

  // 2. Local State for Image Handling
  // Default map image
  const defaultMapUrl = "/images/map.png";
  // Fallback image in case the default fails
  const fallbackMapUrl = "https://media.wired.com/photos/59269cd37034dc5f91becd64/master/w_2560%2Cc_limit/GoogleMapTA.jpg";
  
  const [mapSrc, setMapSrc] = useState(defaultMapUrl);

  const googleMapsUrl = "https://maps.app.goo.gl/ZbjwC5RWZnhMgcbCA";

  // =========================================================
  // 👆 HANDLERS
  // =========================================================
  const handleBookingStart = () => {
    setBookingId(""); // Clear any old ID to start fresh
    setService("فحص نظر عام"); // Set default service
    nextStep(); // Move to next step
  };

  return (
    <SplitLayout 
      imageSrc="/images/lamha-1.webp"
      title={<></>} // Title is hidden here as we render it inside the component
    >
      <motion.div
        className="w-full space-y-5 pt-2 pb-2 flex flex-col items-center max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* ------------------------------------------------- */}
        {/* PROMO HEADER */}
        {/* ------------------------------------------------- */}
        <motion.div 
          className="text-center space-y-2 pb-4"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            فحص نظر <span className="text-red-500">مجاناً</span>
          </h1>
          <p className="text-sm font-medium text-slate-500">
            للعملاء بعمر 12 عاماً وما فوق
          </p>
        </motion.div>

        {/* ------------------------------------------------- */}
        {/* BRANCH INFO */}
        {/* ------------------------------------------------- */}
        <motion.div 
          variants={itemVariants}
          className="px-2 py-1 w-full text-center"
        >
          <p className="text-slate-800 font-bold text-sm leading-relaxed">
            فـــــــرع لمحة للبصريات, حي اليــــــــاسمين, الريــــــــاض
          </p>
        </motion.div>

        {/* ------------------------------------------------- */}
        {/* INTERACTIVE MAP CARD */}
        {/* ------------------------------------------------- */}
        <motion.div 
          variants={itemVariants}
          className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm group cursor-pointer hover:shadow-md transition-all duration-300"
        >
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            {/* Next.js Optimized Image */}
            <Image 
              src={mapSrc}
              alt="Branch Location Map"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setMapSrc(fallbackMapUrl)}
              priority // Load this image quickly as it's above fold
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                <span>📍</span> اضغط لفتح الخريطة
              </span>
            </div>
          </a>
        </motion.div>

        {/* ------------------------------------------------- */}
        {/* ACTION BUTTON */}
        {/* ------------------------------------------------- */}
        <motion.div className="w-full pt-4" variants={itemVariants}>
          <motion.button
            onClick={handleBookingStart}
            className="w-full rounded-xl bg-[#349998] py-4 font-bold text-white text-xl shadow-lg shadow-teal-50 transition-all hover:bg-[#2c8180] hover:shadow-teal-100 active:scale-[0.98]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            أحجز الآن
          </motion.button>
        </motion.div>

      </motion.div>
    </SplitLayout>
  );
};