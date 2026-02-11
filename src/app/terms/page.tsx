// src/app/terms/page.tsx

export default function TermsPage() {
  return (
    <div className="container mx-auto px-40 py-10 text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-[#349998] mb-6">الشروط والأحكام</h1>
      <div className="prose prose-lg max-w-none text-slate-700 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="mb-4">مرحباً بكم في نظارات لمحة. باستخدامك لهذا الموقع، فإنك توافق على الشروط التالية:</p>
        
        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. شروط الحجز</h3>
        <p className="mb-4">يرجى العلم أن المواعيد المحجوزة هي مواعيد مبدئية وتخضع للتأكيد النهائي من قبل الفرع.</p>
        
        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. سياسة الإلغاء</h3>
        <p className="mb-4">يمكنك إلغاء الموعد أو إعادة جدولته قبل 24 ساعة من موعده المحدد.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. الاستبدال والاسترجاع</h3>
        <p className="mb-4">تخضع جميع المنتجات لسياسة الاستبدال والاسترجاع المعتمدة لدى وزارة التجارة.</p>
      </div>
    </div>
  );
}