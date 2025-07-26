"use client";
import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChatBubbleLeftEllipsisIcon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PRAYER_REQUEST } from "@/graphql/mutations/prayer-requests";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import toast from "react-hot-toast";
import { GET_MEMBERS } from "@/graphql/queries/members";
import { usePermissions } from "@/hooks/usePermissions";

interface NewPrayerRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewPrayerRequestModal({ open, onClose, onSuccess }: NewPrayerRequestModalProps) {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId: defaultBranchId } = useOrganisationBranch();
  const { canManagePrayerRequests } = usePermissions();
  const [requestText, setRequestText] = useState("");
  const [touched, setTouched] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  
  // Set the user's own memberId as default when available
  useEffect(() => {
    if (user?.member?.id && !canManagePrayerRequests) {
      setSelectedMemberId(user.member.id);
    }
  }, [user?.member?.id, canManagePrayerRequests]);

  const isSuperAdmin = user?.primaryRole === 'super_admin';
  const [selectedBranchId, setSelectedBranchId] = useState(defaultBranchId || '');
  
  // Fetch branches for super_admins only
  const { branches = [], loading: branchesLoading } = useFilteredBranches(isSuperAdmin ? { organisationId } : undefined);
  
  // Fetch members for admin users who can submit on behalf of others
  const { data: membersData, loading: membersLoading } = useQuery(GET_MEMBERS, {
    variables: {
      filterInput: {
        branchId: selectedBranchId,
        organisationId: organisationId
      },
      paginationInput: {
        skip: 0,
        take: 100
      }
    },
    skip: !canManagePrayerRequests || !selectedBranchId || !open
  });
  
  const members = membersData?.members?.items || [];

  const [createPrayerRequest, { loading: submitting, error }] = useMutation(CREATE_PRAYER_REQUEST, {
    onCompleted: () => {
      toast.success("Prayer request submitted successfully");
      onSuccess();
      handleClose();
    },
    onError: (error) => {
      toast.error(`Failed to submit prayer request: ${error.message}`);
    }
  });

  const handleClose = () => {
    setRequestText("");
    setTouched(false);
    if (canManagePrayerRequests) {
      setSelectedMemberId("");
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    // Validate required fields
    if (!requestText.trim()) return;
    
    // Determine which memberId to use
    let memberId = selectedMemberId;
    
    // For regular users, use their own member ID
    if (!canManagePrayerRequests) {
      if (!user?.member?.id) {
        toast.error("Unable to create prayer request: Your member profile is not set up");
        return;
      }
      memberId = user.member.id;
    } else {
      // For admins, ensure they've selected a member
      if (!selectedMemberId) {
        toast.error("Please select a member for this prayer request");
        return;
      }
    }
    
    // For super admins, validate branch selection
    if (isSuperAdmin && !selectedBranchId) {
      toast.error("Please select a branch");
      return;
    }
    
    createPrayerRequest({
      variables: {
        data: {
          memberId: memberId,
          requestText: requestText.trim(),
          branchId: isSuperAdmin ? selectedBranchId : defaultBranchId,
          organisationId: organisationId,
        },
      },
    });
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2 text-blue-500" />
                    New Prayer Request
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Branch selection for super admins */}
                  {isSuperAdmin && (
                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch
                      </label>
                      <select
                        id="branch"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        required
                      >
                        <option value="">Select a branch</option>
                        {branchesLoading ? (
                          <option disabled>Loading branches...</option>
                        ) : (
                          branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  )}
                  
                  {/* Member selection for admins */}
                  {canManagePrayerRequests && (
                    <div>
                      <label htmlFor="member" className="block text-sm font-medium text-gray-700 mb-1">
                        Member
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <select
                          id="member"
                          className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={selectedMemberId}
                          onChange={(e) => setSelectedMemberId(e.target.value)}
                          required
                        >
                          <option value="">Select a member</option>
                          {membersLoading ? (
                            <option disabled>Loading members...</option>
                          ) : (
                            members.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.firstName} {member.lastName}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {/* Prayer request text */}
                  <div>
                    <label htmlFor="requestText" className="block text-sm font-medium text-gray-700 mb-1">
                      Prayer Request
                    </label>
                    <div className="relative">
                      <textarea
                        id="requestText"
                        rows={4}
                        className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          touched && !requestText.trim() ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your prayer request here..."
                        value={requestText}
                        onChange={(e) => setRequestText(e.target.value)}
                        maxLength={500}
                      />
                      {touched && !requestText.trim() && (
                        <p className="mt-1 text-sm text-red-600">Prayer request text is required</p>
                      )}
                      <div className="mt-1 text-xs text-gray-500 text-right">
                        {requestText.length}/500 characters
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
