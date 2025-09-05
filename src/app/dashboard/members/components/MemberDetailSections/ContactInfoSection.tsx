"use client";

import React from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../../types/member.types";

interface ContactInfoSectionProps {
  member: Member;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ member }) => {
  const formatAddress = () => {
    const addressParts = [
      member.address,
      member.addressLine2,
      member.city,
      member.state,
      member.postalCode,
      member.country,
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(", ") : null;
  };

  const fullAddress = formatAddress();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <EnvelopeIcon className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">
          Contact Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Contact */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Primary Contact</h4>

          {member.email && (
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center">
                <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                <a
                  href={`mailto:${member.email}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {member.email}
                </a>
              </div>
            </div>
          )}

          {member.phoneNumber && (
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                <a
                  href={`tel:${member.phoneNumber}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {member.phoneNumber}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Alternative Contact */}
        {(member.alternativeEmail ||
          member.alternativePhone ||
          member.alternatePhone) && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">
              Alternative Contact
            </h4>

            {member.alternativeEmail && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Alternative Email
                </label>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a
                    href={`mailto:${member.alternativeEmail}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {member.alternativeEmail}
                  </a>
                </div>
              </div>
            )}

            {(member.alternativePhone || member.alternatePhone) && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Alternative Phone
                </label>
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a
                    href={`tel:${member.alternativePhone || member.alternatePhone}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {member.alternativePhone || member.alternatePhone}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Address Information */}
      {(fullAddress ||
        member.district ||
        member.region ||
        member.digitalAddress ||
        member.landmark) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Address Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fullAddress && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Physical Address
                </label>
                <div className="flex items-start">
                  <MapPinIcon className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-900">{fullAddress}</p>
                </div>
              </div>
            )}

            {member.district && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  District
                </label>
                <p className="text-sm text-gray-900">{member.district}</p>
              </div>
            )}

            {member.region && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Region
                </label>
                <p className="text-sm text-gray-900">{member.region}</p>
              </div>
            )}

            {member.digitalAddress && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Digital Address
                </label>
                <div className="flex items-center">
                  <GlobeAltIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">
                    {member.digitalAddress}
                  </p>
                </div>
              </div>
            )}

            {member.landmark && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Landmark
                </label>
                <p className="text-sm text-gray-900">{member.landmark}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfoSection;
