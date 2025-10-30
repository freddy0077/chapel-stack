"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { X, CheckCircle, XCircle, FileText, Printer } from "lucide-react";
import { GET_JOURNAL_ENTRY_BY_ID } from "@/graphql/finance/queries";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface JournalEntry {
  id: string;
  journalEntryNumber: string;
  entryDate: string;
  entryType: string;
  description: string;
  reference?: string;
  status: "DRAFT" | "POSTED" | "VOID";
  totalDebit: number;
  totalCredit: number;
  fiscalYear: number;
  fiscalPeriod: number;
  sourceModule: string;
  sourceTransactionId?: string;
  isReversed: boolean;
  createdBy: string;
  createdAt: string;
  postingDate?: string;
  postedBy?: string;
  voidedAt?: string;
  voidedBy?: string;
  voidReason?: string;
  updatedAt: string;
  version?: number;
}

interface JournalEntryDetailsModalProps {
  open: boolean;
  onClose: () => void;
  entry: JournalEntry;
}

export default function JournalEntryDetailsModal({
  open,
  onClose,
  entry,
}: JournalEntryDetailsModalProps) {
  // Fetch full journal entry details
  const { data, loading, error } = useQuery(GET_JOURNAL_ENTRY_BY_ID, {
    variables: { id: entry.id },
    skip: !open,
  });

  const journalEntry = data?.journalEntry;

  const getStatusBadge = (status: string) => {
    const variants = {
      POSTED: "bg-green-100 text-green-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
      VOID: "bg-red-100 text-red-800",
    };
    const icons = {
      POSTED: <CheckCircle className="h-3 w-3 mr-1" />,
      DRAFT: <XCircle className="h-3 w-3 mr-1" />,
      VOID: <XCircle className="h-3 w-3 mr-1" />,
    };
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading journal entry...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !journalEntry) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center text-red-600">
              <XCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Error loading journal entry</p>
              <p className="text-sm text-muted-foreground mt-2">{error?.message}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {journalEntry.journalEntryNumber}
              </DialogTitle>
              <DialogDescription>
                {new Date(journalEntry.entryDate).toLocaleDateString()} • {journalEntry.entryType}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(journalEntry.status)}
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entry Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entry Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Entry Number</div>
                  <div className="font-mono font-medium">{journalEntry.journalEntryNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Entry Date</div>
                  <div className="font-medium">
                    {new Date(journalEntry.entryDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Entry Type</div>
                  <Badge variant="outline">{journalEntry.entryType}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Created By</div>
                  <div className="font-medium">{journalEntry.createdBy}</div>
                </div>
                {journalEntry.reference && (
                  <div>
                    <div className="text-sm text-muted-foreground">Reference</div>
                    <div className="font-medium">{journalEntry.reference}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Fiscal Period</div>
                  <div className="font-medium">{journalEntry.fiscalYear}/{journalEntry.fiscalPeriod}</div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-2">Description</div>
                <p className="text-sm">{journalEntry.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Totals Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entry Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Total Debit</div>
                  <div className="text-2xl font-bold font-mono text-green-600">
                    GHS {(journalEntry.totalDebit ?? 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Total Credit</div>
                  <div className="text-2xl font-bold font-mono text-blue-600">
                    GHS {(journalEntry.totalCredit ?? 0).toLocaleString()}
                  </div>
                </div>
              </div>
              {Math.abs((journalEntry.totalDebit ?? 0) - (journalEntry.totalCredit ?? 0)) < 0.01 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Entry is balanced</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-32 text-muted-foreground">Created</div>
                  <div>
                    <div className="font-medium">{journalEntry.createdBy}</div>
                    <div className="text-muted-foreground">
                      {new Date(journalEntry.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {journalEntry.status === "POSTED" && journalEntry.postingDate && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-32 text-muted-foreground">Posted</div>
                    <div>
                      <div className="font-medium">{journalEntry.postedBy || 'System'}</div>
                      <div className="text-muted-foreground">
                        {new Date(journalEntry.postingDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
                {journalEntry.status === "VOID" && journalEntry.voidedAt && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-32 text-muted-foreground">Voided</div>
                    <div>
                      <div className="font-medium">{journalEntry.voidedBy || 'System'}</div>
                      <div className="text-muted-foreground">
                        {new Date(journalEntry.voidedAt).toLocaleString()}
                      </div>
                      {journalEntry.voidReason && (
                        <div className="text-sm mt-1">
                          <span className="font-medium">Reason:</span> {journalEntry.voidReason}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions removed - handled in main journal entries page */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
