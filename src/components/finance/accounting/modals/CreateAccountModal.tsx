"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { X, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CREATE_ACCOUNT } from "@/graphql/finance/mutations";
import { GET_CHART_OF_ACCOUNTS } from "@/graphql/finance/queries";

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function CreateAccountModal({
  open,
  onClose,
  onSuccess,
  organisationId,
  branchId,
  userId,
}: CreateAccountModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch parent accounts for hierarchy
  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organisationId, branchId },
    skip: !organisationId || !branchId || !open,
  });

  const parentAccounts = accountsData?.chartOfAccounts || [];

  // Create account mutation
  const [createAccount, { loading: creating }] = useMutation(CREATE_ACCOUNT, {
    refetchQueries: [{ query: GET_CHART_OF_ACCOUNTS, variables: { organisationId, branchId } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      onSuccess();
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    accountCode: "",
    accountName: "",
    accountType: "",
    accountSubType: "",
    normalBalance: "",
    parentAccountId: "",
    description: "",
    isRestricted: false,
    currency: "GHS",
  });

  const accountTypes = [
    { value: "ASSET", label: "Asset" },
    { value: "LIABILITY", label: "Liability" },
    { value: "EQUITY", label: "Equity" },
    { value: "REVENUE", label: "Revenue" },
    { value: "EXPENSE", label: "Expense" },
  ];

  const accountSubTypes = {
    ASSET: [
      { value: "CASH_AND_BANK", label: "Cash and Bank" },
      { value: "MOBILE_MONEY", label: "Mobile Money" },
      { value: "ACCOUNTS_RECEIVABLE", label: "Accounts Receivable" },
      { value: "PREPAID_EXPENSE", label: "Prepaid Expense" },
      { value: "FIXED_ASSET", label: "Fixed Asset" },
      { value: "OTHER_ASSET", label: "Other Asset" },
    ],
    LIABILITY: [
      { value: "ACCOUNTS_PAYABLE", label: "Accounts Payable" },
      { value: "ACCRUED_EXPENSE", label: "Accrued Expense" },
      { value: "LOAN_PAYABLE", label: "Loan Payable" },
      { value: "OTHER_LIABILITY", label: "Other Liability" },
    ],
    EQUITY: [
      { value: "NET_ASSETS_UNRESTRICTED", label: "Net Assets - Unrestricted" },
      { value: "NET_ASSETS_RESTRICTED", label: "Net Assets - Restricted" },
      { value: "RETAINED_EARNINGS", label: "Retained Earnings" },
    ],
    REVENUE: [
      { value: "TITHE_INCOME", label: "Tithe Income" },
      { value: "OFFERING_INCOME", label: "Offering Income" },
      { value: "DONATION_INCOME", label: "Donation Income" },
      { value: "PROGRAM_INCOME", label: "Program Income" },
      { value: "OTHER_INCOME", label: "Other Income" },
    ],
    EXPENSE: [
      { value: "MINISTRY_EXPENSE", label: "Ministry Expense" },
      { value: "ADMINISTRATIVE_EXPENSE", label: "Administrative Expense" },
      { value: "FACILITY_EXPENSE", label: "Facility Expense" },
      { value: "SALARY_EXPENSE", label: "Salary Expense" },
      { value: "OTHER_EXPENSE", label: "Other Expense" },
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.accountCode || !formData.accountName || !formData.accountType || !formData.normalBalance) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createAccount({
        variables: {
          input: {
            accountCode: formData.accountCode,
            accountName: formData.accountName,
            accountType: formData.accountType,
            accountSubType: formData.accountSubType || undefined,
            normalBalance: formData.normalBalance,
            parentAccountId: formData.parentAccountId || undefined,
            description: formData.description || undefined,
            organisationId,
            branchId,
            createdBy: userId,
          },
        },
      });
    } catch (error) {
      console.error("Error creating account:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      accountCode: "",
      accountName: "",
      accountType: "",
      accountSubType: "",
      normalBalance: "",
      parentAccountId: "",
      description: "",
      isRestricted: false,
      currency: "GHS",
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Add a new account to your chart of accounts
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Account Code */}
            <div className="space-y-2">
              <Label htmlFor="accountCode">
                Account Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountCode"
                placeholder="e.g., 1010"
                value={formData.accountCode}
                onChange={(e) =>
                  setFormData({ ...formData, accountCode: e.target.value })
                }
                required
              />
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountName"
                placeholder="e.g., Cash - Operating"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
                required
              />
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="accountType">
                Account Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) =>
                  setFormData({ ...formData, accountType: value, accountSubType: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Sub-Type */}
            <div className="space-y-2">
              <Label htmlFor="accountSubType">Account Sub-Type</Label>
              <Select
                value={formData.accountSubType}
                onValueChange={(value) =>
                  setFormData({ ...formData, accountSubType: value })
                }
                disabled={!formData.accountType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-type" />
                </SelectTrigger>
                <SelectContent>
                  {formData.accountType &&
                    accountSubTypes[formData.accountType as keyof typeof accountSubTypes]?.map(
                      (subType) => (
                        <SelectItem key={subType.value} value={subType.value}>
                          {subType.label}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>

            {/* Normal Balance */}
            <div className="space-y-2">
              <Label htmlFor="normalBalance">
                Normal Balance <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.normalBalance}
                onValueChange={(value) =>
                  setFormData({ ...formData, normalBalance: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select balance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBIT">Debit</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS - Ghana Cedi</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter account description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Is Restricted */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isRestricted">Restricted Account</Label>
              <p className="text-sm text-muted-foreground">
                Mark this account as restricted for special fund tracking
              </p>
            </div>
            <Switch
              id="isRestricted"
              checked={formData.isRestricted}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isRestricted: checked })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
