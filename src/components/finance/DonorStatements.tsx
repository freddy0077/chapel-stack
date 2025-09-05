"use client";

import React, { useState } from "react";
import {
  UserIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useDonorStatements, useDonorStatementMutations, DateRangeInput } from "@/graphql/hooks/useDonorStatements";

interface DonorStatementsProps {
  organisationId: string;
  branchId: string;
  dateRange?: DateRangeInput;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function DonorStatements({
  organisationId,
  branchId,
  dateRange,
}: DonorStatementsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch donor statements data from API
  const { donors, loading, error, refetch } = useDonorStatements({
    organisationId,
    branchId,
    dateRange,
    search: searchTerm,
  });

  // Get mutation functions for generating statements
  const { generateStatement, bulkGenerate } = useDonorStatementMutations();

  const filteredDonors = donors.filter(
    (donor) =>
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectDonor = (donorId: string) => {
    setSelectedDonors((prev) =>
      prev.includes(donorId)
        ? prev.filter((id) => id !== donorId)
        : [...prev, donorId],
    );
  };

  const handleSelectAll = () => {
    if (selectedDonors.length === filteredDonors.length) {
      setSelectedDonors([]);
    } else {
      setSelectedDonors(filteredDonors.map((donor) => donor.id));
    }
  };

  const handlePreviewStatement = (donor: any) => {
    setSelectedDonor(donor);
    setShowPreview(true);
  };

  const handleGenerateStatement = async (donorId: string, format: "pdf" | "email") => {
    try {
      const result = await generateStatement(donorId, format, organisationId, branchId, dateRange);
      if (result?.success) {
        if (format === "pdf" && result.downloadUrl) {
          // Download the PDF
          window.open(result.downloadUrl, '_blank');
        }
        // Show success message
        alert(result.message || `Statement ${format === 'pdf' ? 'generated' : 'emailed'} successfully!`);
      }
    } catch (error) {
      console.error('Error generating statement:', error);
      alert('Failed to generate statement. Please try again.');
    }
  };

  const handleBulkGenerate = async (donorIds: string[], format: "pdf" | "email") => {
    try {
      const result = await bulkGenerate(donorIds, format, organisationId, branchId, dateRange);
      if (result?.success) {
        if (format === "pdf" && result.downloadUrl) {
          // Download the bulk PDF
          window.open(result.downloadUrl, '_blank');
        }
        // Show success message
        alert(result.message || `Bulk statements ${format === 'pdf' ? 'generated' : 'emailed'} successfully!`);
        // Clear selection
        setSelectedDonors([]);
      }
    } catch (error) {
      console.error('Error bulk generating statements:', error);
      alert('Failed to generate bulk statements. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load donor statements
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "There was an error loading the donor statements data."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-green-600" />
            Donor Statements
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Generate giving statements for individual donors or in bulk
          </p>
        </div>

        {/* Bulk Actions */}
        {selectedDonors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedDonors.length} selected
            </span>
            <button
              onClick={() => handleBulkGenerate(selectedDonors, "pdf")}
              className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Bulk PDF
            </button>
            <button
              onClick={() => handleBulkGenerate(selectedDonors, "email")}
              className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
            >
              Email All
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search donors by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          onClick={handleSelectAll}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {selectedDonors.length === filteredDonors.length
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      {/* Donors List */}
      <div className="space-y-3">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className={`border rounded-lg p-4 transition-colors ${
              selectedDonors.includes(donor.id)
                ? "border-green-300 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedDonors.includes(donor.id)}
                  onChange={() => handleSelectDonor(donor.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-green-600" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {donor.name}
                    </h4>
                    {donor.email && (
                      <p className="text-sm text-gray-600">{donor.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Giving Summary */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(donor.totalGiving)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {donor.transactionCount} transactions
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Average Gift</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(donor.averageGift)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Period</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatDate(donor.firstGift)} - {formatDate(donor.lastGift)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreviewStatement(donor)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Preview
                  </button>

                  <button
                    onClick={() => handleGenerateStatement(donor.id, "pdf")}
                    className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleGenerateStatement(donor.id, "email")}
                    className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No donors found
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms."
              : "No donors with giving history available."}
          </p>
        </div>
      )}

      {/* Statement Preview Modal */}
      {showPreview && selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Giving Statement Preview - {selectedDonor.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleGenerateStatement(selectedDonor.id, "pdf")
                  }
                  className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download PDF
                </button>
                <button
                  onClick={() =>
                    handleGenerateStatement(selectedDonor.id, "email")
                  }
                  className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Email Statement
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Statement Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Statement Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Annual Giving Statement
                </h2>
                <p className="text-gray-600">
                  Thank you for your faithful giving and support
                </p>
              </div>

              {/* Donor Information */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Donor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedDonor.name}
                    </p>
                  </div>
                  {selectedDonor.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedDonor.email}
                      </p>
                    </div>
                  )}
                  {selectedDonor.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">
                        {selectedDonor.phone}
                      </p>
                    </div>
                  )}
                  {selectedDonor.address && (
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {selectedDonor.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Giving Summary */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-green-900 mb-4">
                  Giving Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-green-700">Total Giving</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(selectedDonor.totalGiving)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Number of Gifts</p>
                    <p className="text-2xl font-bold text-green-900">
                      {selectedDonor.transactionCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Average Gift</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(selectedDonor.averageGift)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Giving Period</p>
                    <p className="text-sm font-medium text-green-900">
                      {formatDate(selectedDonor.firstGift)}
                    </p>
                    <p className="text-sm font-medium text-green-900">
                      to {formatDate(selectedDonor.lastGift)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Transaction Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Fund
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDonor.transactions.map((transaction, index) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-900">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {transaction.fund?.name || transaction.fund}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {transaction.description || transaction.type}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-gray-300 bg-gray-50">
                        <td
                          colSpan={3}
                          className="py-3 px-4 font-bold text-gray-900"
                        >
                          Total
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {formatCurrency(selectedDonor.totalGiving)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                <p>
                  This statement is provided for your records and tax purposes.
                </p>
                <p className="mt-2">
                  Thank you for your generous support of our ministry!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
