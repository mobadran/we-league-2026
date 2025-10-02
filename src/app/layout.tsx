import "./globals.css";
import React from "react";

export const metadata = {
  title: "دوري المدرسة - WE",
  description: "أخبار مباريات الكرة في مدرسة WE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main className="min-h-screen bg-gray-50 text-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
