"use client";

import { useState, useMemo } from "react";
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import type { Ministry, MinistryMember } from "@/types/ministry";
import { MinistryType } from "@/types/ministry";
import { useMinistry } from "@/graphql/hooks/useMinistry";
import { useCreateMinistry } from "@/graphql/hooks/useCreateMinistry";
import { usePermissions } from "@/hooks/usePermissions";

import { MinistryLoader } from "./MinistryLoader";
import { useOrganizationBranchFilter } from "@/hooks";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";

function MinistryDetailsModal({
  ministryId,
  onClose,
}: {
  ministryId: string;
  onClose: () => void;
}) {
  const { ministry, loading, error } = useMinistry(ministryId);
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
        {loading && <div className="text-center py-8">Loading...</div>}
        {error && (
          <div className="text-center py-8 text-red-500">
            Failed to load ministry.
          </div>
        )}
        {ministry && !loading && !error && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-indigo-700 flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-indigo-400" />
              {ministry.name}
            </h2>
            <div className="text-sm text-gray-600 mb-2">
              Type: {ministry.type || "—"}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Status: {ministry.status || "—"}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Created:{" "}
              {ministry.createdAt
                ? new Date(ministry.createdAt).toLocaleDateString()
                : "—"}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Leader:{" "}
              <span className="font-semibold text-indigo-700">
                {ministry.members?.find(
                  (m: MinistryMember) => m.role === "LEADER",
                )?.memberId || "—"}
              </span>
            </div>
            {ministry.subMinistries && ministry.subMinistries.length > 0 && (
              <div className="mt-2 text-sm text-indigo-500">
                <span>Sub-Ministries:</span>
                <ul className="list-disc ml-5">
                  {ministry.subMinistries.map(
                    (sm: { id: string; name: string }, i: number) => (
                      <li key={sm.id || i}>{sm.name}</li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AddMinistryModal({
  onClose,
  onSuccess,
  branchId: propBranchId,
  afterCreate,
}: {
  onClose: () => void;
  onSuccess: () => void;
  branchId: string;
  afterCreate?: () => void;
}) {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId } = useOrganisationBranch();
  const { isSuperAdmin } = usePermissions();
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    propBranchId || "",
  );
  const { branches = [], loading: branchesLoading } = useFilteredBranches(
    isSuperAdmin ? { organisationId } : undefined,
  );
  const branchId = isSuperAdmin ? selectedBranchId : propBranchId;
  const { createMinistry, loading, error } = useCreateMinistry();
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    type: MinistryType | "";
    status: string;
  }>({ name: "", type: "", status: "ACTIVE" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name || !formData.type) {
      setFormError("Name and type are required.");
      return;
    }
    if (!branchId) {
      setFormError("Branch is required.");
      return;
    }
    try {
      await createMinistry({
        variables: {
          input: {
            name: formData.name,
            type: formData.type,
            branchId,
            organisationId: String(organisationId),
            status: formData.status,
          },
        },
      });
      if (afterCreate) afterCreate();
      onSuccess();
      onClose();
    } catch (err) {
      setFormError("Failed to create ministry. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Glassmorphism Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-300/30 via-white/40 to-indigo-100/40 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <div className="relative bg-white/90 shadow-2xl rounded-3xl max-w-lg w-full p-8 border border-indigo-100 animate-fadeInUp">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-indigo-500 transition-colors text-2xl font-bold"
          onClick={onClose}
          aria-label="Close add"
          type="button"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 shadow">
            <PlusCircleIcon className="h-8 w-8 text-indigo-500" />
          </span>
          <h2 className="text-2xl font-extrabold text-indigo-700">
            Add Ministry
          </h2>
          <p className="text-gray-500 text-sm">
            Create a new ministry or group for your church.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Branch Selection Logic */}
          {isSuperAdmin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch<span className="text-red-500">*</span>
              </label>
              <select
                name="branchId"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                disabled={branchesLoading}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Youth Ministry"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="mt-1 block w-full border border-gray-200 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="WORSHIP">Worship</option>
              <option value="OUTREACH">Outreach</option>
              <option value="EDUCATION">Education</option>
              <option value="PRAYER">Prayer</option>
              <option value="YOUTH">Youth</option>
              <option value="CHILDREN">Children</option>
              <option value="MISSIONS">Missions</option>
              <option value="ADMINISTRATION">Administration</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="mt-1 block w-full border border-gray-200 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {formError && (
            <div className="text-red-500 text-sm text-center">{formError}</div>
          )}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white text-base font-semibold rounded-full shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Ministry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Ministries() {
  const { state } = useAuth();
  const user = state.user;
  const orgBranchFilter = useOrganizationBranchFilter();
  const isSuperAdmin = user?.primaryRole === "super_admin";
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const organisationId = orgBranchFilter.organisationId;
  const { branches = [], loading: branchesLoading } = useFilteredBranches(
    isSuperAdmin ? { organisationId } : undefined,
  );
  const branchId = isSuperAdmin ? selectedBranchId : orgBranchFilter.branchId;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalId, setDetailsModalId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ministryRefetch, setMinistryRefetch] = useState<(() => void) | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16 overflow-visible">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-400 px-6 py-12 shadow-lg rounded-b-3xl mb-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Ministries
            </h1>
            <p className="mt-2 text-lg text-indigo-100 max-w-xl">
              Organize, manage, and grow all ministries and groups in your
              church. Add new ministries, assign leaders, and track membership
              at a glance.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-white/90 text-indigo-700 font-semibold text-base rounded-full shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <PlusCircleIcon className="h-6 w-6 mr-2 text-indigo-500" />
            Add Ministry
          </button>
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          aria-hidden="true"
        >
          <svg
            className="absolute -top-6 left-1/2 -translate-x-1/2"
            width="1024"
            height="200"
            fill="none"
          >
            <ellipse
              cx="512"
              cy="100"
              rx="512"
              ry="100"
              fill="#fff"
              fillOpacity="0.05"
            />
          </svg>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center gap-3 shadow-sm rounded-xl mx-4 md:mx-8 -mt-8 mb-8">
        {/* Branch Selection Logic */}
        {isSuperAdmin ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch<span className="text-red-500">*</span>
            </label>
            <select
              name="branchId"
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={branchesLoading}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <input
              type="text"
              value={
                user?.userBranches && user.userBranches.length > 0
                  ? user.userBranches[0].branch.name
                  : ""
              }
              className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed sm:text-sm"
              disabled
            />
          </div>
        )}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
            placeholder="Search ministries..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="WORSHIP">Worship</option>
          <option value="OUTREACH">Outreach</option>
          <option value="EDUCATION">Education</option>
          <option value="PRAYER">Prayer</option>
          <option value="YOUTH">Youth</option>
          <option value="CHILDREN">Children</option>
          <option value="MISSIONS">Missions</option>
          <option value="ADMINISTRATION">Administration</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <MinistryLoader branchId={branchId} organisationId={organisationId}>
        {(ministries, loading, error, refetch) => {
          if (ministryRefetch !== refetch) setMinistryRefetch(() => refetch);
          if (loading) {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white/80 rounded-2xl h-44 shadow-inner"
                  />
                ))}
              </div>
            );
          }
          if (error) {
            return (
              <div className="text-center py-10">
                <p className="text-red-500">Failed to load ministries.</p>
              </div>
            );
          }
          if (!ministries || ministries.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-24">
                <img
                  src="/empty-state-ministries.svg"
                  alt="No ministries"
                  className="h-40 mb-6 opacity-80"
                />
                <p className="text-xl text-gray-400 mb-2">
                  No ministries found.
                </p>
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Your First Ministry
                </button>
              </div>
            );
          }
          const filteredMinistries = ministries.filter((m: Ministry) => {
            const nameMatch = m.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const typeMatch =
              typeFilter === "all" ||
              (m.type || "GENERAL").toUpperCase() === typeFilter;
            const statusMatch =
              statusFilter === "all" || (m.status || "Active") === statusFilter;
            return nameMatch && typeMatch && statusMatch;
          });
          const paginatedMinistries = (() => {
            const start = (currentPage - 1) * itemsPerPage;
            return filteredMinistries.slice(start, start + itemsPerPage);
          })();
          return (
            <>
              <div className="px-4 md:px-8 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedMinistries.map((ministry: Ministry) => (
                    <div
                      key={ministry.id}
                      className="relative group bg-white/90 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-200 cursor-pointer overflow-hidden"
                      onClick={() => setDetailsModalId(ministry.id)}
                    >
                      <div className="p-6 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-bold text-indigo-700 truncate flex-1">
                            {ministry.name}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${ministry.status === "Inactive" ? "bg-gray-200 text-gray-500" : "bg-indigo-100 text-indigo-700"}`}
                          >
                            {ministry.status || "Active"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 text-xs font-medium">
                            {ministry.type || "General"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <UsersIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {ministry.members?.length || 0} members
                          </span>
                          {ministry.members && ministry.members.length > 0 && (
                            <div className="flex ml-2 -space-x-2">
                              {ministry.members
                                .slice(0, 3)
                                .map((member: MinistryMember, idx: number) => (
                                  <img
                                    key={member.memberId || idx}
                                    src={
                                      member.avatarUrl || "/avatar-default.png"
                                    }
                                    alt={member.name || "Member"}
                                    className="h-7 w-7 rounded-full border-2 border-white shadow -ml-1"
                                  />
                                ))}
                              {ministry.members.length > 3 && (
                                <span className="ml-2 text-xs text-gray-400 font-medium">
                                  +{ministry.members.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 shadow"
                          title="View Details"
                        >
                          <UsersIcon className="h-5 w-5" />
                        </button>
                        {/* Add edit/delete icons as needed */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Modern Pagination: Load More */}
              {filteredMinistries.length > paginatedMinistries.length && (
                <div className="flex justify-center my-8">
                  <button
                    className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow hover:bg-indigo-700"
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          );
        }}
      </MinistryLoader>

      {/* Modals */}
      {addModalOpen && (
        <AddMinistryModal
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => {
            setAddModalOpen(false);
          }}
          branchId={branchId || ""}
          afterCreate={() => ministryRefetch && ministryRefetch()}
        />
      )}
      {detailsModalId && (
        <MinistryDetailsModal
          ministryId={detailsModalId}
          onClose={() => setDetailsModalId(null)}
        />
      )}
    </div>
  );
}
