"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  X,
  Building2,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GET_BANK_ACCOUNT_BY_ID } from "@/graphql/finance/queries";

interface BankAccountDetailsModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  onEdit?: () => void;
}

export default function BankAccountDetailsModal({
  open,
  onClose,
  accountId,
  onEdit,
}: BankAccountDetailsModalProps) {
  const { data, loading } = useQuery(GET_BANK_ACCOUNT_BY_ID, {
    variables: { id: accountId },
    skip: !accountId || !open,
  });

  const account = data?.bankAccount;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!account) {
    return null;
  }

  const difference = account.bankBalance - account.bookBalance;
  const isBalanced = Math.abs(difference) < 0.01;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{account.accountName}</DialogTitle>
              <DialogDescription className="mt-1">
                {account.bankName} • {account.accountNumber}
              </DialogDescription>
            </div>
            <Badge
              variant={account.status === "ACTIVE" ? "default" : "secondary"}
              className="ml-4"
            >
              {account.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Balance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Balance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Book Balance (GL)</p>
                  <p className="text-2xl font-bold">
                    {account.currency} {account.bookBalance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bank Balance</p>
                  <p className="text-2xl font-bold">
                    {account.currency} {account.bankBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Difference</p>
                  <p
                    className={`text-xl font-bold ${
                      isBalanced
                        ? "text-green-600"
                        : difference > 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {difference > 0 ? "+" : ""}
                    {account.currency} {Math.abs(difference).toLocaleString()}
                  </p>
                </div>
                {isBalanced ? (
                  <Badge className="bg-green-100 text-green-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Balanced
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Needs Reconciliation
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{account.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-mono font-medium">{account.accountNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <Badge variant="outline">{account.accountType}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{account.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GL Account Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                GL Account Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">GL Account Code</p>
                <p className="font-mono font-medium">{account.glAccountCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GL Account Name</p>
                <p className="font-medium">{account.glAccountName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Reconciliation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Reconciliation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Last Reconciled</p>
                  <p className="font-medium">
                    {account.lastReconciled
                      ? new Date(account.lastReconciled).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reconciliation Status</p>
                  {account.isReconciled ? (
                    <Badge className="bg-green-100 text-green-800">Reconciled</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(account.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(account.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              Edit Account
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
