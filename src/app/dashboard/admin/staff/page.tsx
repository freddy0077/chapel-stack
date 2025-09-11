"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { 
  GET_STAFF_MEMBERS, 
  GET_STAFF_STATISTICS, 
  GET_AVAILABLE_ROLES, 
  GET_AVAILABLE_BRANCHES 
} from "@/graphql/queries/staffQueries";
import { 
  CREATE_STAFF_MEMBER, 
  UPDATE_STAFF_MEMBER, 
  DELETE_STAFF_MEMBER, 
  TOGGLE_STAFF_STATUS 
} from "@/graphql/mutations/staffMutations";

// Types for staff management based on backend User schema
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  userBranches: {
    branchId: string;
    roleId: string;
    branch: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
      description?: string;
    };
  }[];
  roles: {
    id: string;
    name: string;
    description?: string;
  }[];
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    status: string;
  };
}

interface StaffStatistics {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  totalDepartments: number;
  totalBranches: number;
  recentHires: number;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface Branch {
  id: string;
  name: string;
  address?: string;
  isActive: boolean;
}

// Helper functions for staff data transformation
const transformUserToStaffMember = (user: any): StaffMember => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    userBranches: user.userBranches || [],
    roles: user.roles || [],
    member: user.member,
  };
};

const getStaffStatus = (staff: StaffMember): "active" | "inactive" | "suspended" => {
  if (!staff.isActive) return "inactive";
  if (!staff.isEmailVerified) return "suspended";
  return "active";
};

const getStaffRole = (staff: StaffMember): string => {
  if (staff.userBranches.length > 0) {
    return staff.userBranches[0].role.name;
  }
  if (staff.roles.length > 0) {
    return staff.roles[0].name;
  }
  return "No Role Assigned";
};

const getStaffBranch = (staff: StaffMember): string => {
  if (staff.userBranches.length > 0) {
    return staff.userBranches[0].branch.name;
  }
  return "No Branch Assigned";
};

function StaffModal({
  isOpen,
  onClose,
  staff,
  onSave,
  roles,
  branches,
}: {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember;
  onSave: (staff: any) => void;
  roles: Role[];
  branches: Branch[];
}) {
  const [formData, setFormData] = useState<any>(
    staff ? {
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phoneNumber: staff.phoneNumber || "",
      roleId: staff.roles[0]?.id || "",
      branchId: "",
      isActive: staff.isActive,
    } : {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roleId: "",
      branchId: "",
      isActive: true,
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.roleId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, roleId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <select
                value={formData.branchId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, branchId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Branch</option>
                {branches.filter(b => b.isActive).map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === "active",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              {staff ? "Update" : "Create"} Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffManagementPage() {
  const { state } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // GraphQL queries
  const { data: staffData, loading: staffLoading, error: staffError, refetch: refetchStaff } = useQuery(GET_STAFF_MEMBERS, {
    variables: {
      pagination: {
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      },
      filter: {
        isActive: true,
        organisationId: state.user?.organisationId,
      },
    },
    skip: !state.user?.organisationId,
    fetchPolicy: "cache-and-network",
  });

  const { data: statsData, loading: statsLoading } = useQuery(GET_STAFF_STATISTICS, {
    variables: { organisationId: state.user?.organisationId },
    skip: !state.user?.organisationId,
  });

  const { data: rolesData } = useQuery(GET_AVAILABLE_ROLES, {
    variables: { organisationId: state.user?.organisationId },
    skip: !state.user?.organisationId,
  });

  const { data: branchesData } = useQuery(GET_AVAILABLE_BRANCHES, {
    variables: { organisationId: state.user?.organisationId },
    skip: !state.user?.organisationId,
  });

  // GraphQL mutations
  const [createStaffMember, { loading: createLoading }] = useMutation(CREATE_STAFF_MEMBER, {
    onCompleted: () => {
      refetchStaff();
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error creating staff member:", error);
    },
  });

  const [updateStaffMember, { loading: updateLoading }] = useMutation(UPDATE_STAFF_MEMBER, {
    onCompleted: () => {
      refetchStaff();
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error updating staff member:", error);
    },
  });

  const [deleteStaffMember] = useMutation(DELETE_STAFF_MEMBER, {
    onCompleted: () => {
      refetchStaff();
    },
    onError: (error) => {
      console.error("Error deleting staff member:", error);
    },
  });

  const [toggleStaffStatus] = useMutation(TOGGLE_STAFF_STATUS, {
    onCompleted: () => {
      refetchStaff();
    },
    onError: (error) => {
      console.error("Error toggling staff status:", error);
    },
  });

  // Transform and filter data
  const staffMembers = useMemo(() => {
    if (!staffData?.adminUsers?.items) return [];
    return staffData.adminUsers.items.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified || true,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
      userBranches: [],
      roles: user.roles || [],
      member: user.member,
    }));
  }, [staffData]);

  const roles = rolesData?.roles || [];
  const branches = branchesData?.branches || [];
  const statistics = statsData?.staffStatistics;

  const filteredStaff = useMemo(() => {
    return staffMembers.filter((staff) => {
      const matchesSearch =
        staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStaffRole(staff).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !selectedRole || 
        staff.roles.some(r => r.name === selectedRole);
      
      const staffStatus = getStaffStatus(staff);
      const matchesStatus = !selectedStatus || staffStatus === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffMembers, searchTerm, selectedRole, selectedStatus]);

  const handleAddStaff = () => {
    setEditingStaff(undefined);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (formData: any) => {
    try {
      if (editingStaff) {
        await updateStaffMember({
          variables: {
            id: editingStaff.id,
            input: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
              isActive: formData.isActive,
              roleId: formData.roleId,
              branchId: formData.branchId,
            },
          },
        });
      } else {
        await createStaffMember({
          variables: {
            input: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
              isActive: formData.isActive,
              roleId: formData.roleId,
              branchId: formData.branchId,
              organisationId: state.user?.organisationId,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error saving staff member:", error);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaffMember({
          variables: { id },
        });
      } catch (error) {
        console.error("Error deleting staff member:", error);
      }
    }
  };

  const getStatusBadge = (staff: StaffMember) => {
    const status = getStaffStatus(staff);
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  // Loading state
  if (staffLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff members...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (staffError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <XCircleIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Staff</h2>
          <p className="text-gray-600 mb-4">{staffError.message}</p>
          <button
            onClick={() => refetchStaff()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
                Staff Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage church staff members, roles, and permissions
              </p>
            </div>
            <button
              onClick={handleAddStaff}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Staff Member
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staffMembers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : (statistics?.activeStaff || staffMembers.filter((s) => getStaffStatus(s) === "active").length)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roles.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : (statistics?.inactiveStaff || staffMembers.filter((s) => getStaffStatus(s) !== "active").length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredStaff.length} of {staffMembers.length} staff
              members
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {staff.firstName} {staff.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Staff Member
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getStaffRole(staff)}</div>
                      <div className="text-sm text-gray-500">
                        Staff Member
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {staff.email}
                      </div>
                      {staff.phoneNumber && (
                        <div className="flex items-center text-sm text-gray-500">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {staff.phoneNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(staff)}`}
                      >
                        {getStaffStatus(staff).charAt(0).toUpperCase() +
                          getStaffStatus(staff).slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(staff.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditStaff(staff)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No staff members found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedRole || selectedStatus
                  ? "Try adjusting your search criteria."
                  : "Get started by adding your first staff member."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staff={editingStaff}
        onSave={handleSaveStaff}
        roles={roles}
        branches={branches}
      />
    </div>
  );
}
