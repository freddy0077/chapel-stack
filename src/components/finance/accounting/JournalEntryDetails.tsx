"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit,
  Printer,
  Calendar,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntryDetailsProps {
  entryId: string;
  organisationId: string;
  branchId: string;
  userId: string;
  onBack: () => void;
}

interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
}

export default function JournalEntryDetails({
  entryId,
  organisationId,
  branchId,
  userId,
  onBack,
}: JournalEntryDetailsProps) {
  const { toast } = useToast();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);
  const [voidReason, setVoidReason] = useState("");

  // TODO: Replace with GraphQL query
  const loading = false;
  const error = null;

  // Mock data
  const journalEntry = {
    id: "je-1",
    journalEntryNumber: "JE-2025-10-001",
    entryDate: "2025-10-28",
    postingDate: null,
    entryType: "STANDARD",
    sourceModule: "MANUAL",
    sourceTransactionId: null,
    description: "Monthly offering deposit",
    reference: "OF-2025-10-001",
    fiscalYear: 2025,
    fiscalPeriod: 10,
    status: "DRAFT",
    isReversed: false,
    createdBy: "John Doe",
    createdAt: "2025-10-28T10:00:00Z",
    updatedAt: "2025-10-28T10:00:00Z",
    lines: [
      {
        id: "line-1",
        accountCode: "1121",
        accountName: "Operating Account - GCB",
        description: "Offering deposit",
        debitAmount: 15000,
        creditAmount: 0,
      },
      {
        id: "line-2",
        accountCode: "4020",
        accountName: "Offerings",
        description: "Offering revenue",
        debitAmount: 0,
        creditAmount: 15000,
      },
    ] as JournalEntryLine[],
  };

  const totalDebit = journalEntry.lines.reduce((sum, line) => sum + line.debitAmount, 0);
  const totalCredit = journalEntry.lines.reduce((sum, line) => sum + line.creditAmount, 0);
  const isBalanced = totalDebit === totalCredit;

  const handlePost = () => {
    setIsPostDialogOpen(true);
  };

  const confirmPost = async () => {
    // TODO: Implement GraphQL mutation
    toast({
      title: "Success",
      description: `Journal entry ${journalEntry.journalEntryNumber} posted successfully`,
    });
    setIsPostDialogOpen(false);
  };

  const handleVoid = () => {
    setIsVoidDialogOpen(true);
  };

  const confirmVoid = async () => {
    if (!voidReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for voiding this entry",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement GraphQL mutation
    toast({
      title: "Success",
      description: `Journal entry ${journalEntry.journalEntryNumber} voided successfully`,
    });
    setIsVoidDialogOpen(false);
    setVoidReason("");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Draft
          </Badge>
        );
      case "POSTED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Posted
          </Badge>
        );
      case "VOID":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Void
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEntryTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      STANDARD: "bg-blue-100 text-blue-800",
      ADJUSTING: "bg-purple-100 text-purple-800",
      CLOSING: "bg-orange-100 text-orange-800",
      REVERSING: "bg-pink-100 text-pink-800",
      OPENING: "bg-teal-100 text-teal-800",
    };
    return (
      <Badge variant="outline" className={colors[type] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight font-mono">
                {journalEntry.journalEntryNumber}
              </h2>
              {getStatusBadge(journalEntry.status)}
              {getEntryTypeBadge(journalEntry.entryType)}
            </div>
            <p className="text-muted-foreground mt-1">{journalEntry.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {journalEntry.status === "DRAFT" && (
            <>
              <Button variant="outline" onClick={() => {}}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={handlePost} className="bg-gradient-to-r from-green-500 to-emerald-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Post Entry
              </Button>
            </>
          )}
          {journalEntry.status === "POSTED" && !journalEntry.isReversed && (
            <Button variant="destructive" onClick={handleVoid}>
              <XCircle className="h-4 w-4 mr-2" />
              Void Entry
            </Button>
          )}
        </div>
      </div>

      {/* Balance Warning */}
      {!isBalanced && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Entry Out of Balance</h4>
                <p className="text-sm text-red-700 mt-1">
                  This journal entry is not balanced. Total debits must equal total credits.
                  Difference: GHS {Math.abs(totalDebit - totalCredit).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entry Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entry Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Entry Number</p>
                <p className="font-mono font-semibold">{journalEntry.journalEntryNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entry Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(journalEntry.entryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entry Type</p>
                {getEntryTypeBadge(journalEntry.entryType)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(journalEntry.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fiscal Period</p>
                <p className="font-medium">
                  {journalEntry.fiscalYear} - Period {journalEntry.fiscalPeriod}
                </p>
              </div>
              {journalEntry.reference && (
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-mono text-sm">{journalEntry.reference}</p>
                </div>
              )}
            </div>

            {journalEntry.postingDate && (
              <div>
                <p className="text-sm text-muted-foreground">Posting Date</p>
                <p className="font-medium">
                  {new Date(journalEntry.postingDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Source & Audit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Source Module</p>
                <Badge variant="outline">{journalEntry.sourceModule}</Badge>
              </div>
              {journalEntry.sourceTransactionId && (
                <div>
                  <p className="text-sm text-muted-foreground">Source Transaction</p>
                  <p className="font-mono text-sm">{journalEntry.sourceTransactionId}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{journalEntry.createdBy}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="text-sm">
                  {new Date(journalEntry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journal Entry Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Entry Lines</CardTitle>
          <CardDescription>Debit and credit entries for this journal entry</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntry.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-mono">{line.accountCode}</TableCell>
                  <TableCell className="font-medium">{line.accountName}</TableCell>
                  <TableCell className="text-muted-foreground">{line.description}</TableCell>
                  <TableCell className="text-right font-mono">
                    {line.debitAmount > 0 ? (
                      <span className="text-blue-600 font-semibold">
                        GHS {line.debitAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {line.creditAmount > 0 ? (
                      <span className="text-green-600 font-semibold">
                        GHS {line.creditAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="text-right font-bold">
                  TOTALS
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-blue-600">
                  GHS {totalDebit.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-green-600">
                  GHS {totalCredit.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  DIFFERENCE
                </TableCell>
                <TableCell colSpan={2} className="text-right font-mono font-bold">
                  {isBalanced ? (
                    <span className="text-green-600">GHS 0.00 ✓</span>
                  ) : (
                    <span className="text-red-600">
                      GHS {Math.abs(totalDebit - totalCredit).toLocaleString()}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Post Confirmation Dialog */}
      <AlertDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Post Journal Entry
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to post journal entry{" "}
              <span className="font-mono font-semibold">{journalEntry.journalEntryNumber}</span>?
              This action will make the entry permanent and affect the general ledger.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPost}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              Post Entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Void Confirmation Dialog */}
      <AlertDialog open={isVoidDialogOpen} onOpenChange={setIsVoidDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Void Journal Entry
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to void journal entry{" "}
              <span className="font-mono font-semibold">{journalEntry.journalEntryNumber}</span>.
              Please provide a reason for voiding this entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="voidReason">Reason for Voiding *</Label>
            <Textarea
              id="voidReason"
              placeholder="Enter reason for voiding this entry..."
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmVoid}
              disabled={!voidReason.trim()}
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              Void Entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
