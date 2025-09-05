"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  CloudArrowUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

// Types
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

interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: "text" | "image" | "signature" | "date";
  value: string;
  placeholder?: string;
  required: boolean;
  editable: boolean;
}

interface CertificateTemplate {
  id: string;
  name: string;
  type: "baptism" | "communion" | "confirmation" | "marriage";
  branchId: string;
  headerImageUrl: string;
  footerImageUrl?: string;
  backgroundImageUrl?: string;
  fields: TemplateField[];
  titleFormat: string;
  bodyFormat: string;
  lastUpdated: string;
  createdBy: string;
  isActive: boolean;
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
    website: "www.maincampus.church",
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
    website: "www.eastside.church",
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
    website: "www.westend.church",
  },
];

// Mock template data
const mockTemplates: CertificateTemplate[] = [
  {
    id: "template1",
    name: "Standard Baptism Certificate",
    type: "baptism",
    branchId: "b2",
    headerImageUrl: "/images/templates/baptism-header.jpg",
    footerImageUrl: "/images/templates/baptism-footer.jpg",
    fields: [
      {
        id: "f1",
        name: "recipientName",
        label: "Recipient Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f2",
        name: "baptismDate",
        label: "Date of Baptism",
        type: "date",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f3",
        name: "ministerName",
        label: "Minister Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f4",
        name: "parentNames",
        label: "Parent Names",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f5",
        name: "sponsorNames",
        label: "Sponsor/Godparent Names",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f6",
        name: "churchSeal",
        label: "Church Seal",
        type: "image",
        value: "/images/templates/church-seal.png",
        required: true,
        editable: false,
      },
      {
        id: "f7",
        name: "ministerSignature",
        label: "Minister Signature",
        type: "signature",
        value: "",
        required: true,
        editable: true,
      },
    ],
    titleFormat: "Certificate of Baptism",
    bodyFormat:
      "This certifies that {{recipientName}} was baptized on {{baptismDate}} at {{churchName}} by {{ministerName}}. Parents: {{parentNames}}. Sponsors: {{sponsorNames}}.",
    lastUpdated: "2023-12-15",
    createdBy: "Pastor Thomas Johnson",
    isActive: true,
  },
  {
    id: "template2",
    name: "First Communion Certificate",
    type: "communion",
    branchId: "b2",
    headerImageUrl: "/images/templates/communion-header.jpg",
    fields: [
      {
        id: "f1",
        name: "recipientName",
        label: "Recipient Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f2",
        name: "communionDate",
        label: "Date of First Communion",
        type: "date",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f3",
        name: "ministerName",
        label: "Minister Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f4",
        name: "churchSeal",
        label: "Church Seal",
        type: "image",
        value: "/images/templates/church-seal.png",
        required: true,
        editable: false,
      },
      {
        id: "f5",
        name: "ministerSignature",
        label: "Minister Signature",
        type: "signature",
        value: "",
        required: true,
        editable: true,
      },
    ],
    titleFormat: "Certificate of First Holy Communion",
    bodyFormat:
      "This certifies that {{recipientName}} received First Holy Communion on {{communionDate}} at {{churchName}} with {{ministerName}} presiding.",
    lastUpdated: "2023-11-20",
    createdBy: "Pastor Thomas Johnson",
    isActive: true,
  },
  {
    id: "template3",
    name: "Confirmation Certificate",
    type: "confirmation",
    branchId: "b2",
    headerImageUrl: "/images/templates/confirmation-header.jpg",
    fields: [
      {
        id: "f1",
        name: "recipientName",
        label: "Recipient Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f2",
        name: "confirmationDate",
        label: "Date of Confirmation",
        type: "date",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f3",
        name: "ministerName",
        label: "Minister Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f4",
        name: "sponsorName",
        label: "Sponsor Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f5",
        name: "confirmationName",
        label: "Confirmation Name",
        type: "text",
        value: "",
        required: false,
        editable: true,
      },
      {
        id: "f6",
        name: "churchSeal",
        label: "Church Seal",
        type: "image",
        value: "/images/templates/church-seal.png",
        required: true,
        editable: false,
      },
      {
        id: "f7",
        name: "ministerSignature",
        label: "Minister Signature",
        type: "signature",
        value: "",
        required: true,
        editable: true,
      },
    ],
    titleFormat: "Certificate of Confirmation",
    bodyFormat:
      "This certifies that {{recipientName}} was confirmed on {{confirmationDate}} at {{churchName}} by {{ministerName}}. Sponsor: {{sponsorName}}. Confirmation Name: {{confirmationName}}.",
    lastUpdated: "2023-10-05",
    createdBy: "Bishop Richard Thomas",
    isActive: true,
  },
  {
    id: "template4",
    name: "Marriage Certificate",
    type: "marriage",
    branchId: "b2",
    headerImageUrl: "/images/templates/marriage-header.jpg",
    backgroundImageUrl: "/images/templates/marriage-background.jpg",
    fields: [
      {
        id: "f1",
        name: "spouseName1",
        label: "First Spouse Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f2",
        name: "spouseName2",
        label: "Second Spouse Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f3",
        name: "marriageDate",
        label: "Date of Marriage",
        type: "date",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f4",
        name: "ministerName",
        label: "Minister Name",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f5",
        name: "witnessNames",
        label: "Witness Names",
        type: "text",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f6",
        name: "churchSeal",
        label: "Church Seal",
        type: "image",
        value: "/images/templates/church-seal.png",
        required: true,
        editable: false,
      },
      {
        id: "f7",
        name: "ministerSignature",
        label: "Minister Signature",
        type: "signature",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f8",
        name: "spouse1Signature",
        label: "First Spouse Signature",
        type: "signature",
        value: "",
        required: true,
        editable: true,
      },
      {
        id: "f9",
        name: "spouse2Signature",
        label: "Second Spouse Signature",
        type: "signature",
        value: "",
        required: true,
        editable: true,
      },
    ],
    titleFormat: "Certificate of Holy Matrimony",
    bodyFormat:
      "This certifies that {{spouseName1}} and {{spouseName2}} were united in Holy Matrimony on {{marriageDate}} at {{churchName}} with {{ministerName}} officiating. Witnesses: {{witnessNames}}.",
    lastUpdated: "2023-09-18",
    createdBy: "Pastor Thomas Johnson",
    isActive: true,
  },
];

// Component
export default function TemplateEditPage() {
  const params = useParams();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch branch and templates
  useEffect(() => {
    // In a real app, you would fetch from an API
    const branchId = params.branchId as string;
    const foundBranch = mockBranches.find((b) => b.id === branchId);
    const branchTemplates = mockTemplates.filter(
      (t) => t.branchId === branchId,
    );

    setBranch(foundBranch || null);
    setTemplates(branchTemplates);

    if (branchTemplates.length > 0) {
      setActiveTemplateId(branchTemplates[0].id);
    }

    setLoading(false);
  }, [params.branchId]);

  // Get active template
  const activeTemplate = templates.find((t) => t.id === activeTemplateId);

  // Handler for changing the active template
  const handleTemplateChange = (templateId: string) => {
    if (editMode) {
      // Show confirmation dialog in a real app
      if (
        confirm(
          "You have unsaved changes. Are you sure you want to change templates?",
        )
      ) {
        setActiveTemplateId(templateId);
        setEditMode(false);
      }
    } else {
      setActiveTemplateId(templateId);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setPreviewMode(false);
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // Save template changes
  const handleSaveTemplate = () => {
    // In a real app, you would save to an API
    alert("Template saved successfully!");
    setEditMode(false);
  };

  // If loading or branch not found, show loading or error
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div>
              <h3 className="text-red-800 font-medium">Branch not found</h3>
              <p className="text-red-700 mt-1">
                The branch you requested does not exist.
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard/sacraments/admin"
                  className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                >
                  <ArrowLeftIcon
                    className="-ml-0.5 mr-1 h-4 w-4"
                    aria-hidden="true"
                  />
                  Go Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard/sacraments/admin"
              className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <span
                className="inline-block h-5 w-5 rounded-full mr-2"
                style={{ backgroundColor: branch.primaryColor }}
              ></span>
              {branch.name} Certificate Templates
            </h1>
          </div>
          <div className="flex space-x-3">
            {activeTemplate && !editMode && (
              <button
                type="button"
                onClick={toggleEditMode}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Edit Template
              </button>
            )}
            {activeTemplate && editMode && (
              <button
                type="button"
                onClick={togglePreviewMode}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <EyeIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {previewMode ? "Edit Mode" : "Preview"}
              </button>
            )}
            {activeTemplate && editMode && (
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Changes
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Template
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Manage and customize certificate templates specific to {branch.name}
        </p>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12">
          {/* Template selector sidebar */}
          <div className="col-span-3 border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Templates</h2>
              <p className="text-sm text-gray-500 mt-1">
                Select a template to view or edit
              </p>
            </div>
            <nav className="flex flex-col h-full overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {templates.map((template) => {
                  const isActive = template.id === activeTemplateId;
                  return (
                    <li key={template.id}>
                      <button
                        onClick={() => handleTemplateChange(template.id)}
                        className={`w-full text-left block px-4 py-4 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${isActive ? "bg-indigo-50 border-l-4 border-indigo-500" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <DocumentTextIcon
                              className={`h-5 w-5 ${isActive ? "text-indigo-500" : "text-gray-400"} mr-3`}
                            />
                            <span
                              className={`text-sm font-medium ${isActive ? "text-indigo-700" : "text-gray-900"}`}
                            >
                              {template.name}
                            </span>
                          </span>
                          {template.isActive && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {template.type.charAt(0).toUpperCase() +
                            template.type.slice(1)}{" "}
                          • Last updated:{" "}
                          {new Date(template.lastUpdated).toLocaleDateString()}
                        </p>
                      </button>
                    </li>
                  );
                })}
                {templates.length === 0 && (
                  <li className="px-4 py-8 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No templates
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new template
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <PlusIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5"
                          aria-hidden="true"
                        />
                        New Template
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Template editor/viewer */}
          <div className="col-span-9 p-6">
            {!activeTemplate ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No template selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a template from the sidebar or create a new one
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {activeTemplate.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {activeTemplate.type.charAt(0).toUpperCase() +
                        activeTemplate.type.slice(1)}{" "}
                      Certificate Template
                    </p>
                  </div>
                  {!editMode && (
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <CloudArrowUpIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Upload Images
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-700/10 hover:bg-red-100"
                      >
                        <TrashIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5 text-red-600"
                          aria-hidden="true"
                        />
                        Delete Template
                      </button>
                    </div>
                  )}
                </div>

                {/* Template editor/viewer content - to be implemented in the next part */}
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">
                    {editMode
                      ? "Template editor will go here"
                      : "Template preview will go here"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
