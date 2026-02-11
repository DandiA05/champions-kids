import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ScriptInit } from "@/components/script-init";
import { LayoutContent } from "@/components/layout-content";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PGSports - Sports Next.js Migration",
  description: "Migrated from HTML Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/fontawesome/all.min.css" />
        <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/animate/animate.min.css" />
        <link rel="stylesheet" href="/css/swiper/swiper.min.css" />
        <link rel="stylesheet" href="/css/owl-carousel/owl.carousel.min.css" />
        <link rel="stylesheet" href="/css/magnific-popup/magnific-popup.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScriptInit />
        <LayoutContent>{children}</LayoutContent>

        <Script src="/js/jquery-3.7.1.min.js" strategy="beforeInteractive" />
        <Script src="/js/jquery.appear.js" strategy="afterInteractive" />
        <Script src="/js/popper/popper.min.js" strategy="afterInteractive" />
        <Script
          src="/js/bootstrap/bootstrap.min.js"
          strategy="afterInteractive"
        />
        <Script src="/js/swiper/swiper.min.js" strategy="afterInteractive" />
        <Script
          src="/js/swiperanimation/SwiperAnimation.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/js/counter/jquery.countTo.js"
          strategy="afterInteractive"
        />
        <Script
          src="/js/countdown/jquery.downCount.js"
          strategy="afterInteractive"
        />
        <Script
          src="/js/owl-carousel/owl.carousel.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/js/magnific-popup/jquery.magnific-popup.min.js"
          strategy="afterInteractive"
        />
        <Script src="/js/shuffle/shuffle.min.js" strategy="afterInteractive" />
        <Script src="/js/select2/select2.full.js" strategy="afterInteractive" />
        <Script src="/js/custom.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
