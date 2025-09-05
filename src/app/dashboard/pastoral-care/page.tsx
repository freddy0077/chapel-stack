"use client";

import React, { useState, useCallback } from "react";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import {
  usePastoralCareStats,
  usePastoralCareRecentActivity,
  useCareRequests,
  useUpdateCareRequest,
  usePastoralVisits,
  useCounselingSessions,
  useFollowUpReminders,
} from "@/graphql/hooks/usePastoralCare";
import PastoralCareStats from "./components/PastoralCareStats";
import RecentActivity from "./components/RecentActivity";
import CareRequestsList from "./components/CareRequestsList";
import CreateCareRequestModal from "./components/CreateCareRequestModal";
import PastoralVisitsList from "./components/PastoralVisitsList";
import CounselingSessionsList from "./components/CounselingSessionsList";
import FollowUpRemindersList from "./components/FollowUpRemindersList";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  HeartIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  HandRaisedIcon,
  PhoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

export default function PastoralCarePage() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch data using our custom hooks
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = usePastoralCareStats();
  // Temporarily disable recent activity query due to backend data integrity issue
  // const { activity, loading: activityLoading, error: activityError } = usePastoralCareRecentActivity(7);
  const activity = undefined;
  const activityLoading = false;
  const activityError = {
    message:
      "Recent activity temporarily disabled due to backend data integrity issue",
  };

  const {
    careRequests,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useCareRequests();
  const { updateCareRequest, loading: updating } = useUpdateCareRequest();
  const {
    pastoralVisits,
    loading: visitsLoading,
    error: visitsError,
  } = usePastoralVisits();
  // Counseling sessions are care requests with requestType = "COUNSELING"
  const {
    careRequests: counselingRequests,
    loading: sessionsLoading,
    error: sessionsError,
  } = useCareRequests({ requestType: "COUNSELING" });
  const {
    followUpReminders,
    loading: remindersLoading,
    error: remindersError,
  } = useFollowUpReminders();

  // Handle the case where recent activity has data integrity issues
  const safeActivity = activity?.filter((item) => item.date != null) || [];

  const handleUpdateRequest = async (id: string, updates: any) => {
    try {
      await updateCareRequest(id, updates);
      // Refetch requests to get updated data
      refetchRequests();
    } catch (error) {
      console.error("Failed to update care request:", error);
    }
  };

  const handleCreateRequest = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    // Refetch requests to show the new request
    refetchRequests();
    // Show success toast
    toast.success('Care request created successfully', {
      icon: '💙',
      style: {
        borderRadius: '10px',
        background: '#10B981',
        color: '#fff',
      },
    });
  }, [refetchRequests]);

  if (
    statsError ||
    requestsError ||
    visitsError ||
    sessionsError ||
    remindersError
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="text-center">
              <HeartIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to Load Pastoral Care Data
              </h2>
              <p className="text-gray-600">
                There was an error loading the pastoral care dashboard. Please
                try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Define tabs with modern styling
  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: ChartBarIcon,
      count: stats?.totalRequests || 0,
    },
    {
      id: 'visits',
      name: 'Pastoral Visits',
      icon: HomeIcon,
      count: stats?.totalVisits || 0,
    },
    {
      id: 'counseling',
      name: 'Counseling',
      icon: ChatBubbleOvalLeftEllipsisIcon,
      count: stats?.totalCounselingSessions || 0,
    },
    {
      id: 'reminders',
      name: 'Follow-ups',
      icon: BellAlertIcon,
      count: followUpReminders?.length || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 p-8 shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <HeartIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Pastoral Care
                </h1>
                <p className="text-white/90 text-lg">
                  Compassionate care, spiritual guidance, and community support
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <DocumentTextIcon className="h-4 w-4" />
                    {stats?.totalRequests || 0} Care Requests
                  </span>
                  <span className="flex items-center gap-1">
                    <HomeIcon className="h-4 w-4" />
                    {stats?.totalVisits || 0} Visits
                  </span>
                  <span className="flex items-center gap-1">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
                    {stats?.totalCounselingSessions || 0} Sessions
                  </span>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleCreateRequest}
                size="lg"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Care Request
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Modern Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {[
            { label: 'Total Requests', value: stats?.totalRequests ?? 0, icon: DocumentTextIcon, color: 'from-rose-500 to-rose-600' },
            { label: 'Active', value: stats?.activeRequests ?? 0, icon: ClockIcon, color: 'from-orange-500 to-orange-600' },
            { label: 'Completed', value: stats?.completedRequests ?? 0, icon: CheckCircleIcon, color: 'from-green-500 to-green-600' },
            { label: 'Visits', value: stats?.totalVisits ?? 0, icon: HomeIcon, color: 'from-blue-500 to-blue-600' },
            { label: 'Counseling', value: stats?.totalCounselingSessions ?? 0, icon: ChatBubbleOvalLeftEllipsisIcon, color: 'from-purple-500 to-purple-600' },
            { label: 'Follow-ups', value: followUpReminders?.length ?? 0, icon: BellAlertIcon, color: 'from-indigo-500 to-indigo-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-lg border border-white/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  {statsLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600" />
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {statsLoading ? '...' : stat.value.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modern Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content with Modern Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Activity - Takes 1 column */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                  >
                    {activityError ? (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ClockIcon className="h-5 w-5 text-gray-600" />
                          Recent Activity
                        </h3>
                        <div className="text-center py-8">
                          <div className="p-3 rounded-full bg-yellow-100 w-fit mx-auto mb-3">
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            Recent activity temporarily unavailable
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Data integrity issue being resolved
                          </p>
                        </div>
                      </div>
                    ) : (
                      <RecentActivity
                        activity={safeActivity}
                        loading={activityLoading}
                      />
                    )}
                  </motion.div>

                  {/* Care Requests - Takes 2 columns */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                  >
                    <CareRequestsList
                      requests={careRequests}
                      loading={requestsLoading}
                      onCreateRequest={handleCreateRequest}
                      onUpdateRequest={handleUpdateRequest}
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === "visits" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <PastoralVisitsList visits={pastoralVisits} loading={visitsLoading} />
              </motion.div>
            )}

            {activeTab === "counseling" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CounselingSessionsList
                  sessions={counselingRequests}
                  loading={sessionsLoading}
                />
              </motion.div>
            )}

            {activeTab === "reminders" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FollowUpRemindersList
                  reminders={followUpReminders}
                  loading={remindersLoading}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <CreateCareRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
