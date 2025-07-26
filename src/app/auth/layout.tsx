"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContextEnhanced";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </AuthProvider>
  );
}
