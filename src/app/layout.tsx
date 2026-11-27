import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Signal — UXR Problem Discovery",
  description:
    "Signal — Product Ops & UX Research Problem Discovery Workspace dengan arsitektur Local-First dan Low-AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className="bg-[#FFF7F5] text-[#2D213A] antialiased selection:bg-[#FF7B7B]/20 selection:text-[#2D213A]">
        {children}
      </body>
    </html>
  );
}
