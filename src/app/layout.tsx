import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PANDA SDMK — Pangkalan Data SDM Kesehatan Kab. Kutai Kartanegara",
  description:
    "Dashboard pangkalan data sumber daya manusia kesehatan (SDMK) Kabupaten Kutai Kartanegara: distribusi tenaga kesehatan per jenis, kecamatan, dan fasilitas, dengan panel admin pengelolaan data.",
  keywords: ["PANDA SDMK", "SDMK", "Kutai Kartanegara", "Dinas Kesehatan", "tenaga kesehatan", "nakes"],
  authors: [{ name: "Dinas Kesehatan Kabupaten Kutai Kartanegara" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
