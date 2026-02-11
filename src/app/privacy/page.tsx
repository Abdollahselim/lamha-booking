export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-[#349998] mb-6">سياسة الخصوصية</h1>
      <div className="prose prose-lg max-w-none text-slate-700">
        <p>نحن في نظارات لمحة نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
        <h3>1. جمع البيانات</h3>
        <p>نقوم بجمع اسمك ورقم هاتفك لغرض تأكيد الحجز فقط.</p>
        <h3>2. مشاركة البيانات</h3>
        <p>لا نقوم بمشاركة بياناتك مع أي طرف ثالث.</p>
        {/* صاحب الموقع يكتب التفاصيل القانونية هنا */}
      </div>
    </div>
  );
}