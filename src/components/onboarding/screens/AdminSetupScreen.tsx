import React, { useState, useEffect } from "react";
import { saveOnboardingStepData } from "../utils/onboardingStorage";
import { useCreateSuperAdminUser } from "@/graphql/hooks/useOnboarding";
import { markScreenCompleted } from "../utils/completedScreens";
import { humanizeError } from "@/utils/humanizeError";

interface AdminSetupScreenProps {
  onNext: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const AdminSetupScreen: React.FC<AdminSetupScreenProps> = ({
  onNext,
  onBack,
  isLoading,
}) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Get branchId for admin setup exclusively from localStorage
  const branchId = null;

  const organisationId =
    typeof window !== "undefined"
      ? localStorage.getItem("organisation_id") || ""
      : "";

  const {
    createSuperAdmin,
    loading,
    error: mutationError,
    success: mutationSuccess,
  } = useCreateSuperAdminUser();

  useEffect(() => {
    if (mutationSuccess) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onNext();
      }, 1200);
    }
  }, [mutationSuccess, onNext]);

  useEffect(() => {
    if (success) {
      markScreenCompleted("AdminSetup");
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // if (!branchId) {
    //   setError('Branch information is missing.');
    //   return;
    // }
    try {
      await createSuperAdmin({
        variables: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          branchId: branchId === "" ? null : branchId,
          organisationId: organisationId,
        },
      });
      // Save to localStorage for summary
      saveOnboardingStepData("AdminSetup", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });
    } catch (error: unknown) {
      let msg = "An error occurred";
      if (
        error &&
        typeof error === "object" &&
        "graphQLErrors" in error &&
        Array.isArray((error as any).graphQLErrors)
      ) {
        msg =
          (error as any).graphQLErrors[0]?.message ||
          (error as any).message ||
          "An error occurred";
      } else if (error instanceof Error) {
        msg = error.message;
      }
      setError(humanizeError(msg));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">
          Set Up Your Admin Account
        </h2>
        <p className="mb-6 text-gray-600">
          Create the first admin user for your organization. This user will have
          full access and can invite others later.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-1/2 border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-1/2 border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />
          {(error || mutationError) && (
            <div className="text-red-500 text-sm mt-2">
              {humanizeError(error || mutationError?.message)}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-sm mt-2">
              Super admin created successfully!
            </div>
          )}
          <div className="flex justify-between mt-6">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              disabled={isLoading || loading}
            >
              {isLoading || loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSetupScreen;
