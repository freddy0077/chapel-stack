"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import {
  X,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  AlertCircle,
  Save,
  FileText,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const SAVE_BANK_RECONCILIATION = gql`
  mutation SaveBankReconciliation($input: SaveBankReconciliationInput!) {
    saveBankReconciliation(input: $input) {
      id
      reconciliationDate
      bankStatementBalance
      bookBalance
      adjustedBalance
      difference
      status
      clearedTransactions
      notes
      reconciledBy
      reconciledAt
    }
  }
`;

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
}

export default function BankReconciliationModal({
  open,
  onClose,
  accountId,
  accountName,
  userId,
  onSuccess,
}: BankReconciliationModalProps) {
  const { toast } = useToast();
  const [reconciliationDate, setReconciliationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [bankStatementBalance, setBankStatementBalance] = useState("");
  const [notes, setNotes] = useState("");
  const [saveReconciliation, { loading: saving }] = useMutation(SAVE_BANK_RECONCILIATION);

  // For now, show empty state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Mock book balance - should come from GL account balance
  const bookBalance = 0;
  const clearedDebits = transactions.filter((t) => t.isCleared).reduce((sum, t) => sum + t.debit, 0);
  const clearedCredits = transactions.filter((t) => t.isCleared).reduce((sum, t) => sum + t.credit, 0);
  const adjustedBookBalance = bookBalance + clearedDebits - clearedCredits;
  const bankBalance = parseFloat(bankStatementBalance) || 0;
  const difference = adjustedBookBalance - bankBalance;
  const isBalanced = Math.abs(difference) < 0.01;

  const toggleTransaction = (id: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, isCleared: !t.isCleared } : t
      )
    );
  };

  const handleSave = async () => {
    if (!bankStatementBalance) {
      toast({
        title: "Validation Error",
        description: "Please enter bank statement balance",
        variant: "destructive",
      });
      return;
    }

    if (!isBalanced) {
      toast({
        title: "Reconciliation Error",
        description: "Balances do not match. Please review transactions.",
        variant: "destructive",
      });
      return;
    }

    try {
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
            status: "RECONCILED",
          },
        },
      });

      toast({
        title: "Success",
        description: "Bank reconciliation saved successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error saving reconciliation:", error);
      toast({
        title: "Error",
        description: "Failed to save bank reconciliation",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bank Reconciliation - {accountName}</DialogTitle>
          <DialogDescription>
            Reconcile book balance with bank statement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reconciliation Header */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reconciliationDate">Reconciliation Date</Label>
              <Input
                id="reconciliationDate"
                type="date"
                value={reconciliationDate}
                onChange={(e) => setReconciliationDate(e.target.value)}
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
              />
            </div>

            <div className="space-y-2">
              <Label>Book Balance</Label>
              <div className="h-10 flex items-center font-mono font-bold text-lg">
                GHS {bookBalance.toLocaleString()}
              </div>
            </div>
          </div>

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
                            Transactions will appear here once journal entries are posted to this bank account
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
                    <span className="text-sm text-muted-foreground">Book Balance:</span>
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
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isBalanced || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Reconciliation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
