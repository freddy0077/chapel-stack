import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepProps } from "./types";

interface ReviewStepProps extends StepProps {
  subscriptionPlans: any[];
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  organizationData,
  errors,
  subscriptionPlans,
}) => {
  const selectedPlan = subscriptionPlans.find(
    (p: any) => p.id === organizationData.planId,
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Review Organization Details
        </h3>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Name:</strong> {organizationData.name}
              </div>
              <div>
                <strong>Email:</strong> {organizationData.email}
              </div>
              {organizationData.phoneNumber && (
                <div>
                  <strong>Phone:</strong> {organizationData.phoneNumber}
                </div>
              )}
              {organizationData.website && (
                <div>
                  <strong>Website:</strong> {organizationData.website}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{organizationData.address}</div>
              <div>
                {organizationData.city}, {organizationData.state}
              </div>
              <div>
                {organizationData.country} {organizationData.zipCode}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Administrator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Name:</strong> {organizationData.adminFirstName}{" "}
                {organizationData.adminLastName}
              </div>
              <div>
                <strong>Email:</strong> {organizationData.adminEmail}
              </div>
              {organizationData.adminPhone && (
                <div>
                  <strong>Phone:</strong> {organizationData.adminPhone}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <strong>Plan:</strong> {selectedPlan.name}
                </div>
                <div>
                  <strong>Price:</strong> {selectedPlan.currency}{" "}
                  {selectedPlan.amount}/
                  {organizationData.billingCycle.toLowerCase()}
                </div>
                <div>
                  <strong>Start Date:</strong>{" "}
                  {new Date(
                    organizationData.startDate,
                  ).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}
    </div>
  );
};
