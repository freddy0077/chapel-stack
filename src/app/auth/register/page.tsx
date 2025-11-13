"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useCheckEmailForMember } from "@/graphql/hooks/useRegisterUser";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  CheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import AuthButton from "../components/AuthButton";
import "../components/AuthStyles.css";

interface Branch {
  id: string;
  name: string;
  address: string;
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organisationId, setOrganisationId] = useState("org_default");

  const { register, error, isLoading } = useAuth();
  
  // Check if email exists in members database
  const { memberInfo, loading: checkingMember } = useCheckEmailForMember(
    email,
    organisationId
  );

  // Fetch branches (in a real app, this would be an API call)
  useEffect(() => {
    // Mock branches data
    const mockBranches: Branch[] = [
      {
        id: "branch_001",
        name: "St. Mary's Cathedral",
        address: "123 Main St, New York, NY",
      },
      {
        id: "branch_002",
        name: "St. Joseph's Parish",
        address: "456 Church Ave, Brooklyn, NY",
      },
      {
        id: "branch_003",
        name: "Holy Trinity Church",
        address: "789 Faith Rd, Queens, NY",
      },
    ];

    setBranches(mockBranches);
  }, []);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;

    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;

    // Number check
    if (/[0-9]/.test(password)) strength += 1;

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 3) {
      errors.password = "Password is too weak";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!selectedBranchId) errors.branch = "Please select your church branch";
    if (!agreeTerms)
      errors.terms = "You must agree to the terms and privacy policy";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        branchId: selectedBranchId,
        organisationId,
      });
      // If successful, register will redirect to dashboard
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <AuthCard
        title="Create your account"
        subtitle="Join your church community online"
      >
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Error message from context */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Name fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="First Name"
              name="first-name"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
              error={formErrors.firstName}
              required
            />

            <FormInput
              label="Last Name"
              name="last-name"
              type="text"
              autoComplete="family-name"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
              error={formErrors.lastName}
              required
            />
          </div>

          {/* Email field */}
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
            error={formErrors.email}
            required
          />

          {/* Member Linking Info */}
          {memberInfo && memberInfo.isMember && (
            <div
              className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
                memberInfo.canLink
                  ? "bg-blue-50 border-blue-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <SparklesIcon
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  memberInfo.canLink ? "text-blue-600" : "text-amber-600"
                }`}
              />
              <div>
                <p
                  className={`font-semibold ${
                    memberInfo.canLink ? "text-blue-900" : "text-amber-900"
                  }`}
                >
                  {memberInfo.memberInfo?.firstName}{" "}
                  {memberInfo.memberInfo?.lastName}
                </p>
                <p
                  className={`text-sm ${
                    memberInfo.canLink ? "text-blue-700" : "text-amber-700"
                  }`}
                >
                  {memberInfo.message}
                </p>
              </div>
            </div>
          )}

          {/* Password field with strength indicator */}
          <div>
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              rightIcon={
                showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={formErrors.password}
              required
            />

            {/* Password strength indicator */}
            {password && (
              <div className="mt-2 px-1">
                <div className="flex items-center mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength <= 1 ? "bg-red-500" : passwordStrength <= 3 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span
                    className={`ml-2 text-xs font-medium ${passwordStrength <= 1 ? "text-red-600" : passwordStrength <= 3 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {passwordStrength <= 1
                      ? "Weak"
                      : passwordStrength <= 3
                        ? "Medium"
                        : "Strong"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <div
                    className={`text-xs font-medium flex items-center ${password.length >= 8 ? "text-green-600" : "text-gray-400"}`}
                  >
                    {password.length >= 8 ? (
                      <CheckIcon className="h-3 w-3 mr-1" />
                    ) : (
                      ""
                    )}
                    <span>8+ Characters</span>
                  </div>
                  <div
                    className={`text-xs font-medium flex items-center ${/[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[A-Z]/.test(password) ? (
                      <CheckIcon className="h-3 w-3 mr-1" />
                    ) : (
                      ""
                    )}
                    <span>Uppercase</span>
                  </div>
                  <div
                    className={`text-xs font-medium flex items-center ${/[a-z]/.test(password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[a-z]/.test(password) ? (
                      <CheckIcon className="h-3 w-3 mr-1" />
                    ) : (
                      ""
                    )}
                    <span>Lowercase</span>
                  </div>
                  <div
                    className={`text-xs font-medium flex items-center ${/[0-9]/.test(password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[0-9]/.test(password) ? (
                      <CheckIcon className="h-3 w-3 mr-1" />
                    ) : (
                      ""
                    )}
                    <span>Number</span>
                  </div>
                  <div
                    className={`text-xs font-medium flex items-center ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[^A-Za-z0-9]/.test(password) ? (
                      <CheckIcon className="h-3 w-3 mr-1" />
                    ) : (
                      ""
                    )}
                    <span>Special</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password field */}
          <FormInput
            label="Confirm Password"
            name="confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            error={formErrors.confirmPassword}
            required
          />

          {/* Branch Selection */}
          <div className="form-group">
            <label htmlFor="branch" className="form-label">
              Select your church branch
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="branch"
                name="branch"
                required
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className={`form-input pl-10 ${formErrors.branch ? "error" : ""}`}
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.address}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.branch && (
              <p className="error-message">{formErrors.branch}</p>
            )}
          </div>

          {/* Terms and Privacy Policy */}
          <div className="checkbox-container mt-2">
            <div className="flex items-start gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className={`checkbox mt-1 ${formErrors.terms ? "border-red-300" : ""}`}
              />
              <div>
                <label
                  htmlFor="terms"
                  className={`${formErrors.terms ? "text-red-600" : "text-gray-700"}`}
                >
                  I agree to the{" "}
                  <Link href="/terms" className="auth-link">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="auth-link">
                    Privacy Policy
                  </Link>
                </label>
                {formErrors.terms && (
                  <p className="error-message">{formErrors.terms}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-2">
            <AuthButton type="submit" isLoading={isSubmitting || isLoading}>
              Create Account
            </AuthButton>
          </div>
        </form>

        {/* Login link */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link href="/auth/login" className="auth-link">
              Sign in instead
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
}
