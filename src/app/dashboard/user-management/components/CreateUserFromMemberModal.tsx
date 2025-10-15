"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useLazyQuery, useApolloClient } from "@apollo/client";
import { CREATE_USER_FROM_MEMBER } from "@/graphql/mutations/userManagementMutations";
import { GET_ALL_ROLES } from "@/graphql/queries/userManagementQueries";
import { SEARCH_MEMBERS } from "@/graphql/queries/memberQueries";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  UserPlusIcon, 
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface CreateUserFromMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Roles that Branch Admins can manage
const MANAGEABLE_ROLE_NAMES = ['MEMBER', 'FINANCE', 'PASTORAL', 'BRANCH_ADMIN'];

export function CreateUserFromMemberModal({ isOpen, onClose, onSuccess }: CreateUserFromMemberModalProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const apolloClient = useApolloClient();
  
  // Form state
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Queries
  const { data: rolesData } = useQuery(GET_ALL_ROLES);
  const [searchMembers, { data: membersData, loading: searchingMembers }] = useLazyQuery(SEARCH_MEMBERS);

  // Filter to only manageable roles
  const manageableRoles = rolesData?.adminRoles?.filter((role: any) =>
    MANAGEABLE_ROLE_NAMES.includes(role.name)
  ) || [];

  // Mutation
  const [createUserFromMember, { loading: creating }] = useMutation(CREATE_USER_FROM_MEMBER, {
    onCompleted: async () => {
      toast.success("User created successfully from member!");
      resetForm();
      
      // Reset Apollo Client cache to ensure fresh data
      try {
        await apolloClient.resetStore();
      } catch (error) {
        console.error("Error resetting cache:", error);
        // Fallback to refetch
        await apolloClient.refetchQueries({
          include: ["GetAllUsers"],
        });
      }
      
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user from member");
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Auto-fill email from selected member
  useEffect(() => {
    if (selectedMember && selectedMember.email) {
      setEmail(selectedMember.email);
    }
  }, [selectedMember]);

  const resetForm = () => {
    setMemberSearchQuery("");
    setSelectedMemberId("");
    setSelectedMember(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSelectedRoleIds([]);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSearchMembers = () => {
    if (memberSearchQuery.trim().length < 2) {
      toast.error("Please enter at least 2 characters to search");
      return;
    }
    searchMembers({
      variables: {
        query: memberSearchQuery,
        branchId,
      },
    });
  };

  const handleSelectMember = (member: any) => {
    setSelectedMemberId(member.id);
    setSelectedMember(member);
  };

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedMemberId) {
      toast.error("Please select a member");
      return;
    }

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (selectedRoleIds.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    if (!organisationId || !branchId) {
      toast.error("Organisation and branch information is missing");
      return;
    }

    // Submit
    await createUserFromMember({
      variables: {
        input: {
          memberId: selectedMemberId,
          email,
          password,
          roleIds: selectedRoleIds,
          organisationId,
          branchId,
        },
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <UserPlusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create User from Member</h2>
                  <p className="text-indigo-100 text-sm mt-0.5">
                    Create a user account for an existing member
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Step 1: Search and Select Member */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Select Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search for Member
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchMembers())}
                        placeholder="Search by name, email, or phone..."
                        className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchMembers}
                      disabled={searchingMembers}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {searchingMembers ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {membersData?.searchMembers && membersData.searchMembers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Member ({membersData.searchMembers.length} found)
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                      {membersData.searchMembers.map((member: any) => (
                        <div
                          key={member.id}
                          onClick={() => handleSelectMember(member)}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            selectedMemberId === member.id
                              ? 'bg-blue-100 border-2 border-blue-500'
                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {member.email} {member.phoneNumber && `• ${member.phoneNumber}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {membersData?.searchMembers && membersData.searchMembers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No members found. Try a different search.</p>
                )}

                {selectedMember && (
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-500">
                    <p className="text-sm font-medium text-gray-700 mb-1">Selected Member:</p>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{selectedMember.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: User Credentials */}
            {selectedMember && (
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: User Credentials</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password * (min. 8 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Assign Roles */}
            {selectedMember && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Assign Roles</h3>
                
                <div className="space-y-2">
                  {manageableRoles.map((role: any) => (
                    <label
                      key={role.id}
                      className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoleIds.includes(role.id)}
                        onChange={() => handleToggleRole(role.id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">{role.name}</p>
                        {role.description && (
                          <p className="text-xs text-gray-500">{role.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {selectedRoleIds.length === 0 && (
                  <p className="text-sm text-orange-600 mt-2">Please select at least one role</p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedMember || creating}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>{creating ? 'Creating...' : 'Create User'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
