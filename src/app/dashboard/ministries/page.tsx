"use client";

import { useState, useMemo, useEffect } from "react";
import { PlusCircleIcon, MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/24/outline";
import DashboardHeader from "@/components/DashboardHeader";
import { useMinistries } from "@/graphql/hooks/useMinistries";
import { useAuth } from "@/graphql/hooks/useAuth";
import type { Ministry, MinistryMember } from "@/types/ministry";
import { MinistryType } from "@/types/ministry";
import { useMinistry } from "@/graphql/hooks/useMinistry";
import { useCreateMinistry } from "@/graphql/hooks/useCreateMinistry";
import LoadingState from "../members/components/LoadingState";
import EmptyState from "../members/components/EmptyState";
import Pagination from "../members/components/Pagination";

function MinistryDetailsModal({ ministryId, onClose }: { ministryId: string; onClose: () => void }) {
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
        {error && <div className="text-center py-8 text-red-500">Failed to load ministry.</div>}
        {ministry && !loading && !error && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-indigo-700 flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-indigo-400" />
              {ministry.name}
            </h2>
            <div className="text-sm text-gray-600 mb-2">Type: {ministry.type || "—"}</div>
            <div className="text-sm text-gray-600 mb-2">Status: {ministry.status || "—"}</div>
            <div className="text-sm text-gray-600 mb-2">Created: {ministry.createdAt ? new Date(ministry.createdAt).toLocaleDateString() : "—"}</div>
            <div className="text-sm text-gray-600 mb-2">Leader: <span className="font-semibold text-indigo-700">{ministry.members?.find((m: MinistryMember) => m.role === "LEADER")?.memberId || "—"}</span></div>
            {ministry.subMinistries && ministry.subMinistries.length > 0 && (
              <div className="mt-2 text-sm text-indigo-500">
                <span>Sub-Ministries:</span>
                <ul className="list-disc ml-5">
                  {ministry.subMinistries.map((sm: { id: string; name: string }, i: number) => (
                    <li key={sm.id || i}>{sm.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AddMinistryModal({ onClose, onSuccess, branchId }: { onClose: () => void; onSuccess: () => void; branchId: string }) {
  const { createMinistry, loading, error } = useCreateMinistry();
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; type: MinistryType | ""; status: string }>({ name: "", type: "", status: "ACTIVE" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name || !formData.type) {
      setFormError("Name and type are required.");
      return;
    }
    try {
      await createMinistry({
        variables: {
          input: {
            name: formData.name,
            type: formData.type,
            branchId,
            status: formData.status,
          },
        },
      });
      onSuccess();
      onClose();
    } catch (err) {
      setFormError("Failed to create ministry. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close add"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
          <PlusCircleIcon className="h-6 w-6 text-indigo-400" />
          Add Ministry
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="MINISTRY">Ministry</option>
              <option value="DEPARTMENT">Department</option>
              <option value="GROUP">Group</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Ministry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Ministries() {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); 
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalId, setDetailsModalId] = useState<string | null>(null);

  const { ministries, loading, error, refetch } = useMinistries({ branchId });

  const filteredMinistries = useMemo(() => {
    if (!ministries) return [];
    return ministries.filter((m: Ministry) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ministries, searchTerm]);

  const paginatedMinistries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMinistries.slice(start, start + itemsPerPage);
  }, [filteredMinistries, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Ministries">
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Ministry
        </button>
      </DashboardHeader>

      <div className="flex items-center gap-2 px-4 md:px-8 mt-6 mb-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search ministries..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && <LoadingState message="Loading ministries..." />}
      {!loading && paginatedMinistries.length === 0 && <EmptyState message="No ministries found." />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 px-4 md:px-8 mt-10">
        {paginatedMinistries.map((ministry: Ministry) => (
          <div
            key={ministry.id}
          >
            <div
              className="bg-white rounded-2xl shadow-lg border border-indigo-50 p-6 flex flex-col items-center hover:shadow-xl transition group cursor-pointer"
              onClick={() => setDetailsModalId(ministry.id)}
            >
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700 mb-3 shadow">
                <UsersIcon className="h-10 w-10" />
              </div>
              <div className="text-lg font-semibold text-indigo-900 group-hover:text-indigo-700 text-center">{ministry.name}</div>
              <div className="text-xs text-gray-500 mb-2 text-center">{ministry.type || "—"}</div>
              <div className="flex flex-col items-center gap-1 mb-2">
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                  ministry.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : ministry.status === 'INACTIVE'
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-indigo-50 text-indigo-700'
                }`}>{ministry.status || "—"}</span>
                <span className="text-xs text-gray-400">
                  Created {ministry.createdAt ? new Date(ministry.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Leader: <span className="font-semibold text-indigo-700">{ministry.members?.find((m: MinistryMember) => m.role === "LEADER")?.memberId || "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 mb-8">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredMinistries.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {addModalOpen && (
        <AddMinistryModal
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => refetch()}
          branchId={branchId}
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
