"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitLayoutProps {
  imageSrc: string;
  imageAlt?: string;
  children: ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  direction?: "ltr" | "rtl";
}

/**
 * SplitLayout Component
 * Provides a responsive split-screen layout with RTL/LTR support
 * Animates transitions between wizard steps
 */
export function SplitLayout({
  imageSrc,
  imageAlt = "Wizard Step Image",
  children,
  title,
  subtitle,
  direction = "ltr",
}: SplitLayoutProps) {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkRtl = () => {
      const docDir = document.documentElement.dir || document.documentElement.lang;
      setIsRtl(direction === "rtl" || docDir === "ar" || docDir === "rtl");
    };
    
    checkRtl();
    // Optional: Add observer if dir can change dynamically
  }, [direction]);

  // Animation variants for content
  const contentVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for image
  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-lg min-h-[600px] border border-slate-100 transition-all duration-500",
        isRtl && "lg:flex-row-reverse"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Image Section */}
      <motion.div
        className="hidden lg:flex w-1/2 overflow-hidden bg-white"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <div className="relative h-full w-full">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-10 text-center"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        {/* Header */}
        <div className="w-full max-w-sm space-y-2 text-center">
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
              className="text-base text-slate-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {subtitle}
            </motion.div>
          )}
        </div>

        {/* Dynamic Content */}
        <motion.div
          className="w-full max-w-sm text-center"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Mobile Image Fallback - subtle background */}
      <div className="absolute inset-0 -z-10 lg:hidden opacity-5">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
