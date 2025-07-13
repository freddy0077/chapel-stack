"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_BRANCH } from "@/graphql/queries/branchQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DashboardHeader";
import BranchHeader from "../components/BranchHeader";
import BranchMembersPanel from "../components/BranchMembersPanel";
import MemberTransferPanel from "../components/MemberTransferPanel";
import BranchStatistics from "../components/BranchStatistics";
import RecentActivities from "../components/RecentActivities";
import UpcomingEvents from "../components/UpcomingEvents";
import BranchMinistriesPanel from "../components/BranchMinistriesPanel";
import BranchSettings, { BranchSettingsType } from "../components/BranchSettings";
import BranchUserRolesPanel from "../components/BranchUserRolesPanel";
import CreateUserModal from "../components/CreateUserModal";
import { useBranch } from "../../../../graphql/hooks/useBranch";
import { useMutation } from "@apollo/client";
import { UPDATE_BRANCH } from "../../../../graphql/mutations/branchMutations";
import { usePermissions } from "@/hooks/usePermissions";
import toast from "react-hot-toast";

export default function BranchDetailPage() {
  const router = useRouter();
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<any | null>(null);
  const [updateBranch] = useMutation(UPDATE_BRANCH);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [shouldRefetchUsers, setShouldRefetchUsers] = useState(false);

  const params = useParams();
  const branchId = params.id as string;
  
  const [activeTab, setActiveTab] = useState("overview");

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
        establishedDate: branch.establishedAt ? branch.establishedAt.slice(0, 10) : "",
        status: branch.isActive ? "active" : "inactive"
      });
    }
  }, [branch]);

  // Edit form change handler
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        establishedAt: editFormData.establishedDate ? new Date(editFormData.establishedDate).toISOString() : undefined,
        isActive: editFormData.status === "active"
      };
      const { data } = await updateBranch({ variables: { id: branch.id, input } });
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

  // Handle saving branch settings
  const handleSaveSettings = async (settings: BranchSettingsType) => {
    try {
      // This function is no longer needed as the BranchSettings component
      // now handles saving settings directly through the useBranchSettings hook
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving branch settings:", error);
      toast.error("Failed to save branch settings");
      return Promise.reject(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error || !branch) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error || 'Branch not found'}</div>
        <Link href="/dashboard/branches" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Branches
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <BranchHeader branch={branch} />
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex-grow max-w-7xl mx-auto w-full">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-sm mb-6 p-1">
            <TabsList className="flex w-full justify-start gap-1 overflow-x-auto p-1 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/90 dark:data-[state=inactive]:bg-gray-800/50 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:hover:bg-gray-800/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/90 dark:data-[state=inactive]:bg-gray-800/50 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:hover:bg-gray-800/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Members
              </TabsTrigger>
              <TabsTrigger 
                value="ministries" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/90 dark:data-[state=inactive]:bg-gray-800/50 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:hover:bg-gray-800/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ministries
              </TabsTrigger>
              <TabsTrigger 
                value="transfers" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/90 dark:data-[state=inactive]:bg-gray-800/50 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:hover:bg-gray-800/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4" />
                </svg>
                Transfers
              </TabsTrigger>
              <TabsTrigger 
                value="user-roles" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/90 dark:data-[state=inactive]:bg-gray-800/50 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:hover:bg-gray-800/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
                User Roles
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/90 dark:data-[state=inactive]:bg-gray-800/50 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:hover:bg-gray-800/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="edit" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/90 dark:data-[state=inactive]:bg-gray-800/50 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:hover:bg-gray-800/90"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3h3"></path></svg>
                Edit
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="space-y-6 mb-12 animate-fadeIn">
            <TabsContent value="overview">
              <div className="space-y-6">
                <BranchStatistics branchId={branch.id} />
                
                {/* Branch Overview Content with data from backend */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
                      </div>
                      {(isSuperAdmin || isBranchAdmin) && (
                        <Link 
                          href={`/dashboard/branches/${branch.id}/activities`} 
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          View all
                        </Link>
                      )}
                    </div>
                    <RecentActivities branchId={branch.id} limit={5} />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          View upcoming events in this branch
                        </p>
                      </div>
                      <Link 
                        href={`/dashboard/events?branchId=${branch.id}`}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View calendar
                      </Link>
                    </div>
                    <UpcomingEvents branchId={branch.id} limit={3} />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="members">
              <BranchMembersPanel branchId={branchId} />
            </TabsContent>
            
            <TabsContent value="ministries">
              <BranchMinistriesPanel branchId={branchId} />
            </TabsContent>
            
            <TabsContent value="transfers">
              <MemberTransferPanel branchId={branch.id} branchName={branch.name} />
            </TabsContent>
            
            <TabsContent value="user-roles">
              <div className="animate-fadeIn">
                <BranchUserRolesPanel 
                  branchId={branchId} 
                  onCreateUser={() => setShowCreateUserModal(true)}
                  shouldRefetchUsers={shouldRefetchUsers}
                  onRefetchComplete={() => setShouldRefetchUsers(false)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <BranchSettings branchId={branch.id} />
            </TabsContent>
            {/* Branch Edit Form Tab */}
            <TabsContent value="edit">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-3xl mx-auto">
                <form onSubmit={handleEditSubmit}>
                  <div className="px-6 py-8 grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
                    {/* Branch Info Card */}
                    <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a4 4 0 00-8 0v2m8 0v2a4 4 0 01-8 0V7m8 0a4 4 0 00-8 0"></path></svg>
                        Branch Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-indigo-800 mb-1">Branch Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="e.g. Grace Chapel, Downtown"
                            value={editFormData?.name || ""}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-indigo-800 mb-1">Address</label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="123 Main St"
                            value={editFormData?.address || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-indigo-800 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="City"
                            value={editFormData?.city || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-indigo-800 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            id="state"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="State"
                            value={editFormData?.state || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-indigo-800 mb-1">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="ZIP/Postal Code"
                            value={editFormData?.postalCode || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-indigo-800 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            id="country"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="Country"
                            value={editFormData?.country || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-indigo-800 mb-1">Phone Number</label>
                          <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="(555) 123-4567"
                            value={editFormData?.phoneNumber || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-indigo-800 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="email@example.com"
                            value={editFormData?.email || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="website" className="block text-sm font-medium text-indigo-800 mb-1">Website</label>
                          <input
                            type="url"
                            name="website"
                            id="website"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            placeholder="https://www.example.com"
                            value={editFormData?.website || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Status & Established Date Card */}
                    <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9"></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 7V4m0 0a2 2 0 012 2v2m-2 2a2 2 0 00-2 2v2m0 0a2 2 0 012 2v2m0 0a2 2 0 00-2 2"></path></svg>
                        Branch Status & Established Date
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label htmlFor="establishedDate" className="block text-sm font-medium text-indigo-800 mb-1">Established Date</label>
                          <input
                            type="date"
                            name="establishedDate"
                            id="establishedDate"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            value={editFormData?.establishedDate || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-indigo-800 mb-1">Branch Status</label>
                          <select
                            id="status"
                            name="status"
                            className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            value={editFormData?.status || "active"}
                            onChange={handleEditChange}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => router && router.push("/dashboard/branches")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isEditSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isEditSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Create User Modal - Displayed at the page level */}
      {showCreateUserModal && (
        <CreateUserModal
          isOpen={showCreateUserModal}
          branchId={branchId}
          onClose={() => setShowCreateUserModal(false)}
          onUserCreated={() => {
            setShowCreateUserModal(false);
            setShouldRefetchUsers(true);
            refetch();
          }}
        />
      )}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
