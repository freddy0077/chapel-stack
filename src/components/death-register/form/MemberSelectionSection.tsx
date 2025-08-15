'use client';

import React from 'react';
import { Card, Title, Text, Button, Grid, Flex } from '@tremor/react';
import { UserIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Member {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  profileImageUrl?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

interface MemberSelectionSectionProps {
  selectedMember?: Member;
  showMemberSearch: boolean;
  memberSearchTerm: string;
  members: Member[];
  membersLoading: boolean;
  onToggleSearch: () => void;
  onSearchTermChange: (term: string) => void;
  onMemberSelect: (member: Member) => void;
  onClearSelection: () => void;
  error?: string;
}

export const MemberSelectionSection: React.FC<MemberSelectionSectionProps> = ({
  selectedMember,
  showMemberSearch,
  memberSearchTerm,
  members,
  membersLoading,
  onToggleSearch,
  onSearchTermChange,
  onMemberSelect,
  onClearSelection,
  error,
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <Title className="text-blue-800 mb-4 flex items-center">
        <UserIcon className="h-5 w-5 mr-2" />
        Member Selection
      </Title>
      
      {selectedMember ? (
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <Flex justifyContent="between" alignItems="center">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                {selectedMember.profileImageUrl ? (
                  <img
                    src={selectedMember.profileImageUrl}
                    alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <Text className="font-semibold text-slate-900">
                  {selectedMember.firstName} {selectedMember.middleName} {selectedMember.lastName}
                </Text>
                <Text className="text-slate-600 text-sm">
                  {selectedMember.phoneNumber && `📞 ${selectedMember.phoneNumber}`}
                  {selectedMember.email && ` • ✉️ ${selectedMember.email}`}
                </Text>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={XMarkIcon}
              onClick={onClearSelection}
              className="text-red-600 hover:text-red-700"
            >
              Change
            </Button>
          </Flex>
        </div>
      ) : (
        <div className="space-y-4">
          {!showMemberSearch ? (
            <Button
              onClick={onToggleSearch}
              icon={MagnifyingGlassIcon}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Search for Member
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={memberSearchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {membersLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <Text className="mt-2 text-slate-600">Searching members...</Text>
                </div>
              ) : members && members.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => onMemberSelect(member)}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        {member.profileImageUrl ? (
                          <img
                            src={member.profileImageUrl}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Text className="font-medium text-slate-900">
                          {member.firstName} {member.middleName} {member.lastName}
                        </Text>
                        <Text className="text-sm text-slate-600">
                          {member.phoneNumber || member.email || 'No contact info'}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              ) : memberSearchTerm ? (
                <div className="text-center py-4">
                  <Text className="text-slate-600">No members found matching "{memberSearchTerm}"</Text>
                </div>
              ) : null}
              
              <Button
                variant="secondary"
                onClick={onToggleSearch}
                className="w-full"
              >
                Cancel Search
              </Button>
            </div>
          )}
          
          {error && (
            <Text className="text-red-600 text-sm">{error}</Text>
          )}
        </div>
      )}
    </Card>
  );
};
