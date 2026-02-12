"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Smartphone, MessageCircle, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = 2026;

  const links = [
    { label: "المدونة", href: "https://lamhaoptics.com/blog" },
    { label: "من نحن", href: "https://lamhaoptics.com/%D9%85%D9%86-%D9%86%D8%AD%D9%86/page-1452466801" },
    { label: "الشحن والتوصيل", href: "https://lamhaoptics.com/%D8%A7%D9%84%D8%B4%D8%AD%D9%86-%D9%88%D8%A7%D9%84%D8%AA%D9%88%D8%B5%D9%8A%D9%84/page-1277251452" },
    { label: "سياسة الاستبدال والإسترجاع", href: "/privacy" },
    { label: "تأمين ملاذ", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-[#F9FAFB] pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Centered Logo */}
        <div className="mb-4 flex justify-center">
          <Link href="https://lamhaoptics.com">
          <Image
            src="/images/logo.png"
            alt="نظارات لمحة"
            width={180}
            height={60}
            className="object-contain"
          />
          </Link>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-center max-w-3xl text-sm leading-relaxed mb-6">
          نظارات لمحة تأسست عام 2014، تميزنا في توفير النظارات بجودة عالية وبأسعار منافسة، نسعى إلى خلق تجربة تسوق جميلة.
        </p>

        {/* Contact Numbers Row */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-8 mb-10">
          {/* Mobile */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
              <Smartphone size={18} />
            </span>
            <a href="tel:+966539277769">
            <span className="text-sm font-medium text-slate-700 font-mono" dir="ltr">+966539277769</span>
            </a>
          </div>
          {/* WhatsApp */}
          <div className="flex items-center gap-3">
             <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
              <MessageCircle size={18} />
            </span>
            <a href="https://wa.me/966539277769">
            <span className="text-sm font-medium text-slate-700 font-mono" dir="ltr">+966539277769</span>
            </a>
          </div>
        </div>

        {/* Links & Socials Row Grouped */}
        <div className="w-full flex justify-center md:justify-start pt-4 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {/* Social Icons group (Right side of the block in RTL) */}
            <div className="flex items-center gap-2">
              <a href="https://www.instagram.com/Lamhaoptics" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:border-[#4C90A3] transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="https://x.com/Lamhaoptics" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:border-[#4C90A3] transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25h6.963l4.689 6.138z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@lamhaoptics" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:border-[#4C90A3] transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>

            <span className="md:inline-block hidden text-gray-200 mx-1">|</span>

            {/* Nav Links group (Left side of the block in RTL) */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-500 text-sm hover:text-[#4C90A3] transition-colors border-b border-transparent hover:border-[#4C90A3] pb-0.5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with top border line */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-gray-200/60">
          {/* Tax Info Refined (Image on far right) */}
          <div className="flex items-center gap-3 order-3 md:order-1">
            <Image src="/images/imgi_33_tax.webp" width={30} height={30} alt="VAT" className="object-contain" />
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">الرقم الضريبي</p>
              <p className="text-xs font-bold text-slate-600 leading-tight">310656807100003</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm order-2">
             الحقوق محفوظة | {currentYear} نظارات لمحة 
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2 order-1 md:order-3">
            <Image src="/images/mada.webp" width={38} height={24} alt="Mada" className="object-contain" />
            <Image src="/images/credit_card.webp" width={38} height={24} alt="Visa" className="object-contain" />
            <Image src="/images/apple_pay.webp" width={38} height={24} alt="Apple Pay" className="object-contain" />
            <Image src="/images/stc_pay.webp" width={38} height={24} alt="STC Pay" className="object-contain" />
            <Image src="/images/bank.webp" width={38} height={24} alt="Bank" className="object-contain" />
            <Image src="/images/cod.webp" width={38} height={24} alt="COD" className="object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}
