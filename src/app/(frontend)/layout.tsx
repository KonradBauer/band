import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header-wrapper";
import SiteFooter from "@/components/site-footer";
import "./globals.css";
import React from 'react'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'ARMAGEDON - Zespół muzyczny na wesele',
    template: '%s | ARMAGEDON',
  },
  description:
    'Zespół weselny ARMAGEDON - profesjonalna oprawa muzyczna wesel i imprez okolicznościowych. Skecze, zabawy, instrumentarium na żywo.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://armagedon.com.pl'),
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'ARMAGEDON',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="dark">
    <body className={`${inter.variable} ${playfair.variable} antialiased`}>
    <SiteHeader />
    <main className="pt-16 min-h-screen">{children}</main>
    <SiteFooter />
    </body>
    </html>
  );
}
