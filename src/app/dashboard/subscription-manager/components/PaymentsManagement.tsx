"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getPaymentStatusBadgeColor,
  formatCurrency,
  formatDateTime,
} from "../utils/formatters";
import { GET_SUBSCRIPTION_PAYMENTS } from "@/graphql/subscription-management";

export default function PaymentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch payments from backend
  const {
    data: paymentsData,
    loading,
    error,
    refetch,
  } = useQuery(GET_SUBSCRIPTION_PAYMENTS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const payments = paymentsData?.subscriptionPayments || [];

  const filteredPayments = useMemo(() => {
    return payments.filter((payment: any) => {
      const matchesSearch =
        payment.subscription?.organisation?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.paystackReference
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.subscription?.plan?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const failedPayments = payments.filter((p) => p.status === "FAILED");
  const totalRevenue = payments
    .filter((p) => p.status === "SUCCESSFUL")
    .reduce((sum, p) => sum + p.amount, 0);

  function getStatusIcon(status: string) {
    switch (status) {
      case "SUCCESSFUL":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case "PENDING":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "REFUNDED":
        return <ArrowPathIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4 text-gray-500" />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalRevenue, "GHS")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Failed Payments
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {failedPayments.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">
                {payments.filter((p) => p.status === "PENDING").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <ArrowPathIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(
                  (payments.filter((p) => p.status === "SUCCESSFUL").length /
                    payments.length) *
                    100,
                )}
                %
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-1 items-center space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="SUCCESSFUL">Successful</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
          {failedPayments.length > 0 && (
            <Button variant="default" size="sm">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Retry Failed ({failedPayments.length})
            </Button>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.paystackReference}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.authorizationCode
                          ? "Card Payment"
                          : "Online Payment"}{" "}
                        • {payment.subscription?.plan?.name}
                      </div>
                      {payment.failureReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {payment.failureReason}
                        </div>
                      )}
                      {payment.refundReason && (
                        <div className="text-xs text-blue-600 mt-1">
                          Refund: {payment.refundReason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.subscription?.organisation?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Sub: {payment.subscription?.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <Badge
                        className={`ml-2 ${getPaymentStatusBadgeColor(payment.status)}`}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {payment.status === "FAILED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">Loading payments...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-red-600 mb-2">Failed to load payments</p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPayments.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No payments found</p>
                <p className="text-sm text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Payments will appear here once subscriptions are active"}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
