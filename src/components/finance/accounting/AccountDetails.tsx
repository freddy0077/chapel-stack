"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  ChevronRight,
} from "lucide-react";

interface AccountDetailsProps {
  accountId: string;
  organisationId: string;
  branchId: string;
  onBack: () => void;
  onEdit: () => void;
}

interface Transaction {
  id: string;
  date: string;
  journalEntryNumber: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export default function AccountDetails({
  accountId,
  organisationId,
  branchId,
  onBack,
  onEdit,
}: AccountDetailsProps) {
  // TODO: Replace with GraphQL queries
  const loading = false;
  const error = null;

  // Mock data
  const account = {
    id: "gl-1121",
    accountCode: "1121",
    accountName: "Operating Account - GCB",
    accountType: "ASSET",
    accountSubType: "Bank Account",
    normalBalance: "DEBIT",
    description: "Main operating bank account at Ghana Commercial Bank",
    notes: "Primary account for day-to-day operations",
    isActive: true,
    isBankAccount: true,
    bankAccountId: "1",
    currency: "GHS",
    parentAccountId: "1",
    parentAccountCode: "1000",
    parentAccountName: "Assets",
    createdAt: "2025-01-01",
    updatedAt: "2025-10-28",
  };

  const accountBalance = {
    accountId: "gl-1121",
    debitTotal: 450000,
    creditTotal: 325000,
    balance: 125000,
  };

  const bankDetails = {
    bankName: "Ghana Commercial Bank",
    accountNumber: "****1234",
    accountType: "Current",
    bankBalance: 125000,
    lastReconciled: "2025-10-25",
  };

  const subAccounts = [];

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2025-10-28",
      journalEntryNumber: "JE-2025-10-001",
      description: "Offering deposit",
      debit: 15000,
      credit: 0,
      balance: 125000,
    },
    {
      id: "2",
      date: "2025-10-27",
      journalEntryNumber: "JE-2025-10-002",
      description: "Utility payment",
      debit: 0,
      credit: 5000,
      balance: 110000,
    },
    {
      id: "3",
      date: "2025-10-26",
      journalEntryNumber: "JE-2025-10-003",
      description: "Tithe deposit",
      debit: 25000,
      credit: 0,
      balance: 115000,
    },
  ];

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "ASSET":
        return "bg-blue-100 text-blue-800";
      case "LIABILITY":
        return "bg-red-100 text-red-800";
      case "EQUITY":
        return "bg-purple-100 text-purple-800";
      case "REVENUE":
        return "bg-green-100 text-green-800";
      case "EXPENSE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              <h2 className="text-3xl font-bold tracking-tight">
                {account.accountCode} - {account.accountName}
              </h2>
              {account.isBankAccount && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Building2 className="h-3 w-3 mr-1" />
                  Bank Account
                </Badge>
              )}
              {account.isActive ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">{account.description}</p>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Account
        </Button>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">
                  GHS {(accountBalance?.balance || 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-2xl font-bold text-blue-600">
                  GHS {accountBalance.debitTotal.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">
                  GHS {accountBalance.creditTotal.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                  {account.accountType}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{account.accountSubType}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          {account.isBankAccount && <TabsTrigger value="banking">Banking Info</TabsTrigger>}
          {account.parentAccountId && <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Account Code</p>
                  <p className="font-mono font-semibold">{account.accountCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Name</p>
                  <p className="font-semibold">{account.accountName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                    {account.accountType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sub Type</p>
                  <p className="font-medium">{account.accountSubType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Normal Balance</p>
                  <Badge variant="outline">{account.normalBalance}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{account.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(account.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{new Date(account.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {account.notes && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm">{account.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent transactions affecting this account</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Journal Entry</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.journalEntryNumber}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right font-mono">
                        {transaction.debit > 0 ? (
                          <span className="text-blue-600">
                            GHS {transaction.debit.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {transaction.credit > 0 ? (
                          <span className="text-green-600">
                            GHS {transaction.credit.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        GHS {(transaction.balance || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Info Tab */}
        {account.isBankAccount && (
          <TabsContent value="banking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="font-semibold">{bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-mono font-semibold">{bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium">{bankDetails.accountType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Balance</p>
                    <p className="font-semibold text-lg">
                      GHS {bankDetails.bankBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Reconciled</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {new Date(bankDetails.lastReconciled).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Hierarchy Tab */}
        {account.parentAccountId && (
          <TabsContent value="hierarchy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Hierarchy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Parent Account */}
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <span className="font-mono text-sm">{account.parentAccountCode}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{account.parentAccountName}</span>
                    <Badge variant="outline" className="ml-auto">Parent</Badge>
                  </div>

                  {/* Current Account */}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg ml-8">
                    <span className="font-mono text-sm font-semibold">{account.accountCode}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{account.accountName}</span>
                    <Badge variant="outline" className="ml-auto bg-blue-100">Current</Badge>
                  </div>

                  {/* Sub Accounts */}
                  {subAccounts.length > 0 && (
                    <div className="ml-16 space-y-2">
                      {subAccounts.map((sub: any) => (
                        <div key={sub.id} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <span className="font-mono text-sm">{sub.accountCode}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{sub.accountName}</span>
                          <Badge variant="outline" className="ml-auto">Child</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
