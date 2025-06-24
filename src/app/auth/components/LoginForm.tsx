"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import SocialButtons from "./SocialButtons";
import "../components/AuthStyles.css";

// Input component with floating label and animation
const FloatingInput = ({ 
  id, 
  type, 
  label, 
  value, 
  onChange, 
  icon, 
  error,
  rightIcon,
  onRightIconClick,
  autoComplete
}: { 
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  autoComplete?: string;
}) => {
  return (
    <div className="relative mb-6">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          className={`
            block w-full px-10 py-3.5 
            bg-white/5 border ${error ? 'border-red-400' : 'border-white/10 focus:border-indigo-400'} 
            rounded-xl outline-none transition-all duration-200
            text-white placeholder-transparent
            focus:ring-2 focus:ring-indigo-500/30
            peer
          `}
          placeholder={label}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        {rightIcon && onRightIconClick && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={onRightIconClick}>
            {rightIcon}
          </div>
        )}
        <label
          htmlFor={id}
          className={`
            absolute left-10 top-3.5 text-indigo-300 
            transition-all duration-200 
            peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-indigo-300/70 
            peer-focus:text-xs peer-focus:-top-3 peer-focus:text-indigo-400 
            text-xs -top-3 pointer-events-none
          `}
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

type LoginFormProps = {
  onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  error: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
};

export default function LoginForm({ onSubmit, error, successMessage, isSubmitting }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = (): boolean => {
    const errors: {email?: string; password?: string} = {};
    
    // Email validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Illustration/Brand */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="max-w-md relative z-10">
          {/* Church logo */}
          <div className="mb-8 flex items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="ml-4 text-2xl font-bold text-white">Divine<span className="text-indigo-300">System</span></h1>
          </div>
          {/* Hero text */}
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Elevate Your Church Management Experience
          </h2>
          <p className="text-indigo-200 mb-8">
            Sign in to access your dashboard and manage your church activities with ease.
          </p>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
          
          {/* Login Card */}
          <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-indigo-200 mb-8">Sign in to continue to your account</p>
            
            {/* Status messages */}
            {error && (
              <div className="mb-6 bg-red-900/30 backdrop-blur-md border border-red-500/30 text-red-200 px-4 py-3 rounded-xl flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 bg-green-900/30 backdrop-blur-md border border-green-500/30 text-green-200 px-4 py-3 rounded-xl flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <FloatingInput
                id="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<EnvelopeIcon className="h-5 w-5 text-indigo-400" />}
                error={formErrors.email}
                autoComplete="email"
              />
              
              {/* Password input */}
              <FloatingInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<LockClosedIcon className="h-5 w-5 text-indigo-400" />}
                error={formErrors.password}
                autoComplete="current-password"
                rightIcon={showPassword ? <EyeSlashIcon className="h-5 w-5 text-indigo-400 cursor-pointer" /> : <EyeIcon className="h-5 w-5 text-indigo-400 cursor-pointer" />}
                onRightIconClick={() => setShowPassword((prev) => !prev)}
              />
              
              {/* Remember me checkbox and forgot password link */}
              <div className="flex items-center justify-between mt-6 mb-8">
                <label className="flex items-center text-indigo-200 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-500 rounded mr-2"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className="text-indigo-300 hover:text-white text-sm font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Signing in...</span>
                ) : (
                  <div className="flex items-center">
                    <span>Sign in</span>
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="mx-4 text-sm text-indigo-300">Or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            
            {/* Social login */}
            <SocialButtons />
            
            {/* Registration link */}
            <div className="mt-6 text-center">
              <p className="text-indigo-200">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-indigo-300 hover:text-white font-medium transition-colors">
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
