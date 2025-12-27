import type { Metadata } from "next";
import { Special_Elite } from "next/font/google"; 
import "./globals.css";

// Retro Daktilo Fontu
const retroFont = Special_Elite({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-retro" 
});

export const metadata: Metadata = {
  title: "Bizim Kaset",
  description: "Spotify Playlist Rating",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${retroFont.className} antialiased bg-[#f4f1ea] text-[#2c2c2c]`}>
        {children}
      </body>
    </html>
  );
}