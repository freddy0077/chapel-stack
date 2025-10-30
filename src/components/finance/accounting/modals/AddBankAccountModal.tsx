"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Building2, CreditCard, DollarSign, Hash, Landmark } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CREATE_BANK_ACCOUNT } from "@/graphql/finance/mutations";
import { GET_ACCOUNTS, GET_BANK_ACCOUNTS } from "@/graphql/finance/queries";

interface AddBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organisationId: string;
  branchId: string;
}

const ACCOUNT_TYPES = [
  { value: "Current", label: "Current Account" },
  { value: "Savings", label: "Savings Account" },
  { value: "Fixed Deposit", label: "Fixed Deposit" },
  { value: "Money Market", label: "Money Market" },
];

const CURRENCIES = [
  { value: "GHS", label: "GHS - Ghana Cedis" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
];

export default function AddBankAccountModal({
  open,
  onClose,
  onSuccess,
  organisationId,
  branchId,
}: AddBankAccountModalProps) {
  const { toast } = useToast();
  
  // Form state
  const [glAccountId, setGlAccountId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("Current");
  const [currency, setCurrency] = useState("GHS");

  // Fetch GL accounts (Cash/Bank type only)
  const { data: accountsData, loading: loadingAccounts } = useQuery(GET_ACCOUNTS, {
    variables: {
      organisationId,
      branchId,
    },
    skip: !organisationId || !branchId || !open,
  });

  // Filter for bank/cash accounts only
  // Note: If accountSubType is null, we still show ASSET accounts as they might be cash/bank accounts
  const glAccounts = (accountsData?.chartOfAccounts || []).filter(
    (account: any) => 
      account.accountType === "ASSET" && 
      (
        account.accountSubType === "CASH_AND_BANK" || 
        account.accountSubType === "MOBILE_MONEY" ||
        account.accountSubType === null  // Include accounts without subtype
      ) &&
      !account.isBankAccount // Not already linked to a bank account
  );

  // Create bank account mutation
  const [createBankAccount, { loading: creating }] = useMutation(CREATE_BANK_ACCOUNT, {
    refetchQueries: [
      { query: GET_BANK_ACCOUNTS, variables: { organisationId, branchId } },
      { query: GET_ACCOUNTS, variables: { organisationId, branchId } }
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Bank account created successfully",
      });
      handleClose();
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create bank account",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setGlAccountId("");
    setAccountName("");
    setBankName("");
    setAccountNumber("");
    setAccountType("Current");
    setCurrency("GHS");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!glAccountId) {
      toast({
        title: "GL Account Required",
        description: "Please select a GL account to link",
        variant: "destructive",
      });
      return;
    }

    if (!accountName.trim()) {
      toast({
        title: "Account Name Required",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    if (!bankName.trim()) {
      toast({
        title: "Bank Name Required",
        description: "Please enter the bank name",
        variant: "destructive",
      });
      return;
    }

    if (!accountNumber.trim()) {
      toast({
        title: "Account Number Required",
        description: "Please enter the account number",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBankAccount({
        variables: {
          input: {
            glAccountId,
            accountName: accountName.trim(),
            bankName: bankName.trim(),
            accountNumber: accountNumber.trim(),
            accountType,
            currency,
            organisationId,
            branchId,
          },
        },
      });
    } catch (error) {
      console.error("Error creating bank account:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Add Bank Account
          </DialogTitle>
          <DialogDescription>
            Link a bank account to a GL account for tracking and reconciliation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GL Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="glAccount" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              GL Account *
            </Label>
            <Select
              value={glAccountId}
              onValueChange={setGlAccountId}
              disabled={loadingAccounts}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingAccounts 
                    ? "Loading GL accounts..." 
                    : glAccounts.length === 0
                      ? "No available GL accounts"
                      : "Select GL account"
                } />
              </SelectTrigger>
              <SelectContent>
                {glAccounts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <p>No available GL accounts</p>
                    <p className="text-xs mt-1">
                      Create a Cash/Bank GL account first
                    </p>
                  </div>
                ) : (
                  glAccounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {account.accountCode} - {account.accountName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {account.accountSubType} • Balance: GHS {account.balance?.toLocaleString() || 0}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This links the bank account to your chart of accounts
            </p>
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="accountName" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Account Name *
            </Label>
            <Input
              id="accountName"
              placeholder="e.g., Operating Account, Savings Account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>

          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              Bank Name *
            </Label>
            <Input
              id="bankName"
              placeholder="e.g., Ghana Commercial Bank, Ecobank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              placeholder="e.g., 1234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              You can mask it for security (e.g., ****1234)
            </p>
          </div>

          {/* Account Type & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Currency *
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">
              ℹ️ What happens next?
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Bank account will be linked to the selected GL account</li>
              <li>• Book balance will sync with GL account balance</li>
              <li>• You can update bank balance from statements</li>
              <li>• Reconciliation will track differences</li>
            </ul>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating || loadingAccounts || glAccounts.length === 0}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {creating ? "Creating..." : "Create Bank Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
