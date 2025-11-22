import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { DamaGenie } from "@/components/ai/DamaGenie";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Navbar } from "@/components/ui-custom/Navbar";
import { Footer } from "@/components/ui-custom/Footer";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { NavbarSpacer } from "@/components/layout/NavbarSpacer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Dama Home Realty - Properties in Damascus',
    template: '%s | Dama Home Realty',
  },
  description: "Find your perfect home in Damascus. Rent, buy, or book properties in Syria's capital. Connecting Syrian expats with trusted homes in their homeland.",
  keywords: [
    'Damascus real estate',
    'Syria properties',
    'Damascus apartments',
    'Syrian expats',
    'Damascus homes',
    'real estate Syria',
    'property Damascus',
    'rent Damascus',
    'buy Damascus',
  ],
  authors: [{ name: 'Dama Home Realty' }],
  creator: 'Dama Home Realty',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icon-192x192.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Dama Home Realty',
    title: 'Dama Home Realty - Properties in Damascus',
    description: "Find your perfect home in Damascus. Rent, buy, or book properties in Syria's capital.",
    images: [
      {
        url: '/icon-192x192.png',
        width: 192,
        height: 192,
        alt: 'Dama Home Realty - Properties in Damascus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dama Home Realty - Properties in Damascus',
    description: "Find your perfect home in Damascus. Rent, buy, or book properties in Syria's capital.",
    images: ['/icon-192x192.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon-192x192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" sizes="180x180" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dama Home Realty" />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} font-sans antialiased bg-background dark:bg-[#020617] text-foreground dark:text-slate-200 transition-colors`}
      >
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen flex flex-col">
              {/* Scroll Progress Bar at Top */}
              <ScrollProgressBar />
              
              {/* Navbar */}
              <Navbar />
              
              {/* Smart Spacer - Only for non-home pages */}
              <NavbarSpacer />
              
              {/* Main Content - Add padding-top for all pages except Home */}
              <main className="flex-1 pt-0">
                {children}
              </main>
              
              {/* Footer */}
              <Footer />
            </div>
            <DamaGenie />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
