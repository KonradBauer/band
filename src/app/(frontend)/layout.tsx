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
  title: "ARMAGEDON - Zespół muzyczny na wesele",
  description:
    "Zespół weselny ARMAGEDON - profesjonalna oprawa muzyczna wesel i imprez okolicznościowych. Skecze, zabawy, instrumentarium na żywo.",
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
