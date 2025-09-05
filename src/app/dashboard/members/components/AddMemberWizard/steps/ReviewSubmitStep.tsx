"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { WizardStepProps } from "../types/WizardTypes";

const ReviewSubmitStep: React.FC<WizardStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  isFirstStep,
  isLastStep,
}) => {
  const formatDate = (date?: Date) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString();
  };

  const formatEnum = (value?: string) => {
    if (!value) return "Not specified";
    return value
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>
        <p className="text-gray-600 mt-2">
          Please review all information before submitting
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <UserIcon className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">
              Personal Information
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <p className="text-gray-900">
                {formData.firstName} {formData.middleName} {formData.lastName}
                {formData.preferredName && ` (${formData.preferredName})`}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date of Birth:</span>
              <p className="text-gray-900">
                {formatDate(formData.dateOfBirth)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Gender:</span>
              <p className="text-gray-900">{formatEnum(formData.gender)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Marital Status:</span>
              <p className="text-gray-900">
                {formatEnum(formData.maritalStatus)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Nationality:</span>
              <p className="text-gray-900">
                {formData.nationality || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Place of Birth:</span>
              <p className="text-gray-900">
                {formData.placeOfBirth || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Occupation:</span>
              <p className="text-gray-900">
                {formData.occupation || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Employer:</span>
              <p className="text-gray-900">
                {formData.employerName || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <EnvelopeIcon className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">
              Contact Information
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">
                {formData.email || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <p className="text-gray-900">
                {formData.phoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Alternate Phone:
              </span>
              <p className="text-gray-900">
                {formData.alternatePhone || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Preferred Language:
              </span>
              <p className="text-gray-900">
                {formData.preferredLanguage || "English"}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">Address:</span>
              <p className="text-gray-900">
                {formData.address
                  ? `${formData.address}${formData.city ? `, ${formData.city}` : ""}`
                  : "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        {(formData.emergencyContactName || formData.emergencyContactPhone) && (
          <div className="bg-orange-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <PhoneIcon className="w-5 h-5 text-orange-600 mr-2" />
              <h4 className="text-lg font-medium text-gray-900">
                Emergency Contact
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <p className="text-gray-900">
                  {formData.emergencyContactName || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-900">
                  {formData.emergencyContactPhone || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Relationship:</span>
                <p className="text-gray-900">
                  {formData.emergencyContactRelation || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Church Membership */}
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <BuildingLibraryIcon className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">
              Church Membership
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Member Status:</span>
              <p className="text-gray-900">{formatEnum(formData.status)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Membership Level:
              </span>
              <p className="text-gray-900">
                {formatEnum(formData.membershipStatus)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Membership Type:
              </span>
              <p className="text-gray-900">
                {formatEnum(formData.membershipType)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Membership Date:
              </span>
              <p className="text-gray-900">
                {formatDate(formData.membershipDate)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Baptism Date:</span>
              <p className="text-gray-900">
                {formatDate(formData.baptismDate)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Baptism Location:
              </span>
              <p className="text-gray-900">
                {formData.baptismLocation || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Regular Attendee:
              </span>
              <p className="text-gray-900">
                {formData.isRegularAttendee ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Head of Household:
              </span>
              <p className="text-gray-900">
                {formData.headOfHousehold ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-indigo-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">
              Communication Preferences
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Privacy Level:</span>
              <p className="text-gray-900">
                {formatEnum(formData.privacyLevel)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Consent Date:</span>
              <p className="text-gray-900">
                {formatDate(formData.consentDate)}
              </p>
            </div>
            {formData.communicationPrefs && (
              <>
                <div>
                  <span className="font-medium text-gray-700">
                    Email Notifications:
                  </span>
                  <p className="text-gray-900">
                    {formData.communicationPrefs.emailNotifications
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    SMS Notifications:
                  </span>
                  <p className="text-gray-900">
                    {formData.communicationPrefs.smsNotifications
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Communication Frequency:
                  </span>
                  <p className="text-gray-900">
                    {formatEnum(
                      formData.communicationPrefs.communicationFrequency,
                    )}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Preferred Contact Time:
                  </span>
                  <p className="text-gray-900">
                    {formatEnum(
                      formData.communicationPrefs.preferredContactTime,
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        {formData.statusChangeReason && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Additional Notes
            </h4>
            <p className="text-gray-700 text-sm">
              {formData.statusChangeReason}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={isFirstStep || isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isFirstStep || isSubmitting
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>

        <motion.button
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Member...
            </div>
          ) : (
            "Create Member"
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
