import type { Metadata } from "next";
import { Outfit } from "next/font/google"; 
import "./globals.css";

const modernFont = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"] 
});

export const metadata: Metadata = {
  title: "Bizim Kaset",
  description: "Birlikte Müzik Puanlama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* DEĞİŞİKLİK: bg-[#09090b] ve text-white SİLİNDİ. Rengi globals.css verecek. */}
      <body className={`${modernFont.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}