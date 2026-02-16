"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// =========================================================
// TYPES
// =========================================================
interface SplitLayoutProps {
  imageSrc: string;
  imageAlt?: string;
  children: ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  direction?: "ltr" | "rtl";
  priority?: boolean; // New prop to force eager loading for LCP
}

// =========================================================
// ANIMATION VARIANTS
// =========================================================
const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * SplitLayout Component
 * Provides a responsive split-screen layout with RTL/LTR support.
 * Optimized with next/image for performance.
 */
export function SplitLayout({
  imageSrc,
  imageAlt = "Wizard Step Image",
  children,
  title,
  subtitle,
  direction = "ltr",
  priority = true, // Default to true as this is usually above-the-fold
}: SplitLayoutProps) {
  
  // 1. RTL Logic
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkRtl = () => {
      if (typeof window === "undefined") return;
      const docDir = document.documentElement.dir || document.documentElement.lang;
      setIsRtl(direction === "rtl" || docDir === "ar" || docDir === "rtl");
    };
    checkRtl();
  }, [direction]);

  return (
    <div
      className={cn(
        "relative flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-lg min-h-[600px] border border-slate-100 transition-all duration-500",
        isRtl && "lg:flex-row-reverse"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      
      {/* ------------------------------------------------- */}
      {/* DESKTOP IMAGE SECTION (LEFT/RIGHT) */}
      {/* ------------------------------------------------- */}
      <motion.div
        className="hidden lg:flex w-1/2 bg-slate-50 relative"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <div className="relative h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority} // Critical for LCP Score
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Overlay gradient for better text contrast if needed */}
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* ------------------------------------------------- */}
      {/* CONTENT SECTION */}
      {/* ------------------------------------------------- */}
      <motion.div
        className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-10 text-center relative z-10"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        {/* Header */}
        <div className="w-full max-w-sm space-y-3 mb-6">
          <motion.div
            className="text-3xl font-bold text-slate-900"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {title}
          </motion.div>
          
          {subtitle && (
            <motion.div
              className="text-base text-slate-600 font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {subtitle}
            </motion.div>
          )}
        </div>

        {/* Dynamic Children (Form Steps) */}
        <motion.div
          className="w-full max-w-sm"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* ------------------------------------------------- */}
      {/* MOBILE IMAGE BACKGROUND (FALLBACK) */}
      {/* ------------------------------------------------- */}
      <div className="absolute inset-0 -z-10 lg:hidden opacity-[0.03]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover grayscale"
          quality={50} // Lower quality for background to save bandwidth
        />
      </div>
    </div>
  );
}