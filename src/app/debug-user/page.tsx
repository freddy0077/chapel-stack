"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugUserPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-8">Not authenticated</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>User Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Raw User Object:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold">Key Properties:</h3>
              <ul className="space-y-2">
                <li>
                  <strong>ID:</strong> {user?.id}
                </li>
                <li>
                  <strong>Email:</strong> {user?.email}
                </li>
                <li>
                  <strong>Primary Role:</strong> {user?.primaryRole}
                </li>
                <li>
                  <strong>Organisation ID:</strong> {user?.organisationId}
                </li>
                <li>
                  <strong>Roles Array:</strong> {JSON.stringify(user?.roles)}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Role Checks:</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Is ADMIN:</strong>{" "}
                  {user?.primaryRole === "ADMIN" ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Is SUBSCRIPTION_MANAGER:</strong>{" "}
                  {user?.primaryRole === "SUBSCRIPTION_MANAGER" ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Allowed Roles Check:</strong>{" "}
                  {["ADMIN", "SUBSCRIPTION_MANAGER"].includes(
                    user?.primaryRole || "",
                  )
                    ? "Pass"
                    : "Fail"}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
