"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { POST_OFFERING_TO_GL } from "@/graphql/finance/mutations";
import { GET_CHART_OF_ACCOUNTS } from "@/graphql/finance/queries";
import { Calendar, DollarSign, FileText, AlertCircle } from "lucide-react";

interface PostOfferingToGLModalProps {
  open: boolean;
  onClose: () => void;
  batch: {
    id: string;
    batchNumber: string;
    batchDate: string;
    serviceName: string;
    cashAmount: number;
    mobileMoneyAmount: number;
    chequeAmount: number;
    foreignCurrencyAmount: number;
    totalAmount: number;
    offeringType: string;
  } | null;
  organisationId: string;
  branchId: string;
  onSuccess: () => void;
}

export default function PostOfferingToGLModal({
  open,
  onClose,
  batch,
  organisationId,
  branchId,
  onSuccess,
}: PostOfferingToGLModalProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [cashAccountId, setCashAccountId] = useState("");
  const [mobileMoneyAccountId, setMobileMoneyAccountId] = useState("");
  const [revenueAccountId, setRevenueAccountId] = useState("");

  // Fetch chart of accounts
  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organisationId, branchId },
    skip: !open,
  });

  const accounts = accountsData?.chartOfAccounts || [];

  // Filter accounts by type
  const cashAccounts = accounts.filter(
    (acc: any) => acc.accountType === "ASSET" && acc.accountSubType === "CASH_AND_BANK"
  );
  const mobileMoneyAccounts = accounts.filter(
    (acc: any) => acc.accountType === "ASSET" && acc.accountSubType === "MOBILE_MONEY"
  );
  const revenueAccounts = accounts.filter(
    (acc: any) => acc.accountType === "REVENUE"
  );

  const [postOfferingToGL, { loading }] = useMutation(POST_OFFERING_TO_GL, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: `Offering batch ${batch?.batchNumber} posted to GL successfully. Journal entry created.`,
      });
      onSuccess();
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post offering to GL",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setNotes("");
    setCashAccountId("");
    setMobileMoneyAccountId("");
    setRevenueAccountId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!batch) return;

    // Validation
    if (batch.cashAmount > 0 && !cashAccountId) {
      toast({
        title: "Validation Error",
        description: "Please select a cash account",
        variant: "destructive",
      });
      return;
    }

    if (batch.mobileMoneyAmount > 0 && !mobileMoneyAccountId) {
      toast({
        title: "Validation Error",
        description: "Please select a mobile money account",
        variant: "destructive",
      });
      return;
    }

    if (!revenueAccountId) {
      toast({
        title: "Validation Error",
        description: "Please select a revenue account",
        variant: "destructive",
      });
      return;
    }

    try {
      await postOfferingToGL({
        variables: {
          input: {
            id: batch.id,
            cashAccountId: batch.cashAmount > 0 ? cashAccountId : undefined,
            mobileMoneyAccountId: batch.mobileMoneyAmount > 0 ? mobileMoneyAccountId : undefined,
            revenueAccountId,
            notes: notes || undefined,
          },
        },
      });
    } catch (error) {
      console.error("Error posting to GL:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post Offering to General Ledger</DialogTitle>
          <DialogDescription>
            Review and configure the journal entry for {batch.batchNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Offering Batch Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Batch Number</Label>
                  <p className="font-semibold">{batch.batchNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Service</Label>
                  <p className="font-semibold">{batch.serviceName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-semibold">
                    {new Date(batch.batchDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <Badge variant="outline">{batch.offeringType}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Amount Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batch.cashAmount > 0 && (
                    <TableRow>
                      <TableCell>Cash</TableCell>
                      <TableCell className="text-right font-mono">
                        GHS {batch.cashAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  {batch.mobileMoneyAmount > 0 && (
                    <TableRow>
                      <TableCell>Mobile Money</TableCell>
                      <TableCell className="text-right font-mono">
                        GHS {batch.mobileMoneyAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  {batch.chequeAmount > 0 && (
                    <TableRow>
                      <TableCell>Cheque</TableCell>
                      <TableCell className="text-right font-mono">
                        GHS {batch.chequeAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  {batch.foreignCurrencyAmount > 0 && (
                    <TableRow>
                      <TableCell>Foreign Currency</TableCell>
                      <TableCell className="text-right font-mono">
                        GHS {batch.foreignCurrencyAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold font-mono">
                      GHS {batch.totalAmount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Account Mapping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Mapping</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select the GL accounts for posting this offering
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cash Account */}
              {batch.cashAmount > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="cashAccount">
                    Cash Account <span className="text-red-500">*</span>
                  </Label>
                  <Select value={cashAccountId} onValueChange={setCashAccountId}>
                    <SelectTrigger id="cashAccount">
                      <SelectValue placeholder="Select cash account (e.g., 1010 - Cash Operating)" />
                    </SelectTrigger>
                    <SelectContent>
                      {cashAccounts.map((account: any) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountCode} - {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Debit: GHS {batch.cashAmount.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Mobile Money Account */}
              {batch.mobileMoneyAmount > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="mobileMoneyAccount">
                    Mobile Money Account <span className="text-red-500">*</span>
                  </Label>
                  <Select value={mobileMoneyAccountId} onValueChange={setMobileMoneyAccountId}>
                    <SelectTrigger id="mobileMoneyAccount">
                      <SelectValue placeholder="Select mobile money account (e.g., 1020 - MTN Mobile Money)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mobileMoneyAccounts.map((account: any) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountCode} - {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Debit: GHS {batch.mobileMoneyAmount.toLocaleString()}
                  </p>
                </div>
              )}

              <Separator />

              {/* Revenue Account */}
              <div className="space-y-2">
                <Label htmlFor="revenueAccount">
                  Revenue Account <span className="text-red-500">*</span>
                </Label>
                <Select value={revenueAccountId} onValueChange={setRevenueAccountId}>
                  <SelectTrigger id="revenueAccount">
                    <SelectValue placeholder="Select revenue account (e.g., 4010 - Tithes & Offerings)" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueAccounts.map((account: any) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountCode} - {account.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Credit: GHS {batch.totalAmount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Journal Entry Preview */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Journal Entry Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batch.cashAmount > 0 && cashAccountId && (
                    <TableRow>
                      <TableCell>
                        {cashAccounts.find((a: any) => a.id === cashAccountId)?.accountCode} -{" "}
                        {cashAccounts.find((a: any) => a.id === cashAccountId)?.accountName}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        GHS {batch.cashAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  )}
                  {batch.mobileMoneyAmount > 0 && mobileMoneyAccountId && (
                    <TableRow>
                      <TableCell>
                        {mobileMoneyAccounts.find((a: any) => a.id === mobileMoneyAccountId)?.accountCode} -{" "}
                        {mobileMoneyAccounts.find((a: any) => a.id === mobileMoneyAccountId)?.accountName}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        GHS {batch.mobileMoneyAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  )}
                  {revenueAccountId && (
                    <TableRow>
                      <TableCell>
                        {revenueAccounts.find((a: any) => a.id === revenueAccountId)?.accountCode} -{" "}
                        {revenueAccounts.find((a: any) => a.id === revenueAccountId)?.accountName}
                      </TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right font-mono">
                        GHS {batch.totalAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold font-mono">
                      GHS {batch.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold font-mono">
                      GHS {batch.totalAmount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes for this journal entry..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Warning */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-900">
                    Important: Posting to General Ledger
                  </p>
                  <p className="text-sm text-yellow-800">
                    This action will create a journal entry and update account balances. 
                    Once posted, this cannot be undone (only reversed). Please verify all 
                    account selections are correct before proceeding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post to General Ledger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
