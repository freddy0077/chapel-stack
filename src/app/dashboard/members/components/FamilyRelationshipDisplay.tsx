"use client";

import React from 'react';
import { Users, Heart, User } from 'lucide-react';
import { Member } from '../types/member.types';

// Family Relationship Types
export enum FamilyRelationshipType {
  SPOUSE = 'SPOUSE',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  SIBLING = 'SIBLING',
  GRANDPARENT = 'GRANDPARENT',
  GRANDCHILD = 'GRANDCHILD',
  UNCLE_AUNT = 'UNCLE_AUNT',
  NEPHEW_NIECE = 'NEPHEW_NIECE',
  COUSIN = 'COUSIN',
  GUARDIAN = 'GUARDIAN',
  WARD = 'WARD',
  FRIEND = 'FRIEND',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  OTHER = 'OTHER',
}

// Relationship display labels
const RELATIONSHIP_LABELS = {
  [FamilyRelationshipType.SPOUSE]: 'Spouse',
  [FamilyRelationshipType.PARENT]: 'Parent',
  [FamilyRelationshipType.CHILD]: 'Child',
  [FamilyRelationshipType.SIBLING]: 'Sibling',
  [FamilyRelationshipType.GRANDPARENT]: 'Grandparent',
  [FamilyRelationshipType.GRANDCHILD]: 'Grandchild',
  [FamilyRelationshipType.UNCLE_AUNT]: 'Uncle/Aunt',
  [FamilyRelationshipType.NEPHEW_NIECE]: 'Nephew/Niece',
  [FamilyRelationshipType.COUSIN]: 'Cousin',
  [FamilyRelationshipType.GUARDIAN]: 'Guardian',
  [FamilyRelationshipType.WARD]: 'Ward',
  [FamilyRelationshipType.FRIEND]: 'Friend',
  [FamilyRelationshipType.EMERGENCY_CONTACT]: 'Emergency Contact',
  [FamilyRelationshipType.OTHER]: 'Other',
};

// Relationship icons
const RELATIONSHIP_ICONS = {
  [FamilyRelationshipType.SPOUSE]: Heart,
  [FamilyRelationshipType.PARENT]: User,
  [FamilyRelationshipType.CHILD]: User,
  [FamilyRelationshipType.SIBLING]: Users,
  [FamilyRelationshipType.GRANDPARENT]: User,
  [FamilyRelationshipType.GRANDCHILD]: User,
  [FamilyRelationshipType.UNCLE_AUNT]: UserIcon,
  [FamilyRelationshipType.NEPHEW_NIECE]: UserIcon,
  [FamilyRelationshipType.COUSIN]: UserGroupIcon,
  [FamilyRelationshipType.GUARDIAN]: UserIcon,
  [FamilyRelationshipType.WARD]: UserIcon,
  [FamilyRelationshipType.FRIEND]: UserGroupIcon,
  [FamilyRelationshipType.EMERGENCY_CONTACT]: UserIcon,
  [FamilyRelationshipType.OTHER]: UserIcon,
};

// Relationship colors
const RELATIONSHIP_COLORS = {
  [FamilyRelationshipType.SPOUSE]: 'text-red-600 bg-red-50',
  [FamilyRelationshipType.PARENT]: 'text-blue-600 bg-blue-50',
  [FamilyRelationshipType.CHILD]: 'text-green-600 bg-green-50',
  [FamilyRelationshipType.SIBLING]: 'text-purple-600 bg-purple-50',
  [FamilyRelationshipType.GRANDPARENT]: 'text-indigo-600 bg-indigo-50',
  [FamilyRelationshipType.GRANDCHILD]: 'text-pink-600 bg-pink-50',
  [FamilyRelationshipType.UNCLE_AUNT]: 'text-yellow-600 bg-yellow-50',
  [FamilyRelationshipType.NEPHEW_NIECE]: 'text-orange-600 bg-orange-50',
  [FamilyRelationshipType.COUSIN]: 'text-teal-600 bg-teal-50',
  [FamilyRelationshipType.GUARDIAN]: 'text-cyan-600 bg-cyan-50',
  [FamilyRelationshipType.WARD]: 'text-lime-600 bg-lime-50',
  [FamilyRelationshipType.FRIEND]: 'text-emerald-600 bg-emerald-50',
  [FamilyRelationshipType.EMERGENCY_CONTACT]: 'text-rose-600 bg-rose-50',
  [FamilyRelationshipType.OTHER]: 'text-gray-600 bg-gray-50',
};

interface FamilyRelationship {
  id: string;
  memberId: string;
  relatedMemberId: string;
  relationshipType: FamilyRelationshipType;
  member?: Member;
  relatedMember?: Member;
  createdAt: Date;
  updatedAt: Date;
}

interface FamilyRelationshipDisplayProps {
  relationships: FamilyRelationship[];
  loading?: boolean;
  onViewMember?: (member: Member) => void;
  compact?: boolean;
  showTitle?: boolean;
}

export default function FamilyRelationshipDisplay({
  relationships,
  loading = false,
  onViewMember,
  compact = false,
  showTitle = true,
}: FamilyRelationshipDisplayProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {showTitle && (
          <h4 className="text-sm font-medium text-gray-900">Family Relationships</h4>
        )}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relationships || relationships.length === 0) {
    return (
      <div className="text-center py-6">
        {showTitle && (
          <h4 className="text-sm font-medium text-gray-900 mb-3">Family Relationships</h4>
        )}
        <div className="flex flex-col items-center">
          <UserGroupIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No family relationships found</p>
        </div>
      </div>
    );
  }

  // Group relationships by type for better organization
  const groupedRelationships = relationships.reduce((acc, relationship) => {
    const type = relationship.relationshipType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(relationship);
    return acc;
  }, {} as Record<FamilyRelationshipType, FamilyRelationship[]>);

  // Priority order for relationship types
  const relationshipOrder = [
    FamilyRelationshipType.SPOUSE,
    FamilyRelationshipType.PARENT,
    FamilyRelationshipType.CHILD,
    FamilyRelationshipType.SIBLING,
    FamilyRelationshipType.GRANDPARENT,
    FamilyRelationshipType.GRANDCHILD,
    FamilyRelationshipType.UNCLE_AUNT,
    FamilyRelationshipType.NEPHEW_NIECE,
    FamilyRelationshipType.COUSIN,
    FamilyRelationshipType.GUARDIAN,
    FamilyRelationshipType.WARD,
    FamilyRelationshipType.FRIEND,
    FamilyRelationshipType.EMERGENCY_CONTACT,
    FamilyRelationshipType.OTHER,
  ];

  const handleMemberClick = (member: Member) => {
    if (onViewMember) {
      onViewMember(member);
    }
  };

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-900">
            Family Relationships ({relationships.length})
          </h4>
        </div>
      )}

      <div className="space-y-3">
        {relationshipOrder.map((relationshipType) => {
          const relationshipsOfType = groupedRelationships[relationshipType];
          if (!relationshipsOfType || relationshipsOfType.length === 0) {
            return null;
          }

          const Icon = RELATIONSHIP_ICONS[relationshipType];
          const colorClasses = RELATIONSHIP_COLORS[relationshipType];
          const label = RELATIONSHIP_LABELS[relationshipType];

          return (
            <div key={relationshipType} className="space-y-2">
              {!compact && (
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${colorClasses.split(' ')[0]}`} />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {label}
                    {relationshipsOfType.length > 1 && ` (${relationshipsOfType.length})`}
                  </span>
                </div>
              )}
              
              <div className="space-y-2">
                {relationshipsOfType.map((relationship) => {
                  const relatedMember = relationship.relatedMember;
                  if (!relatedMember) return null;

                  return (
                    <div
                      key={relationship.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        onViewMember 
                          ? 'cursor-pointer hover:bg-gray-50 hover:border-gray-300' 
                          : ''
                      } ${colorClasses}`}
                      onClick={() => onViewMember && handleMemberClick(relatedMember)}
                    >
                      <div className={`p-2 rounded-full ${colorClasses}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {relatedMember.firstName} {relatedMember.lastName}
                          </p>
                          {compact && (
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                              {label}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {relatedMember.email && (
                            <p className="text-xs text-gray-600 truncate">
                              {relatedMember.email}
                            </p>
                          )}
                          {relatedMember.phoneNumber && (
                            <p className="text-xs text-gray-600">
                              {relatedMember.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {onViewMember && (
                        <div className="flex-shrink-0">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
