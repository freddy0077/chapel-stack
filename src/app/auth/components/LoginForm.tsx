"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
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
  autoComplete,
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
            bg-white/5 border ${error ? "border-red-400" : "border-white/10 focus:border-indigo-400"} 
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
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={onRightIconClick}
          >
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
  onSubmit: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  error: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
};

export default function LoginForm({
  onSubmit,
  error,
  successMessage,
  isSubmitting,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col lg:flex-row overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Left side - Brand & Features */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16 relative z-10"
      >
        <div className="max-w-xl">
          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 shadow-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  ChapelStack
                </h1>
                <p className="text-blue-300 text-sm">Church Management System</p>
              </div>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Manage Your Church
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                With Excellence
              </span>
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed">
              Streamline your church operations, engage your congregation, and
              grow your ministry with our comprehensive management platform.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            {[
              {
                icon: <SparklesIcon className="h-6 w-6" />,
                title: "Intuitive Dashboard",
                description: "Easy-to-use interface for all your needs",
              },
              {
                icon: <ShieldCheckIcon className="h-6 w-6" />,
                title: "Secure & Reliable",
                description: "Enterprise-grade security for your data",
              },
              {
                icon: <BoltIcon className="h-6 w-6" />,
                title: "Lightning Fast",
                description: "Optimized performance for efficiency",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="flex items-start space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2 text-white flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 flex items-center justify-center p-8 relative z-10"
      >
        <div className="w-full max-w-md">
          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl"
          >
            {/* Decorative gradient orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-blue-200 mb-8">
                  Sign in to access your dashboard
                </p>
              </motion.div>

              {/* Status messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-100 px-4 py-3 rounded-xl flex items-center"
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-300 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-100 px-4 py-3 rounded-xl flex items-center"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
                  <span className="text-sm">{successMessage}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <FloatingInput
                    id="email"
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<EnvelopeIcon className="h-5 w-5 text-blue-400" />}
                    error={formErrors.email}
                    autoComplete="email"
                  />
                </motion.div>

                {/* Password input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <FloatingInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockClosedIcon className="h-5 w-5 text-blue-400" />}
                    error={formErrors.password}
                    autoComplete="current-password"
                    rightIcon={
                      showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" />
                      )
                    }
                    onRightIconClick={() => setShowPassword((prev) => !prev)}
                  />
                </motion.div>

                {/* Remember me & Forgot password */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center text-blue-200 text-sm cursor-pointer group">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
                      checked={rememberMe}
                      onChange={() => setRememberMe((prev) => !prev)}
                    />
                    <span className="ml-2 group-hover:text-white transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-blue-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
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
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Sign In</span>
                        <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </button>
                </motion.div>
              </form>

              {/* Footer text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-blue-200 text-sm">
                  Protected by enterprise-grade security
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="mt-6 flex items-center justify-center space-x-6 text-blue-300/60 text-xs"
          >
            <div className="flex items-center">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              <span>Secure</span>
            </div>
            <div className="flex items-center">
              <BoltIcon className="h-4 w-4 mr-1" />
              <span>Fast</span>
            </div>
            <div className="flex items-center">
              <SparklesIcon className="h-4 w-4 mr-1" />
              <span>Reliable</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
