"use client";

import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { Loader2 } from "lucide-react";
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

interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  accountSubType?: string;
  normalBalance: string;
  description?: string;
  isRestricted?: boolean;
  currency?: string;
}

interface EditAccountModalProps {
  open: boolean;
  onClose: () => void;
  account: Account;
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function EditAccountModal({
  open,
  onClose,
  account,
  organisationId,
  branchId,
  userId,
}: EditAccountModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    accountCode: account.accountCode,
    accountName: account.accountName,
    accountType: account.accountType,
    accountSubType: account.accountSubType || "",
    normalBalance: account.normalBalance,
    description: account.description || "",
    isRestricted: account.isRestricted || false,
    currency: account.currency || "GHS",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        accountSubType: account.accountSubType || "",
        normalBalance: account.normalBalance,
        description: account.description || "",
        isRestricted: account.isRestricted || false,
        currency: account.currency || "GHS",
      });
    }
  }, [account]);

  const accountTypes = [
    { value: "ASSET", label: "Asset" },
    { value: "LIABILITY", label: "Liability" },
    { value: "EQUITY", label: "Equity" },
    { value: "REVENUE", label: "Revenue" },
    { value: "EXPENSE", label: "Expense" },
  ];

  const accountSubTypes = {
    ASSET: ["Current Asset", "Fixed Asset", "Other Asset"],
    LIABILITY: ["Current Liability", "Long-term Liability", "Other Liability"],
    EQUITY: ["Owner's Equity", "Retained Earnings", "Other Equity"],
    REVENUE: ["Operating Revenue", "Non-operating Revenue", "Other Revenue"],
    EXPENSE: ["Operating Expense", "Non-operating Expense", "Other Expense"],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      // TODO: Replace with actual mutation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Account updated successfully",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Update account information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountCode">
                Account Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountCode"
                value={formData.accountCode}
                onChange={(e) =>
                  setFormData({ ...formData, accountCode: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
                required
              />
            </div>

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
                  <SelectValue />
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
                        <SelectItem key={subType} value={subType}>
                          {subType}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>

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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBIT">Debit</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

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
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
