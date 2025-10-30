"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CheckCircle,
  AlertCircle,
  Save,
  Send,
  ThumbsUp,
  ThumbsDown,
  Upload,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  SAVE_BANK_RECONCILIATION,
  SUBMIT_BANK_RECONCILIATION_FOR_REVIEW,
  APPROVE_BANK_RECONCILIATION,
  REJECT_BANK_RECONCILIATION,
} from "@/graphql/finance/mutations";
import { GET_BANK_ACCOUNT_WITH_GL_BALANCE } from "@/graphql/finance/queries";

interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  isCleared: boolean;
}

interface BankReconciliationModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  accountName: string;
  userId: string;
  onSuccess?: () => void;
  existingReconciliation?: any; // For editing existing reconciliation
}

export default function BankReconciliationModal({
  open,
  onClose,
  accountId,
  accountName,
  userId,
  onSuccess,
  existingReconciliation,
}: BankReconciliationModalProps) {
  const { toast } = useToast();
  
  // State
  const [reconciliationDate, setReconciliationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [bankStatementBalance, setBankStatementBalance] = useState("");
  const [notes, setNotes] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankStatementFile, setBankStatementFile] = useState<File | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Fetch bank account with GL balance
  const { data: bankAccountData, loading: loadingAccount } = useQuery(
    GET_BANK_ACCOUNT_WITH_GL_BALANCE,
    {
      variables: { id: accountId },
      skip: !accountId,
    }
  );

  // Auto-populate book balance from GL account
  const bookBalance = bankAccountData?.bankAccount?.glAccount?.balance || 0;
  const lastBankBalance = bankAccountData?.bankAccount?.bankBalance || 0;

  // Pre-fill bank statement balance with last known balance
  useEffect(() => {
    if (lastBankBalance && !bankStatementBalance && !existingReconciliation) {
      setBankStatementBalance(lastBankBalance.toString());
    }
  }, [lastBankBalance, bankStatementBalance, existingReconciliation]);

  // Load existing reconciliation data
  useEffect(() => {
    if (existingReconciliation) {
      setReconciliationDate(existingReconciliation.reconciliationDate);
      setBankStatementBalance(existingReconciliation.bankStatementBalance.toString());
      setNotes(existingReconciliation.notes || "");
      // Load cleared transactions if available
    }
  }, [existingReconciliation]);

  // Calculations
  const clearedDebits = transactions
    .filter((t) => t.isCleared)
    .reduce((sum, t) => sum + t.debit, 0);
  const clearedCredits = transactions
    .filter((t) => t.isCleared)
    .reduce((sum, t) => sum + t.credit, 0);
  const adjustedBookBalance = bookBalance + clearedDebits - clearedCredits;
  const bankBalance = parseFloat(bankStatementBalance) || 0;
  const difference = adjustedBookBalance - bankBalance;
  const isBalanced = Math.abs(difference) < 0.01;

  // Calculate variance from last reconciliation
  const variance = Math.abs(bankBalance - lastBankBalance);
  const variancePercent =
    lastBankBalance !== 0 ? (variance / Math.abs(lastBankBalance)) * 100 : 0;
  const hasLargeVariance = variancePercent > 10; // Alert if >10% variance

  // Mutations
  const [saveReconciliation, { loading: saving }] = useMutation(
    SAVE_BANK_RECONCILIATION,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Bank reconciliation saved as draft",
        });
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to save reconciliation",
          variant: "destructive",
        });
      },
    }
  );

  const [submitForReview, { loading: submitting }] = useMutation(
    SUBMIT_BANK_RECONCILIATION_FOR_REVIEW,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Reconciliation submitted for review",
        });
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to submit for review",
          variant: "destructive",
        });
      },
    }
  );

  const [approveReconciliation, { loading: approving }] = useMutation(
    APPROVE_BANK_RECONCILIATION,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Reconciliation approved successfully",
        });
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to approve reconciliation",
          variant: "destructive",
        });
      },
    }
  );

  const [rejectReconciliation, { loading: rejecting }] = useMutation(
    REJECT_BANK_RECONCILIATION,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Reconciliation rejected",
        });
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to reject reconciliation",
          variant: "destructive",
        });
      },
    }
  );

  // Handlers
  const toggleTransaction = (id: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, isCleared: !t.isCleared } : t
      )
    );
  };

  const handleSaveDraft = async () => {
    if (!bankStatementBalance) {
      toast({
        title: "Validation Error",
        description: "Please enter bank statement balance",
        variant: "destructive",
      });
      return;
    }

    // TODO: Re-enable when file upload is implemented
    // if (!bankStatementFile) {
    //   toast({
    //     title: "Validation Error",
    //     description: "Please upload bank statement",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    try {
      // TODO: Upload file first and get URL
      const bankStatementFileUrl = bankStatementFile ? "pending-upload" : null; // Placeholder

      await saveReconciliation({
        variables: {
          input: {
            accountId,
            reconciliationDate,
            bankStatementBalance: parseFloat(bankStatementBalance),
            bookBalance,
            adjustedBalance: adjustedBookBalance,
            difference,
            clearedTransactions: transactions
              .filter((t) => t.isCleared)
              .map((t) => t.id),
            notes: notes.trim() || null,
            reconciledBy: userId,
            status: "DRAFT",
            bankStatementFileUrl,
          },
        },
      });
    } catch (error) {
      console.error("Error saving reconciliation:", error);
    }
  };

  const handleReconcile = async () => {
    if (!isBalanced) {
      toast({
        title: "Reconciliation Error",
        description: "Balances do not match. Please review transactions.",
        variant: "destructive",
      });
      return;
    }

    if (!bankStatementBalance) {
      toast({
        title: "Validation Error",
        description: "Please enter bank statement balance",
        variant: "destructive",
      });
      return;
    }

    try {
      const bankStatementFileUrl = bankStatementFile ? "pending-upload" : null;

      await saveReconciliation({
        variables: {
          input: {
            accountId,
            reconciliationDate,
            bankStatementBalance: parseFloat(bankStatementBalance),
            bookBalance,
            adjustedBalance: adjustedBookBalance,
            difference,
            clearedTransactions: transactions
              .filter((t) => t.isCleared)
              .map((t) => t.id),
            notes: notes.trim() || null,
            reconciledBy: userId,
            status: "RECONCILED", // ✅ Direct to RECONCILED
            bankStatementFileUrl,
          },
        },
      });
    } catch (error) {
      console.error("Error reconciling:", error);
    }
  };

  // Maker-checker functions commented out - using simple workflow
  // const handleSubmitForReview = async () => { ... };
  // const handleApprove = async () => { ... };
  // const handleReject = async () => { ... };

  // Status badge
  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: <Badge variant="secondary">Draft</Badge>,
      PENDING_REVIEW: <Badge className="bg-yellow-500">Pending Review</Badge>,
      APPROVED: <Badge className="bg-green-500">Approved</Badge>,
      RECONCILED: <Badge className="bg-green-600">Reconciled</Badge>,
      REJECTED: <Badge variant="destructive">Rejected</Badge>,
      VOIDED: <Badge variant="destructive">Voided</Badge>,
    };
    return badges[status] || <Badge>{status}</Badge>;
  };

  const status = existingReconciliation?.status || "DRAFT";
  const canEdit = status === "DRAFT" || !existingReconciliation;
  const canSubmit = status === "DRAFT";
  const canApprove = status === "PENDING_REVIEW" && existingReconciliation?.preparedBy !== userId;
  const canReject = status === "PENDING_REVIEW";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Bank Reconciliation - {accountName}</DialogTitle>
              <DialogDescription>
                Reconcile book balance with bank statement
              </DialogDescription>
            </div>
            {existingReconciliation && getStatusBadge(status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Large Variance Warning */}
          {hasLargeVariance && canEdit && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Large Variance Detected</AlertTitle>
              <AlertDescription>
                Bank balance has changed by {variancePercent.toFixed(1)}% since
                last reconciliation (Last: GHS {lastBankBalance.toLocaleString()}, 
                Current: GHS {bankBalance.toLocaleString()}). Please verify the bank
                statement balance.
              </AlertDescription>
            </Alert>
          )}

          {/* Reconciliation Header */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reconciliationDate">Reconciliation Date</Label>
              <Input
                id="reconciliationDate"
                type="date"
                value={reconciliationDate}
                onChange={(e) => setReconciliationDate(e.target.value)}
                disabled={!canEdit}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankBalance">
                Bank Statement Balance <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bankBalance"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={bankStatementBalance}
                onChange={(e) => setBankStatementBalance(e.target.value)}
                disabled={!canEdit}
              />
              {lastBankBalance > 0 && (
                <p className="text-xs text-muted-foreground">
                  Last reconciled: GHS {lastBankBalance.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Book Balance (from GL)
                <span className="ml-2 text-xs text-muted-foreground">
                  {loadingAccount ? "Loading..." : "Auto-populated"}
                </span>
              </Label>
              <div className="h-10 flex items-center font-mono font-bold text-lg">
                GHS {bookBalance.toLocaleString()}
              </div>
              {bankAccountData?.bankAccount?.glAccount && (
                <p className="text-xs text-muted-foreground">
                  Account: {bankAccountData.bankAccount.glAccount.accountCode} -{" "}
                  {bankAccountData.bankAccount.glAccount.accountName}
                </p>
              )}
            </div>
          </div>

          {/* Bank Statement Upload - TODO: Re-enable when file upload is implemented */}
          {/* {canEdit && (
            <div className="space-y-2">
              <Label htmlFor="bankStatement">
                Bank Statement <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bankStatement"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setBankStatementFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                {bankStatementFile && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    {bankStatementFile.name}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Upload bank statement as proof (PDF, JPG, PNG)
              </p>
            </div>
          )} */}

          {/* Transactions to Clear */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outstanding Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Clear</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <div className="space-y-2">
                          <p>No unreconciled transactions</p>
                          <p className="text-sm">
                            Transactions will appear here once journal entries are
                            posted to this bank account
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className={transaction.isCleared ? "bg-green-50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={transaction.isCleared}
                            onCheckedChange={() => toggleTransaction(transaction.id)}
                            disabled={!canEdit}
                          />
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {transaction.reference}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {transaction.debit > 0
                            ? `GHS ${transaction.debit.toLocaleString()}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {transaction.credit > 0
                            ? `GHS ${transaction.credit.toLocaleString()}`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Reconciliation Summary */}
          <Card className={isBalanced ? "bg-green-50" : "bg-red-50"}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {isBalanced ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600">Reconciliation Balanced</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600">Reconciliation Out of Balance</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Book Balance (GL):
                    </span>
                    <span className="font-mono font-medium">
                      GHS {bookBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Add: Cleared Deposits
                    </span>
                    <span className="font-mono font-medium text-green-600">
                      +GHS {clearedDebits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Less: Cleared Payments
                    </span>
                    <span className="font-mono font-medium text-red-600">
                      -GHS {clearedCredits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Adjusted Book Balance:</span>
                    <span className="font-mono font-bold">
                      GHS {adjustedBookBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Bank Statement Balance:
                    </span>
                    <span className="font-mono font-medium">
                      GHS {bankBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-auto">
                    <span className="font-medium">Difference:</span>
                    <span
                      className={`font-mono font-bold ${
                        isBalanced ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      GHS {Math.abs(difference).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Reconciliation Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or explanations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={!canEdit}
            />
          </div>

          {/* Maker-Checker Info */}
          {existingReconciliation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Workflow Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {existingReconciliation.preparedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prepared By:</span>
                    <span className="font-medium">{existingReconciliation.preparedBy}</span>
                  </div>
                )}
                {existingReconciliation.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reviewed By:</span>
                    <span className="font-medium">{existingReconciliation.reviewedBy}</span>
                  </div>
                )}
                {existingReconciliation.approvedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approved By:</span>
                    <span className="font-medium">
                      {existingReconciliation.approvedBy} on{" "}
                      {new Date(existingReconciliation.approvedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving || submitting || approving || rejecting}>
            Cancel
          </Button>

          {canEdit && (
            <>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={saving || !bankStatementBalance}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Draft"}
              </Button>

              {canSubmit && (
                <Button
                  onClick={handleReconcile}
                  disabled={!isBalanced || saving || !bankStatementBalance}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {saving ? "Reconciling..." : "Reconcile"}
                </Button>
              )}
            </>
          )}

          {/* Maker-checker buttons removed - using simple workflow */}
        </DialogFooter>
      </DialogContent>

      {/* Reject Dialog removed - using simple workflow */}
    </Dialog>
  );
}
