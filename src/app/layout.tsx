import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpotifyProvider } from "@/lib/spotify/spotifyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { SubscriptionValidationProvider } from "@/components/subscription/SubscriptionValidationProvider";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
