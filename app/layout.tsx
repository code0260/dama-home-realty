import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { DamaGenie } from "@/components/ai/DamaGenie";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Dama Home Realty',
    title: 'Dama Home Realty - Properties in Damascus',
    description: "Find your perfect home in Damascus. Rent, buy, or book properties in Syria's capital.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dama Home Realty - Properties in Damascus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dama Home Realty - Properties in Damascus',
    description: "Find your perfect home in Damascus. Rent, buy, or book properties in Syria's capital.",
    images: ['/og-image.jpg'],
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
        <meta name="theme-color" content="#0F172A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dama Realty" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} font-sans antialiased bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors`}
      >
        <ErrorBoundary>
          <Providers>
            {children}
            <DamaGenie />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
