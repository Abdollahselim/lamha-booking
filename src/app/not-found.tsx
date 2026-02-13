
import Link from "next/link";
import { Home } from "lucide-react";

/**
 * @file not-found.tsx
 * @description Minimalist 404 with bold typography and brand colors.
 */

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-white text-center px-6 overflow-hidden">
      
      {/* رقم 404 ضخم ومتجاوب */}
      <div className="select-none">
        <h1 className="text-[120px] sm:text-[180px] md:text-[220px] font-black text-slate-50 leading-none tracking-tighter">
          404
        </h1>
      </div>
      
      {/* نصوص توضيحية هادئة */}
      <div className="relative -mt-10 md:-mt-16 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
          الصفحة غير موجودة
        </h2>
        <p className="text-slate-400 max-w-xs md:max-w-md mx-auto leading-relaxed">
          نعتذر، الرابط الذي اتبعته قد يكون معطلاً أو الصفحة تم نقلها نهائياً.
        </p>
      </div>

      {/* زر العودة للرئيسية بلون البراند */}
      <Link 
        href="/"
        className="flex items-center justify-center gap-2 bg-[#349998] text-white px-12 py-4 rounded-full font-bold hover:bg-[#2a7a78] transition-all active:scale-95 shadow-lg shadow-[#349998]/20"
      >
        <Home className="w-5 h-5" />
        العودة للرئيسية
      </Link>

    </div>
  );
}