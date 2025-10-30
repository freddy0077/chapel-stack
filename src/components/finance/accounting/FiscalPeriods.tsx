"use client";

import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

interface FiscalPeriod {
  id: string;
  year: number;
  period: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "OPEN" | "CLOSED" | "LOCKED";
  isCurrent: boolean;
}

interface FiscalPeriodsProps {
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function FiscalPeriods({
  organisationId,
  branchId,
  userId,
}: FiscalPeriodsProps) {
  const [selectedYear, setSelectedYear] = useState("2025");

  // Mock data
  const fiscalPeriods: FiscalPeriod[] = [
    {
      id: "1",
      year: 2025,
      period: 1,
      name: "January 2025",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      status: "CLOSED",
      isCurrent: false,
    },
    {
      id: "2",
      year: 2025,
      period: 2,
      name: "February 2025",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      status: "CLOSED",
      isCurrent: false,
    },
    {
      id: "3",
      year: 2025,
      period: 3,
      name: "March 2025",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      status: "CLOSED",
      isCurrent: false,
    },
    {
      id: "4",
      year: 2025,
      period: 10,
      name: "October 2025",
      startDate: "2025-10-01",
      endDate: "2025-10-31",
      status: "OPEN",
      isCurrent: true,
    },
    {
      id: "5",
      year: 2025,
      period: 11,
      name: "November 2025",
      startDate: "2025-11-01",
      endDate: "2025-11-30",
      status: "OPEN",
      isCurrent: false,
    },
    {
      id: "6",
      year: 2025,
      period: 12,
      name: "December 2025",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      status: "OPEN",
      isCurrent: false,
    },
  ];

  const getStatusBadge = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Current
        </Badge>
      );
    }

    const variants = {
      OPEN: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800",
      LOCKED: "bg-red-100 text-red-800",
    };

    const icons = {
      OPEN: <Unlock className="h-3 w-3 mr-1" />,
      CLOSED: <XCircle className="h-3 w-3 mr-1" />,
      LOCKED: <Lock className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const handleClosePeriod = (period: FiscalPeriod) => {
    // TODO: Implement close period
    console.log("Close period:", period);
  };

  const handleReopenPeriod = (period: FiscalPeriod) => {
    // TODO: Implement reopen period
    console.log("Reopen period:", period);
  };

  const handleLockPeriod = (period: FiscalPeriod) => {
    // TODO: Implement lock period
    console.log("Lock period:", period);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fiscal Periods</h2>
          <p className="text-muted-foreground">Manage accounting periods and year-end</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Fiscal Year
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Period</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">October 2025</div>
            <p className="text-xs text-muted-foreground">Period 10 of 12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Periods</CardTitle>
            <Unlock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Available for posting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Periods</CardTitle>
            <Lock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">Locked for changes</p>
          </CardContent>
        </Card>
      </div>

      {/* Periods Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fiscal Periods - {selectedYear}</CardTitle>
          <CardDescription>
            Manage monthly accounting periods and their status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Period</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fiscalPeriods.map((period) => (
                <TableRow
                  key={period.id}
                  className={period.isCurrent ? "bg-blue-50" : ""}
                >
                  <TableCell className="font-mono font-medium">
                    P{period.period.toString().padStart(2, "0")}
                  </TableCell>
                  <TableCell className="font-medium">{period.name}</TableCell>
                  <TableCell>
                    {new Date(period.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(period.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(period.status, period.isCurrent)}</TableCell>
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
                        {period.status === "OPEN" && !period.isCurrent && (
                          <DropdownMenuItem onClick={() => handleClosePeriod(period)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Close Period
                          </DropdownMenuItem>
                        )}
                        {period.status === "CLOSED" && (
                          <>
                            <DropdownMenuItem onClick={() => handleReopenPeriod(period)}>
                              <Unlock className="h-4 w-4 mr-2" />
                              Reopen Period
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleLockPeriod(period)}>
                              <Lock className="h-4 w-4 mr-2" />
                              Lock Period
                            </DropdownMenuItem>
                          </>
                        )}
                        {period.isCurrent && (
                          <DropdownMenuItem disabled>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Current Period
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Period Management Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Period Management Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <span className="font-medium">Open Periods:</span> Allow posting of transactions
            </div>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-gray-600 mt-0.5" />
            <div>
              <span className="font-medium">Closed Periods:</span> Prevent new transactions, can be reopened
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-red-600 mt-0.5" />
            <div>
              <span className="font-medium">Locked Periods:</span> Permanently closed, cannot be reopened
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <span className="font-medium">Current Period:</span> Active accounting period for new entries
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
