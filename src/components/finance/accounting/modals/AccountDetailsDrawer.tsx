"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { X, Edit, Trash2, TrendingUp, TrendingDown, Calendar, Download, History, FileText, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DEACTIVATE_ACCOUNT } from "@/graphql/finance/mutations";
import { GET_CHART_OF_ACCOUNTS } from "@/graphql/finance/queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  accountSubType?: string;
  normalBalance: string;
  isActive: boolean;
  balance: number;
  description?: string;
  isRestricted?: boolean;
  currency?: string;
}

interface AccountDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  account: Account;
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function AccountDetailsDrawer({
  open,
  onClose,
  onEdit,
  account,
  organisationId,
  branchId,
  userId,
}: AccountDetailsDrawerProps) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // TODO: Fetch real transactions from API
  // For now, check if account has balance to determine if it has transactions
  const hasTransactions = account.balance !== null && account.balance !== 0;
  const recentTransactions: any[] = [];

  // Deactivate account mutation
  const [deactivateAccount, { loading: deactivating }] = useMutation(DEACTIVATE_ACCOUNT, {
    refetchQueries: [{ query: GET_CHART_OF_ACCOUNTS, variables: { organisationId, branchId } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Account deactivated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate account",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    if (hasTransactions) {
      toast({
        title: "Cannot Delete Account",
        description: "This account has transactions. You can only deactivate it.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deactivateAccount({
        variables: { id: account.id },
      });
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  };

  const handleExportTransactions = () => {
    toast({
      title: "Export Started",
      description: "Your transaction export will download shortly",
    });
    // TODO: Implement actual export
  };

  const canEdit = !hasTransactions;
  const canDelete = !hasTransactions && !account.isActive;

  const getAccountTypeColor = (type: string) => {
    const colors = {
      ASSET: "bg-blue-100 text-blue-800",
      LIABILITY: "bg-red-100 text-red-800",
      EQUITY: "bg-purple-100 text-purple-800",
      REVENUE: "bg-green-100 text-green-800",
      EXPENSE: "bg-orange-100 text-orange-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{account.accountName}</DialogTitle>
              <div className="text-sm font-mono text-muted-foreground mt-1">
                {account.accountCode}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onEdit}
                disabled={!canEdit}
                title={!canEdit ? "Cannot edit account with transactions" : "Edit account"}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600"
                onClick={() => setShowDeleteDialog(true)}
                disabled={hasTransactions}
                title={hasTransactions ? "Cannot delete account with transactions" : "Deactivate account"}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {hasTransactions ? "Deactivate" : "Delete"}
              </Button>
            </div>
          </div>
          <DialogDescription>
            View account details and recent activity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Account Type</div>
                  <Badge variant="outline" className={`mt-1 ${getAccountTypeColor(account.accountType)}`}>
                    {account.accountType}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Normal Balance</div>
                  <Badge variant="outline" className="mt-1">
                    {account.normalBalance}
                  </Badge>
                </div>
                {account.accountSubType && (
                  <div>
                    <div className="text-sm text-muted-foreground">Sub-Type</div>
                    <div className="mt-1 font-medium">{account.accountSubType}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Currency</div>
                  <div className="mt-1 font-medium">{account.currency || "GHS"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      account.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {account.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {account.isRestricted && (
                  <div>
                    <div className="text-sm text-muted-foreground">Restricted</div>
                    <Badge variant="outline" className="mt-1 bg-amber-100 text-amber-800">
                      Yes
                    </Badge>
                  </div>
                )}
              </div>

              {account.description && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Description</div>
                    <p className="text-sm">{account.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Current Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                GHS {(account.balance || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+12.5%</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No transactions yet</p>
                  <p className="text-sm mt-2">Transactions will appear here once journal entries are posted</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction: any) => (
                      <div
                        key={transaction.id}
                        className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Debit: GHS {(transaction.debit || 0).toLocaleString()}
                            </span>
                            <span>
                              Credit: GHS {(transaction.credit || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            GHS {(transaction.balance || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Balance</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Transactions
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Coming Soon", description: "Account history view will be available soon" })}
              >
                <History className="h-4 w-4 mr-2" />
                View Account History
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleExportTransactions}
                disabled={recentTransactions.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Transactions
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Coming Soon", description: "Report generation will be available soon" })}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Accounting Rules Notice */}
          {hasTransactions && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-900">
                      Accounting Standards Notice
                    </p>
                    <p className="text-sm text-yellow-800">
                      This account has posted transactions and cannot be edited or deleted. 
                      You can only deactivate it to prevent future use while maintaining audit trail integrity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {hasTransactions ? "Deactivate Account?" : "Delete Account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {hasTransactions ? (
                <>
                  This account has transactions and cannot be deleted. 
                  Deactivating will prevent future use while preserving the audit trail.
                  <br /><br />
                  <strong>Account:</strong> {account.accountCode} - {account.accountName}
                </>
              ) : (
                <>
                  Are you sure you want to delete this account? This action cannot be undone.
                  <br /><br />
                  <strong>Account:</strong> {account.accountCode} - {account.accountName}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deactivating}
            >
              {deactivating ? "Processing..." : (hasTransactions ? "Deactivate" : "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
