import React from "react";
import {
  SparklesIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../../types/member.types";
import { useMemberSacramentalRecords } from "@/graphql/hooks/useMemberGroupMemberships";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

interface SacramentsSectionProps {
  member: Member;
}

interface Sacrament {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  locationOfSacrament?: string;
  officiantName?: string;
  notes?: string;
  certificateNumber?: string;
  groomName?: string;
  brideName?: string;
}

const SacramentsSection: React.FC<SacramentsSectionProps> = ({ member }) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const { sacramentalRecords, loading, error } = useMemberSacramentalRecords(
    member.id,
    branchId,
    organisationId,
  );

  console.log(" SacramentsSection Debug:", {
    memberId: member.id,
    branchId,
    organisationId,
    sacramentalRecords,
    recordsLength: sacramentalRecords?.length || 0,
    loading,
    error,
  });

  const getSacramentIcon = (type: string) => {
    switch (type) {
      case "EUCHARIST_FIRST_COMMUNION":
        return <DocumentTextIcon className="h-4 w-4 text-green-500" />;
      case "BAPTISM":
        return <SparklesIcon className="h-4 w-4 text-blue-500" />;
      case "CONFIRMATION":
        return <DocumentTextIcon className="h-4 w-4 text-green-500" />;
      case "MATRIMONY":
        return <SparklesIcon className="h-4 w-4 text-pink-500" />;
      case "HOLY_ORDERS_PRIESTHOOD":
        return <SparklesIcon className="h-4 w-4 text-yellow-500" />;
      case "HOLY_ORDERS_DIACONATE":
        return <SparklesIcon className="h-4 w-4 text-yellow-500" />;
      case "ANOINTING_OF_THE_SICK":
        return <SparklesIcon className="h-4 w-4 text-indigo-500" />;
      case "RECONCILIATION_FIRST":
        return <SparklesIcon className="h-4 w-4 text-purple-500" />;
      case "RCIA_INITIATION":
        return <SparklesIcon className="h-4 w-4 text-purple-500" />;
      case "OTHER":
        return <SparklesIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <SparklesIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSacramentColor = (type: string) => {
    switch (type) {
      case "EUCHARIST_FIRST_COMMUNION":
        return "bg-green-50 text-green-700 border-green-200";
      case "BAPTISM":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMATION":
        return "bg-green-50 text-green-700 border-green-200";
      case "MATRIMONY":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "HOLY_ORDERS_PRIESTHOOD":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "HOLY_ORDERS_DIACONATE":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "ANOINTING_OF_THE_SICK":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "RECONCILIATION_FIRST":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "RCIA_INITIATION":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "OTHER":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatSacramentType = (type: string) => {
    switch (type) {
      case "EUCHARIST_FIRST_COMMUNION":
        return "First Communion";
      case "BAPTISM":
        return "Baptism";
      case "CONFIRMATION":
        return "Confirmation";
      case "MATRIMONY":
        return "Marriage";
      case "HOLY_ORDERS_PRIESTHOOD":
        return "Priesthood";
      case "HOLY_ORDERS_DIACONATE":
        return "Diaconate";
      case "ANOINTING_OF_THE_SICK":
        return "Anointing of the Sick";
      case "RECONCILIATION_FIRST":
        return "First Reconciliation";
      case "RCIA_INITIATION":
        return "RCIA Initiation";
      case "OTHER":
        return "Other";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <SparklesIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sacraments & Milestones
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading sacraments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <XCircleIcon className="h-12 w-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-600 text-sm">Error loading sacraments</p>
        </div>
      ) : sacramentalRecords.length === 0 ? (
        <div className="text-center py-8">
          <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No sacramental records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sacramentalRecords.map((sacrament) => (
            <div
              key={sacrament.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getSacramentIcon(sacrament.sacramentType)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {formatSacramentType(sacrament.sacramentType)}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSacramentColor(sacrament.sacramentType)}`}
                  >
                    {getSacramentIcon(sacrament.sacramentType)}
                    {formatSacramentType(sacrament.sacramentType)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(sacrament.dateOfSacrament).toLocaleDateString()}
                  </span>

                  {sacrament.locationOfSacrament && (
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {sacrament.locationOfSacrament}
                    </span>
                  )}

                  {sacrament.officiantName && (
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      {sacrament.officiantName}
                    </span>
                  )}

                  {sacrament.certificateNumber && (
                    <span className="flex items-center gap-1">
                      <DocumentTextIcon className="h-3 w-3" />
                      Certificate: {sacrament.certificateNumber}
                    </span>
                  )}
                </div>

                {/* Display groom and bride for marriage sacraments */}
                {sacrament.sacramentType === "MATRIMONY" &&
                  (sacrament.groomName || sacrament.brideName) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2 mt-2 pt-2 border-t border-gray-200">
                      {sacrament.groomName && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          Groom: {sacrament.groomName}
                        </span>
                      )}
                      {sacrament.brideName && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          Bride: {sacrament.brideName}
                        </span>
                      )}
                    </div>
                  )}

                {sacrament.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    {sacrament.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SacramentsSection;
