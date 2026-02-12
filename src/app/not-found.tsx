import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

// Custom 404 Page Component
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      
      {/* Icon & Error Code */}
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">الصفحة غير موجودة</h2>
      
      <p className="text-slate-500 max-w-md mb-8">
        عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
      </p>

      {/* Back to Home Action */}
      <Link 
        href="/"
        className="flex items-center gap-2 bg-[#349998] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2c8180] transition-all shadow-lg active:scale-95"
      >
        <Home className="w-5 h-5" />
        العودة للرئيسية
      </Link>
    </div>
  );
}