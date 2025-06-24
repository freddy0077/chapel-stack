"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  LockClosedIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import BranchAccessControls from "../components/BranchAccessControls";
import CertificateGenerator from "../components/CertificateGenerator";

// Define types
interface Branch {
  id: string;
  name: string;
  location: string;
  region: string;
  logoUrl: string;
  letterheadImageUrl: string; 
  primaryColor: string;
  secondaryColor: string;
  contactInfo: string;
  website: string;
}

interface CertificateData {
  id: string;
  type: "baptism" | "communion" | "confirmation" | "marriage";
  recipientName: string;
  date: string;
  location: string;
  ministerName: string;
  witnesses?: string[];
  parents?: string[];
  sponsors?: string[];
  specialNotes?: string;
  recordNumber?: string;
  branchId: string;
}

// Mock data for branches
const mockBranches: Branch[] = [
  {
    id: "b1",
    name: "Main Campus",
    location: "123 Main St, Cityville",
    region: "North",
    logoUrl: "/images/branch-logos/main-campus-logo.png",
    letterheadImageUrl: "/images/letterheads/main-campus-letterhead.jpg",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    contactInfo: "Phone: (555) 123-4567 | Email: info@maincampus.church",
    website: "www.maincampus.church"
  },
  {
    id: "b2",
    name: "East Side",
    location: "456 East Blvd, Cityville",
    region: "East",
    logoUrl: "/images/branch-logos/east-side-logo.png",
    letterheadImageUrl: "/images/letterheads/east-side-letterhead.jpg",
    primaryColor: "#065f46",
    secondaryColor: "#10b981",
    contactInfo: "Phone: (555) 234-5678 | Email: info@eastside.church",
    website: "www.eastside.church" 
  },
  {
    id: "b3",
    name: "West End",
    location: "789 West Ave, Cityville",
    region: "West",
    logoUrl: "/images/branch-logos/west-end-logo.png",
    letterheadImageUrl: "/images/letterheads/west-end-letterhead.jpg",
    primaryColor: "#7c2d12",
    secondaryColor: "#ea580c",
    contactInfo: "Phone: (555) 345-6789 | Email: info@westend.church",
    website: "www.westend.church"
  }
];

// Mock certificate templates
const mockCertificates: CertificateData[] = [
  {
    id: "cert1",
    type: "baptism",
    recipientName: "Emma Wilson",
    date: "2023-01-15",
    location: "Main Campus",
    ministerName: "Pastor Thomas Johnson",
    parents: ["Michael Wilson", "Sarah Wilson"],
    sponsors: ["John Davis", "Mary Smith"],
    recordNumber: "BAP-2023-001",
    branchId: "b1"
  },
  {
    id: "cert2",
    type: "communion",
    recipientName: "Noah Martinez",
    date: "2023-02-20",
    location: "East Side",
    ministerName: "Father Michael Rodriguez",
    recordNumber: "COM-2023-015",
    branchId: "b2"
  },
  {
    id: "cert3",
    type: "confirmation",
    recipientName: "Olivia Taylor",
    date: "2023-03-12",
    location: "West End",
    ministerName: "Bishop Richard Thomas",
    sponsors: ["Elizabeth Davis"],
    recordNumber: "CON-2023-008",
    branchId: "b3"
  },
  {
    id: "cert4",
    type: "marriage",
    recipientName: "James & Emily Johnson",
    date: "2023-04-22",
    location: "Main Campus",
    ministerName: "Pastor Thomas Johnson",
    witnesses: ["Robert Brown", "Jennifer White"],
    recordNumber: "MAR-2023-005",
    branchId: "b1"
  }
];

// Component
export default function SacramentsAdminPage() {
  const [activeTab, setActiveTab] = useState<"access-controls" | "certificates">("access-controls");
  const [selectedRecordType, setSelectedRecordType] = useState<"baptism" | "communion" | "confirmation" | "marriage" | "all">("all");
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  
  const handleGenerateCertificate = (certificate: CertificateData) => {
    setSelectedCertificate(certificate);
    setIsCertificateModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center">
          <Link 
            href="/dashboard/sacraments" 
            className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Sacramental Records Administration</h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Manage branch-specific access controls and certificate generation
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as "access-controls" | "certificates")}
          >
            <option value="access-controls">Branch Access Controls</option>
            <option value="certificates">Certificate Management</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("access-controls")}
                className={`${
                  activeTab === "access-controls"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <LockClosedIcon className={`${
                  activeTab === "access-controls" ? "text-indigo-500" : "text-gray-400"
                } -ml-0.5 mr-2 h-5 w-5`} />
                Branch Access Controls
              </button>
              <button
                onClick={() => setActiveTab("certificates")}
                className={`${
                  activeTab === "certificates"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <DocumentTextIcon className={`${
                  activeTab === "certificates" ? "text-indigo-500" : "text-gray-400"
                } -ml-0.5 mr-2 h-5 w-5`} />
                Certificate Management
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Tab content */}
      {activeTab === "access-controls" && (
        <div>
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">Record Type Filter</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set permissions for specific types of sacramental records
                </p>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <select
                  id="record-type"
                  name="record-type"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={selectedRecordType}
                  onChange={(e) => setSelectedRecordType(e.target.value as "baptism" | "communion" | "confirmation" | "marriage" | "all")}
                >
                  <option value="all">All Record Types</option>
                  <option value="baptism">Baptism Records</option>
                  <option value="communion">First Communion Records</option>
                  <option value="confirmation">Confirmation Records</option>
                  <option value="marriage">Marriage Records</option>
                </select>
              </div>
            </div>
          </div>
          
          <BranchAccessControls selectedRecordType={selectedRecordType} />
        </div>
      )}
      
      {activeTab === "certificates" && (
        <div>
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Branch-Specific Certificate Templates
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage certificate templates and generation for each branch
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Template
                </button>
              </div>
            </div>
            
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockBranches.map((branch) => (
                  <div key={branch.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6" style={{ backgroundColor: branch.primaryColor }}>
                      <h3 className="text-lg font-medium text-white">{branch.name}</h3>
                      <p className="mt-1 max-w-2xl text-sm text-white opacity-80">{branch.location}</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Baptism Template</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Active
                            </span>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Communion Template</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Active
                            </span>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Confirmation Template</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Active
                            </span>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Marriage Template</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Active
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-4 flex justify-end">
                      <Link
                        href={`/dashboard/sacraments/templates/${branch.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Edit Templates
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sample certificates */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Certificates
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and generate certificates for recent sacramental records
              </p>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {mockCertificates.map((certificate) => {
                const branch = mockBranches.find(b => b.id === certificate.branchId);
                return (
                  <li key={certificate.id} className="px-6 py-5 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ 
                            backgroundColor: branch?.primaryColor || '#4f46e5',
                            color: 'white'
                          }}>
                            {certificate.type === 'baptism' && 'B'}
                            {certificate.type === 'communion' && 'C'}
                            {certificate.type === 'confirmation' && 'Cf'}
                            {certificate.type === 'marriage' && 'M'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{certificate.recipientName}</div>
                          <div className="text-sm text-gray-500">
                            {certificate.recordNumber} • {new Date(certificate.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-4 text-sm text-gray-500">{branch?.name}</span>
                        <button
                          type="button"
                          onClick={() => handleGenerateCertificate(certificate)}
                          className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                        >
                          Generate Certificate
                          <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <Link
                href="/dashboard/sacraments/certificates"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all certificates →
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Certificate Generator Modal */}
      {selectedCertificate && (
        <CertificateGenerator
          isOpen={isCertificateModalOpen}
          onClose={() => {
            setIsCertificateModalOpen(false);
            setSelectedCertificate(null);
          }}
          certificateData={selectedCertificate}
          branches={mockBranches}
        />
      )}
    </div>
  );
}
