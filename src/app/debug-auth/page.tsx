"use client";

import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useEffect } from "react";

export default function DebugAuthPage() {
  const { state } = useAuth();
  const user = state.user;

  useEffect(() => {
    // Check userBranches structure
    if (user?.userBranches && user.userBranches.length > 0) {
    }

    // Check localStorage directly
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("chapel_user_data");

      if (storedUserData) {
        try {
          const parsedUser = JSON.parse(storedUserData);

          // Check userBranches in localStorage
          if (parsedUser.userBranches && parsedUser.userBranches.length > 0) {
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      // Check all localStorage keys related to chapel
      const allKeys = Object.keys(localStorage);
      const chapelKeys = allKeys.filter((key) => key.includes("chapel"));

      chapelKeys.forEach((key) => {});
    }
  }, [state, user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Auth State</h2>
          <p>
            <strong>Is Authenticated:</strong>{" "}
            {state.isAuthenticated ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is Loading:</strong> {state.isLoading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is Hydrated:</strong> {state.isHydrated ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has User:</strong> {user ? "Yes" : "No"}
          </p>
        </div>

        {user && (
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="font-semibold">User Data</h2>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Organisation ID:</strong>{" "}
              {user.organisationId || "MISSING/NULL"}
            </p>
            <p>
              <strong>Primary Role:</strong> {user.primaryRole}
            </p>
            <p>
              <strong>Roles:</strong> {user.roles?.join(", ")}
            </p>
            <p>
              <strong>User Branches:</strong> {user.userBranches?.length || 0}
            </p>
          </div>
        )}

        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="font-semibold">Raw Data (Check Console)</h2>
          <p>
            Check the browser console for detailed logging of the auth state and
            localStorage data.
          </p>
        </div>
      </div>
    </div>
  );
}
