"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CREATE_JOURNAL_ENTRY } from "@/graphql/finance/mutations";
import { GET_CHART_OF_ACCOUNTS, GET_JOURNAL_ENTRIES } from "@/graphql/finance/queries";
import { 
  validateJournalEntry, 
  ValidationError,
  VALIDATION_LIMITS,
  getFieldError,
  hasFieldError 
} from "@/lib/validation/finance-validation";

interface LineItem {
  id: string;
  accountId: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

interface CreateJournalEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function CreateJournalEntryModal({
  open,
  onClose,
  onSuccess,
  organisationId,
  branchId,
  userId,
}: CreateJournalEntryModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Fetch GL accounts
  const { data: accountsData, loading: loadingAccounts } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: {
      organisationId,
      branchId,
    },
    skip: !organisationId || !branchId || !open,
  });

  const accounts = accountsData?.chartOfAccounts || [];

  // Create journal entry mutation
  const [createJournalEntry, { loading: creating }] = useMutation(CREATE_JOURNAL_ENTRY, {
    refetchQueries: [
      { query: GET_JOURNAL_ENTRIES, variables: { organisationId, branchId } },
      { query: GET_CHART_OF_ACCOUNTS, variables: { organisationId, branchId } }
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Journal entry created successfully",
      });
      onSuccess();
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create journal entry",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split("T")[0],
    entryType: "STANDARD",
    description: "",
    reference: "",
    memo: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      accountId: "",
      accountName: "",
      description: "",
      debit: 0,
      credit: 0,
    },
    {
      id: "2",
      accountId: "",
      accountName: "",
      description: "",
      debit: 0,
      credit: 0,
    },
  ]);

  const addLineItem = () => {
    if (lineItems.length >= VALIDATION_LIMITS.MAX_JOURNAL_LINES) {
      toast({
        title: "Maximum Lines Reached",
        description: `Cannot add more than ${VALIDATION_LIMITS.MAX_JOURNAL_LINES} lines`,
        variant: "destructive",
      });
      return;
    }
    
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        accountId: "",
        accountName: "",
        description: "",
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 2) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotals = () => {
    const totalDebit = lineItems.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalCredit = lineItems.reduce((sum, item) => sum + (item.credit || 0), 0);
    return { totalDebit, totalCredit, difference: totalDebit - totalCredit };
  };

  const { totalDebit, totalCredit, difference } = calculateTotals();
  const isBalanced = difference === 0 && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation errors
    setValidationErrors([]);

    // Validate journal entry
    const validation = validateJournalEntry(
      formData.entryDate,
      formData.description,
      lineItems.map(line => ({
        accountId: line.accountId,
        description: line.description,
        debit: line.debit || 0,
        credit: line.credit || 0,
      }))
    );

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: "Validation Error",
        description: validation.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createJournalEntry({
        variables: {
          input: {
            entryDate: formData.entryDate,
            entryType: formData.entryType,
            sourceModule: "MANUAL",
            description: formData.description,
            reference: formData.reference || undefined,
            memo: formData.memo || undefined,
            lines: lineItems.map((line) => ({
              accountId: line.accountId,
              description: line.description || undefined,
              debitAmount: line.debit || 0,
              creditAmount: line.credit || 0,
            })),
            organisationId,
            branchId,
          },
        },
      });
    } catch (error) {
      console.error("Error creating journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      entryDate: new Date().toISOString().split("T")[0],
      entryType: "STANDARD",
      description: "",
      reference: "",
      memo: "",
    });
    setLineItems([
      {
        id: "1",
        accountId: "",
        accountName: "",
        description: "",
        debit: 0,
        credit: 0,
      },
      {
        id: "2",
        accountId: "",
        accountName: "",
        description: "",
        debit: 0,
        credit: 0,
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Journal Entry</DialogTitle>
          <DialogDescription>
            Create a new general ledger entry
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Entry Header */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryDate">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="entryDate"
                type="date"
                value={formData.entryDate}
                onChange={(e) =>
                  setFormData({ ...formData, entryDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryType">
                Entry Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.entryType}
                onValueChange={(value) =>
                  setFormData({ ...formData, entryType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="ADJUSTING">Adjusting</SelectItem>
                  <SelectItem value="CLOSING">Closing</SelectItem>
                  <SelectItem value="REVERSING">Reversing</SelectItem>
                  <SelectItem value="OPENING">Opening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Optional reference"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter entry description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={2}
              maxLength={VALIDATION_LIMITS.MAX_DESCRIPTION}
              className={hasFieldError(validationErrors, 'Description') ? 'border-red-500' : ''}
            />
            {hasFieldError(validationErrors, 'Description') && (
              <p className="text-sm text-red-500">
                {getFieldError(validationErrors, 'Description')}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/{VALIDATION_LIMITS.MAX_DESCRIPTION} characters
            </p>
          </div>

          {/* Validation Errors Alert */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-1">Please fix the following errors:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.slice(0, 5).map((error, index) => (
                    <li key={index} className="text-sm">{error.message}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li className="text-sm">...and {validationErrors.length - 5} more</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Line
              </Button>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                {lineItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg"
                  >
                    <div className="col-span-4">
                      <Label className="text-xs">Account</Label>
                      <Select
                        value={item.accountId}
                        onValueChange={(value) =>
                          updateLineItem(item.id, "accountId", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingAccounts ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              Loading accounts...
                            </div>
                          ) : accounts.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No accounts available
                            </div>
                          ) : (
                            accounts
                              .filter((acc: any) => acc.isActive)
                              .map((account: any) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.accountCode} - {account.accountName}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-3">
                      <Label className="text-xs">Description</Label>
                      <Input
                        className="h-9"
                        placeholder="Line description"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        maxLength={VALIDATION_LIMITS.MAX_DESCRIPTION}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-xs">Debit</Label>
                      <Input
                        className={`h-9 ${hasFieldError(validationErrors, `line${index + 1}.debit`) || hasFieldError(validationErrors, `Line ${index + 1}`) ? 'border-red-500' : ''}`}
                        type="number"
                        min="0"
                        max={VALIDATION_LIMITS.MAX_JOURNAL_AMOUNT}
                        step="0.01"
                        value={item.debit || ""}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "debit",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-xs">Credit</Label>
                      <Input
                        className={`h-9 ${hasFieldError(validationErrors, `line${index + 1}.credit`) || hasFieldError(validationErrors, `Line ${index + 1}`) ? 'border-red-500' : ''}`}
                        type="number"
                        min="0"
                        max={VALIDATION_LIMITS.MAX_JOURNAL_AMOUNT}
                        step="0.01"
                        value={item.credit || ""}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "credit",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="col-span-1 pt-5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length <= 2}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Totals */}
          <Card className={isBalanced ? "bg-green-50" : "bg-red-50"}>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Debit</div>
                  <div className="text-lg font-bold">
                    GHS {totalDebit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Credit</div>
                  <div className="text-lg font-bold">
                    GHS {totalCredit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Difference</div>
                  <div
                    className={`text-lg font-bold ${
                      difference === 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    GHS {Math.abs(difference).toLocaleString()}
                  </div>
                </div>
              </div>
              {!isBalanced && totalDebit > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Entry is not balanced. Debits must equal credits.
                </p>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting || !isBalanced}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting || !isBalanced}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
