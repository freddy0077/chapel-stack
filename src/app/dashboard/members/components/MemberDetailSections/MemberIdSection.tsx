"use client";

import React from "react";
import {
  CreditCardIcon,
  IdentificationIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  WifiIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../../types/member.types";

interface MemberIdSectionProps {
  member: Member;
}

const MemberIdSection: React.FC<MemberIdSectionProps> = ({ member }) => {
  const hasMemberId = member.memberId;
  const hasCardInfo =
    member.cardIssued || member.cardType || member.cardIssuedAt;
  const hasLegacyIds = member.rfidCardId || member.nfcId;

  if (!hasMemberId && !hasCardInfo && !hasLegacyIds) {
    return null;
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return null;
    }
  };

  const getCardTypeIcon = (cardType: string | undefined) => {
    switch (cardType?.toUpperCase()) {
      case "NFC":
        return <WifiIcon className="w-4 h-4 text-blue-500" />;
      case "RFID":
        return <CreditCardIcon className="w-4 h-4 text-purple-500" />;
      case "BARCODE":
      case "QR":
        return <QrCodeIcon className="w-4 h-4 text-green-500" />;
      default:
        return <CreditCardIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <IdentificationIcon className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">
          Member ID & Card Information
        </h3>
      </div>

      <div className="space-y-6">
        {/* Unified Member ID */}
        {hasMemberId && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Unified Member ID
            </h4>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-blue-700">
                    Member ID
                  </label>
                  <p className="text-lg font-mono font-bold text-blue-900">
                    {member.memberId}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <IdentificationIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              {member.memberIdGeneratedAt && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-blue-600">
                    Generated
                  </label>
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 text-blue-500 mr-1" />
                    <p className="text-xs text-blue-700">
                      {formatDate(member.memberIdGeneratedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Physical Card Information */}
        {hasCardInfo && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Physical Card Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Card Status
                </label>
                <div className="flex items-center mt-1">
                  {member.cardIssued ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-green-700 font-medium">
                        Issued
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Not Issued</span>
                    </>
                  )}
                </div>
              </div>

              {member.cardType && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Card Type
                  </label>
                  <div className="flex items-center mt-1">
                    {getCardTypeIcon(member.cardType)}
                    <span className="text-sm text-gray-900 ml-2">
                      {member.cardType}
                    </span>
                  </div>
                </div>
              )}

              {member.cardIssuedAt && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Card Issued Date
                  </label>
                  <div className="flex items-center mt-1">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatDate(member.cardIssuedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legacy ID Systems */}
        {hasLegacyIds && (
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Legacy ID Systems
            </h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    Legacy Systems (Deprecated)
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    These IDs are maintained for backward compatibility
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {member.rfidCardId && (
                  <div>
                    <label className="text-sm font-medium text-yellow-700">
                      RFID Card ID
                    </label>
                    <p className="text-sm text-yellow-900 font-mono">
                      {member.rfidCardId}
                    </p>
                  </div>
                )}

                {member.nfcId && (
                  <div>
                    <label className="text-sm font-medium text-yellow-700">
                      NFC ID
                    </label>
                    <p className="text-sm text-yellow-900 font-mono">
                      {member.nfcId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No ID Information */}
        {!hasMemberId && !hasCardInfo && !hasLegacyIds && (
          <div className="text-center py-8">
            <IdentificationIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No member ID or card information available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Contact administrator to assign a member ID
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberIdSection;
