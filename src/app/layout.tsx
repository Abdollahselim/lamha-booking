import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google"; // 1. Using the correct Next.js font loader
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// =========================================================
// 🎨 FONT CONFIGURATION (IBM Plex Sans Arabic)
// =========================================================
// This optimizes the font loading and prevents layout shift
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ 
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-ibm", // CSS variable for Tailwind
  display: "swap",
});

// =========================================================
// 🌍 METADATA CONFIGURATION (SEO & SOCIAL)
// =========================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://lamha-booking.vercel.app"),
  title: "حجز موعد | نظارات لمحة",
  description: "احجز موعد فحص النظر مجاناً في فروع نظارات لمحة - المتجر الرسمي.",
  
  // ✅ Icons Configuration
  icons: {
    icon: "/images/icon.jpeg",
    shortcut: "/images/icon.jpeg",
    apple: "/images/icon.jpeg",
  },

  // ✅ Open Graph (WhatsApp, Facebook, etc.)
  openGraph: {
    title: "حجز موعد | نظارات لمحة",
    description: "احجز موعد فحص النظر مجاناً بأسهل الخطوات.",
    siteName: "نظارات لمحة",
    images: [
      {
        url: "/images/icon.jpeg",
        width: 800,
        height: 800,
        alt: "Lamha Optics Logo",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
};

// =========================================================
// 📱 VIEWPORT SETTINGS
// =========================================================
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

// =========================================================
// 🚀 ROOT LAYOUT COMPONENT
// =========================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      {/* suppressHydrationWarning: Prevents errors from browser extensions */}
      <body 
        className={`${ibmPlexSansArabic.className} antialiased bg-[#F9FAFB] text-[#171717] min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        
        {/* 1. Header */}
        <Header />

        {/* 2. Toast Notifications (Styled for your theme) */}
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'inherit',
              borderRadius: '8px',
              background: '#1e293b', 
              color: '#fff',
              fontSize: '14px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        {/* 3. Main Content Wrapper */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* 4. Footer */}
        <Footer />
        
      </body>
    </html>
  );
}