'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    'نظارات شمسية',
    'عدسات لاصقة',
    'المدونة',
    'تخفيضات',
    'عدسات لاصقة',
    'نظارات شمسية',
  ];

  return (
    <>
      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? 'py-1 shadow-sm' : 'py-4'
        }`}
      >
        <div className="container mx-auto px-5 max-w-screen-2x2">
          <div className="flex items-center justify-between gap-4">
            
            {/* Hamburger Menu */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="القائمة"
            >
              <Menu size={26} className="text-gray-950" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="https://lamhaoptics.com">
              <Image
                src="/images/logo.png"
                alt="Lamha Optics"
                width={170}
                height={150}
                priority={true}
                className="object-contain"
              />
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Bar (Desktop) */}
              <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-[900px] transition-colors focus-within:border-gray-400 group">
                <Search size={16} className="text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                <input
                  type="text"
                  placeholder="ادخل كلمة البحث"
                  className="flex-1 bg-transparent text-[15px] outline-none text-gray-700 placeholder:text-gray-400 text-right pr-2"
                />
              </div>

              {/* Search Icon (Mobile) */}
              <button 
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="بحث"
              >
                <Search size={20} className="text-gray-400" />
              </button>

              {/* User Account Link */}
            <Link 
              href="https://lamhaoptics.com/login"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="حسابي"
            >
              <User size={24} className="text-[#3A5B63]" strokeWidth={1.5} />
            </Link>

            {/* Shopping Bag Link */}
            <Link 
              href="https://lamhaoptics.com/cart"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative block"
              aria-label="السلة"
            >
              <ShoppingBag size={24} className="text-[#3A5B63]" strokeWidth={1.5} />
              <span 
                className="absolute top-0 right-0 bg-[#FD6F6D] text-white text-xs w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold border-2 border-white"
                style={{ fontSize: '10px' }}
              >
                0
              </span>
            </Link>
            </div>

          </div>
        </div>
      </header>


      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-999"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <aside className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-1000 animate-slide-in">
            {/* Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="إغلاق"
            >
              <X size={24} className="text-gray-700" />
            </button>

            {/* Navigation */}
            <nav className="mt-16 px-6">
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <a
                      href="https://lamhaoptics.com/%D9%86%D8%B8%D8%A7%D8%B1%D8%A7%D8%AA-%D8%B4%D9%85%D8%B3%D9%8A%D8%A9/c1394165064"
                      onClick={() => setIsSidebarOpen(false)}
                      className="block py-3 text-gray-800 font-medium border-b border-gray-100 hover:text-[#5DABB8] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
