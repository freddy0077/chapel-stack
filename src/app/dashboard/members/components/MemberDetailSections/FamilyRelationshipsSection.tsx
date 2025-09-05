import React from "react";
import {
  UsersIcon,
  HeartIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../../types/member.types";
import { 
  useFamilyRelationships,
  getRelationshipDisplayName,
  getRelationshipColor,
} from "../../../../../graphql/hooks/useFamilyRelationships";

interface FamilyRelationshipsSectionProps {
  member: Member;
}

const FamilyRelationshipsSection: React.FC<FamilyRelationshipsSectionProps> = ({
  member,
}) => {
  const { relationships, loading, error } = useFamilyRelationships(member.id);

  const getRelationshipIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "SPOUSE":
        return <HeartIcon className="h-4 w-4 text-pink-500" />;
      case "PARENT":
        return <UsersIcon className="h-4 w-4 text-blue-500" />;
      case "CHILD":
        return <UserGroupIcon className="h-4 w-4 text-green-500" />;
      case "SIBLING":
        return <UsersIcon className="h-4 w-4 text-purple-500" />;
      case "GRANDPARENT":
        return <UsersIcon className="h-4 w-4 text-indigo-500" />;
      case "GRANDCHILD":
        return <UserGroupIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <UserGroupIcon className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Family Relationships
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Loading family relationships...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <UserGroupIcon className="h-12 w-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-600 text-sm">
            Error loading family relationships
          </p>
        </div>
      ) : relationships.length > 0 ? (
        <div className="space-y-4">
          {relationships.map((relationship) => (
            <div
              key={relationship.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative">
                  {relationship.relatedMember.profileImageUrl ? (
                    <img
                      src={relationship.relatedMember.profileImageUrl}
                      alt={`${relationship.relatedMember.firstName} ${relationship.relatedMember.lastName}`}
                      className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {relationship.relatedMember.firstName.charAt(0)}
                      {relationship.relatedMember.lastName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {relationship.relatedMember.firstName}{" "}
                      {relationship.relatedMember.lastName}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(relationship.relationshipType)}`}
                    >
                      {getRelationshipIcon(relationship.relationshipType)}
                      {getRelationshipDisplayName(relationship.relationshipType)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {relationship.relatedMember.email && (
                      <a
                        href={`mailto:${relationship.relatedMember.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {relationship.relatedMember.email}
                      </a>
                    )}
                    {relationship.relatedMember.phoneNumber && (
                      <a
                        href={`tel:${relationship.relatedMember.phoneNumber}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {relationship.relatedMember.phoneNumber}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Relationship Date */}
              <div className="text-xs text-gray-500">
                Added {new Date(relationship.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No family relationships recorded
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Family connections will appear here when added
          </p>
        </div>
      )}

      {/* Family Summary */}
      {member.familyId && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Family ID:</span>
            <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
              {member.familyId}
            </span>
          </div>
          {member.headOfHousehold && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Household Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Head of Household
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyRelationshipsSection;
