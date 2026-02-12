"use client"; // Error boundaries must be client components

import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

// Types for Error Boundary props
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  
  // Log error to console (or external service like Sentry)
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      
      <div className="bg-orange-50 p-6 rounded-full mb-6">
        <AlertTriangle className="w-16 h-16 text-orange-500" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-4">حدث خطأ غير متوقع</h2>
      
      <p className="text-slate-500 max-w-md mb-8">
        نعتذر عن هذا الخطأ الفني. يرجى المحاولة مرة أخرى.
      </p>

      {/* Retry Action */}
      <button
        onClick={reset}
        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
      >
        <RefreshCw className="w-5 h-5" />
        إعادة المحاولة
      </button>
    </div>
  );
}