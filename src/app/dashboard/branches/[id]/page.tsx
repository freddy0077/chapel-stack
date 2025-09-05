"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_BRANCH } from "@/graphql/queries/branchQueries";
import DashboardHeader from "@/components/DashboardHeader";
import BranchHeader from "../components/BranchHeader";
import BranchMembersPanel from "../components/BranchMembersPanel";
import MemberTransferPanel from "../components/MemberTransferPanel";
import BranchStatistics from "../components/BranchStatistics";
import RecentActivities from "../components/RecentActivities";
import UpcomingEvents from "../components/UpcomingEvents";
import BranchMinistriesPanel from "../components/BranchMinistriesPanel";
import BranchSettings, {
  BranchSettingsType,
} from "../components/BranchSettings";
import BranchUserRolesPanel from "../components/BranchUserRolesPanel";
import CreateUserModal from "../components/CreateUserModal";
import { useBranch } from "../../../../graphql/hooks/useBranch";
import { useMutation } from "@apollo/client";
import { UPDATE_BRANCH } from "../../../../graphql/mutations/branchMutations";
import { usePermissions } from "@/hooks/usePermissions";
import toast from "react-hot-toast";
import BranchPastoralCarePanel from "../components/BranchPastoralCarePanel";
import BranchSacramentsPanel from "../components/BranchSacramentsPanel";
import BranchSermonsPanel from "../components/BranchSermonsPanel";
import {
  HomeIcon,
  UsersIcon,
  BuildingLibraryIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  HeartIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  CogIcon,
  PencilIcon,
  ChevronLeftIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

// Navigation items configuration
const navigationItems = [
  {
    id: "overview",
    label: "Overview",
    icon: HomeIcon,
    description: "Branch dashboard and key metrics",
  },
  {
    id: "members",
    label: "Members",
    icon: UsersIcon,
    description: "Manage branch members",
  },
  {
    id: "ministries",
    label: "Ministries",
    icon: BuildingLibraryIcon,
    description: "Ministry management",
  },
  {
    id: "pastoral-care",
    label: "Pastoral Care",
    icon: HeartIcon,
    description: "Prayer requests and counseling",
  },
  {
    id: "sacraments",
    label: "Sacraments",
    icon: DocumentTextIcon,
    description: "Baptisms, communion, marriages",
  },
  {
    id: "sermons",
    label: "Sermons",
    icon: SpeakerWaveIcon,
    description: "Sermon library and speakers",
  },
  {
    id: "transfers",
    label: "Transfers",
    icon: ArrowsRightLeftIcon,
    description: "Member transfers",
  },
  {
    id: "user-roles",
    label: "User Roles",
    icon: UserGroupIcon,
    description: "Role management",
  },
  {
    id: "settings",
    label: "Settings",
    icon: CogIcon,
    description: "Branch configuration",
  },
  {
    id: "edit",
    label: "Edit Branch",
    icon: PencilIcon,
    description: "Edit branch details",
  },
];

export default function BranchDetailPage() {
  const router = useRouter();
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<any | null>(null);
  const [updateBranch] = useMutation(UPDATE_BRANCH);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [shouldRefetchUsers, setShouldRefetchUsers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const params = useParams();
  const branchId = params.id as string;

  const [activeSection, setActiveSection] = useState("overview");

  const { branch, loading, error, refetch } = useBranch(branchId);

  const { isSuperAdmin, isBranchAdmin, canManageEvents } = usePermissions();

  // Initialize edit form data when branch loads
  useEffect(() => {
    if (branch) {
      setEditFormData({
        name: branch.name || "",
        address: branch.address || "",
        city: branch.city || "",
        state: branch.state || "",
        postalCode: branch.postalCode || "",
        country: branch.country || "USA",
        phoneNumber: branch.phoneNumber || "",
        email: branch.email || "",
        website: branch.website || "",
        establishedDate: branch.establishedAt
          ? branch.establishedAt.slice(0, 10)
          : "",
        status: branch.isActive ? "active" : "inactive",
      });
    }
  }, [branch]);

  // Edit form change handler
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Edit form submit handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;
    setIsEditSubmitting(true);
    try {
      const input = {
        name: editFormData.name,
        address: editFormData.address,
        city: editFormData.city,
        state: editFormData.state,
        postalCode: editFormData.postalCode,
        country: editFormData.country,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        website: editFormData.website,
        establishedAt: editFormData.establishedDate
          ? new Date(editFormData.establishedDate).toISOString()
          : undefined,
        isActive: editFormData.status === "active",
      };
      const { data } = await updateBranch({
        variables: { id: branch.id, input },
      });
      if (data?.updateBranch) {
        toast.success("Branch updated successfully!");
        refetch();
        setTimeout(() => {
          if (router) router.push("/dashboard/branches");
        }, 1200);
      }
    } catch (err: unknown) {
      toast.error(err?.message || "Failed to update branch. Please try again.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleUserCreated = () => {
    setShouldRefetchUsers(true);
    setShowCreateUserModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Loading branch details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-red-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Branch not found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The branch you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Link
              href="/dashboard/branches"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Back to Branches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-4">
                <BranchStatistics branchId={branch.id} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveSection("members")}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                >
                  <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Manage Members
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("pastoral-care")}
                  className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors group"
                >
                  <HeartIcon className="h-6 w-6 text-pink-600 dark:text-pink-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-pink-900 dark:text-pink-100">
                    Pastoral Care
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("sermons")}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
                >
                  <SpeakerWaveIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Sermons
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("ministries")}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                >
                  <BuildingLibraryIcon className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Ministries
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Activities & Upcoming Events */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                      <BellIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Activities
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Latest branch activities
                      </p>
                    </div>
                  </div>
                  {(isSuperAdmin || isBranchAdmin) && (
                    <Link
                      href={`/dashboard/branches/${branch.id}/activities`}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                    >
                      View all →
                    </Link>
                  )}
                </div>
                <RecentActivities branchId={branch.id} limit={5} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upcoming Events
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Next scheduled events
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/events?branchId=${branch.id}`}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    View calendar →
                  </Link>
                </div>
                <UpcomingEvents branchId={branch.id} limit={3} />
              </div>
            </div>
          </div>
        );
      case "members":
        return <BranchMembersPanel branchId={branchId} />;
      case "ministries":
        return <BranchMinistriesPanel branchId={branchId} />;
      case "transfers":
        return (
          <MemberTransferPanel branchId={branch.id} branchName={branch.name} />
        );
      case "user-roles":
        return (
          <BranchUserRolesPanel
            branchId={branchId}
            onCreateUser={() => setShowCreateUserModal(true)}
            shouldRefetchUsers={shouldRefetchUsers}
            onRefetchComplete={() => setShouldRefetchUsers(false)}
          />
        );
      case "pastoral-care":
        return <BranchPastoralCarePanel branchId={branchId} />;
      case "sacraments":
        return <BranchSacramentsPanel branchId={branchId} />;
      case "sermons":
        return <BranchSermonsPanel branchId={branchId} />;
      case "settings":
        return <BranchSettings branchId={branchId} />;
      case "edit":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Branch Details
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update branch information and settings
              </p>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Branch Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData?.name || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData?.email || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editFormData?.phoneNumber || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={editFormData?.website || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={editFormData?.address || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveSection("overview")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none
        `}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard/branches"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {branch.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Branch Details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigationItems
                .filter((item) => {
                  // Hide members and ministries from SUPER_ADMIN
                  if (
                    isSuperAdmin &&
                    (item.id === "members" || item.id === "ministries")
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                      w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }
                    `}
                    >
                      <Icon
                        className={`
                      h-5 w-5 mr-3 transition-colors
                      ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      }
                    `}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${isActive ? "text-indigo-700 dark:text-indigo-300" : ""}`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-xs truncate ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {branch.name}
              </h1>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Branch header - hidden on mobile to save space */}
          <div className="hidden lg:block">
            <BranchHeader branch={branch} />
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <CreateUserModal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          branchId={branchId}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
}
