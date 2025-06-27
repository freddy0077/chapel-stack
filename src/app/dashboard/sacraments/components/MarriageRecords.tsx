"use client";

import { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  DocumentArrowDownIcon,
  DocumentIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface MarriageRecord {
  id: string;
  spouse1Id: string;
  spouse1Name: string;
  spouse2Id: string;
  spouse2Name: string;
  weddingDate: string;
  location: string;
  officiant: string;
  witnesses: string[];
  certificateUrl: string | null;
  photoUrl: string | null;
  anniversaryReminder: boolean;
  notes: string;
}

// Mock data for marriage records
const mockMarriageRecords: MarriageRecord[] = [
  {
    id: "mar-001",
    spouse1Id: "mem-123",
    spouse1Name: "Michael Johnson",
    spouse2Id: "mem-124",
    spouse2Name: "Sarah Williams",
    weddingDate: "2022-06-18",
    location: "First Baptist Church",
    officiant: "Pastor John Smith",
    witnesses: ["James Davis", "Emily Brown"],
    certificateUrl: "/certificates/marriage-001.pdf",
    photoUrl: "/photos/wedding-001.jpg",
    anniversaryReminder: true,
    notes: "Traditional ceremony"
  },
  {
    id: "mar-002",
    spouse1Id: "mem-456",
    spouse1Name: "David Wilson",
    spouse2Id: "mem-457",
    spouse2Name: "Jennifer Taylor",
    weddingDate: "2022-09-24",
    location: "Grace Community Church",
    officiant: "Reverend Thomas Lee",
    witnesses: ["Robert Jones", "Susan Miller"],
    certificateUrl: "/certificates/marriage-002.pdf",
    photoUrl: "/photos/wedding-002.jpg",
    anniversaryReminder: true,
    notes: "Outdoor ceremony"
  },
  {
    id: "mar-003",
    spouse1Id: "mem-789",
    spouse1Name: "Christopher Moore",
    spouse2Id: "mem-790",
    spouse2Name: "Elizabeth Clark",
    weddingDate: "2023-02-11",
    location: "Trinity Church",
    officiant: "Pastor David Anderson",
    witnesses: ["Daniel Harris", "Patricia White"],
    certificateUrl: null,
    photoUrl: "/photos/wedding-003.jpg",
    anniversaryReminder: false,
    notes: "Certificate pending"
  },
  {
    id: "mar-004",
    spouse1Id: "mem-101",
    spouse1Name: "Joseph Martin",
    spouse2Id: "mem-102",
    spouse2Name: "Olivia Davis",
    weddingDate: "2023-05-06",
    location: "Faith Chapel",
    officiant: "Reverend Michael Johnson",
    witnesses: ["William Brown", "Emma Wilson"],
    certificateUrl: "/certificates/marriage-004.pdf",
    photoUrl: null,
    anniversaryReminder: true,
    notes: "Evening ceremony"
  },
  {
    id: "mar-005",
    spouse1Id: "mem-112",
    spouse1Name: "Matthew Thompson",
    spouse2Id: "mem-113",
    spouse2Name: "Sophia Martinez",
    weddingDate: "2023-08-19",
    location: "New Life Church",
    officiant: "Pastor Elizabeth Williams",
    witnesses: ["Noah Miller", "Ava Garcia"],
    certificateUrl: "/certificates/marriage-005.pdf",
    photoUrl: "/photos/wedding-005.jpg",
    anniversaryReminder: true,
    notes: "Bilingual ceremony"
  }
];

export function MarriageRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const records = mockMarriageRecords;

  // Filter records based on search query
  const filteredRecords = records.filter(record => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      record.spouse1Name.toLowerCase().includes(searchTerms) ||
      record.spouse2Name.toLowerCase().includes(searchTerms) ||
      record.officiant.toLowerCase().includes(searchTerms) ||
      record.location.toLowerCase().includes(searchTerms) ||
      record.witnesses.some(witness => witness.toLowerCase().includes(searchTerms))
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
        <h2 className="text-lg font-medium text-gray-900">Marriage Records</h2>
        <div className="relative max-w-md w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search by names, officiant, location..."
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
                Couple
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wedding Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Officiant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Witnesses
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
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
                  No marriage records found. Try a different search term or add a new record.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div>
                      <Link href={`/dashboard/members/${record.spouse1Id}`} className="text-indigo-600 hover:text-indigo-900">
                        {record.spouse1Name}
                      </Link>
                      {" & "}
                      <Link href={`/dashboard/members/${record.spouse2Id}`} className="text-indigo-600 hover:text-indigo-900">
                        {record.spouse2Name}
                      </Link>
                    </div>
                    {record.anniversaryReminder && (
                      <span className="inline-flex items-center mt-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Anniversary Reminders
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.weddingDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.officiant}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.witnesses.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {record.certificateUrl ? (
                        <a
                          href={record.certificateUrl}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                          <span className="sr-only">Certificate</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-gray-400">
                          <DocumentIcon className="h-5 w-5" />
                          <span className="sr-only">No Certificate</span>
                        </span>
                      )}
                      {record.photoUrl ? (
                        <a
                          href={record.photoUrl}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PhotoIcon className="h-5 w-5" />
                          <span className="sr-only">Wedding Photo</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-gray-400">
                          <PhotoIcon className="h-5 w-5" />
                          <span className="sr-only">No Photo</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/dashboard/sacraments/marriage/edit/${record.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit marriage record</span>
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
