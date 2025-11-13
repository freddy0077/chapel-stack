"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import AutomationDashboard from './components/AutomationDashboard';
import AutomationList from './components/AutomationList';
import AutomationConfigModal from './components/AutomationConfigModal';
import AutomationEditorModal from './components/AutomationEditorModal';
import AutomationLogsModal from './components/AutomationLogsModal';
import TemplatesPage from './templates/page';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { 
  AutomationConfig, 
  AutomationStats, 
  AutomationType,
  AutomationStatus,
  AUTOMATION_DEFINITIONS 
} from './types/automation.types';
import {
  GET_AUTOMATION_CONFIGS,
  GET_AUTOMATION_STATS,
  TOGGLE_AUTOMATION_ENABLED,
  DELETE_AUTOMATION_CONFIG,
} from './graphql/automation.mutations';

export default function AutomationsPage() {
  // Get organisation and branch context
  const { organisationId, branchId } = useOrganisationBranch();

  // Fetch automations from backend
  const { data, loading, error, refetch } = useQuery(GET_AUTOMATION_CONFIGS, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: statsData } = useQuery(GET_AUTOMATION_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  const [toggleEnabled] = useMutation(TOGGLE_AUTOMATION_ENABLED);
  const [deleteAutomation] = useMutation(DELETE_AUTOMATION_CONFIG);

  const automations: AutomationConfig[] = data?.automationConfigs || [];

  const [selectedAutomation, setSelectedAutomation] = useState<AutomationConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [view, setView] = useState<'dashboard' | 'list' | 'templates'>('dashboard');

  // Calculate stats from backend data
  const stats: AutomationStats = useMemo(() => {
    if (statsData?.automationStats) {
      return {
        totalAutomations: statsData.automationStats.total || 0,
        activeAutomations: statsData.automationStats.active || 0,
        totalMessagesSent: automations.reduce((sum, a) => sum + (a.totalRuns || 0), 0),
        successRate: automations.length > 0
          ? automations.reduce((sum, a) => {
              const rate = a.totalRuns > 0 ? (a.successCount / a.totalRuns) * 100 : 0;
              return sum + rate;
            }, 0) / automations.length
          : 0,
        recentRuns: [],
      };
    }

    return {
      totalAutomations: automations.length,
      activeAutomations: automations.filter(a => a.isEnabled).length,
      totalMessagesSent: 0,
      successRate: 0,
      recentRuns: [],
    };
  }, [automations, statsData]);

  // Handlers
  const handleToggleAutomation = async (id: string, enabled: boolean) => {
    try {
      await toggleEnabled({
        variables: { id },
      });
      await refetch();
      toast.success(
        enabled 
          ? 'Automation enabled successfully' 
          : 'Automation disabled successfully'
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle automation');
    }
  };

  const handleEditAutomation = (automation: AutomationConfig) => {
    setSelectedAutomation(automation);
    setShowEditorModal(true);
  };

  const handleCreateAutomation = () => {
    setSelectedAutomation(null);
    setShowEditorModal(true);
  };

  const handleViewDetails = (automation: AutomationConfig) => {
    setSelectedAutomation(automation);
    setShowConfigModal(true);
  };

  const handleManageTemplates = () => {
    setView('templates');
  };

  const handleViewLogs = () => {
    setShowLogsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'dashboard'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'list'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Automations
          </button>
          <button
            onClick={() => setView('templates')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'templates'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && !data && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading automations...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading automations: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {view === 'dashboard' ? (
            <>
              <AutomationDashboard
                stats={stats}
                onCreateAutomation={handleCreateAutomation}
                onManageTemplates={handleManageTemplates}
                onViewLogs={handleViewLogs}
              />
              
              {/* Quick List of Active Automations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Automations</h3>
                <AutomationList
                  automations={automations.filter(a => a.isEnabled)}
                  onToggle={handleToggleAutomation}
                  onEdit={handleEditAutomation}
                  onView={handleViewDetails}
                />
              </div>
            </>
          ) : view === 'list' ? (
            <AutomationList
              automations={automations}
              onToggle={handleToggleAutomation}
              onEdit={handleEditAutomation}
              onView={handleViewDetails}
            />
          ) : (
            <TemplatesPage />
          )}
        </>
      )}

      {/* Config Modal (View Only) */}
      <AutomationConfigModal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedAutomation(null);
        }}
        automation={selectedAutomation}
      />

      {/* Editor Modal (Create/Edit) */}
      <AutomationEditorModal
        isOpen={showEditorModal}
        onClose={() => {
          setShowEditorModal(false);
          setSelectedAutomation(null);
        }}
        automation={selectedAutomation}
        onSuccess={() => refetch()}
      />

      {/* Logs Modal */}
      <AutomationLogsModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
      />
    </div>
  );
}
