"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
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
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Banknote,
  Smartphone,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { APPROVE_OFFERING_BATCH, POST_OFFERING_TO_GL } from "@/graphql/finance/mutations";
import { GET_OFFERING_BATCHES } from "@/graphql/finance/queries";

interface OfferingBatchDetailsProps {
  batchId: string;
  organisationId: string;
  branchId: string;
  userId: string;
  onBack: () => void;
}

export default function OfferingBatchDetails({
  batchId,
  organisationId,
  branchId,
  userId,
  onBack,
}: OfferingBatchDetailsProps) {
  const { toast } = useToast();
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  // TODO: Replace with GraphQL query
  const loading = false;
  const error = null;

  // Mock data
  const offeringBatch = {
    id: "batch-1",
    batchNumber: "OF-2025-10-001",
    batchDate: "2025-10-28",
    serviceName: "Sunday Morning Service",
    serviceId: "service-1",
    offeringType: "GENERAL",
    cashAmount: 12000,
    mobileMoneyAmount: 3000,
    chequeAmount: 0,
    foreignCurrencyAmount: 0,
    totalAmount: 15000,
    cashDenominations: {
      "200": 30,
      "100": 40,
      "50": 40,
      "20": 50,
      "10": 20,
      "5": 40,
      "2": 50,
      "1": 100,
    },
    counters: [
      { name: "John Doe", role: "Primary Counter" },
      { name: "Jane Smith", role: "Secondary Counter" },
    ],
    countedBy: ["user-1", "user-2"],
    verifiedBy: "user-3",
    verifiedAt: "2025-10-28T11:00:00Z",
    approvedBy: null,
    approvedAt: null,
    discrepancyAmount: 0,
    discrepancyNotes: null,
    status: "VERIFIED",
    isPostedToGL: false,
    journalEntryId: null,
    createdAt: "2025-10-28T10:00:00Z",
  };

  const handleVerify = () => {
    setIsVerifyDialogOpen(true);
  };

  const confirmVerify = async () => {
    // TODO: Implement GraphQL mutation
    toast({
      title: "Success",
      description: `Offering batch ${offeringBatch.batchNumber} verified successfully`,
    });
    setIsVerifyDialogOpen(false);
  };

  const handleApprove = () => {
    setIsApproveDialogOpen(true);
  };

  const [approveOfferingBatch, { loading: approving }] = useMutation(APPROVE_OFFERING_BATCH, {
    refetchQueries: [
      { query: GET_OFFERING_BATCHES, variables: { organisationId, branchId } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "Success",
        description: `Offering batch ${offeringBatch.batchNumber} approved successfully`,
      });
      setIsApproveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve offering batch",
        variant: "destructive",
      });
    },
  });

  const confirmApprove = async () => {
    try {
      await approveOfferingBatch({
        variables: { id: batchId },
      });
    } catch (error) {
      console.error("Error approving offering batch:", error);
    }
  };

  const handlePostToGL = () => {
    setIsPostDialogOpen(true);
  };

  const [postOfferingToGL, { loading: posting }] = useMutation(POST_OFFERING_TO_GL, {
    refetchQueries: [
      { query: GET_OFFERING_BATCHES, variables: { organisationId, branchId } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "Success",
        description: `Offering batch ${offeringBatch.batchNumber} posted to GL successfully. Journal entry created.`,
      });
      setIsPostDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post offering batch to GL",
        variant: "destructive",
      });
    },
  });

  const confirmPostToGL = async () => {
    try {
      await postOfferingToGL({
        variables: { id: batchId },
      });
    } catch (error) {
      console.error("Error posting offering to GL:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COUNTING":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Counting
          </Badge>
        );
      case "PENDING_VERIFICATION":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "POSTED":
        return (
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
            <FileCheck className="h-3 w-3 mr-1" />
            Posted to GL
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOfferingTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      GENERAL: "bg-blue-100 text-blue-800",
      TITHE: "bg-green-100 text-green-800",
      SPECIAL: "bg-purple-100 text-purple-800",
      BUILDING: "bg-orange-100 text-orange-800",
      MISSIONS: "bg-pink-100 text-pink-800",
      THANKSGIVING: "bg-yellow-100 text-yellow-800",
    };
    return (
      <Badge variant="outline" className={colors[type] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    );
  };

  const denominationDetails = Object.entries(offeringBatch.cashDenominations).map(
    ([denomination, count]) => ({
      denomination: parseFloat(denomination),
      count: count as number,
      total: parseFloat(denomination) * (count as number),
    })
  );

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
                {offeringBatch.batchNumber}
              </h2>
              {getStatusBadge(offeringBatch.status)}
              {getOfferingTypeBadge(offeringBatch.offeringType)}
            </div>
            <p className="text-muted-foreground mt-1">{offeringBatch.serviceName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {offeringBatch.status === "PENDING_VERIFICATION" && (
            <Button onClick={handleVerify} className="bg-gradient-to-r from-purple-500 to-purple-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Batch
            </Button>
          )}
          {offeringBatch.status === "VERIFIED" && (
            <Button onClick={handleApprove} className="bg-gradient-to-r from-green-500 to-emerald-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Batch
            </Button>
          )}
          {offeringBatch.status === "APPROVED" && !offeringBatch.isPostedToGL && (
            <Button onClick={handlePostToGL} className="bg-gradient-to-r from-blue-500 to-blue-600">
              <FileCheck className="h-4 w-4 mr-2" />
              Post to GL
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  GHS {offeringBatch.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cash Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  GHS {offeringBatch.cashAmount.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mobile Money</p>
                <p className="text-2xl font-bold text-purple-600">
                  GHS {offeringBatch.mobileMoneyAmount.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Counters</p>
                <p className="text-2xl font-bold">{offeringBatch.counters.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Batch Number</p>
                <p className="font-mono font-semibold">{offeringBatch.batchNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Batch Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(offeringBatch.batchDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{offeringBatch.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offering Type</p>
                {getOfferingTypeBadge(offeringBatch.offeringType)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(offeringBatch.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posted to GL</p>
                <Badge variant="outline" className={offeringBatch.isPostedToGL ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {offeringBatch.isPostedToGL ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workflow Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Counted */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Counted</p>
                  <p className="text-sm text-muted-foreground">
                    By {offeringBatch.counters.map(c => c.name).join(", ")}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Verified */}
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  offeringBatch.verifiedBy ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {offeringBatch.verifiedBy ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Verified</p>
                  {offeringBatch.verifiedBy ? (
                    <p className="text-sm text-muted-foreground">
                      {new Date(offeringBatch.verifiedAt!).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Pending verification</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Approved */}
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  offeringBatch.approvedBy ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {offeringBatch.approvedBy ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Approved</p>
                  {offeringBatch.approvedBy ? (
                    <p className="text-sm text-muted-foreground">
                      {new Date(offeringBatch.approvedAt!).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Pending approval</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Posted to GL */}
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  offeringBatch.isPostedToGL ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {offeringBatch.isPostedToGL ? (
                    <FileCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Posted to GL</p>
                  {offeringBatch.journalEntryId ? (
                    <p className="text-sm text-muted-foreground font-mono">
                      {offeringBatch.journalEntryId}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not posted yet</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Denominations */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Denominations Breakdown</CardTitle>
          <CardDescription>Detailed breakdown of cash received</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Denomination</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {denominationDetails
                .sort((a, b) => b.denomination - a.denomination)
                .map((item) => (
                  <TableRow key={item.denomination}>
                    <TableCell className="font-mono font-semibold">
                      GHS {item.denomination.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      GHS {item.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={2} className="text-right font-bold">
                  TOTAL CASH
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-blue-600">
                  GHS {offeringBatch.cashAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Counters */}
      <Card>
        <CardHeader>
          <CardTitle>Counter Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offeringBatch.counters.map((counter, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{counter.name}</p>
                  <p className="text-sm text-muted-foreground">{counter.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AlertDialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Offering Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify this offering batch? This confirms that the amounts have been counted correctly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVerify} className="bg-gradient-to-r from-purple-500 to-purple-600">
              Verify Batch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Offering Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this offering batch? This will allow it to be posted to the general ledger.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} className="bg-gradient-to-r from-green-500 to-emerald-600">
              Approve Batch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post to General Ledger</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to post this offering batch to the general ledger? This will create a journal entry and update account balances.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPostToGL} className="bg-gradient-to-r from-blue-500 to-blue-600">
              Post to GL
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
