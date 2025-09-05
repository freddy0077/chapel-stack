"use client";

import { ReactNode } from "react";
import Image from "next/image";
import "./AuthStyles.css";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  logo?: string;
  withAnimation?: boolean;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  logo = "/images/logo.png",
  withAnimation = true,
}: AuthCardProps) {
  return (
    <div
      className={`auth-card p-8 sm:p-10 max-w-md w-full ${withAnimation ? "animate-fadeIn" : ""}`}
    >
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-circle">
            <Image
              src={logo}
              alt="Church Management System"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        </div>
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
