
import { Loader2 } from "lucide-react";

/**
 * @file loading.tsx
 * @description Elegant and minimalist global loading spinner.
 */

export default function Loading() {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="flex flex-col items-center">
        
        {/* Spinner Container */}
        <div className="relative flex items-center justify-center mb-6">
          {/* دائرة خلفية ثابتة خفيفة */}
          <div className="absolute w-16 h-16 border-4 border-slate-100 rounded-full"></div>
          
          {/* Spinner المتحرك بلون البراند */}
          <Loader2 className="w-16 h-16 text-[#349998] animate-spin stroke-[1.5px] relative z-10" />
        </div>

        {/* نص التحميل بهدوء */}
        <div className="space-y-1 text-center">
          <p className="text-lg font-bold text-slate-800 tracking-wide animate-pulse">
            لحظات من فضلك
          </p>
          <p className="text-sm text-slate-400">
            جاري تحضير تجربة بصرية مميزة...
          </p>
        </div>

      </div>
    </div>
  );
}