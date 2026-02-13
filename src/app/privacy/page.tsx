
import { ShieldCheck, Eye, Lock, Smartphone } from "lucide-react";

const SECTIONS = [
  {
    title: "جمع المعلومات",
    desc: "نجمع فقط البيانات الضرورية لتأكيد حجزك (الاسم ورقم الجوال) لضمان تقديم خدمة تليق بك في فروعنا.",
    icon: <Eye className="w-6 h-6 text-[#349998]" />,
  },
  {
    title: "حماية البيانات",
    desc: "تُخزن بياناتك في بيئة تقنية آمنة ومحمية، ولا يمكن الوصول إليها إلا من قبل الموظفين المختصين بتنظيم المواعيد.",
    icon: <Lock className="w-6 h-6 text-[#349998]" />,
  },
  {
    title: "مشاركة البيانات",
    desc: "نلتزم بخصوصيتك المطلقة؛ لذا لا نقوم ببيع أو مشاركة بياناتك مع أي جهات خارجية أو أطراف ثالثة نهائياً.",
    icon: <ShieldCheck className="w-6 h-6 text-[#349998]" />,
  },
  {
    title: "التوافق والأمان",
    desc: "نظامنا متوافق مع كافة الأجهزة الذكية لضمان تجربة حجز آمنة وسلسة من أي مكان وفي أي وقت.",
    icon: <Smartphone className="w-6 h-6 text-[#349998]" />,
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* القسم العلوي (Hero Section) */}
      <section className="relative py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-[#349998]/10 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-[#349998]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            خصوصيتك هي <span className="text-[#349998]">أولويتنا</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            في نظارات لمحة، نؤمن بأن الثقة تبدأ من حماية الخصوصية. إليك كيف نهتم ببياناتك.
          </p>
        </div>
      </section>

      {/* قسم المحتوى (Grid Layout) */}
      <main className="container mx-auto px-4 -mt-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="mb-4 inline-block p-3 bg-slate-50 rounded-xl group-hover:bg-[#349998]/10 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-loose">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* رسالة ختامية للربط مع الـ Footer */}
        <div className="mt-16 text-center bg-[#349998]/5 rounded-4xl p-10 border border-[#349998]/10">
          <h4 className="text-lg font-bold text-slate-900 mb-2">هل لديك استفسار آخر؟</h4>
          <p className="text-slate-600 mb-6">فريقنا جاهز للإجابة على جميع تساؤلاتك حول الأمان والخصوصية.</p>
          <button className="bg-[#349998] text-white px-8 py-3 rounded-full font-medium hover:bg-[#2a7a78] transition-all shadow-lg shadow-[#349998]/20 active:scale-95">
            تواصل معنا
          </button>
        </div>
      </main>
    </div>
  );
}