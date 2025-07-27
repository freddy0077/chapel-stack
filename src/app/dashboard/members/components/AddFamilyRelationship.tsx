import { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useSearchMembers } from '@/graphql/hooks/useSearchMembers';
import { toast } from 'react-hot-toast';
import { CREATE_FAMILY_RELATIONSHIP } from '@/graphql/mutations/familyRelationshipMutations';
import { UserPlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useOrganizationBranchFilter } from '@/hooks/useOrganizationBranchFilter';

// Define the FamilyRelationshipType enum to match backend
export enum FamilyRelationshipType {
  SPOUSE = 'SPOUSE',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  SIBLING = 'SIBLING',
  GRANDPARENT = 'GRANDPARENT',
  GRANDCHILD = 'GRANDCHILD',
  OTHER = 'OTHER',
}

// GraphQL query to get families for a member
const GET_MEMBER_FAMILIES = gql`
  query GetMemberFamilies($memberId: String!) {
    member(id: $memberId) {
      id
      families {
        id
        name
      }
    }
  }
`;

interface AddFamilyRelationshipProps {
  memberId: string;
  onSuccess?: () => void;
}

export default function AddFamilyRelationship({ memberId, onSuccess }: AddFamilyRelationshipProps) {
  const [selectedRelatedMemberId, setSelectedRelatedMemberId] = useState<string>('');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<FamilyRelationshipType>(FamilyRelationshipType.OTHER);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Get organization and branch filters
  const { organisationId, branchId } = useOrganizationBranchFilter();
  
  // Search members
  const { members, loading: searchLoading } = useSearchMembers(searchTerm, organisationId || '', branchId);
  
  // Get member's families
  const { data: familiesData, loading: familiesLoading } = useQuery(GET_MEMBER_FAMILIES, {
    variables: { memberId },
    skip: !memberId
  });

  // Create family relationship mutation
  const [createFamilyRelationship, { loading: creating }] = useMutation(CREATE_FAMILY_RELATIONSHIP, {
    onCompleted: () => {
      toast.success('Family relationship added successfully');
      resetForm();
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error creating family relationship:', error);
      toast.error('Failed to add family relationship');
    },
  });

  // Reset form
  const resetForm = () => {
    setSelectedRelatedMemberId('');
    setRelationshipType(FamilyRelationshipType.OTHER);
    setSearchTerm('');
    setIsFormVisible(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRelatedMemberId || !selectedFamilyId) return;

    createFamilyRelationship({
      variables: {
        createFamilyRelationshipInput: {
          memberId,
          relatedMemberId: selectedRelatedMemberId,
          familyId: selectedFamilyId,
          relationshipType,
        },
      },
    });
  };

  // Filter out the current member from search results
  const filteredMembers = members?.filter((member: any) => member.id !== memberId) || [];

  // Get families from the query
  const families = familiesData?.member?.families || [];

  // Debug logging to help diagnose search issues
  useEffect(() => {
    if (searchTerm && searchTerm.length > 2) {
    }
  }, [searchTerm, members, organisationId, branchId]);

  if (families.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      {!isFormVisible ? (
        <button
          onClick={() => setIsFormVisible(true)}
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <UserPlusIcon className="h-5 w-5 mr-1" />
          Add Family Relationship
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add Family Relationship</h3>
            <button 
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Family Selection */}
            <div>
              <label htmlFor="family" className="block text-sm font-medium text-gray-700 mb-1">
                Select Family
              </label>
              <select
                id="family"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={selectedFamilyId}
                onChange={(e) => setSelectedFamilyId(e.target.value)}
                disabled={familiesLoading || families.length === 0}
                required
              >
                <option value="">Select a family</option>
                {families.map((family: any) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Member Search */}
            <div>
              <label htmlFor="member-search" className="block text-sm font-medium text-gray-700 mb-1">
                Search for Related Member
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="member-search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Search Results */}
              {searchTerm.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                  {searchLoading ? (
                    <div className="p-2 text-sm text-gray-500">Searching...</div>
                  ) : filteredMembers.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredMembers.map((member: any) => (
                        <li
                          key={member.id}
                          className={`p-2 cursor-pointer hover:bg-gray-50 text-sm ${
                            selectedRelatedMemberId === member.id ? 'bg-indigo-50' : ''
                          }`}
                          onClick={() => setSelectedRelatedMemberId(member.id)}
                        >
                          <div className="font-medium">{member.firstName} {member.lastName}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-2 text-sm text-gray-500">No members found. Try a different search term.</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Relationship Type Selection */}
            <div>
              <label htmlFor="relationshipType" className="block text-sm font-medium text-gray-700 mb-1">
                Relationship Type
              </label>
              <select
                id="relationshipType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={relationshipType}
                onChange={(e) => setRelationshipType(e.target.value as FamilyRelationshipType)}
                required
              >
                {Object.values(FamilyRelationshipType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Selected Member Display */}
            {selectedRelatedMemberId && (
              <div className="bg-indigo-50 p-3 rounded-md">
                <p className="text-sm font-medium text-indigo-700">Selected Member:</p>
                <p className="text-sm text-gray-700">
                  {filteredMembers.find(m => m.id === selectedRelatedMemberId)?.firstName} {filteredMembers.find(m => m.id === selectedRelatedMemberId)?.lastName}
                </p>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                disabled={creating || !selectedRelatedMemberId || !selectedFamilyId}
              >
                {creating ? 'Adding...' : 'Add Relationship'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
