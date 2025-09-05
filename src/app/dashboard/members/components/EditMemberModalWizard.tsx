"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  UsersIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  Member,
  UpdateMemberInput,
  MembershipStatus,
  MembershipType,
  Gender,
  MaritalStatus,
  PrivacyLevel,
} from "../types/member.types";
import { useUpdateMember } from "../hooks/useMemberOperations";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onSuccess?: (updated: Member) => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onSuccess,
}) => {
  const { updateMember, loading } = useUpdateMember();

  const initialForm: UpdateMemberInput = useMemo(
    () => ({
      id: member.id,
      firstName: member.firstName || "",
      middleName: member.middleName || "",
      lastName: member.lastName || "",
      preferredName: member.preferredName || "",
      title: member.title || "",
      email: member.email || "",
      phoneNumber: member.phoneNumber || member.alternatePhone || "",
      alternatePhone: member.alternatePhone || "",
      address: member.address || "",
      addressLine2: member.addressLine2 || "",
      city: member.city || "",
      state: member.state || "",
      postalCode: member.postalCode || "",
      country: member.country || "",
      membershipStatus: member.membershipStatus || MembershipStatus.MEMBER,
      membershipType: member.membershipType || MembershipType.REGULAR,
      gender: member.gender || Gender.NOT_SPECIFIED,
      maritalStatus: member.maritalStatus || MaritalStatus.UNKNOWN,
      privacyLevel: member.privacyLevel || PrivacyLevel.STANDARD,
      organisationId: member.organisationId,
      branchId: member.branchId,
      dateOfBirth: member.dateOfBirth,
    }),
    [member],
  );

  const [formData, setFormData] = useState<UpdateMemberInput>(initialForm);

  useEffect(() => {
    setFormData(initialForm);
  }, [initialForm]);

  const handleChange = (field: keyof UpdateMemberInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMember(formData.id, formData);
      onSuccess?.({ ...member, ...formData } as Member);
      onClose();
    } catch (err) {
      console.error("Failed to update member", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ scale: 0.98, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 20, opacity: 0 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Edit Member</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Middle Name
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.middleName || ""}
                      onChange={(e) =>
                        handleChange("middleName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Last Name
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.lastName || ""}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Preferred Name
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.preferredName || ""}
                      onChange={(e) =>
                        handleChange("preferredName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Phone
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.phoneNumber || ""}
                      onChange={(e) =>
                        handleChange("phoneNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Address
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.address || ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      City
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.city || ""}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Country
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.country || ""}
                      onChange={(e) => handleChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Membership */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Membership
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.membershipStatus}
                      onChange={(e) =>
                        handleChange(
                          "membershipStatus",
                          e.target.value as MembershipStatus,
                        )
                      }
                    >
                      {Object.values(MembershipStatus).map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.membershipType || ""}
                      onChange={(e) =>
                        handleChange(
                          "membershipType",
                          e.target.value as MembershipType,
                        )
                      }
                    >
                      {Object.values(MembershipType).map((t) => (
                        <option key={t} value={t}>
                          {t.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditMemberModal;
