"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { GET_OFFERING_BATCHES } from "@/graphql/finance/queries";
import PostOfferingToGLModal from "./PostOfferingToGLModal";

interface OfferingBatch {
  id: string;
  batchNumber: string;
  batchDate: string;
  serviceName: string;
  offeringType: string;
  cashAmount: number;
  mobileMoneyAmount: number;
  chequeAmount: number;
  foreignCurrencyAmount: number;
  totalAmount: number;
  status: string;
  isPostedToGL: boolean;
}

interface SelectOfferingBatchModalProps {
  open: boolean;
  onClose: () => void;
  organisationId: string;
  branchId: string;
  onSuccess: () => void;
}

export default function SelectOfferingBatchModal({
  open,
  onClose,
  organisationId,
  branchId,
  onSuccess,
}: SelectOfferingBatchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<OfferingBatch | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Fetch offering batches
  const { data, loading } = useQuery(GET_OFFERING_BATCHES, {
    variables: { organisationId, branchId },
    skip: !open,
  });

  const batches = Array.isArray(data?.offeringBatches) ? data.offeringBatches : [];

  // Filter unposted and approved batches
  const unpostedBatches = batches.filter(
    (batch: OfferingBatch) =>
      batch &&
      !batch.isPostedToGL &&
      batch.status === "APPROVED" &&
      (searchQuery === "" ||
        batch.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.offeringType?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectBatch = (batch: OfferingBatch) => {
    setSelectedBatch(batch);
    setIsPostModalOpen(true);
  };

  const handlePostSuccess = () => {
    setIsPostModalOpen(false);
    setSelectedBatch(null);
    onSuccess();
    onClose();
  };

  return (
    <>
      <Dialog open={open && !isPostModalOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Select Offering Batch to Post
            </DialogTitle>
            <DialogDescription>
              Select an approved offering batch to post to the general ledger. Only approved batches that haven't been posted yet are shown.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by batch number, service, or offering type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Table */}
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : unpostedBatches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No unposted offerings found</p>
                <p className="text-sm mt-1">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "All approved offerings have been posted to GL"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unpostedBatches.map((batch: OfferingBatch) => (
                    <TableRow key={batch.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium">
                        {batch.batchNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(batch.batchDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{batch.serviceName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{batch.offeringType}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        GHS {(batch.totalAmount ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {batch.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSelectBatch(batch)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600"
                        >
                          Post to GL
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Offering to GL Modal */}
      {selectedBatch && (
        <PostOfferingToGLModal
          open={isPostModalOpen}
          onClose={() => {
            setIsPostModalOpen(false);
            setSelectedBatch(null);
          }}
          batch={selectedBatch}
          organisationId={organisationId}
          branchId={branchId}
          onSuccess={handlePostSuccess}
        />
      )}
    </>
  );
}
