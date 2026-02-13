
"use client";

import { useEffect } from "react";
import { RefreshCw, AlertCircle, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  
  useEffect(() => {
    // هنا يمكن ربط خدمة مثل Sentry لاحقاً
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F9FAFB] text-center px-4 relative overflow-hidden">
      
      {/* عناصر جمالية في الخلفية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#349998]/5 rounded-full blur-3xl -z-10" />

      {/* أيقونة الخطأ بتصميم متناسق */}
      <div className="bg-red-50 p-6 rounded-3xl mb-8 border border-red-100 animate-pulse">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
        عذراً، حدث خطأ ما!
      </h2>
      
      <p className="text-slate-500 max-w-md mb-10 leading-relaxed text-lg">
        يبدو أن هناك مشكلة تقنية غير متوقعة. لا تقلق، يمكنك المحاولة مرة أخرى أو العودة للرئيسية.
      </p>

      {/* أزرار التحكم - Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 bg-[#349998] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#2a7a78] transition-all shadow-xl shadow-[#349998]/20 active:scale-95 w-full sm:w-auto"
        >
          <RefreshCw className="w-5 h-5" />
          إعادة المحاولة
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 w-full sm:w-auto"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </Link>
      </div>

      {/* عرض كود الخطأ للمطورين فقط في بيئة التطوير */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-10 p-4 bg-slate-100 rounded-lg text-left text-xs text-slate-400 font-mono overflow-auto max-w-full">
          Error Digest: {error.digest}
        </div>
      )}
    </div>
  );
}