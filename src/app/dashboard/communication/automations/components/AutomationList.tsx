"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import AutomationCard from './AutomationCard';
import { AutomationConfig, AutomationStatus, AutomationType } from '../types/automation.types';

interface AutomationListProps {
  automations: AutomationConfig[];
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (automation: AutomationConfig) => void;
  onView?: (automation: AutomationConfig) => void;
}

export default function AutomationList({
  automations,
  onToggle,
  onEdit,
  onView,
}: AutomationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AutomationStatus>('all');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter automations
  const filteredAutomations = automations.filter((automation) => {
    // Search filter
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || automation.status === filterStatus;
    
    // Type filter (active/inactive)
    const matchesType = filterType === 'all' ||
                       (filterType === 'active' && automation.isEnabled) ||
                       (filterType === 'inactive' && !automation.isEnabled);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Group automations by category
  const groupedAutomations = {
    celebrations: filteredAutomations.filter(a => 
      [AutomationType.BIRTHDAY, AutomationType.ANNIVERSARY, AutomationType.SACRAMENTAL_ANNIVERSARY].includes(a.type)
    ),
    membership: filteredAutomations.filter(a =>
      [AutomationType.FIRST_TIMER, AutomationType.VISITOR_FOLLOWUP, AutomationType.NEW_CONVERT].includes(a.type)
    ),
    attendance: filteredAutomations.filter(a =>
      [AutomationType.ABSENCE, AutomationType.RETURN_WELCOME].includes(a.type)
    ),
    giving: filteredAutomations.filter(a =>
      [AutomationType.PAYMENT_RECEIPT, AutomationType.PAYMENT_THANK_YOU, AutomationType.RECURRING_GIVING_REMINDER].includes(a.type)
    ),
    events: filteredAutomations.filter(a =>
      [AutomationType.EVENT_REMINDER].includes(a.type)
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automations</h2>
          <p className="text-gray-600 mt-1">
            {filteredAutomations.length} automation{filteredAutomations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search automations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Automations</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Automations by Category */}
      {groupedAutomations.celebrations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎉</span>
            <span>Celebrations & Life Events</span>
          </h3>
          <div className="space-y-4">
            {groupedAutomations.celebrations.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}

      {groupedAutomations.membership.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>👥</span>
            <span>Membership & Onboarding</span>
          </h3>
          <div className="space-y-4">
            {groupedAutomations.membership.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}

      {groupedAutomations.attendance.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span>
            <span>Attendance & Engagement</span>
          </h3>
          <div className="space-y-4">
            {groupedAutomations.attendance.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}

      {groupedAutomations.giving.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>💰</span>
            <span>Giving & Payments</span>
          </h3>
          <div className="space-y-4">
            {groupedAutomations.giving.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}

      {groupedAutomations.events.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📢</span>
            <span>Events & Reminders</span>
          </h3>
          <div className="space-y-4">
            {groupedAutomations.events.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={onToggle}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredAutomations.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No automations found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filters
          </p>
        </Card>
      )}
    </div>
  );
}
