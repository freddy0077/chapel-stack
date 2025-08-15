import React, { useState } from 'react';
import { 
  BuildingLibraryIcon, 
  UserGroupIcon, 
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Member } from '../../types/member.types';
import { useMinistryMutations } from '../../../../../graphql/hooks/useMinistryMutations';
import { useSmallGroupMutations } from '../../../../../graphql/hooks/useSmallGroups';
import { useQuery, useMutation, gql } from '@apollo/client';
import { LIST_MINISTRIES } from '../../../../../graphql/queries/ministryQueries';
import { GET_ALL_SMALL_GROUPS } from '../../../../../graphql/queries/groupQueries';
import { useOrganisationBranch } from '../../../../../hooks/useOrganisationBranch';

// Query for group memberships - using correct backend schema
const GET_GROUP_MEMBERSHIPS = gql`
  query GetGroupMembers($filters: GroupMemberFilterInput) {
    groupMembers(filters: $filters) {
      id
      role
      status
      joinDate
      memberId
      ministryId
      smallGroupId
      ministry {
        id
        name
        description
        type
      }
      smallGroup {
        id
        name
        description
        type
        meetingSchedule
        location
        maximumCapacity
      }
    }
  }
`;

interface GroupMembershipsSectionProps {
  member: Member;
}

interface GroupMembership {
  id: string;
  role: string;
  status: string;
  joinDate: string;
  memberId: string;
  ministryId: string;
  smallGroupId: string;
  ministry?: {
    id: string;
    name: string;
    description?: string;
    type: string;
  };
  smallGroup?: {
    id: string;
    name: string;
    description?: string;
    type: string;
    meetingSchedule?: string;
    location?: string;
    maximumCapacity?: number;
  };
}

interface AddGroupMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (membership: Omit<GroupMembership, 'id'>) => void;
  memberId: string;
}

const AddGroupMembershipModal: React.FC<AddGroupMembershipModalProps> = ({ isOpen, onClose, onAdd, memberId }) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [groupType, setGroupType] = useState<'ministry' | 'smallGroup'>('ministry');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [role, setRole] = useState('MEMBER');
  const [status, setStatus] = useState('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: ministriesData, loading: ministriesLoading, error: ministriesError } = useQuery(LIST_MINISTRIES, {
    variables: { filters: { organisationId, branchId } }
  });
  const { data: smallGroupsData, loading: smallGroupsLoading, error: smallGroupsError } = useQuery(GET_ALL_SMALL_GROUPS, {
    variables: { organisationId, branchId }
  });

  const ministries = ministriesData?.ministries || [];
  const smallGroups = smallGroupsData?.smallGroups || [];

  // Use existing hooks for API calls
  const { addMemberToMinistry } = useMinistryMutations();
  const { addMemberToGroup } = useSmallGroupMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (groupType === 'ministry') {
        // Add member to ministry
        await addMemberToMinistry({
          memberId,
          ministryId: selectedGroup,
          role,
          joinDate: new Date().toISOString()
        });
      } else {
        // Add member to small group
        await addMemberToGroup({
          memberId,
          smallGroupId: selectedGroup,
          role
        });
      }

      // Create the membership object for local state update
      const selectedData = groupType === 'ministry' 
        ? ministries.find(m => m.id === selectedGroup)
        : smallGroups.find(sg => sg.id === selectedGroup);

      if (selectedData) {
        const membership: Omit<GroupMembership, 'id'> = {
          role,
          status,
          joinDate: new Date().toISOString(),
          memberId,
          ministryId: groupType === 'ministry' ? selectedGroup : null,
          smallGroupId: groupType === 'smallGroup' ? selectedGroup : null,
          ...(groupType === 'ministry' 
            ? { ministry: selectedData }
            : { smallGroup: selectedData }
          )
        };
        onAdd(membership);
      }

      // Reset form
      setSelectedGroup('');
      setRole('MEMBER');
      setStatus('ACTIVE');
      onClose();
    } catch (error) {
      console.error('Error adding member to group:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentGroups = groupType === 'ministry' ? ministries : smallGroups;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Group Membership</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Group Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGroupType('ministry')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    groupType === 'ministry'
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <BuildingLibraryIcon className="h-4 w-4 mx-auto mb-1" />
                  Ministry
                </button>
                <button
                  type="button"
                  onClick={() => setGroupType('smallGroup')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    groupType === 'smallGroup'
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <UserGroupIcon className="h-4 w-4 mx-auto mb-1" />
                  Small Group
                </button>
              </div>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select {groupType === 'ministry' ? 'Ministry' : 'Small Group'}
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a {groupType === 'ministry' ? 'ministry' : 'small group'}...</option>
                {currentGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              
              {/* Group Details */}
              {selectedGroup && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  {(() => {
                    const group = currentGroups.find(g => g.id === selectedGroup);
                    return group ? (
                      <div>
                        <div className="font-medium text-gray-900">{group.name}</div>
                        {group.description && (
                          <div className="text-sm text-gray-600 mt-1">{group.description}</div>
                        )}
                        {'meetingSchedule' in group && group.meetingSchedule && (
                          <div className="text-sm text-gray-500 mt-1">
                            📅 {group.meetingSchedule}
                          </div>
                        )}
                        {'location' in group && group.location && (
                          <div className="text-sm text-gray-500">
                            📍 {group.location}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MEMBER">Member</option>
                <option value="CO_LEADER">Co-Leader</option>
                <option value="LEADER">Leader</option>
              </select>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedGroup || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Membership
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const GroupMembershipsSection: React.FC<GroupMembershipsSectionProps> = ({ member }) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: groupMembershipsData, loading: groupMembershipsLoading, error: groupMembershipsError } = useQuery(GET_GROUP_MEMBERSHIPS, {
    variables: { filters: { memberId: member.id, organisationId, branchId } }
  });

  const groupMemberships = groupMembershipsData?.groupMembers || [];

  const handleAddMembership = (membership: Omit<GroupMembership, 'id'>) => {
    setShowAddModal(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'MEMBER':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'CO_LEADER':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'LEADER':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'MEMBER':
        return <StarIcon className="h-3 w-3" />;
      case 'CO_LEADER':
        return <UserGroupIcon className="h-3 w-3" />;
      case 'LEADER':
        return <BuildingLibraryIcon className="h-3 w-3" />;
      default:
        return <StarIcon className="h-3 w-3" />;
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'MEMBER':
        return 'Member';
      case 'CO_LEADER':
        return 'Co-Leader';
      case 'LEADER':
        return 'Leader';
      default:
        return 'Member';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'INACTIVE':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      default:
        return 'Active';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BuildingLibraryIcon className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Group Memberships</h3>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Membership
        </button>
      </div>

      <div className="space-y-6">
        {/* Ministries Section */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BuildingLibraryIcon className="h-4 w-4 text-purple-600" />
            Ministries ({groupMemberships.filter(membership => membership.ministryId).length})
          </h4>
          
          {groupMemberships.filter(membership => membership.ministryId).length > 0 ? (
            <div className="space-y-3">
              {groupMemberships.filter(membership => membership.ministryId).map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-gray-900">
                        {membership.ministry?.name}
                      </h5>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(membership.role)}`}>
                        {getRoleIcon(membership.role)}
                        {formatRole(membership.role)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(membership.status)}`}>
                        {formatStatus(membership.status)}
                      </span>
                    </div>
                    
                    {membership.ministry?.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {membership.ministry.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Joined {new Date(membership.joinDate).toLocaleDateString()}
                      </span>
                      <span className="capitalize">
                        {membership.ministry?.type.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-purple-50 rounded-lg border border-purple-200">
              <BuildingLibraryIcon className="h-8 w-8 text-purple-300 mx-auto mb-2" />
              <p className="text-purple-600 text-sm">No ministry memberships</p>
            </div>
          )}
        </div>

        {/* Small Groups Section */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4 text-blue-600" />
            Small Groups ({groupMemberships.filter(membership => membership.smallGroupId).length})
          </h4>
          
          {groupMemberships.filter(membership => membership.smallGroupId).length > 0 ? (
            <div className="space-y-3">
              {groupMemberships.filter(membership => membership.smallGroupId).map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-gray-900">
                        {membership.smallGroup?.name}
                      </h5>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(membership.role)}`}>
                        {getRoleIcon(membership.role)}
                        {formatRole(membership.role)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(membership.status)}`}>
                        {formatStatus(membership.status)}
                      </span>
                    </div>
                    
                    {membership.smallGroup?.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {membership.smallGroup.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Joined {new Date(membership.joinDate).toLocaleDateString()}
                      </span>
                      
                      {membership.smallGroup?.meetingSchedule && (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {membership.smallGroup.meetingSchedule}
                        </span>
                      )}
                      
                      {membership.smallGroup?.location && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {membership.smallGroup.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-blue-50 rounded-lg border border-blue-200">
              <UserGroupIcon className="h-8 w-8 text-blue-300 mx-auto mb-2" />
              <p className="text-blue-600 text-sm">No small group memberships</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {groupMemberships.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{groupMemberships.filter(membership => membership.ministryId).length}</div>
              <div className="text-purple-700">Ministries</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{groupMemberships.filter(membership => membership.smallGroupId).length}</div>
              <div className="text-blue-700">Small Groups</div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddGroupMembershipModal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMembership}
          memberId={member.id}
        />
      )}
    </div>
  );
};

export default GroupMembershipsSection;
