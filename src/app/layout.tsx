import type { Metadata } from "next";

import { Header } from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "لمحة — Lamha Optics",
  description: "نظارات لمحة - المتجر الرسمي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        suppressHydrationWarning
        className="antialiased bg-white text-slate-900"
      >
        <div className="min-h-screen flex flex-col bg-white" dir="rtl">
          <Header />
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
