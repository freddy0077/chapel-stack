"use client";

import React, { useState } from "react";
import { useBankAccounts } from "@/hooks/finance/useBankAccounts";
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRightLeft,
  Download,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddBankAccountModal from "./modals/AddBankAccountModal";
import EditBankAccountModal from "./modals/EditBankAccountModal";
import BankAccountDetailsModal from "./modals/BankAccountDetailsModal";
import BankReconciliationModal from "./modals/BankReconciliationModal";
import ReconciliationHistoryModal from "./modals/ReconciliationHistoryModal";

interface BankAccount {
  id: string;
  
  // GL Integration
  glAccountId: string;
  glAccountCode: string;
  glAccountName: string;
  
  // Bank Details
  accountName: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  
  // Balances
  bookBalance: number;        // From GL account
  bankBalance: number;        // From bank statement
  difference: number;         // bankBalance - bookBalance
  
  // Reconciliation
  lastReconciled: string;
  status: "ACTIVE" | "INACTIVE";
  isReconciled: boolean;
}

interface BankAccountsProps {
  organisationId: string;
  branchId: string;
  userId: string;
  onOpenReconciliation?: (accountId: string) => void;
}

export default function BankAccounts({
  organisationId,
  branchId,
  userId,
  onOpenReconciliation,
}: BankAccountsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [reconcileAllMode, setReconcileAllMode] = useState(false);
  const [currentReconcileIndex, setCurrentReconcileIndex] = useState(0);

  const handleOpenDetails = (account: any) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEdit = (account: any) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleOpenReconciliation = (account: any) => {
    setSelectedAccount(account);
    setIsReconciliationModalOpen(true);
  };

  const handleOpenHistory = (account: any) => {
    setSelectedAccount(account);
    setIsHistoryModalOpen(true);
  };

  const handleReconcileAll = () => {
    const unreconciledAccounts = bankAccounts.filter((acc: any) => !acc.isReconciled);
    if (unreconciledAccounts.length === 0) {
      alert("All accounts are already reconciled!");
      return;
    }
    setReconcileAllMode(true);
    setCurrentReconcileIndex(0);
    setSelectedAccount(unreconciledAccounts[0]);
    setIsReconciliationModalOpen(true);
  };

  const handleReconciliationSuccess = () => {
    if (reconcileAllMode) {
      const unreconciledAccounts = bankAccounts.filter((acc: any) => !acc.isReconciled);
      const nextIndex = currentReconcileIndex + 1;
      if (nextIndex < unreconciledAccounts.length) {
        setCurrentReconcileIndex(nextIndex);
        setSelectedAccount(unreconciledAccounts[nextIndex]);
      } else {
        setReconcileAllMode(false);
        setCurrentReconcileIndex(0);
        setIsReconciliationModalOpen(false);
        alert("All accounts reconciled successfully!");
      }
    }
    refetch();
  };

  const handleDownloadStatements = () => {
    alert("Download bank statements feature coming soon!");
  };

  // Use the custom hook
  const {
    bankAccounts: accountsData,
    totalBalance,
    unreconciledCount,
    totalDifference,
    loading,
    error,
    refetch,
  } = useBankAccounts({
    organisationId,
    branchId,
  });

  // Filter accounts based on search
  const filteredAccounts = accountsData.filter((account: any) => {
    if (searchQuery === "") return true;
    return (
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.glAccountName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const bankAccounts = filteredAccounts;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>Error loading bank accounts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        Inactive
      </Badge>
    );
  };

  const getReconciliationBadge = (isReconciled: boolean, bookBalance: number, currentBalance: number) => {
    if (isReconciled && bookBalance === currentBalance) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Reconciled
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-100 text-amber-800">
        <AlertCircle className="h-3 w-3 mr-1" />
        Needs Reconciliation
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bank Accounts</h2>
          <p className="text-muted-foreground">Manage bank accounts and reconciliation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bank Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {(totalBalance ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bankAccounts.length}</div>
            <p className="text-xs text-muted-foreground">Bank accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Reconciliation</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreconciledCount}</div>
            <p className="text-xs text-muted-foreground">Accounts pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bank accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts</CardTitle>
          <CardDescription>View and manage all bank accounts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name / GL Account</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Book Balance</TableHead>
                <TableHead className="text-right">Bank Balance</TableHead>
                <TableHead className="text-right">Difference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 className="h-12 w-12 mb-3 opacity-30" />
                      <p className="text-lg font-medium">No bank accounts found</p>
                      <p className="text-sm mt-1">
                        {searchQuery
                          ? "Try adjusting your search or create a new bank account"
                          : "Create your first bank account to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bankAccounts.map((account) => (
                  <TableRow key={account.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{account.accountName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        GL: {account.glAccountCode} - {account.glAccountName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{account.bankName}</TableCell>
                  <TableCell className="font-mono text-sm">{account.accountNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{account.accountType}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {account.currency} {(account.bookBalance ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {account.currency} {(account.bankBalance ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {account.difference && account.difference !== 0 ? (
                      <span className={account.difference > 0 ? "text-green-600" : "text-red-600"}>
                        {account.difference > 0 ? "+" : ""}
                        {account.currency} {account.difference.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getReconciliationBadge(
                      account.isReconciled,
                      account.bookBalance,
                      account.bankBalance
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenDetails(account)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(account)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Account
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenReconciliation(account)}
                        >
                          <ArrowRightLeft className="h-4 w-4 mr-2" />
                          Reconcile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenHistory(account)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleReconcileAll}
              disabled={unreconciledCount === 0}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Reconcile All Accounts ({unreconciledCount})
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                if (bankAccounts.length > 0) {
                  handleOpenHistory(bankAccounts[0]);
                }
              }}
              disabled={bankAccounts.length === 0}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reconciliation History
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleDownloadStatements}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Bank Statements
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Bank Account Modal */}
      <AddBankAccountModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
        organisationId={organisationId}
        branchId={branchId}
      />

      {/* Edit Bank Account Modal */}
      {selectedAccount && (
        <EditBankAccountModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          accountId={selectedAccount.id}
          onSuccess={refetch}
        />
      )}

      {/* Bank Account Details Modal */}
      {selectedAccount && (
        <BankAccountDetailsModal
          open={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          accountId={selectedAccount.id}
          onEdit={() => {
            setIsDetailsModalOpen(false);
            setIsEditModalOpen(true);
          }}
        />
      )}

      {/* Bank Reconciliation Modal */}
      {selectedAccount && (
        <BankReconciliationModal
          open={isReconciliationModalOpen}
          onClose={() => {
            setIsReconciliationModalOpen(false);
            setReconcileAllMode(false);
            setCurrentReconcileIndex(0);
          }}
          accountId={selectedAccount.id}
          accountName={selectedAccount.accountName}
          userId={userId}
          onSuccess={handleReconciliationSuccess}
        />
      )}

      {/* Reconciliation History Modal */}
      {selectedAccount && (
        <ReconciliationHistoryModal
          open={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          bankAccountId={selectedAccount.id}
          bankAccountName={selectedAccount.accountName}
        />
      )}
    </div>
  );
}
