
import { FileText, CalendarCheck, Clock, RefreshCcw, AlertCircle } from "lucide-react";

const TERMS_SECTIONS = [
  {
    title: "1. شروط الحجز",
    desc: "يرجى العلم أن المواعيد المحجوزة عبر الموقع هي مواعيد مبدئية، ويتم اعتمادها نهائياً بعد تواصل الفرع معك لتأكيد التوافر.",
    icon: <CalendarCheck className="w-6 h-6 text-[#349998]" />,
  },
  {
    title: "2. سياسة الإلغاء",
    desc: "نقدّر وقتك ووقت أطبائنا؛ لذا يمكنك إلغاء الموعد أو إعادة جدولته بسهولة قبل 24 ساعة على الأقل من الوقت المحدد.",
    icon: <Clock className="w-6 h-6 text-[#349998]" />,
  },
  {
    title: "3. الاستبدال والاسترجاع",
    desc: "نضمن لك حق الاستبدال والاسترجاع وفقاً للأنظمة المعتمدة لدى وزارة التجارة السعودية لضمان رضاك التام عن منتجاتنا.",
    icon: <RefreshCcw className="w-6 h-6 text-[#349998]" />,
  },
  {
    title: "4. المسؤولية القانونية",
    desc: "باستخدامك لموقعنا، فإنك تقر بصحة البيانات المدخلة وتوافق على شروط الخدمة الموضحة أعلاه.",
    icon: <AlertCircle className="w-6 h-6 text-[#349998]" />,
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* الجزء العلوي (Hero Section) */}
      <section className="relative py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-[#349998]/10 rounded-2xl">
            <FileText className="w-8 h-8 text-[#349998]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            الشروط <span className="text-[#349998]">والأحكام</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            مرحباً بك في <span className="font-bold text-slate-900 text-lg">نظارات لمحة</span>. يرجى قراءة شروط الخدمة بعناية لضمان أفضل تجربة لك.
          </p>
        </div>
      </section>

      {/* عرض الشروط بشكل بطاقات Grid */}
      <main className="container mx-auto px-4 -mt-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TERMS_SECTIONS.map((term, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="mb-4 inline-block p-3 bg-slate-50 rounded-xl group-hover:bg-[#349998]/10 transition-colors">
                {term.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{term.title}</h2>
              <p className="text-slate-600 leading-loose text-justify">
                {term.desc}
              </p>
            </div>
          ))}
        </div>

        {/* رسالة ختامية للربط مع الـ Footer */}
        <div className="mt-16 text-center bg-[#349998]/5 rounded-4xl p-10 border border-[#349998]/10">
          <h4 className="text-lg font-bold text-slate-900 mb-2">هل لديك استفسار آخر؟</h4>
          <p className="text-slate-600 mb-6">نحن هنا لمساعدتك وتوضيح أي نقطة غير واضحة.</p>
          <button className="bg-[#349998] text-white px-8 py-3 rounded-full font-medium hover:bg-[#2a7a78] transition-all shadow-lg shadow-[#349998]/20 active:scale-95">
            تواصل معنا
          </button>
        </div>
      </main>
    </div>
  );
}