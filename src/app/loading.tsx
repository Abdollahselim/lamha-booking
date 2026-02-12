import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#349998] animate-spin" />
        <p className="text-slate-600 font-bold animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}