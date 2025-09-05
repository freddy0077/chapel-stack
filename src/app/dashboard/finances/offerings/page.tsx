"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ListBulletIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import OfferingCountForm from "./components/OfferingCountForm";

// Types
interface Branch {
  id: string;
  name: string;
  location: string;
}

interface OfferingCount {
  id: string;
  branchId: string;
  dateCollected: string;
  serviceType: string;
  cashAmount: number;
  checkAmount: number;
  electronicAmount: number;
  otherAmount: number;
  totalAmount: number;
  countedBy: string[];
  verifiedBy?: string;
  notes?: string;
  status: "pending" | "verified" | "deposited";
  depositDate?: string;
  depositReferenceNumber?: string;
}

// Mock data
const mockBranches: Branch[] = [
  { id: "b1", name: "Main Campus", location: "123 Main St, Cityville" },
  { id: "b2", name: "East Side", location: "456 East Blvd, Cityville" },
  { id: "b3", name: "West End", location: "789 West Ave, Cityville" },
  { id: "b4", name: "South Chapel", location: "321 South Rd, Cityville" },
];

const mockOfferingCounts: OfferingCount[] = [
  {
    id: "oc1",
    branchId: "b1",
    dateCollected: "2025-04-07",
    serviceType: "Sunday Morning",
    cashAmount: 1250.75,
    checkAmount: 2430.0,
    electronicAmount: 3675.5,
    otherAmount: 100.0,
    totalAmount: 7456.25,
    countedBy: ["John Smith", "Mary Johnson"],
    verifiedBy: "Pastor Thomas",
    notes: "Large attendance, special offering for missions",
    status: "deposited",
    depositDate: "2025-04-08",
    depositReferenceNumber: "DEP-001-2025",
  },
  {
    id: "oc2",
    branchId: "b2",
    dateCollected: "2025-04-07",
    serviceType: "Sunday Morning",
    cashAmount: 575.25,
    checkAmount: 1200.0,
    electronicAmount: 1850.0,
    otherAmount: 0,
    totalAmount: 3625.25,
    countedBy: ["Robert Brown", "Lisa Davis"],
    verifiedBy: "James Wilson",
    notes: "",
    status: "verified",
  },
  {
    id: "oc3",
    branchId: "b3",
    dateCollected: "2025-04-07",
    serviceType: "Sunday Morning",
    cashAmount: 450.0,
    checkAmount: 975.0,
    electronicAmount: 1325.75,
    otherAmount: 50.0,
    totalAmount: 2800.75,
    countedBy: ["Patricia White", "Michael Lee"],
    notes: "Youth fundraiser included",
    status: "pending",
  },
  {
    id: "oc4",
    branchId: "b1",
    dateCollected: "2025-04-06",
    serviceType: "Saturday Evening",
    cashAmount: 525.5,
    checkAmount: 850.0,
    electronicAmount: 1225.25,
    otherAmount: 0,
    totalAmount: 2600.75,
    countedBy: ["John Smith", "Sarah Miller"],
    verifiedBy: "Pastor Thomas",
    notes: "",
    status: "deposited",
    depositDate: "2025-04-08",
    depositReferenceNumber: "DEP-001-2025",
  },
];

// Helper functions
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getBranchName(branchId: string) {
  const branch = mockBranches.find((b) => b.id === branchId);
  return branch ? branch.name : "Unknown Branch";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "verified":
      return "bg-blue-100 text-blue-800";
    case "deposited":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Component
export default function OfferingCountPage() {
  const [offerings, setOfferings] =
    useState<OfferingCount[]>(mockOfferingCounts);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // Filter offerings by branch
  const filteredOfferings = selectedBranch
    ? offerings.filter((offering) => offering.branchId === selectedBranch)
    : offerings;

  // Create tabs for different offering statuses
  const pendingOfferings = filteredOfferings.filter(
    (o) => o.status === "pending",
  );
  const verifiedOfferings = filteredOfferings.filter(
    (o) => o.status === "verified",
  );
  const depositedOfferings = filteredOfferings.filter(
    (o) => o.status === "deposited",
  );

  // Handle new offering submission
  const handleNewOffering = (
    offeringData: Omit<OfferingCount, "id" | "totalAmount" | "status">,
  ) => {
    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(() => {
      const newOffering: OfferingCount = {
        id: `oc${offerings.length + 1}`,
        ...offeringData,
        totalAmount:
          Number(offeringData.cashAmount || 0) +
          Number(offeringData.checkAmount || 0) +
          Number(offeringData.electronicAmount || 0) +
          Number(offeringData.otherAmount || 0),
        status: "pending",
      };

      setOfferings([newOffering, ...offerings]);
      setIsProcessing(false);
    }, 1000);
  };

  // Handle status update
  const handleUpdateStatus = (
    id: string,
    newStatus: "pending" | "verified" | "deposited",
  ) => {
    const updatedOfferings = offerings.map((offering) => {
      if (offering.id === id) {
        const updates: Partial<OfferingCount> = { status: newStatus };

        if (newStatus === "deposited") {
          updates.depositDate = new Date().toISOString().split("T")[0];
          updates.depositReferenceNumber = `DEP-${offerings.length}-${new Date().getFullYear()}`;
        }

        return { ...offering, ...updates };
      }
      return offering;
    });

    setOfferings(updatedOfferings);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Offering Count
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track offering collections across all branches.
          </p>
        </div>
      </div>

      {/* Branch Filter */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <label
          htmlFor="branch-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by Branch
        </label>
        <select
          id="branch-filter"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Branches</option>
          {mockBranches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Offering Counts List */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Tab.Group>
              <Tab.List className="flex border-b border-gray-200">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full py-2.5 text-sm font-medium text-center",
                      selected
                        ? "text-indigo-700 border-b-2 border-indigo-500"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    )
                  }
                >
                  <span className="inline-flex items-center">
                    <ListBulletIcon className="h-5 w-5 mr-2" />
                    All ({filteredOfferings.length})
                  </span>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full py-2.5 text-sm font-medium text-center",
                      selected
                        ? "text-indigo-700 border-b-2 border-indigo-500"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    )
                  }
                >
                  <span className="inline-flex items-center">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Pending ({pendingOfferings.length})
                  </span>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full py-2.5 text-sm font-medium text-center",
                      selected
                        ? "text-indigo-700 border-b-2 border-indigo-500"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    )
                  }
                >
                  <span className="inline-flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Verified ({verifiedOfferings.length})
                  </span>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full py-2.5 text-sm font-medium text-center",
                      selected
                        ? "text-indigo-700 border-b-2 border-indigo-500"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    )
                  }
                >
                  <span className="inline-flex items-center">
                    <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                    Deposited ({depositedOfferings.length})
                  </span>
                </Tab>
              </Tab.List>
              <Tab.Panels>
                {/* All Offerings Panel */}
                <Tab.Panel>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Branch
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Service
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOfferings.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No offering counts found
                            </td>
                          </tr>
                        ) : (
                          filteredOfferings.map((offering) => (
                            <tr key={offering.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  offering.dateCollected,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  <div className="text-sm font-medium text-gray-900">
                                    {getBranchName(offering.branchId)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {offering.serviceType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(offering.totalAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(offering.status)}`}
                                >
                                  {offering.status.charAt(0).toUpperCase() +
                                    offering.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {offering.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        offering.id,
                                        "verified",
                                      )
                                    }
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Verify
                                  </button>
                                )}
                                {offering.status === "verified" && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        offering.id,
                                        "deposited",
                                      )
                                    }
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Mark as Deposited
                                  </button>
                                )}
                                {offering.status === "deposited" &&
                                  offering.depositReferenceNumber && (
                                    <span className="text-sm text-gray-500">
                                      Ref: {offering.depositReferenceNumber}
                                    </span>
                                  )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>

                {/* Pending Offerings Panel */}
                <Tab.Panel>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Branch
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Service
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingOfferings.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No pending offerings found
                            </td>
                          </tr>
                        ) : (
                          pendingOfferings.map((offering) => (
                            <tr key={offering.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  offering.dateCollected,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  <div className="text-sm font-medium text-gray-900">
                                    {getBranchName(offering.branchId)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {offering.serviceType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(offering.totalAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(offering.id, "verified")
                                  }
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Verify
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>

                {/* Verified Offerings Panel */}
                <Tab.Panel>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Branch
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Service
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Verified By
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {verifiedOfferings.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No verified offerings found
                            </td>
                          </tr>
                        ) : (
                          verifiedOfferings.map((offering) => (
                            <tr key={offering.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  offering.dateCollected,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  <div className="text-sm font-medium text-gray-900">
                                    {getBranchName(offering.branchId)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {offering.serviceType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(offering.totalAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {offering.verifiedBy || "Not specified"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(offering.id, "deposited")
                                  }
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Mark as Deposited
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>

                {/* Deposited Offerings Panel */}
                <Tab.Panel>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Branch
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Service
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Deposit Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Reference
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {depositedOfferings.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No deposited offerings found
                            </td>
                          </tr>
                        ) : (
                          depositedOfferings.map((offering) => (
                            <tr key={offering.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  offering.dateCollected,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  <div className="text-sm font-medium text-gray-900">
                                    {getBranchName(offering.branchId)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {offering.serviceType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(offering.totalAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {offering.depositDate
                                  ? new Date(
                                      offering.depositDate,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {offering.depositReferenceNumber || "N/A"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        {/* New Offering Form */}
        <div className="lg:col-span-2">
          <OfferingCountForm
            branches={mockBranches}
            onSubmit={handleNewOffering}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
