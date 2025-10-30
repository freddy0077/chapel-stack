"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CheckCircle, XCircle, AlertCircle, Users, DollarSign, Building2, Calendar, FileText } from "lucide-react";
import { GET_BANK_ACCOUNTS } from "@/graphql/finance/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { VERIFY_OFFERING_BATCH } from "@/graphql/finance/mutations";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OfferingBatch {
  id: string;
  batchNumber: string;
  serviceName: string;
  offeringType: string;
  batchDate: string;
  cashAmount: number;
  mobileMoneyAmount: number;
  totalAmount: number;
  countedBy: Array<{ id: string; name: string }>;
  cashDenominations: Record<string, number>;
  status: string;
  organisationId?: string;
  branchId?: string;
}

interface OfferingVerificationModalProps {
  open: boolean;
  onClose: () => void;
  batch: OfferingBatch | null;
  onSuccess: () => void;
}

export default function OfferingVerificationModal({
  open,
  onClose,
  batch,
  onSuccess,
}: OfferingVerificationModalProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [recordDeposit, setRecordDeposit] = useState(false);
  const [depositBankAccountId, setDepositBankAccountId] = useState("");
  const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0]);
  const [depositSlipNumber, setDepositSlipNumber] = useState("");
  const [verifyBatch, { loading }] = useMutation(VERIFY_OFFERING_BATCH);

  // Fetch bank accounts
  const { data: bankAccountsData, loading: loadingBankAccounts } = useQuery(GET_BANK_ACCOUNTS, {
    variables: {
      organisationId: batch?.organisationId || "",
      branchId: batch?.branchId || "",
    },
    skip: !batch?.organisationId || !batch?.branchId,
    fetchPolicy: 'cache-and-network',
  });

  const bankAccounts = bankAccountsData?.bankAccounts || [];

  if (!batch) return null;

  const handleVerify = async (status: "VERIFIED" | "REJECTED") => {
    if (status === "REJECTED" && !notes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    // Validate deposit fields if recording deposit
    if (recordDeposit && !depositBankAccountId) {
      toast({
        title: "Bank Account Required",
        description: "Please select a bank account for the deposit",
        variant: "destructive",
      });
      return;
    }

    try {
      await verifyBatch({
        variables: {
          input: {
            id: batch.id,
            discrepancyAmount: undefined,
            discrepancyNotes: notes.trim() || undefined,
            // Include deposit info if recording deposit
            ...(recordDeposit && depositBankAccountId && {
              depositBankAccountId,
              depositDate,
              depositSlipNumber: depositSlipNumber.trim() || undefined,
            }),
          },
        },
      });

      const successMessage = recordDeposit && depositBankAccountId
        ? "Offering batch verified and deposit recorded successfully"
        : `Offering batch ${status === "VERIFIED" ? "verified" : "rejected"} successfully`;

      toast({
        title: "Success",
        description: successMessage,
      });

      onSuccess();
      onClose();
      setNotes("");
      setRecordDeposit(false);
      setDepositBankAccountId("");
      setDepositSlipNumber("");
    } catch (err) {
      console.error("Error verifying batch:", err);
      toast({
        title: "Error",
        description: "Failed to verify offering batch",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Verify Offering Batch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Batch Info */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Batch Number</p>
                  <p className="font-semibold">{batch.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold">{batch.serviceName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Offering Type</p>
                  <Badge variant="outline" className="capitalize">
                    {batch.offeringType.replace("-", " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">
                    {new Date(batch.batchDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Counters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="font-semibold">Counted By</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {batch.countedBy.map((counter) => (
                  <Badge key={counter.id} variant="outline">
                    {counter.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amounts */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-700">Amount Summary</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cash Amount:</span>
                  <span className="font-semibold">
                    GHS {batch.cashAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mobile Money:</span>
                  <span className="font-semibold">
                    GHS {batch.mobileMoneyAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-green-200">
                  <span className="font-bold text-lg">Total Amount:</span>
                  <span className="font-bold text-2xl text-green-700">
                    GHS {batch.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Denominations */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Cash Denominations</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(batch.cashDenominations).map(([denom, count]) => {
                  if (count === 0) return null;
                  return (
                    <div
                      key={denom}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="font-medium">
                        {denom === "coins" ? "Coins" : `GHS ${denom}`}:
                      </span>
                      <span className="text-gray-600">
                        {count} {denom === "coins" ? "" : `× ${denom}`} = GHS{" "}
                        {denom === "coins"
                          ? count.toFixed(2)
                          : (parseInt(denom) * count).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Optional Deposit Recording */}
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="recordDeposit"
                  checked={recordDeposit}
                  onCheckedChange={(checked) => setRecordDeposit(checked as boolean)}
                />
                <Label
                  htmlFor="recordDeposit"
                  className="text-base font-semibold cursor-pointer flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Record Bank Deposit Now (Optional)
                </Label>
              </div>

              {recordDeposit && (
                <div className="space-y-4 mt-4 pl-6 border-l-2 border-blue-200">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account *</Label>
                    <Select
                      value={depositBankAccountId}
                      onValueChange={setDepositBankAccountId}
                      disabled={loadingBankAccounts}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          loadingBankAccounts 
                            ? "Loading bank accounts..." 
                            : bankAccounts.length === 0
                              ? "No bank accounts available"
                              : "Select bank account"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>No bank accounts found</p>
                            <p className="text-xs mt-1">Create a bank account first</p>
                          </div>
                        ) : (
                          bankAccounts.map((account: any) => (
                            <SelectItem key={account.id} value={account.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{account.accountName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {account.bankName} - {account.accountNumber} ({account.currency})
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {bankAccounts.length > 0 && depositBankAccountId && (
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          const selected = bankAccounts.find((a: any) => a.id === depositBankAccountId);
                          return selected ? `Current balance: ${selected.currency} ${selected.bookBalance.toLocaleString()}` : '';
                        })()}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="depositDate" className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Deposit Date
                      </Label>
                      <Input
                        id="depositDate"
                        type="date"
                        value={depositDate}
                        onChange={(e) => setDepositDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="depositSlip" className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        Deposit Slip #
                      </Label>
                      <Input
                        id="depositSlip"
                        placeholder="e.g., DS-2025-001"
                        value={depositSlipNumber}
                        onChange={(e) => setDepositSlipNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Amount to deposit:</strong> GHS {batch.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      This will mark the batch as DEPOSITED instead of VERIFIED
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Verification Notes {" "}
              <span className="text-xs text-gray-500">(Required for rejection)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or comments about this offering batch..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Warning for Rejection */}
          {notes.trim() && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">Note Added</p>
                    <p className="text-sm text-amber-700">
                      If you reject this batch, the counters will be notified with your notes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {batch.status === 'VERIFIED' || batch.status === 'APPROVED' || batch.status === 'POSTED' || batch.status === 'DEPOSITED' ? 'Close' : 'Cancel'}
          </Button>
          
          {/* Only show action buttons if batch is in COUNTING status */}
          {batch.status === 'COUNTING' && (
            <>
              <Button
                variant="destructive"
                onClick={() => handleVerify("REJECTED")}
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-red-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleVerify("VERIFIED")}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {loading 
                  ? "Processing..." 
                  : recordDeposit && depositBankAccountId
                    ? "Verify & Record Deposit"
                    : "Verify Batch"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
