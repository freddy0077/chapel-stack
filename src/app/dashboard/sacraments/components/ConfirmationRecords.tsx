"use client";

import { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  DocumentArrowDownIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface ConfirmationRecord {
  id: string;
  memberId: string;
  memberName: string;
  confirmationDate: string;
  location: string;
  officiant: string;
  sponsor: string;
  confirmationName: string;
  certificateUrl: string | null;
  notes: string;
}

// Mock data for confirmation records
const mockConfirmationRecords: ConfirmationRecord[] = [
  {
    id: "conf-001",
    memberId: "mem-456",
    memberName: "Emma Wilson",
    confirmationDate: "2023-06-04",
    location: "St. Mary's Cathedral",
    officiant: "Bishop Thomas Williams",
    sponsor: "Sarah Johnson",
    confirmationName: "Catherine",
    certificateUrl: "/certificates/confirmation-001.pdf",
    notes: "Part of diocesan confirmation"
  },
  {
    id: "conf-002",
    memberId: "mem-789",
    memberName: "Noah Martinez",
    confirmationDate: "2023-06-04",
    location: "St. Mary's Cathedral",
    officiant: "Bishop Thomas Williams",
    sponsor: "Michael Brown",
    confirmationName: "Francis",
    certificateUrl: "/certificates/confirmation-002.pdf",
    notes: "Part of diocesan confirmation"
  },
  {
    id: "conf-003",
    memberId: "mem-101",
    memberName: "Olivia Taylor",
    confirmationDate: "2023-09-17",
    location: "Sacred Heart Church",
    officiant: "Bishop John Anderson",
    sponsor: "Jennifer Davis",
    confirmationName: "Elizabeth",
    certificateUrl: "/certificates/confirmation-003.pdf",
    notes: "Private ceremony"
  },
  {
    id: "conf-004",
    memberId: "mem-112",
    memberName: "William Davis",
    confirmationDate: "2023-11-05",
    location: "Holy Trinity Church",
    officiant: "Bishop Robert Clark",
    sponsor: "James Wilson",
    confirmationName: "Michael",
    certificateUrl: null,
    notes: "Certificate pending"
  },
  {
    id: "conf-005",
    memberId: "mem-131",
    memberName: "Sophia Brown",
    confirmationDate: "2024-02-18",
    location: "St. Joseph's Parish",
    officiant: "Bishop David Smith",
    sponsor: "Mary Taylor",
    confirmationName: "Teresa",
    certificateUrl: "/certificates/confirmation-005.pdf",
    notes: "Special needs accommodations provided"
  }
];

export function ConfirmationRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const records = mockConfirmationRecords;

  // Filter records based on search query
  const filteredRecords = records.filter(record => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      record.memberName.toLowerCase().includes(searchTerms) ||
      record.officiant.toLowerCase().includes(searchTerms) ||
      record.location.toLowerCase().includes(searchTerms) ||
      record.sponsor.toLowerCase().includes(searchTerms) ||
      record.confirmationName.toLowerCase().includes(searchTerms)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-medium text-gray-900">Confirmation Records</h2>
        <div className="relative max-w-md w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search by name, officiant, location, sponsor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Officiant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sponsor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confirmation Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No confirmation records found. Try a different search term or add a new record.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/dashboard/members/${record.memberId}`} className="hover:text-indigo-600">
                      {record.memberName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.confirmationDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.officiant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.sponsor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.confirmationName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.certificateUrl ? (
                      <a
                        href={record.certificateUrl}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
                        View
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-gray-400">
                        <DocumentIcon className="h-5 w-5 mr-1" />
                        None
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/dashboard/sacraments/confirmation/edit/${record.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit {record.memberName}&apos;s confirmation record</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
