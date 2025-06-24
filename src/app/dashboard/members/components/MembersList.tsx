"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, gql } from "@apollo/client";

type Member = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  memberSince: string;
  branch?: string;
  branchId?: string;
};

type MembersListProps = {
  members: Member[];
};

const ADD_FAMILY_MEMBER = gql`
  mutation AddFamilyConnection($memberId: ID!, $relativeId: ID!, $relationship: String!) {
    addFamilyConnection(memberId: $memberId, relativeId: $relativeId, relationship: $relationship) {
      id
      member { id name }
      relative { id name }
      relationship
      status
    }
  }
`;

function AddFamilyConnection({ memberId }: { memberId: string }) {
  const [showInput, setShowInput] = useState(false);
  const [relativeId, setRelativeId] = useState("");
  const [relationship, setRelationship] = useState("Sibling");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addFamilyConnection] = useMutation(ADD_FAMILY_MEMBER);

  // TODO: Replace with actual members list for search/autocomplete
  const relatives = [];

  const handleAdd = async () => {
    if (!relativeId) return;
    setAdding(true);
    setError(null);
    try {
      await addFamilyConnection({ variables: { memberId, relativeId, relationship } });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowInput(false);
        setRelativeId("");
      }, 1200);
    } catch (e: any) {
      setError(e.message || "Failed to add family connection");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mb-2">
      {!showInput && (
        <button
          className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold shadow-sm"
          onClick={() => setShowInput(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" /> Add Family
        </button>
      )}
      {showInput && (
        <div className="flex flex-col gap-2 bg-indigo-50 p-2 rounded-md border border-indigo-100 mt-2">
          <input
            type="text"
            className="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            placeholder="Relative Member ID..."
            value={relativeId}
            onChange={e => setRelativeId(e.target.value)}
          />
          <select
            className="rounded border-gray-300 text-xs px-2 py-1"
            value={relationship}
            onChange={e => setRelationship(e.target.value)}
          >
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Grandparent">Grandparent</option>
            <option value="Grandchild">Grandchild</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex gap-2 mt-1">
            <button
              className="inline-flex items-center px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-sm disabled:opacity-50"
              onClick={handleAdd}
              disabled={!relativeId || adding}
            >
              {adding ? "Adding..." : "Add"}
            </button>
            <button
              className="inline-flex items-center px-2 py-1 rounded text-xs border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
            {success && <span className="text-green-600 text-xs ml-2">Added!</span>}
            {error && <span className="text-red-600 text-xs ml-2">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MembersList({ members }: MembersListProps) {
  return (
    <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Name
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Member Since
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Branch
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {member.name}
                <AddFamilyConnection memberId={String(member.id)} />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.email || 'N/A'}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.phone || 'N/A'}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {member.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.memberSince}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.branch || 'Not Assigned'}</td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <Link href={`/dashboard/members/${member.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                  View
                </Link>
                <Link href={`/dashboard/members/${member.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
