"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ModernOnboardingFlow from "@/components/onboarding/ModernOnboardingFlow";
import {
  saveModulePreferences,
  loadModulePreferences,
  ChurchProfile,
} from "@/components/onboarding/ModulePreferences";
import { useAuth } from "@/contexts/AuthContextEnhanced"; // Updated to use new auth context
import { setCookie } from "cookies-next";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, authLoading, isAuthenticated } = useAuth();
  const [shouldSkip, setShouldSkip] = useState(false);
  const [isCheckingPrefs, setIsCheckingPrefs] = useState(true); // Renamed isLoading for clarity

  // Check if onboarding has already been completed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { isOnboardingCompleted } = loadModulePreferences();
      if (isOnboardingCompleted) {
        setShouldSkip(true);
      }
      setIsCheckingPrefs(false); // Update renamed state
    }
  }, []);

  // Handle onboarding completion with selected modules and church profile
  const handleOnboardingComplete = (
    selectedModules: string[],
    churchProfile: ChurchProfile,
  ) => {
    saveModulePreferences(selectedModules, churchProfile);
    setCookie("onboardingDeferred", "true", { path: "/" });
    router.push("/dashboard");
  };

  // If onboarding should be skipped, redirect to dashboard
  useEffect(() => {
    if (shouldSkip && !isCheckingPrefs && !authLoading) {
      // Check authLoading as well
      router.replace("/dashboard");
    }
  }, [shouldSkip, isCheckingPrefs, authLoading, router]);

  // Redirect to login if not authenticated and auth is loaded
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/onboarding");
    }
  }, [authLoading, isAuthenticated, router]);

  // Only allow onboarding for ADMIN
  const isAdmin =
    user && typeof user === "object" && user.roles && Array.isArray(user.roles)
      ? user.roles.some((role: unknown) => {
          if (typeof role === "string")
            return (
              role.toLowerCase() === "admin" ||
              role.toLowerCase() === "superadmin"
            );
          if (
            role &&
            typeof role === "object" &&
            "name" in role &&
            typeof role.name === "string"
          )
            return (
              role.name.toLowerCase() === "admin" ||
              role.name.toLowerCase() === "superadmin"
            );
          return false;
        })
      : false;

  if (!isAdmin && !authLoading && isAuthenticated) {
    if (typeof window !== "undefined") router.replace("/dashboard");
    return null;
  }

  // Show loading state while checking onboarding status or auth state
  if (isCheckingPrefs || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-indigo-200 animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
          <p className="mt-2 text-gray-600">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  // Render the onboarding flow directly for ADMIN
  if (isAdmin) {
    // Determine the branchId from accessibleBranches
    const branchId =
      user?.userBranches &&
      user.userBranches.length > 0 &&
      user.userBranches[0].branch
        ? (user.userBranches[0].branch.id ?? null)
        : null;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <ModernOnboardingFlow
          branchId={branchId}
          onComplete={handleOnboardingComplete}
        />
      </div>
    );
  }

  // Fallback (should not be reached)
  return null;
}
