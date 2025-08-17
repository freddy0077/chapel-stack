"use client";

import React, { useState } from 'react';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { 
  usePastoralCareStats, 
  usePastoralCareRecentActivity, 
  useCareRequests,
  useUpdateCareRequest,
  usePastoralVisits,
  useCounselingSessions,
  useFollowUpReminders
} from '@/graphql/hooks/usePastoralCare';
import PastoralCareStats from './components/PastoralCareStats';
import RecentActivity from './components/RecentActivity';
import CareRequestsList from './components/CareRequestsList';
import CreateCareRequestModal from './components/CreateCareRequestModal';
import PastoralVisitsList from './components/PastoralVisitsList';
import CounselingSessionsList from './components/CounselingSessionsList';
import FollowUpRemindersList from './components/FollowUpRemindersList';
import { HeartIcon, HomeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function PastoralCarePage() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch data using our custom hooks
  const { stats, loading: statsLoading, error: statsError } = usePastoralCareStats();
  // Temporarily disable recent activity query due to backend data integrity issue
  // const { activity, loading: activityLoading, error: activityError } = usePastoralCareRecentActivity(7);
  const activity = undefined;
  const activityLoading = false;
  const activityError = { message: 'Recent activity temporarily disabled due to backend data integrity issue' };
  
  const { careRequests, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useCareRequests();
  const { updateCareRequest, loading: updating } = useUpdateCareRequest();
  const { pastoralVisits, loading: visitsLoading, error: visitsError } = usePastoralVisits();
  const { counselingSessions, loading: sessionsLoading, error: sessionsError } = useCounselingSessions();
  const { followUpReminders, loading: remindersLoading, error: remindersError } = useFollowUpReminders();

  // Handle the case where recent activity has data integrity issues
  const safeActivity = activity?.filter(item => item.date != null) || [];

  const handleUpdateRequest = async (id: string, updates: any) => {
    try {
      await updateCareRequest(id, updates);
      // Refetch requests to get updated data
      refetchRequests();
    } catch (error) {
      console.error('Failed to update care request:', error);
    }
  };

  const handleCreateRequest = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    // Refetch requests to show the new request
    refetchRequests();
  };

  if (statsError || requestsError || visitsError || sessionsError || remindersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="text-center">
              <HeartIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Pastoral Care Data</h2>
              <p className="text-gray-600">
                There was an error loading the pastoral care dashboard. Please try refreshing the page.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <HeartIcon className="h-8 w-8 text-rose-600 mr-3" />
                Pastoral Care
              </h1>
              <p className="text-gray-600 mt-1">
                Manage pastoral visits, counseling sessions, and care requests
              </p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('visits')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'visits'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HomeIcon className="h-4 w-4 inline mr-1" />
                Visits
              </button>
              <button
                onClick={() => setActiveTab('counseling')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'counseling'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
                Counseling
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'reminders'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reminders
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Statistics Overview */}
            <PastoralCareStats stats={stats} loading={statsLoading} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity - Takes 1 column */}
              <div className="lg:col-span-1">
                {activityError ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="text-center py-8">
                      <div className="text-yellow-500 mb-2">⚠️</div>
                      <p className="text-gray-500 text-sm">
                        Recent activity temporarily unavailable
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Data integrity issue being resolved
                      </p>
                    </div>
                  </div>
                ) : (
                  <RecentActivity activity={safeActivity} loading={activityLoading} />
                )}
              </div>

              {/* Care Requests - Takes 2 columns */}
              <div className="lg:col-span-2">
                <CareRequestsList 
                  requests={careRequests} 
                  loading={requestsLoading}
                  onCreateRequest={handleCreateRequest}
                  onUpdateRequest={handleUpdateRequest}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visits' && (
          <PastoralVisitsList visits={pastoralVisits} loading={visitsLoading} />
        )}

        {activeTab === 'counseling' && (
          <CounselingSessionsList sessions={counselingSessions} loading={sessionsLoading} />
        )}

        {activeTab === 'reminders' && (
          <FollowUpRemindersList reminders={followUpReminders} loading={remindersLoading} />
        )}
      </div>
      <CreateCareRequestModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={handleCreateSuccess} 
      />
    </div>
  );
}
