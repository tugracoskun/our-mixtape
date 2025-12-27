import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Modern, geometrik font
import "./globals.css";

const modernFont = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"] 
});

export const metadata: Metadata = {
  title: "Bizim Kaset | Duo Session",
  description: "Birlikte Müzik Puanlama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${modernFont.className} antialiased bg-[#09090b] text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}