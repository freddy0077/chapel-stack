"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import "./AuthStyles.css";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export default function AuthButton({
  children,
  variant = "primary",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className,
  ...props
}: AuthButtonProps) {
  return (
    <button
      className={`
        auth-button
        ${variant === "primary" ? "auth-button-primary" : ""}
        ${variant === "secondary" ? "bg-gray-100 text-gray-800 border border-gray-300" : ""}
        ${variant === "outline" ? "bg-transparent border border-gray-300 text-gray-800" : ""}
        ${fullWidth ? "w-full" : ""}
        ${className || ""}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
