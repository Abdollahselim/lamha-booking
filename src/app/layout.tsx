import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// =========================================================
// 🌍 METADATA CONFIGURATION (SEO)
// =========================================================
export const metadata: Metadata = {
  title: "حجز موعد | نظارات لمحة",
  description: "احجز موعد فحص النظر مجاناً في فروع نظارات لمحة - المتجر الرسمي.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      {/* suppressHydrationWarning:
        يمنع ظهور أخطاء الـ Hydration الناتجة عن إضافات المتصفح
        التي تعدل في الـ body مثل ColorZilla أو Grammarly
      */}
      <body 
        className="antialiased bg-slate-50 text-slate-900"
        suppressHydrationWarning={true} 
      >
        
        {/* Sticky Footer Layout Wrapper */}
        <div className="min-h-screen flex flex-col">
          
          {/* 1. Header */}
          <Header />
          
          {/* 2. Toast Notifications */}
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              style: {
                fontFamily: 'inherit',
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }}
          />

          {/* 3. Main Content */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
            {children}
          </main>

          {/* 4. Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}