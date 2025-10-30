"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UPDATE_BANK_ACCOUNT } from "@/graphql/finance/mutations";
import { GET_BANK_ACCOUNT_BY_ID } from "@/graphql/finance/queries";

interface EditBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  onSuccess?: () => void;
}

export default function EditBankAccountModal({
  open,
  onClose,
  accountId,
  onSuccess,
}: EditBankAccountModalProps) {
  const { toast } = useToast();
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [currency, setCurrency] = useState("GHS");

  // Fetch existing account data
  const { data, loading: loadingAccount } = useQuery(GET_BANK_ACCOUNT_BY_ID, {
    variables: { id: accountId },
    skip: !accountId || !open,
  });

  // Populate form when data loads
  useEffect(() => {
    if (data?.bankAccount) {
      const account = data.bankAccount;
      setAccountName(account.accountName || "");
      setBankName(account.bankName || "");
      setAccountNumber(account.accountNumber || "");
      setAccountType(account.accountType || "");
      setCurrency(account.currency || "GHS");
    }
  }, [data]);

  const [updateBankAccount, { loading: updating }] = useMutation(
    UPDATE_BANK_ACCOUNT,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Bank account updated successfully",
        });
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update bank account",
          variant: "destructive",
        });
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountName || !bankName || !accountNumber || !accountType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    await updateBankAccount({
      variables: {
        id: accountId,
        input: {
          accountName,
          bankName,
          accountNumber,
          accountType,
          currency,
        },
      },
    });
  };

  if (loadingAccount) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Bank Account</DialogTitle>
          <DialogDescription>
            Update bank account information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountName"
                placeholder="e.g., Main Operating Account"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">
                Bank Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bankName"
                placeholder="e.g., GCB Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                Account Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountNumber"
                placeholder="e.g., 1234567890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="accountType">
                Account Type <span className="text-red-500">*</span>
              </Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHECKING">Checking</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="MONEY_MARKET">Money Market</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              <Save className="h-4 w-4 mr-2" />
              {updating ? "Updating..." : "Update Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
