"use client";

import { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  DocumentArrowDownIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface CommunionRecord {
  id: string;
  memberId: string;
  memberName: string;
  communionDate: string;
  location: string;
  officiant: string;
  catechist: string;
  certificateUrl: string | null;
  notes: string;
}

// Mock data for communion records
const mockCommunionRecords: CommunionRecord[] = [
  {
    id: "com-001",
    memberId: "mem-456",
    memberName: "Emma Wilson",
    communionDate: "2023-05-21",
    location: "St. Mary's Cathedral",
    officiant: "Father Joseph Thomas",
    catechist: "Sister Mary Elizabeth",
    certificateUrl: "/certificates/communion-001.pdf",
    notes: "Part of group communion ceremony"
  },
  {
    id: "com-002",
    memberId: "mem-789",
    memberName: "Noah Martinez",
    communionDate: "2023-05-21",
    location: "St. Mary's Cathedral",
    officiant: "Father Joseph Thomas",
    catechist: "Sister Mary Elizabeth",
    certificateUrl: "/certificates/communion-002.pdf",
    notes: "Part of group communion ceremony"
  },
  {
    id: "com-003",
    memberId: "mem-101",
    memberName: "Olivia Taylor",
    communionDate: "2023-06-11",
    location: "Sacred Heart Church",
    officiant: "Father Michael Rodriguez",
    catechist: "Brother James Francis",
    certificateUrl: "/certificates/communion-003.pdf",
    notes: "Private ceremony"
  },
  {
    id: "com-004",
    memberId: "mem-112",
    memberName: "William Davis",
    communionDate: "2023-08-27",
    location: "Holy Trinity Church",
    officiant: "Father Robert Anderson",
    catechist: "Sister Catherine Marie",
    certificateUrl: null,
    notes: "Certificate pending"
  },
  {
    id: "com-005",
    memberId: "mem-131",
    memberName: "Sophia Brown",
    communionDate: "2023-10-15",
    location: "St. Joseph's Parish",
    officiant: "Father David Wilson",
    catechist: "Sister Anna Grace",
    certificateUrl: "/certificates/communion-005.pdf",
    notes: "Special needs accommodations provided"
  }
];

export function CommunionRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const records: CommunionRecord[] = mockCommunionRecords;

  // Filter records based on search query
  const filteredRecords = records.filter(record => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      record.memberName.toLowerCase().includes(searchTerms) ||
      record.officiant.toLowerCase().includes(searchTerms) ||
      record.location.toLowerCase().includes(searchTerms) ||
      record.catechist.toLowerCase().includes(searchTerms)
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
        <h2 className="text-lg font-medium text-gray-900">First Communion Records</h2>
        <div className="relative max-w-md w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search by name, officiant, location..."
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
                Catechist
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
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No communion records found. Try a different search term or add a new record.
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
                    {formatDate(record.communionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.officiant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.catechist}
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
                      href={`/dashboard/sacraments/communion/edit/${record.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit {record.memberName}&apos;s communion record</span>
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
