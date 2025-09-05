"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@apollo/client";
import { GET_BRANCHES } from "../../../../graphql/queries/branchQueries";
import { GET_MEMBERS_LIST } from "../../../../graphql/queries/memberQueries";
import {
  useTransferRequests,
  TransferDataType,
} from "../../../../hooks/useTransferRequests";
import { useOrganizationBranchFilter } from "../../../../hooks/useOrganizationBranchFilter";

interface Branch {
  id: string;
  name: string;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranchId: string;
  onSuccess?: () => void;
}

export default function NewTransferModal({
  isOpen,
  onClose,
  currentBranchId,
  onSuccess,
}: NewTransferModalProps) {
  // Form state
  const [memberId, setMemberId] = useState("");
  const [destinationBranchId, setDestinationBranchId] = useState("");
  const [reason, setReason] = useState("");
  const [transferData, setTransferData] = useState<TransferDataType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get organization/branch filter
  const filter = useOrganizationBranchFilter();

  // Get branches for dropdown
  const { data: branchesData, loading: loadingBranches } = useQuery(
    GET_BRANCHES,
    {
      variables: {
        pagination: { take: 100 }, // Fetch up to 100 branches
        filter: {
          isActive: true,
          ...filter, // Include organization ID if available
        },
      },
    },
  );

  // Get members for dropdown (filtered by current branch)
  const { data: membersData, loading: loadingMembers } = useQuery(
    GET_MEMBERS_LIST,
    {
      variables: {
        branchId: currentBranchId,
        take: 50,
        search: searchTerm,
      },
      skip: !currentBranchId,
    },
  );

  // Get transfer actions
  const { actions } = useTransferRequests({ branchId: currentBranchId });

  // Filter out the current branch from the branches list
  const branches =
    branchesData?.branches?.items?.filter(
      (branch: Branch) => branch.id !== currentBranchId,
    ) || [];

  // Members list
  const members = membersData?.members || [];

  // Define transfer data type options
  const transferDataTypes = [
    { id: "personal", value: "PERSONAL", label: "Personal Information" },
    { id: "sacraments", value: "SACRAMENTS", label: "Sacramental Records" },
    { id: "ministries", value: "MINISTRIES", label: "Ministry Involvement" },
    {
      id: "donation_history",
      value: "DONATION_HISTORY",
      label: "Donation History",
    },
  ];

  // Handle checkbox changes for transfer data types
  const handleTransferDataChange = (type: TransferDataType) => {
    setTransferData((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!memberId) {
      setError("Please select a member");
      return;
    }

    if (!destinationBranchId) {
      setError("Please select a destination branch");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for the transfer");
      return;
    }

    if (transferData.length === 0) {
      setError("Please select at least one data type to transfer");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await actions.createTransfer({
        memberId,
        sourceBranchId: currentBranchId,
        destinationBranchId,
        reason,
        transferData,
      });

      // Reset form and close modal
      setMemberId("");
      setDestinationBranchId("");
      setReason("");
      setTransferData([]);
      setSearchTerm("");
      onClose();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating transfer request:", err);
      setError("Failed to create transfer request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setMemberId("");
      setDestinationBranchId("");
      setReason("");
      setTransferData([]);
      setSearchTerm("");
      setError("");
    }
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                      New Member Transfer Request
                    </Dialog.Title>

                    <div className="mt-4">
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Member Selection */}
                        <div>
                          <label
                            htmlFor="member"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Member to Transfer
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              placeholder="Search members..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white py-2 px-3"
                            />
                          </div>

                          {loadingMembers ? (
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Loading members...
                            </div>
                          ) : members.length > 0 ? (
                            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                              {members.map((member: Member) => (
                                <div
                                  key={member.id}
                                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                    memberId === member.id
                                      ? "bg-indigo-50 dark:bg-indigo-900/30"
                                      : ""
                                  }`}
                                  onClick={() => setMemberId(member.id)}
                                >
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {member.firstName} {member.lastName}
                                  </div>
                                  {member.email && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {member.email}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {searchTerm
                                ? "No members found"
                                : "Enter a search term to find members"}
                            </div>
                          )}
                        </div>

                        {/* Destination Branch Selection */}
                        <div>
                          <label
                            htmlFor="destinationBranch"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Destination Branch
                          </label>
                          <select
                            id="destinationBranch"
                            value={destinationBranchId}
                            onChange={(e) =>
                              setDestinationBranchId(e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white py-2 px-3"
                          >
                            <option value="">Select destination branch</option>
                            {loadingBranches ? (
                              <option disabled>Loading branches...</option>
                            ) : (
                              branches.map((branch: Branch) => (
                                <option key={branch.id} value={branch.id}>
                                  {branch.name}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        {/* Transfer Reason */}
                        <div>
                          <label
                            htmlFor="reason"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Reason for Transfer
                          </label>
                          <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white py-2 px-3"
                            placeholder="Explain why this member is being transferred..."
                          />
                        </div>

                        {/* Data to Transfer */}
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data to Transfer
                          </span>
                          <div className="space-y-2">
                            {transferDataTypes.map((type) => (
                              <div key={type.id} className="flex items-center">
                                <input
                                  id={type.id}
                                  type="checkbox"
                                  checked={transferData.includes(
                                    type.value as TransferDataType,
                                  )}
                                  onChange={() =>
                                    handleTransferDataChange(
                                      type.value as TransferDataType,
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={type.id}
                                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {type.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting
                              ? "Creating..."
                              : "Create Transfer Request"}
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
