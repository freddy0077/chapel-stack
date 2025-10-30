"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useOfferingBatches } from "@/hooks/finance/useOfferingBatches";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  ThumbsUp,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import OfferingVerificationModal from "./modals/OfferingVerificationModal";
import PostOfferingToGLModal from "./modals/PostOfferingToGLModal";
import { APPROVE_OFFERING_BATCH } from "@/graphql/finance/mutations";
import { GET_OFFERING_BATCHES } from "@/graphql/finance/queries";

interface OfferingBatch {
  id: string;
  batchNumber: string;
  serviceName: string;
  offeringType: string;
  batchDate: string;
  cashAmount: number;
  mobileMoneyAmount: number;
  totalAmount: number;
  status: string;
  isPostedToGL: boolean;
  journalEntryId?: string;
  countedBy: Array<{ id: string; name: string }>;
  verifiedBy?: { id: string; name: string };
  cashDenominations: Record<string, number>;
  createdAt: string;
}

interface OfferingBatchListProps {
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function OfferingBatchList({
  organisationId,
  branchId,
  userId,
}: OfferingBatchListProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState<OfferingBatch | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPostToGLModalOpen, setIsPostToGLModalOpen] = useState(false);
  const [batchToPost, setBatchToPost] = useState<OfferingBatch | null>(null);

  // Approve mutation
  const [approveOfferingBatch, { loading: approving }] = useMutation(APPROVE_OFFERING_BATCH, {
    refetchQueries: [
      { query: GET_OFFERING_BATCHES, variables: { organisationId, branchId } },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      toast({
        title: "Success",
        description: `Offering batch approved successfully`,
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve offering batch",
        variant: "destructive",
      });
    },
  });


  const handleApprove = async (batchId: string, batchNumber: string) => {
    if (window.confirm(`Approve offering batch ${batchNumber}?`)) {
      try {
        await approveOfferingBatch({ variables: { id: batchId } });
      } catch (error) {
        console.error("Error approving batch:", error);
      }
    }
  };

  const handlePostToGL = (batch: OfferingBatch) => {
    setBatchToPost(batch);
    setIsPostToGLModalOpen(true);
  };

  // Use the custom hook
  const {
    batches: batchesData,
    totalCount,
    loading,
    error,
    refetch,
  } = useOfferingBatches({
    organisationId,
    branchId,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mock data for fallback
  const mockBatches: OfferingBatch[] = [
    {
      id: "1",
      batchNumber: "OFR-2025-0001",
      serviceName: "Sunday 1st Service",
      offeringType: "general",
      batchDate: "2025-10-27T09:00:00Z",
      cashAmount: 5200,
      mobileMoneyAmount: 800,
      totalAmount: 6000,
      status: "COUNTING",
      countedBy: [
        { id: "user-1", name: "John Doe" },
        { id: "user-2", name: "Jane Smith" },
      ],
      cashDenominations: { "200": 20, "100": 10, "50": 4, coins: 0 },
      createdAt: "2025-10-27T10:30:00Z",
    },
    {
      id: "2",
      batchNumber: "OFR-2025-0002",
      serviceName: "Sunday 2nd Service",
      offeringType: "tithe",
      batchDate: "2025-10-27T11:00:00Z",
      cashAmount: 8500,
      mobileMoneyAmount: 1500,
      totalAmount: 10000,
      status: "VERIFIED",
      countedBy: [{ id: "user-1", name: "John Doe" }],
      verifiedBy: { id: "user-3", name: "Treasurer Sarah" },
      cashDenominations: { "200": 40, "100": 5, coins: 0 },
      createdAt: "2025-10-27T12:30:00Z",
    },
    {
      id: "3",
      batchNumber: "OFR-2025-0003",
      serviceName: "Wednesday Service",
      offeringType: "special",
      batchDate: "2025-10-23T18:00:00Z",
      cashAmount: 3200,
      mobileMoneyAmount: 300,
      totalAmount: 3500,
      status: "APPROVED",
      countedBy: [{ id: "user-2", name: "Jane Smith" }],
      verifiedBy: { id: "user-3", name: "Treasurer Sarah" },
      cashDenominations: { "200": 15, "50": 4, coins: 0 },
      createdAt: "2025-10-23T19:00:00Z",
    },
  ];

  // Use real data if available, otherwise show empty state (not mock data)
  const batches = batchesData;

  const getStatusBadge = (status: string, isPostedToGL?: boolean) => {
    const variants = {
      COUNTING: {
        className: "bg-blue-100 text-blue-800",
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: "Counting",
      },
      VERIFIED: {
        className: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: "Verified - Pending Approval",
      },
      DEPOSITED: {
        className: "bg-teal-100 text-teal-800",
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: "Deposited - Pending Approval",
      },
      APPROVED: {
        className: "bg-purple-100 text-purple-800",
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: "Approved - Ready to Post",
      },
      POSTED: {
        className: isPostedToGL ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
        icon: isPostedToGL ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />,
        label: isPostedToGL ? "Posted to GL" : "Error - Not Posted",
      },
    };

    const variant = variants[status as keyof typeof variants] || variants.COUNTING;

    return (
      <Badge variant="outline" className={variant.className}>
        {variant.icon}
        {variant.label}
      </Badge>
    );
  };

  const handleViewBatch = (batch: OfferingBatch) => {
    setSelectedBatch(batch);
    setIsVerificationModalOpen(true);
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <p>Error loading offering batches</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Offering Batches</h2>
          <p className="text-muted-foreground">View and verify offering collections</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Counting</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.filter((b) => b.status === "COUNTING").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified/Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.filter((b) => b.status === "VERIFIED" || b.status === "APPROVED").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posted</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {batches.reduce((sum, b) => sum + (b.status === "POSTED" || b.status === "DEPOSITED" ? b.totalAmount : 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by batch number or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COUNTING">Counting</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="POSTED">Posted</SelectItem>
                <SelectItem value="DEPOSITED">Deposited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Offering Batches</CardTitle>
          <CardDescription>
            {filteredBatches.length} batch{filteredBatches.length !== 1 ? "es" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Number</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Counted By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-lg font-medium">No offering batches found</p>
                      <p className="text-sm mt-1">
                        {statusFilter !== "all" 
                          ? "Try changing the status filter or create a new batch"
                          : "Create your first offering batch to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono font-medium">
                      {batch.batchNumber}
                    </TableCell>
                    <TableCell>{batch.serviceName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {batch.offeringType.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(batch.batchDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      GHS {batch.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {batch.countedBy && batch.countedBy.slice(0, 2).map((counterId, index) => (
                          <Badge key={counterId || index} variant="outline" className="text-xs">
                            Counter {index + 1}
                          </Badge>
                        ))}
                        {batch.countedBy && batch.countedBy.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{batch.countedBy.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(batch.status, (batch as any).isPostedToGL)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBatch(batch)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Approve Button - Show for VERIFIED or DEPOSITED */}
                        {(batch.status === 'VERIFIED' || batch.status === 'DEPOSITED') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(batch.id, batch.batchNumber)}
                            disabled={approving}
                            title="Approve batch"
                            className="text-green-600 hover:text-green-700"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Post to GL Button - Show for APPROVED */}
                        {batch.status === 'APPROVED' && !(batch as any).isPostedToGL && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePostToGL(batch)}
                            title="Post to General Ledger"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verification Modal */}
      <OfferingVerificationModal
        open={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setSelectedBatch(null);
        }}
        batch={selectedBatch}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Post to GL Modal */}
      <PostOfferingToGLModal
        open={isPostToGLModalOpen}
        onClose={() => {
          setIsPostToGLModalOpen(false);
          setBatchToPost(null);
        }}
        batch={batchToPost}
        organisationId={organisationId}
        branchId={branchId}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
