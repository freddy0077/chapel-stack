import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpotifyProvider } from "@/lib/spotify/spotifyContext";
import { AuthProvider } from "@/contexts/AuthContextEnhanced";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { SubscriptionValidationProvider } from "@/components/subscription/SubscriptionValidationProvider";
import { ServiceWorkerInit } from "@/components/ServiceWorkerInit";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Optimize font loading with display swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ChapelStack - Church Management System",
  description:
    "A comprehensive, scalable solution designed to streamline church operations, enhance member engagement, and support ministry growth.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ChapelStack",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ChapelStack",
    title: "ChapelStack - Church Management System",
    description: "Comprehensive church management platform for modern ministries",
  },
  twitter: {
    card: "summary",
    title: "ChapelStack - Church Management System",
    description: "Comprehensive church management platform for modern ministries",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="ChapelStack" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChapelStack" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003"}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <ServiceWorkerInit />
        <ApolloWrapper>
          <AuthProvider>
            <SubscriptionValidationProvider>
              <SpotifyProvider>{children}</SpotifyProvider>
            </SubscriptionValidationProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
