"use client";

import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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

interface CertificateTemplate {
  id: string;
  name: string;
  type: "baptism" | "communion" | "confirmation" | "marriage";
  previewImageUrl: string;
}

interface CertificateData {
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

interface CertificateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  certificateData: CertificateData;
  branches: Branch[];
}

// Mock data for branch letterheads
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

// Mock certificate templates
const mockTemplates: CertificateTemplate[] = [
  {
    id: "t1",
    name: "Classic",
    type: "baptism",
    previewImageUrl: "/images/certificate-templates/baptism-classic.jpg",
  },
  {
    id: "t2",
    name: "Modern",
    type: "baptism",
    previewImageUrl: "/images/certificate-templates/baptism-modern.jpg",
  },
  {
    id: "t3",
    name: "Classic",
    type: "communion",
    previewImageUrl: "/images/certificate-templates/communion-classic.jpg",
  },
  {
    id: "t4",
    name: "Modern",
    type: "communion",
    previewImageUrl: "/images/certificate-templates/communion-modern.jpg",
  },
  {
    id: "t5",
    name: "Classic",
    type: "confirmation",
    previewImageUrl: "/images/certificate-templates/confirmation-classic.jpg",
  },
  {
    id: "t6",
    name: "Modern",
    type: "confirmation",
    previewImageUrl: "/images/certificate-templates/confirmation-modern.jpg",
  },
  {
    id: "t7",
    name: "Classic",
    type: "marriage",
    previewImageUrl: "/images/certificate-templates/marriage-classic.jpg",
  },
  {
    id: "t8",
    name: "Modern",
    type: "marriage",
    previewImageUrl: "/images/certificate-templates/marriage-modern.jpg",
  },
];

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  isOpen,
  onClose,
  certificateData,
  branches = mockBranches, // For demo purposes
}) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<CertificateTemplate | null>(null);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get the relevant templates for this certificate type
  const relevantTemplates = mockTemplates.filter(
    (template) => template.type === certificateData.type,
  );

  // Initialize selected branch based on certificateData
  useEffect(() => {
    if (isOpen && certificateData.branchId) {
      const branch = branches.find((b) => b.id === certificateData.branchId);
      if (branch) {
        setSelectedBranch(branch);
      }
    }

    // Pre-select the first template
    if (relevantTemplates.length > 0) {
      setSelectedTemplate(relevantTemplates[0]);
    }

    // Reset steps when modal opens
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen, certificateData, branches, relevantTemplates]);

  const handleGenerateCertificate = () => {
    setIsGenerating(true);

    // Simulate certificate generation
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  // Get the title for the certificate based on type
  const getCertificateTitle = () => {
    switch (certificateData.type) {
      case "baptism":
        return "Certificate of Baptism";
      case "communion":
        return "Certificate of First Holy Communion";
      case "confirmation":
        return "Certificate of Confirmation";
      case "marriage":
        return "Certificate of Holy Matrimony";
      default:
        return "Certificate";
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <DocumentTextIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Generate {getCertificateTitle()}
                    </Dialog.Title>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="mt-6">
                  <nav aria-label="Progress">
                    <ol
                      role="list"
                      className="space-y-4 md:flex md:space-y-0 md:space-x-8"
                    >
                      <li className="md:flex-1">
                        <div
                          className={`group flex flex-col border-l-4 ${
                            step >= 1 ? "border-indigo-600" : "border-gray-200"
                          } py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              step >= 1 ? "text-indigo-600" : "text-gray-500"
                            }`}
                          >
                            Step 1
                          </span>
                          <span className="text-sm font-medium">
                            Select Branch Letterhead
                          </span>
                        </div>
                      </li>
                      <li className="md:flex-1">
                        <div
                          className={`group flex flex-col border-l-4 ${
                            step >= 2 ? "border-indigo-600" : "border-gray-200"
                          } py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              step >= 2 ? "text-indigo-600" : "text-gray-500"
                            }`}
                          >
                            Step 2
                          </span>
                          <span className="text-sm font-medium">
                            Choose Certificate Style
                          </span>
                        </div>
                      </li>
                      <li className="md:flex-1">
                        <div
                          className={`group flex flex-col border-l-4 ${
                            step >= 3 ? "border-indigo-600" : "border-gray-200"
                          } py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              step >= 3 ? "text-indigo-600" : "text-gray-500"
                            }`}
                          >
                            Step 3
                          </span>
                          <span className="text-sm font-medium">
                            Generate & Download
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>
                </div>

                {/* Step content */}
                <div className="mt-8">
                  {/* Step 1: Select Branch */}
                  {step === 1 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Select Branch Letterhead
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Choose the branch letterhead to use for this certificate
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {branches.map((branch) => (
                          <div
                            key={branch.id}
                            className={`relative rounded-lg border ${
                              selectedBranch?.id === branch.id
                                ? "border-indigo-500 ring-2 ring-indigo-500"
                                : "border-gray-300"
                            } bg-white p-4 shadow-sm focus:outline-none cursor-pointer`}
                            onClick={() => setSelectedBranch(branch)}
                          >
                            {selectedBranch?.id === branch.id && (
                              <div className="absolute top-1 right-1">
                                <CheckIcon
                                  className="h-5 w-5 text-indigo-600"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <BuildingOfficeIcon
                                  className="h-6 w-6 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ml-4 text-left">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {branch.name}
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                  {branch.location}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Using {branch.name} letterhead with your branch
                              styling
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Choose Template */}
                  {step === 2 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Choose Certificate Template
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Select a template for your{" "}
                        {getCertificateTitle().toLowerCase()}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {relevantTemplates.map((template) => (
                          <div
                            key={template.id}
                            className={`relative rounded-lg border ${
                              selectedTemplate?.id === template.id
                                ? "border-indigo-500 ring-2 ring-indigo-500"
                                : "border-gray-300"
                            } bg-white p-4 shadow-sm focus:outline-none cursor-pointer`}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            {selectedTemplate?.id === template.id && (
                              <div className="absolute top-1 right-1">
                                <CheckIcon
                                  className="h-5 w-5 text-indigo-600"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
                              {/* This would be a preview image in a real implementation */}
                              <DocumentTextIcon
                                className="h-32 w-32 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-2 text-center">
                              <h3 className="text-sm font-medium text-gray-900">
                                {template.name}
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">
                                {template.type.charAt(0).toUpperCase() +
                                  template.type.slice(1)}{" "}
                                Style
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Generated Certificate */}
                  {step === 3 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Certificate Generated
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Your certificate has been generated successfully
                      </p>

                      <div className="mt-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                        <div className="flex flex-col items-center justify-center">
                          <div
                            className="bg-gray-50 w-full rounded-t-md p-4 text-center border-b border-gray-200"
                            style={{
                              backgroundColor: selectedBranch?.primaryColor,
                              color: "white",
                            }}
                          >
                            <h3 className="text-xl font-serif">
                              {selectedBranch?.name}
                            </h3>
                            <p className="text-sm">
                              {selectedBranch?.location}
                            </p>
                          </div>

                          <div className="w-full p-6 text-center">
                            <h1 className="text-2xl font-bold mb-4">
                              {getCertificateTitle()}
                            </h1>
                            <p className="text-lg mb-6">
                              This is to certify that
                            </p>
                            <p className="text-xl font-semibold mb-2">
                              {certificateData.recipientName}
                            </p>

                            {certificateData.type === "baptism" &&
                              certificateData.parents && (
                                <p className="text-sm mb-4">
                                  Child of{" "}
                                  {certificateData.parents.join(" &amp; ")}
                                </p>
                              )}

                            <p className="text-lg mb-6">
                              {certificateData.type === "baptism" &&
                                "was baptized on"}
                              {certificateData.type === "communion" &&
                                "received First Holy Communion on"}
                              {certificateData.type === "confirmation" &&
                                "was confirmed on"}
                              {certificateData.type === "marriage" &&
                                "was united in Holy Matrimony on"}
                            </p>

                            <p className="text-lg mt-4">
                              on this day,{" "}
                              {new Date(
                                certificateData.date,
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-lg mt-8">
                              May God&apos;s grace be with you always.
                            </p>

                            <div className="flex justify-between items-center mt-8 px-8">
                              <div className="text-center">
                                <div className="border-t border-gray-300 w-32 mx-auto mb-1"></div>
                                <p className="text-sm">
                                  Minister&apos;s Signature
                                </p>
                                <p className="text-xs">
                                  {certificateData.ministerName}
                                </p>
                              </div>

                              <div className="text-center">
                                <div className="border-t border-gray-300 w-32 mx-auto mb-1"></div>
                                <p className="text-sm">Date</p>
                                <p className="text-xs">
                                  {new Date().toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {certificateData.recordNumber && (
                              <p className="text-xs text-gray-500 mt-8">
                                Certificate #: {certificateData.recordNumber}
                              </p>
                            )}
                          </div>

                          <div
                            className="bg-gray-50 w-full rounded-b-md p-2 text-center text-xs border-t border-gray-200"
                            style={{
                              backgroundColor: selectedBranch?.secondaryColor,
                              color: "white",
                            }}
                          >
                            {selectedBranch?.contactInfo} |{" "}
                            {selectedBranch?.website}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center space-x-4">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <PrinterIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Print Certificate
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <ArrowDownTrayIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  {step < 3 ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        onClick={() => {
                          if (step === 1 && selectedBranch) {
                            setStep(2);
                          } else if (step === 2 && selectedTemplate) {
                            handleGenerateCertificate();
                          }
                        }}
                        disabled={
                          (step === 1 && !selectedBranch) ||
                          (step === 2 && !selectedTemplate) ||
                          isGenerating
                        }
                      >
                        {isGenerating ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Generating...
                          </>
                        ) : step === 1 ? (
                          "Next Step"
                        ) : (
                          "Generate Certificate"
                        )}
                      </button>
                      {step > 1 && (
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={() => setStep(step - 1)}
                          disabled={isGenerating}
                        >
                          Back
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CertificateGenerator;
