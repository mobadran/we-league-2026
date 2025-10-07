import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'دوري المدرسة - WE',
  description: 'أخبار مباريات الكرة في مدرسة WE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/" className="text-xl font-extrabold text-[var(--color-primary,#1E3A8A)]">
              دوري WE 2026
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link className="text-[var(--color-primary,#1E3A8A)] hover:text-blue-800" href="/matches">
                كل المباريات
              </Link>
              <Link className="text-[var(--color-primary,#1E3A8A)] hover:text-blue-800" href="/teams">
                كل الفرق
              </Link>
              <Link className="text-[var(--color-primary,#1E3A8A)] hover:text-blue-800" href="/players">
                كل اللاعبين
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50 text-gray-900">{children}</main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm opacity-70">
          © 2026 دوري المدرسة - جميع الحقوق محفوظة
        </footer>
      </body>
    </html>
  );
}
