"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import CreateJournalEntryModal from "./modals/CreateJournalEntryModal";
import JournalEntryDetailsModal from "./modals/JournalEntryDetailsModal";
import SelectOfferingBatchModal from "./modals/SelectOfferingBatchModal";
import { useJournalEntries } from "@/hooks/finance/useJournalEntries";
import { ConflictDialog, useConflictDialog } from "@/components/finance/ConflictDialog";

interface JournalEntry {
  id: string;
  journalEntryNumber: string;
  entryDate: string;
  entryType: string;
  description: string;
  status: "DRAFT" | "POSTED" | "VOID";
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  version?: number;
}

interface JournalEntriesProps {
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function JournalEntries({
  organisationId,
  branchId,
  userId,
}: JournalEntriesProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [entryToAction, setEntryToAction] = useState<JournalEntry | null>(null);
  const [isPostOfferingModalOpen, setIsPostOfferingModalOpen] = useState(false);
  
  // Conflict dialog for optimistic locking
  const { isOpen: isConflictOpen, hideConflict } = useConflictDialog();

  // Use the custom hook
  const {
    entries,
    totalCount,
    loading,
    error,
    refetch,
    postJournalEntry,
    voidJournalEntry,
    posting,
    voiding,
  } = useJournalEntries({
    organisationId,
    branchId,
    status: filterStatus === "all" ? undefined : filterStatus,
  });

  // Filter entries based on search
  const filteredEntries = entries.filter((entry: JournalEntry) => {
    if (searchQuery === "") return true;
    return (
      entry.journalEntryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      POSTED: "bg-green-100 text-green-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
      VOID: "bg-red-100 text-red-800",
    };
    const icons = {
      POSTED: <CheckCircle className="h-3 w-3 mr-1" />,
      DRAFT: <Clock className="h-3 w-3 mr-1" />,
      VOID: <XCircle className="h-3 w-3 mr-1" />,
    };
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const handleViewDetails = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDetailsModalOpen(true);
  };

  const handlePost = (entry: JournalEntry) => {
    setEntryToAction(entry);
    setIsPostDialogOpen(true);
  };

  const handleVoid = (entry: JournalEntry) => {
    setEntryToAction(entry);
    setVoidReason("");
    setIsVoidDialogOpen(true);
  };

  const confirmPost = async () => {
    if (!entryToAction) return;

    try {
      // Send version for optimistic locking
      await postJournalEntry(entryToAction.id, entryToAction.version);
      setIsPostDialogOpen(false);
      setEntryToAction(null);
    } catch (error) {
      console.error("Error posting entry:", error);
      // Error handling is done in the hook
    }
  };

  const confirmVoid = async () => {
    if (!entryToAction) return;

    if (!voidReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for voiding this entry",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send version for optimistic locking
      await voidJournalEntry({
        id: entryToAction.id,
        reason: voidReason.trim(),
      }, entryToAction.version);
      setIsVoidDialogOpen(false);
      setEntryToAction(null);
      setVoidReason("");
    } catch (error) {
      console.error("Error voiding entry:", error);
      // Error handling is done in the hook
    }
  };

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
            <AlertCircle className="h-5 w-5" />
            <p>Error loading journal entries</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Journal Entries</h2>
          <p className="text-muted-foreground">Manage general ledger entries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPostOfferingModalOpen(true)}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Post Offering to GL
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="POSTED">Posted</SelectItem>
                <SelectItem value="VOID">Void</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Adjusting">Adjusting</SelectItem>
                <SelectItem value="Closing">Closing</SelectItem>
                <SelectItem value="Reversing">Reversing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Entry Number</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[120px] text-right">Debit</TableHead>
                <TableHead className="w-[120px] text-right">Credit</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-lg font-medium">No journal entries found</p>
                      <p className="text-sm mt-1">
                        {searchQuery || filterStatus !== "all" || filterType !== "all"
                          ? "Try adjusting your filters or create a new entry"
                          : "Create your first journal entry to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">
                    {entry.journalEntryNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(entry.entryDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.entryType}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    GHS {(entry.totalDebit ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    GHS {(entry.totalCredit ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* View Details Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(entry)}
                        className="h-8"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {/* Post Button (DRAFT only) */}
                      {entry.status === "DRAFT" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handlePost(entry)}
                          className="h-8 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Post
                        </Button>
                      )}

                      {/* Void Button (POSTED only) */}
                      {entry.status === "POSTED" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleVoid(entry)}
                          className="h-8"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Void
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

      {/* Modals */}
      <CreateJournalEntryModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
        organisationId={organisationId}
        branchId={branchId}
        userId={userId}
      />

      {selectedEntry && (
        <JournalEntryDetailsModal
          open={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          entry={selectedEntry}
        />
      )}

      {/* Select Offering Batch Modal */}
      <SelectOfferingBatchModal
        open={isPostOfferingModalOpen}
        onClose={() => setIsPostOfferingModalOpen(false)}
        organisationId={organisationId}
        branchId={branchId}
        onSuccess={refetch}
      />

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
              <span className="font-mono font-semibold">
                {entryToAction?.journalEntryNumber}
              </span>
              ? This action will make the entry permanent and affect the general ledger.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={posting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPost}
              disabled={posting}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              {posting ? "Posting..." : "Post Entry"}
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
              <span className="font-mono font-semibold">
                {entryToAction?.journalEntryNumber}
              </span>
              . Please provide a reason for voiding this entry.
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
            <AlertDialogCancel disabled={voiding}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmVoid}
              disabled={voiding || !voidReason.trim()}
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              {voiding ? "Voiding..." : "Void Entry"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Conflict Dialog for Optimistic Locking */}
      <ConflictDialog
        open={isConflictOpen}
        onClose={hideConflict}
        onRefresh={async () => {
          await refetch();
          hideConflict();
          toast({
            title: "Refreshed",
            description: "Journal entries have been refreshed with the latest data",
          });
        }}
        entityName="Journal Entry"
      />
    </div>
  );
}
