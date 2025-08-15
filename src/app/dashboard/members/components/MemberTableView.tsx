'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CreditCardIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Member, SortField, SortDirection } from '../types/member.types';

interface MemberTableViewProps {
  members: Member[];
  selectedMembers: string[];
  onSelectMember: (memberId: string) => void;
  onSelectAll: () => void;
  onSort?: (field: SortField, direction: SortDirection) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

const MemberTableView: React.FC<MemberTableViewProps> = ({
  members,
  selectedMembers,
  onSelectMember,
  onSelectAll,
  onSort,
  sortField,
  sortDirection
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const allSelected = members.length > 0 && selectedMembers.length === members.length;
  const someSelected = selectedMembers.length > 0 && selectedMembers.length < members.length;

  const handleSort = (field: SortField) => {
    if (!onSort) return;
    
    const newDirection: SortDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    
    const statusColors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      VISITOR: 'bg-blue-100 text-blue-800',
      MEMBER: 'bg-purple-100 text-purple-800',
      DEACTIVATED: 'bg-red-100 text-red-800',
      TRANSFERRED: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || statusColors.ACTIVE
      }`}>
        {status.toLowerCase().replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  const getAge = (dateOfBirth?: Date) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Select All Checkbox */}
              <th className="px-6 py-3 text-left">
                <button
                  onClick={onSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    allSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : someSelected
                      ? 'bg-blue-100 border-blue-600 text-blue-600'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {allSelected && <CheckIcon className="w-3 h-3" />}
                  {someSelected && !allSelected && <div className="w-2 h-2 bg-blue-600 rounded-sm" />}
                </button>
              </th>

              {/* Name */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('firstName')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Name</span>
                  {getSortIcon('firstName')}
                </button>
              </th>

              {/* Email */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Email</span>
                  {getSortIcon('email')}
                </button>
              </th>

              {/* Phone */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>

              {/* Status */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('membershipStatus')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Status</span>
                  {getSortIcon('membershipStatus')}
                </button>
              </th>

              {/* Age */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('dateOfBirth')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Age</span>
                  {getSortIcon('dateOfBirth')}
                </button>
              </th>

              {/* Join Date */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('joinDate')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Joined</span>
                  {getSortIcon('joinDate')}
                </button>
              </th>

              {/* Actions */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member, index) => {
              const isSelected = selectedMembers.includes(member.id);
              const isHovered = hoveredRow === member.id;
              const fullName = [member.firstName, member.middleName, member.lastName]
                .filter(Boolean)
                .join(' ');
              const displayName = member.preferredName || fullName;

              return (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(member.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Selection Checkbox */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onSelectMember(member.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {isSelected && <CheckIcon className="w-3 h-3" />}
                    </button>
                  </td>

                  {/* Name with Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.profileImageUrl ? (
                        <img
                          src={member.profileImageUrl}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.firstName.charAt(0)}{member.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {displayName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          {member.rfidCardId && (
                            <CreditCardIcon className="w-4 h-4 text-green-600" title="Has RFID Card" />
                          )}
                          {member.isRegularAttendee && (
                            <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Regular</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.email ? (
                        <>
                          <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{member.email}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.phoneNumber ? (
                        <>
                          <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{member.phoneNumber}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(member.membershipStatus)}
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAge(member.dateOfBirth)}
                  </td>

                  {/* Join Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(member.joinDate)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className={`flex items-center justify-end space-x-2 transition-opacity ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors"
                        title="Edit Member"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTableView;
