"use client";

import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useUpdateSacramentalRecord } from "@/graphql/hooks/useUpdateSacramentalRecord";
import { SacramentRecord } from "../page";
import SearchableMemberInput from "@/components/ui/SearchableMemberInput";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";

interface SacramentRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  locationOfSacrament: string;
  officiantName: string;
  officiantId?: string | null;
  godparent1Name?: string | null;
  godparent2Name?: string | null;
  sponsorName?: string | null;
  witness1Name?: string | null;
  witness2Name?: string | null;
  groomName?: string | null;
  brideName?: string | null;
  certificateNumber?: string | null;
  certificateUrl?: string | null;
  notes?: string | null;
  branchId: string;
  organisationId?: string | null;
  createdAt: string;
  updatedAt: string;
  memberName?: string;
  displayName?: string;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  memberId?: string;
  branch?: {
    id: string;
    name: string;
  };
}

interface EditSacramentalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SacramentRecord | null;
  onSuccess: () => void;
}

// Map frontend display names to backend enum values
const SACRAMENT_TYPE_MAPPING = {
  BAPTISM: "BAPTISM",
  COMMUNION: "EUCHARIST_FIRST_COMMUNION",
  CONFIRMATION: "CONFIRMATION",
  MARRIAGE: "MATRIMONY",
  MATRIMONY: "MATRIMONY",
  EUCHARIST_FIRST_COMMUNION: "EUCHARIST_FIRST_COMMUNION",
  RECONCILIATION_FIRST: "RECONCILIATION_FIRST",
  ANOINTING_OF_THE_SICK: "ANOINTING_OF_THE_SICK",
  HOLY_ORDERS_DIACONATE: "HOLY_ORDERS_DIACONATE",
  HOLY_ORDERS_PRIESTHOOD: "HOLY_ORDERS_PRIESTHOOD",
  RCIA_INITIATION: "RCIA_INITIATION",
};

// Reverse mapping for display
const DISPLAY_TYPE_MAPPING = {
  BAPTISM: "Baptism",
  EUCHARIST_FIRST_COMMUNION: "First Communion",
  CONFIRMATION: "Confirmation",
  MATRIMONY: "Marriage",
  RECONCILIATION_FIRST: "First Reconciliation",
  ANOINTING_OF_THE_SICK: "Anointing of the Sick",
  HOLY_ORDERS_DIACONATE: "Diaconate Ordination",
  HOLY_ORDERS_PRIESTHOOD: "Priesthood Ordination",
  RCIA_INITIATION: "RCIA Initiation",
};

const formatSacramentType = (type: string) => {
  return (
    DISPLAY_TYPE_MAPPING[type as keyof typeof DISPLAY_TYPE_MAPPING] ||
    type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const getSacramentColor = (type: string) => {
  switch (type) {
    case "BAPTISM":
      return "blue";
    case "EUCHARIST_FIRST_COMMUNION":
      return "amber";
    case "CONFIRMATION":
      return "purple";
    case "MATRIMONY":
      return "rose";
    case "RECONCILIATION_FIRST":
      return "green";
    case "ANOINTING_OF_THE_SICK":
      return "indigo";
    case "HOLY_ORDERS_DIACONATE":
    case "HOLY_ORDERS_PRIESTHOOD":
      return "violet";
    case "RCIA_INITIATION":
      return "teal";
    default:
      return "blue";
  }
};

export default function EditSacramentalRecordModal({
  isOpen,
  onClose,
  record,
  onSuccess,
}: EditSacramentalRecordModalProps) {
  const [formData, setFormData] = useState({
    dateOfSacrament: "",
    locationOfSacrament: "",
    officiantName: "",
    officiantId: "",
    godparent1Name: "",
    godparent2Name: "",
    sponsorName: "",
    witness1Name: "",
    witness2Name: "",
    groomName: "",
    brideName: "",
    certificateNumber: "",
    certificateUrl: "",
    notes: "",
  });

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedGroomMember, setSelectedGroomMember] = useState<Member | null>(
    null,
  );
  const [selectedBrideMember, setSelectedBrideMember] = useState<Member | null>(
    null,
  );
  const [updateRecord, { loading }] = useUpdateSacramentalRecord();
  const orgBranchFilter = useOrganizationBranchFilter();

  useEffect(() => {
    if (record) {
      setFormData({
        dateOfSacrament: record.dateOfSacrament
          ? new Date(record.dateOfSacrament).toISOString().split("T")[0]
          : "",
        locationOfSacrament: record.locationOfSacrament || "",
        officiantName: record.officiantName || "",
        officiantId: record.officiantId || "",
        godparent1Name: record.godparent1Name || "",
        godparent2Name: record.godparent2Name || "",
        sponsorName: record.sponsorName || "",
        witness1Name: record.witness1Name || "",
        witness2Name: record.witness2Name || "",
        groomName: record.groomName || "",
        brideName: record.brideName || "",
        certificateNumber: record.certificateNumber || "",
        certificateUrl: record.certificateUrl || "",
        notes: record.notes || "",
      });

      if (record.memberId && record.memberName) {
        const [firstName, ...lastNameParts] = record.memberName.split(" ");
        setSelectedMember({
          id: record.memberId,
          firstName: firstName || "",
          lastName: lastNameParts.join(" ") || "",
          memberId: record.memberId,
        });
      }
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!record) return;

    if (!selectedMember) {
      toast.error("Please select a member for this sacrament record");
      return;
    }

    try {
      await updateRecord({
        variables: {
          id: record.id,
          input: {
            memberId: selectedMember.id,
            dateOfSacrament: new Date(formData.dateOfSacrament),
            locationOfSacrament: formData.locationOfSacrament,
            officiantName: formData.officiantName,
            officiantId: formData.officiantId || null,
            groomMemberId: selectedGroomMember?.id || null,
            brideMemberId: selectedBrideMember?.id || null,
            witness1MemberId: null, // TODO: Add witness member selection
            witness2MemberId: null, // TODO: Add witness member selection
            godparent1Name: formData.godparent1Name || null,
            godparent2Name: formData.godparent2Name || null,
            sponsorName: formData.sponsorName || null,
            witness1Name: formData.witness1Name || null,
            witness2Name: formData.witness2Name || null,
            groomName: selectedGroomMember
              ? `${selectedGroomMember.firstName} ${selectedGroomMember.lastName}`
              : formData.groomName || null,
            brideName: selectedBrideMember
              ? `${selectedBrideMember.firstName} ${selectedBrideMember.lastName}`
              : formData.brideName || null,
            certificateNumber: formData.certificateNumber || null,
            certificateUrl: formData.certificateUrl || null,
            notes: formData.notes || null,
            branchId: orgBranchFilter.branchId || "",
            organisationId: orgBranchFilter.organisationId || null,
          },
        },
      });

      toast.success("Sacrament record updated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating record:", error);
      toast.error(error.message || "Failed to update sacrament record");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (memberId: string, member?: Member) => {
    setSelectedMember(member || null);
  };

  const handleGroomMemberChange = (value: string, member?: Member) => {
    if (member) {
      setSelectedGroomMember(member);
      setFormData((prev) => ({
        ...prev,
        groomName: `${member.firstName} ${member.lastName}`,
      }));
    } else {
      setSelectedGroomMember(null);
      setFormData((prev) => ({
        ...prev,
        groomName: value,
      }));
    }
  };

  const handleBrideMemberChange = (value: string, member?: Member) => {
    if (member) {
      setSelectedBrideMember(member);
      setFormData((prev) => ({
        ...prev,
        brideName: `${member.firstName} ${member.lastName}`,
      }));
    } else {
      setSelectedBrideMember(null);
      setFormData((prev) => ({
        ...prev,
        brideName: value,
      }));
    }
  };

  if (!record) return null;

  const color = getSacramentColor(record.sacramentType);
  const sacramentType = record.sacramentType;

  const showGodparents = sacramentType === "BAPTISM";
  const showSponsor =
    sacramentType === "EUCHARIST_FIRST_COMMUNION" ||
    sacramentType === "CONFIRMATION";
  const showMarriageFields = sacramentType === "MATRIMONY";
  const showWitnesses =
    sacramentType === "MATRIMONY" || sacramentType === "CONFIRMATION";

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className={`text-lg font-semibold text-${color}-900`}
                    >
                      Edit {formatSacramentType(record.sacramentType)} Record
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Update the details for this sacramental record
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Sacrament *
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfSacrament}
                        onChange={(e) =>
                          handleInputChange("dateOfSacrament", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={formData.locationOfSacrament}
                        onChange={(e) =>
                          handleInputChange(
                            "locationOfSacrament",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Church or location name"
                        required
                      />
                    </div>
                  </div>

                  {/* Member Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member *
                    </label>
                    <SearchableMemberInput
                      value={selectedMember}
                      onChange={handleMemberChange}
                      placeholder="Search for a member"
                    />
                  </div>

                  {/* Officiant Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Officiant Name *
                      </label>
                      <input
                        type="text"
                        value={formData.officiantName}
                        onChange={(e) =>
                          handleInputChange("officiantName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name of officiating minister"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Officiant ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.officiantId}
                        onChange={(e) =>
                          handleInputChange("officiantId", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Internal officiant ID"
                      />
                    </div>
                  </div>

                  {/* Sacrament-specific fields */}
                  {showGodparents && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Godparents
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Godparent 1
                          </label>
                          <input
                            type="text"
                            value={formData.godparent1Name}
                            onChange={(e) =>
                              handleInputChange(
                                "godparent1Name",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First godparent name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Godparent 2
                          </label>
                          <input
                            type="text"
                            value={formData.godparent2Name}
                            onChange={(e) =>
                              handleInputChange(
                                "godparent2Name",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Second godparent name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {showSponsor && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sponsor
                      </label>
                      <input
                        type="text"
                        value={formData.sponsorName}
                        onChange={(e) =>
                          handleInputChange("sponsorName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Sponsor name"
                      />
                    </div>
                  )}

                  {showMarriageFields && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Marriage Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Groom Name
                          </label>
                          <SearchableMemberInput
                            value={selectedGroomMember}
                            onChange={handleGroomMemberChange}
                            placeholder="Search for the groom"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bride Name
                          </label>
                          <SearchableMemberInput
                            value={selectedBrideMember}
                            onChange={handleBrideMemberChange}
                            placeholder="Search for the bride"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {showWitnesses && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Witnesses
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Witness 1
                          </label>
                          <input
                            type="text"
                            value={formData.witness1Name}
                            onChange={(e) =>
                              handleInputChange("witness1Name", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First witness name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Witness 2
                          </label>
                          <input
                            type="text"
                            value={formData.witness2Name}
                            onChange={(e) =>
                              handleInputChange("witness2Name", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Second witness name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certificate Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">
                      Certificate Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificate Number
                        </label>
                        <input
                          type="text"
                          value={formData.certificateNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "certificateNumber",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Certificate tracking number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificate URL
                        </label>
                        <input
                          type="url"
                          value={formData.certificateUrl}
                          onChange={(e) =>
                            handleInputChange("certificateUrl", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Digital certificate URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes or comments"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 text-sm font-medium text-white bg-${color}-600 border border-transparent rounded-md hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? "Updating..." : "Update Record"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
