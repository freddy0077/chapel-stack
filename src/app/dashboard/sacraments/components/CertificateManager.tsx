"use client";

import { useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  DocumentArrowDownIcon,
  XMarkIcon,
  PrinterIcon,
  ShareIcon,
  PaintBrushIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface CertificateTemplate {
  id: string;
  name: string;
  sacramentType: string;
  description: string;
  previewUrl: string;
  isDefault: boolean;
}

interface SacramentRecord {
  id: string;
  memberId: string;
  memberName: string;
  sacramentType: string;
  dateOfSacrament: string;
  officiantName: string;
  locationOfSacrament: string;
  certificateUrl?: string;
  certificateNumber?: string;
  witness1Name?: string;
  witness2Name?: string;
}

interface CertificateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  record: SacramentRecord | null;
  onCertificateGenerated?: (
    certificateUrl: string,
    certificateNumber: string,
  ) => void;
}

const defaultTemplates: CertificateTemplate[] = [
  {
    id: "baptism-classic",
    name: "Classic Baptism",
    sacramentType: "BAPTISM",
    description: "Traditional baptism certificate with elegant border",
    previewUrl: "/templates/baptism-classic-preview.jpg",
    isDefault: true,
  },
  {
    id: "baptism-modern",
    name: "Modern Baptism",
    sacramentType: "BAPTISM",
    description: "Contemporary design with clean lines",
    previewUrl: "/templates/baptism-modern-preview.jpg",
    isDefault: false,
  },
  {
    id: "communion-traditional",
    name: "Traditional First Communion",
    sacramentType: "EUCHARIST_FIRST_COMMUNION",
    description: "Classic first communion certificate with religious symbols",
    previewUrl: "/templates/communion-traditional-preview.jpg",
    isDefault: true,
  },
  {
    id: "confirmation-elegant",
    name: "Elegant Confirmation",
    sacramentType: "CONFIRMATION",
    description: "Sophisticated confirmation certificate design",
    previewUrl: "/templates/confirmation-elegant-preview.jpg",
    isDefault: true,
  },
  {
    id: "marriage-ornate",
    name: "Ornate Marriage",
    sacramentType: "MARRIAGE",
    description: "Beautiful marriage certificate with decorative elements",
    previewUrl: "/templates/marriage-ornate-preview.jpg",
    isDefault: true,
  },
];

export default function CertificateManager({
  isOpen,
  onClose,
  record,
  onCertificateGenerated,
}: CertificateManagerProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<CertificateTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<
    "template" | "customizing" | "generating" | "complete"
  >("template");
  const [certificateData, setCertificateData] = useState({
    memberName: "",
    dateOfSacrament: "",
    officiantName: "",
    locationOfSacrament: "",
    certificateNumber: "",
    specialNotes: "",
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!record) return null;

  const availableTemplates = defaultTemplates.filter(
    (template) => template.sacramentType === record.sacramentType,
  );

  const handleTemplateSelect = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setCertificateData({
      memberName: record.memberName,
      dateOfSacrament: record.dateOfSacrament,
      officiantName: record.officiantName,
      locationOfSacrament: record.locationOfSacrament,
      certificateNumber:
        record.certificateNumber || generateCertificateNumber(),
      specialNotes: "",
    });
    setGenerationStep("customizing");
  };

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const typeCode = record.sacramentType.charAt(0);
    return `${typeCode}${year}${random}`;
  };

  const handleCustomizationComplete = () => {
    setGenerationStep("generating");
    generateCertificate();
  };

  const generateCertificate = async () => {
    setIsGenerating(true);

    try {
      // Simulate certificate generation process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would:
      // 1. Create a PDF using a library like jsPDF or PDFKit
      // 2. Apply the selected template
      // 3. Fill in the certificate data
      // 4. Upload to cloud storage
      // 5. Return the URL and certificate number

      const mockCertificateUrl = `https://certificates.church.com/${certificateData.certificateNumber}.pdf`;

      setGenerationStep("complete");

      if (onCertificateGenerated) {
        onCertificateGenerated(
          mockCertificateUrl,
          certificateData.certificateNumber,
        );
      }

      toast.success("Certificate generated successfully!");
    } catch (error) {
      toast.error("Failed to generate certificate");
      setGenerationStep("customizing");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    // In real implementation, this would download the actual PDF
    const link = document.createElement("a");
    link.href = "#"; // Would be the actual certificate URL
    link.download = `${record.sacramentType.toLowerCase()}-certificate-${certificateData.certificateNumber}.pdf`;
    link.click();
    toast.success("Certificate download started");
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${record.sacramentType} Certificate`,
          text: `Certificate for ${certificateData.memberName}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const resetToTemplateSelection = () => {
    setGenerationStep("template");
    setSelectedTemplate(null);
  };

  const formatSacramentType = (type: string) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <DocumentArrowDownIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <Dialog.Title className="text-lg font-semibold text-white">
                          Certificate Manager
                        </Dialog.Title>
                        <p className="text-sm text-white/80">
                          Generate {formatSacramentType(record.sacramentType)}{" "}
                          Certificate
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-center space-x-8">
                    <div
                      className={`flex items-center space-x-2 ${
                        generationStep === "template"
                          ? "text-indigo-600"
                          : ["customizing", "generating", "complete"].includes(
                                generationStep,
                              )
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          generationStep === "template"
                            ? "bg-indigo-100 border-2 border-indigo-600"
                            : [
                                  "customizing",
                                  "generating",
                                  "complete",
                                ].includes(generationStep)
                              ? "bg-green-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {["customizing", "generating", "complete"].includes(
                          generationStep,
                        ) ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-sm font-medium">1</span>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        Select Template
                      </span>
                    </div>

                    <div
                      className={`flex items-center space-x-2 ${
                        generationStep === "customizing"
                          ? "text-indigo-600"
                          : ["generating", "complete"].includes(generationStep)
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          generationStep === "customizing"
                            ? "bg-indigo-100 border-2 border-indigo-600"
                            : ["generating", "complete"].includes(
                                  generationStep,
                                )
                              ? "bg-green-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {["generating", "complete"].includes(generationStep) ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-sm font-medium">2</span>
                        )}
                      </div>
                      <span className="text-sm font-medium">Customize</span>
                    </div>

                    <div
                      className={`flex items-center space-x-2 ${
                        generationStep === "generating"
                          ? "text-indigo-600"
                          : generationStep === "complete"
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          generationStep === "generating"
                            ? "bg-indigo-100 border-2 border-indigo-600"
                            : generationStep === "complete"
                              ? "bg-green-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {generationStep === "complete" ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-sm font-medium">3</span>
                        )}
                      </div>
                      <span className="text-sm font-medium">Generate</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Template Selection */}
                  {generationStep === "template" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Choose a Certificate Template
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableTemplates.map((template) => (
                          <div
                            key={template.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <div className="aspect-w-4 aspect-h-3 mb-3">
                              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                <DocumentDuplicateIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {template.name}
                              </h4>
                              {template.isDefault && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {template.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customization */}
                  {generationStep === "customizing" && selectedTemplate && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Customize Certificate
                          </h3>
                          <button
                            onClick={resetToTemplateSelection}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Change Template
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Member Name
                            </label>
                            <input
                              type="text"
                              value={certificateData.memberName}
                              onChange={(e) =>
                                setCertificateData((prev) => ({
                                  ...prev,
                                  memberName: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date of Sacrament
                            </label>
                            <input
                              type="date"
                              value={certificateData.dateOfSacrament}
                              onChange={(e) =>
                                setCertificateData((prev) => ({
                                  ...prev,
                                  dateOfSacrament: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Officiant Name
                            </label>
                            <input
                              type="text"
                              value={certificateData.officiantName}
                              onChange={(e) =>
                                setCertificateData((prev) => ({
                                  ...prev,
                                  officiantName: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={certificateData.locationOfSacrament}
                              onChange={(e) =>
                                setCertificateData((prev) => ({
                                  ...prev,
                                  locationOfSacrament: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Certificate Number
                            </label>
                            <input
                              type="text"
                              value={certificateData.certificateNumber}
                              onChange={(e) =>
                                setCertificateData((prev) => ({
                                  ...prev,
                                  certificateNumber: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Special Notes (Optional)
                            </label>
                            <textarea
                              value={certificateData.specialNotes}
                              onChange={(e) =>
                                setCertificateData((prev) => ({
                                  ...prev,
                                  specialNotes: e.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Any special notes or dedications..."
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Preview
                        </h4>
                        <div className="bg-gray-100 rounded-lg p-6 text-center">
                          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-sm">
                            <h5 className="text-xl font-bold text-gray-900 mb-4">
                              {selectedTemplate.name}
                            </h5>
                            <div className="space-y-2 text-sm text-gray-700">
                              <p>
                                <strong>Member:</strong>{" "}
                                {certificateData.memberName}
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  certificateData.dateOfSacrament,
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Officiant:</strong>{" "}
                                {certificateData.officiantName}
                              </p>
                              <p>
                                <strong>Location:</strong>{" "}
                                {certificateData.locationOfSacrament}
                              </p>
                              <p>
                                <strong>Certificate #:</strong>{" "}
                                {certificateData.certificateNumber}
                              </p>
                            </div>
                            {certificateData.specialNotes && (
                              <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                                {certificateData.specialNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generation Progress */}
                  {generationStep === "generating" && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Generating Certificate
                      </h3>
                      <p className="text-gray-600">
                        Please wait while we create your certificate...
                      </p>
                    </div>
                  )}

                  {/* Completion */}
                  {generationStep === "complete" && (
                    <div className="text-center py-8">
                      <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Certificate Generated!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your{" "}
                        {formatSacramentType(
                          record.sacramentType,
                        ).toLowerCase()}{" "}
                        certificate has been successfully created.
                      </p>

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={handleDownload}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                          Download
                        </button>
                        <button
                          onClick={handlePrint}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <PrinterIcon className="h-4 w-4 mr-2" />
                          Print
                        </button>
                        <button
                          onClick={handleShare}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <ShareIcon className="h-4 w-4 mr-2" />
                          Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                {generationStep === "customizing" && (
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                    <button
                      onClick={resetToTemplateSelection}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back to Templates
                    </button>
                    <button
                      onClick={handleCustomizationComplete}
                      disabled={
                        !certificateData.memberName ||
                        !certificateData.dateOfSacrament ||
                        !certificateData.officiantName
                      }
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      Generate Certificate
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
