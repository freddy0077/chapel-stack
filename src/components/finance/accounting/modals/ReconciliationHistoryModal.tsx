"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { X, CheckCircle, XCircle, FileText, Download, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { GET_BANK_RECONCILIATIONS } from "@/graphql/finance/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface ReconciliationHistoryModalProps {
  open: boolean;
  onClose: () => void;
  bankAccountId: string;
  bankAccountName: string;
}

export default function ReconciliationHistoryModal({
  open,
  onClose,
  bankAccountId,
  bankAccountName,
}: ReconciliationHistoryModalProps) {
  const { data, loading, error } = useQuery(GET_BANK_RECONCILIATIONS, {
    variables: { bankAccountId },
    skip: !open || !bankAccountId,
  });

  const reconciliations = data?.bankReconciliations || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      RECONCILED: { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Reconciled" },
      PENDING: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      VOIDED: { variant: "destructive" as const, className: "bg-red-100 text-red-800", label: "Voided" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleDownloadStatement = (reconciliationId: string, date: string) => {
    // TODO: Implement actual download
    console.log("Download statement for reconciliation:", reconciliationId);
    alert(`Download statement for ${date} - Feature coming soon!`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reconciliation History</DialogTitle>
          <DialogDescription>
            View past reconciliations for {bankAccountName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  <p>Error loading reconciliation history: {error.message}</p>
                </div>
              </CardContent>
            </Card>
          ) : reconciliations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Reconciliation History</p>
                  <p className="text-sm mt-2">
                    This bank account has not been reconciled yet
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Bank Balance</TableHead>
                      <TableHead className="text-right">Book Balance</TableHead>
                      <TableHead className="text-right">Difference</TableHead>
                      <TableHead>Reconciled By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliations.map((reconciliation: any) => (
                      <TableRow key={reconciliation.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(reconciliation.reconciliationDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(reconciliation.status)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          GHS {reconciliation.bankStatementBalance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          GHS {reconciliation.bookBalance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span
                            className={
                              Math.abs(reconciliation.difference) < 0.01
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {Math.abs(reconciliation.difference) < 0.01 ? (
                              <span className="flex items-center justify-end gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Balanced
                              </span>
                            ) : (
                              `GHS ${Math.abs(reconciliation.difference).toLocaleString()}`
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {reconciliation.reconciledBy || "System"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownloadStatement(
                                reconciliation.id,
                                new Date(reconciliation.reconciliationDate).toLocaleDateString()
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {reconciliations.length > 0 && (
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                Total Reconciliations: {reconciliations.length}
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
