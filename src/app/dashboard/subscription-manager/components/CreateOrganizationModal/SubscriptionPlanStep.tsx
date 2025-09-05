import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { StepProps } from "./types";

interface SubscriptionPlanStepProps extends StepProps {
  subscriptionPlans: any[];
  subscriptionPlansLoading: boolean;
  subscriptionPlansError: any;
}

export const SubscriptionPlanStep: React.FC<SubscriptionPlanStepProps> = ({
  organizationData,
  errors,
  updateField,
  subscriptionPlans,
  subscriptionPlansLoading,
  subscriptionPlansError,
}) => {
  return (
    <div className="space-y-4">
      {subscriptionPlansLoading && (
        <div className="text-center py-4">
          Loading subscription plans...
        </div>
      )}

      {subscriptionPlansError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            Error loading subscription plans. Please try again.
          </p>
        </div>
      )}

      {!subscriptionPlansLoading && !subscriptionPlansError && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Subscription Plan *
          </label>
          <div className="grid gap-4">
            {subscriptionPlans.map((plan: any) => (
              <Card
                key={plan.id}
                className={cn(
                  "cursor-pointer transition-all",
                  organizationData.planId === plan.id
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:border-gray-300",
                )}
                onClick={() => updateField("planId", plan.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {plan.name}
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {plan.currency} {plan.amount}
                        <span className="text-sm font-normal text-gray-500">
                          /{organizationData.billingCycle.toLowerCase()}
                        </span>
                      </p>
                      {plan.features && (
                        <ul className="mt-2 space-y-1">
                          {plan.features.map(
                            (feature: string, index: number) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 flex items-center"
                              >
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>
                    {organizationData.planId === plan.id && (
                      <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.planId && (
            <p className="text-red-500 text-sm mt-1">{errors.planId}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Billing Cycle
        </label>
        <Select
          value={organizationData.billingCycle}
          onValueChange={(value: "MONTHLY" | "YEARLY") =>
            updateField("billingCycle", value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="YEARLY">Yearly (Save 20%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <Input
          type="date"
          value={organizationData.startDate}
          onChange={(e) => updateField("startDate", e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
    </div>
  );
};
