"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_SUBSCRIPTION_PLANS } from "@/graphql/subscription-management";
import { useCreateOrganizationSubscription } from "@/hooks/subscription/useOrganizationSubscription";
import type { SubscriptionValidationResult } from "@/hooks/subscription/useSubscriptionValidation";

interface SubscriptionValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: SubscriptionValidationResult;
  organizationId: string;
  organizationName?: string;
  onSubscriptionCreated?: () => void;
}

const SubscriptionValidationModal: React.FC<
  SubscriptionValidationModalProps
> = ({
  isOpen,
  onClose,
  validationResult,
  organizationId,
  organizationName,
  onSubscriptionCreated,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: plansData, loading: plansLoading } = useQuery(
    GET_SUBSCRIPTION_PLANS,
    {
      variables: { filter: { isActive: true } },
      skip: !isOpen,
    },
  );

  const { createOrganizationSubscription } =
    useCreateOrganizationSubscription();

  const getStatusInfo = () => {
    switch (validationResult.status) {
      case "EXPIRED":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: "Subscription Expired",
          description:
            "Your organization's subscription has expired. Please renew to continue using Chapel Stack.",
          variant: "destructive" as const,
        };
      case "GRACE_PERIOD":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          title: "Subscription in Grace Period",
          description:
            "Your subscription has expired but you're in a grace period. Please renew soon to avoid service interruption.",
          variant: "default" as const,
        };
      case "TRIAL":
        return {
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          title: "Trial Ending Soon",
          description: `Your trial expires in ${validationResult.daysUntilExpiry} days. Choose a plan to continue using Chapel Stack.`,
          variant: "default" as const,
        };
      case "NONE":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
          title: "No Active Subscription",
          description:
            "Your organization doesn't have an active subscription. Please choose a plan to access Chapel Stack.",
          variant: "default" as const,
        };
      default:
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: "Subscription Active",
          description: "Your subscription is active and in good standing.",
          variant: "default" as const,
        };
    }
  };

  const handleCreateSubscription = async () => {
    if (!selectedPlanId) return;

    setIsCreating(true);
    try {
      const result = await createOrganizationSubscription({
        organizationId,
        planId: selectedPlanId,
        startDate: new Date().toISOString(),
      });

      if (result.success) {
        onSubscriptionCreated?.();
        onClose();
      }
    } catch (error) {
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const statusInfo = getStatusInfo();
  const plans = plansData?.subscriptionPlans || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {statusInfo.icon}
            {statusInfo.title}
          </DialogTitle>
          <DialogDescription>
            {organizationName && `Organization: ${organizationName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert variant={statusInfo.variant}>
            <AlertDescription>{statusInfo.description}</AlertDescription>
          </Alert>

          {validationResult.subscription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="font-medium">
                      {validationResult.subscription.plan.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge
                      variant={
                        validationResult.subscription.status === "ACTIVE"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {validationResult.subscription.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expires:</span>
                    <span className="text-sm">
                      {new Date(
                        validationResult.subscription.currentPeriodEnd,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Choose a Subscription Plan
            </h3>

            {plansLoading ? (
              <div className="text-center py-8">
                Loading subscription plans...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan: any) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all ${
                      selectedPlanId === plan.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {plan.trialPeriodDays > 0 && (
                          <Badge variant="secondary">
                            {plan.trialPeriodDays} day trial
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {formatCurrency(plan.amount, plan.currency)}
                          </div>
                          <div className="text-sm text-gray-600">
                            per {plan.interval.toLowerCase()}
                          </div>
                        </div>

                        {plan.features && plan.features.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Features:</div>
                            <ul className="text-xs space-y-1">
                              {plan.features
                                .slice(0, 4)
                                .map((feature: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-1"
                                  >
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              {plan.features.length > 4 && (
                                <li className="text-gray-500">
                                  +{plan.features.length - 4} more features
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubscription}
              disabled={!selectedPlanId || isCreating}
              className="min-w-[120px]"
            >
              {isCreating ? "Creating..." : "Subscribe Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionValidationModal;
