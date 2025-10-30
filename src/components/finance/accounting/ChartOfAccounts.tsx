"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import CreateAccountModal from "./modals/CreateAccountModal";
import EditAccountModal from "./modals/EditAccountModal";
import AccountDetailsDrawer from "./modals/AccountDetailsDrawer";
import { useChartOfAccounts } from "@/hooks/finance/useChartOfAccounts";

interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  accountSubType?: string;
  normalBalance: "DEBIT" | "CREDIT";
  isActive: boolean;
  balance: number;
  parentAccountId?: string;
  subAccounts?: Account[];
  
  // Bank Account Integration
  isBankAccount?: boolean;
  bankAccountId?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountType: string;
  };
}

interface ChartOfAccountsProps {
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function ChartOfAccounts({
  organisationId,
  branchId,
  userId,
}: ChartOfAccountsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  // Use the custom hook
  const {
    accounts: accountsData,
    flatAccounts,
    loading,
    error,
    refetch,
    deactivateAccount,
    deactivating,
  } = useChartOfAccounts({
    organisationId,
    branchId,
    accountType: filterType === "all" ? undefined : filterType,
  });

  // Filter accounts based on search and status
  const filteredAccounts = accountsData.filter((account: Account) => {
    const matchesSearch = searchQuery === "" ||
      account.accountCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && account.isActive) ||
      (filterStatus === "inactive" && !account.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
    setIsDetailsDrawerOpen(true);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (account: Account) => {
    if (confirm(`Are you sure you want to deactivate account ${account.accountCode} - ${account.accountName}?`)) {
      await deactivateAccount(account.id);
    }
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      ASSET: "bg-blue-100 text-blue-800",
      LIABILITY: "bg-red-100 text-red-800",
      EQUITY: "bg-purple-100 text-purple-800",
      REVENUE: "bg-green-100 text-green-800",
      EXPENSE: "bg-orange-100 text-orange-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const renderAccountRow = (account: Account, level: number = 0) => {
    const hasSubAccounts = account.subAccounts && account.subAccounts.length > 0;
    const isExpanded = expandedAccounts.has(account.id);

    return (
      <React.Fragment key={account.id}>
        <TableRow className="hover:bg-muted/50">
          <TableCell className="font-medium">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
              {hasSubAccounts && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleExpand(account.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!hasSubAccounts && <div className="w-6" />}
              <span className="font-mono text-sm">{account.accountCode}</span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span>{account.accountName}</span>
              {account.isBankAccount && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Building2 className="h-3 w-3 mr-1" />
                  Bank
                </Badge>
              )}
              {account.accountSubType && !account.isBankAccount && (
                <span className="text-xs text-muted-foreground">({account.accountSubType})</span>
              )}
              {account.isBankAccount && account.bankDetails && (
                <span className="text-xs text-muted-foreground">
                  ({account.bankDetails.bankName} - {account.bankDetails.accountNumber})
                </span>
              )}
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
              {account.accountType}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant="outline">{account.normalBalance}</Badge>
          </TableCell>
          <TableCell className="text-right font-mono">
            GHS {(account.balance || 0).toLocaleString()}
          </TableCell>
          <TableCell>
            {account.isActive ? (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                <XCircle className="h-3 w-3 mr-1" />
                Inactive
              </Badge>
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
                <DropdownMenuItem onClick={() => handleViewDetails(account)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(account)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(account)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {hasSubAccounts && isExpanded && account.subAccounts!.map((subAccount) => renderAccountRow(subAccount, level + 1))}
      </React.Fragment>
    );
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
            <p>Error loading accounts</p>
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
          <h2 className="text-2xl font-bold tracking-tight">Chart of Accounts</h2>
          <p className="text-muted-foreground">Manage your organization's accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Account
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
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ASSET">Assets</SelectItem>
                <SelectItem value="LIABILITY">Liabilities</SelectItem>
                <SelectItem value="EQUITY">Equity</SelectItem>
                <SelectItem value="REVENUE">Revenue</SelectItem>
                <SelectItem value="EXPENSE">Expenses</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[100px]">Balance</TableHead>
                <TableHead className="w-[150px] text-right">Current Balance</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-lg font-medium">No accounts found</p>
                      <p className="text-sm mt-1">
                        {searchQuery || filterType !== "all" || filterStatus !== "all"
                          ? "Try adjusting your filters or create a new account"
                          : "Create your first account to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => renderAccountRow(account))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateAccountModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
        organisationId={organisationId}
        branchId={branchId}
        userId={userId}
      />
      
      {selectedAccount && (
        <>
          <EditAccountModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            account={selectedAccount}
            organisationId={organisationId}
            branchId={branchId}
            userId={userId}
          />
          
          <AccountDetailsDrawer
            open={isDetailsDrawerOpen}
            onClose={() => setIsDetailsDrawerOpen(false)}
            onEdit={() => {
              setIsDetailsDrawerOpen(false);
              setIsEditModalOpen(true);
            }}
            account={selectedAccount}
            organisationId={organisationId}
            branchId={branchId}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}
