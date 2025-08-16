import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpotifyProvider } from "@/lib/spotify/spotifyContext";
import { AuthProvider } from "@/contexts/AuthContextEnhanced";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { SubscriptionValidationProvider } from "@/components/subscription/SubscriptionValidationProvider";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

// Optimize font loading with display swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Church Management System",
  description: "A comprehensive, scalable solution designed to streamline church operations, enhance member engagement, and support ministry growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <ApolloWrapper>
          <AuthProvider>
            <SubscriptionValidationProvider>
              <SpotifyProvider>
                {children}
              </SpotifyProvider>
            </SubscriptionValidationProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
