"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Download, Printer, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface TrialBalanceProps {
  organisationId: string;
  branchId: string;
  userId: string;
}

interface TrialBalanceAccount {
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
}

export default function TrialBalance({
  organisationId,
  branchId,
  userId,
}: TrialBalanceProps) {
  const [fiscalYear, setFiscalYear] = useState<number>(new Date().getFullYear());
  const [fiscalPeriod, setFiscalPeriod] = useState<number>(new Date().getMonth() + 1);

  // TODO: Replace with GraphQL query
  const loading = false;
  const error = null;

  // Mock data
  const trialBalance = {
    accounts: [
      {
        accountCode: "1000",
        accountName: "Assets",
        accountType: "ASSET",
        debitBalance: 873500,
        creditBalance: 0,
      },
      {
        accountCode: "1010",
        accountName: "Cash - Operating",
        accountType: "ASSET",
        debitBalance: 45000,
        creditBalance: 0,
      },
      {
        accountCode: "1121",
        accountName: "Operating Account - GCB",
        accountType: "ASSET",
        debitBalance: 125000,
        creditBalance: 0,
      },
      {
        accountCode: "1122",
        accountName: "Savings Account - Ecobank",
        accountType: "ASSET",
        debitBalance: 248500,
        creditBalance: 0,
      },
      {
        accountCode: "1123",
        accountName: "Building Fund - Stanbic",
        accountType: "ASSET",
        debitBalance: 500000,
        creditBalance: 0,
      },
      {
        accountCode: "2000",
        accountName: "Liabilities",
        accountType: "LIABILITY",
        debitBalance: 0,
        creditBalance: 35000,
      },
      {
        accountCode: "2010",
        accountName: "Accounts Payable",
        accountType: "LIABILITY",
        debitBalance: 0,
        creditBalance: 15000,
      },
      {
        accountCode: "2020",
        accountName: "Accrued Expenses",
        accountType: "LIABILITY",
        debitBalance: 0,
        creditBalance: 20000,
      },
      {
        accountCode: "3000",
        accountName: "Equity",
        accountType: "EQUITY",
        debitBalance: 0,
        creditBalance: 588500,
      },
      {
        accountCode: "4000",
        accountName: "Revenue",
        accountType: "REVENUE",
        debitBalance: 0,
        creditBalance: 250000,
      },
      {
        accountCode: "4010",
        accountName: "Tithes",
        accountType: "REVENUE",
        debitBalance: 0,
        creditBalance: 150000,
      },
      {
        accountCode: "4020",
        accountName: "Offerings",
        accountType: "REVENUE",
        debitBalance: 0,
        creditBalance: 100000,
      },
    ],
    totalDebits: 873500,
    totalCredits: 873500,
    isBalanced: true,
  };

  const handleExportPDF = () => {
    console.log("Export to PDF");
    // TODO: Implement PDF export
  };

  const handleExportExcel = () => {
    console.log("Export to Excel");
    // TODO: Implement Excel export
  };

  const handlePrint = () => {
    window.print();
  };

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
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Trial Balance
          </h2>
          <p className="text-muted-foreground">
            Verify that debits equal credits for the selected period
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Fiscal Year</Label>
              <Select
                value={fiscalYear.toString()}
                onValueChange={(value) => setFiscalYear(parseInt(value))}
              >
                <SelectTrigger id="fiscalYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiscalPeriod">Fiscal Period</Label>
              <Select
                value={fiscalPeriod.toString()}
                onValueChange={(value) => setFiscalPeriod(parseInt(value))}
              >
                <SelectTrigger id="fiscalPeriod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      Period {month} - {new Date(2025, month - 1).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {trialBalance.isBalanced ? (
                <>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance Status</p>
                    <p className="text-lg font-semibold text-green-600">Balanced</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance Status</p>
                    <p className="text-lg font-semibold text-red-600">Out of Balance</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-2xl font-bold text-blue-600">
                  GHS {trialBalance.totalDebits.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">
                  GHS {trialBalance.totalCredits.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trial Balance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trial Balance Report</CardTitle>
          <CardDescription>
            As of Period {fiscalPeriod}, {fiscalYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trialBalance.accounts.map((account) => (
                <TableRow key={account.accountCode}>
                  <TableCell className="font-mono">{account.accountCode}</TableCell>
                  <TableCell className="font-medium">{account.accountName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                      {account.accountType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {account.debitBalance > 0 ? (
                      <span className="text-blue-600">
                        GHS {account.debitBalance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {account.creditBalance > 0 ? (
                      <span className="text-green-600">
                        GHS {account.creditBalance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Totals Row */}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={3} className="text-right">
                  TOTALS
                </TableCell>
                <TableCell className="text-right font-mono text-blue-600">
                  GHS {trialBalance.totalDebits.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-green-600">
                  GHS {trialBalance.totalCredits.toLocaleString()}
                </TableCell>
              </TableRow>

              {/* Difference Row */}
              <TableRow className="font-bold">
                <TableCell colSpan={3} className="text-right">
                  DIFFERENCE
                </TableCell>
                <TableCell colSpan={2} className="text-right font-mono">
                  {trialBalance.isBalanced ? (
                    <span className="text-green-600">GHS 0.00 ✓</span>
                  ) : (
                    <span className="text-red-600">
                      GHS {Math.abs(trialBalance.totalDebits - trialBalance.totalCredits).toLocaleString()}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      {!trialBalance.isBalanced && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Trial Balance Out of Balance</h4>
                <p className="text-sm text-red-700 mt-1">
                  The trial balance does not balance. Please review all journal entries for the period
                  and ensure that all debits equal credits. Common causes include:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                  <li>Unposted journal entries</li>
                  <li>Journal entries with unequal debits and credits</li>
                  <li>Data entry errors</li>
                  <li>System calculation errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
