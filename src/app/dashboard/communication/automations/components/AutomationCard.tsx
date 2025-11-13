"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  PencilIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  AutomationConfig, 
  getAutomationIcon, 
  getAutomationColor,
  getStatusColor,
  formatCronSchedule,
  MessageChannel
} from '../types/automation.types';

interface AutomationCardProps {
  automation: AutomationConfig;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (automation: AutomationConfig) => void;
}

export default function AutomationCard({
  automation,
  onToggle,
  onEdit,
}: AutomationCardProps) {
  const icon = getAutomationIcon(automation.type);
  const color = getAutomationColor(automation.type);
  const statusColor = getStatusColor(automation.status);

  const getChannelIcon = (channel: MessageChannel) => {
    switch (channel) {
      case MessageChannel.EMAIL:
        return '📧';
      case MessageChannel.SMS:
        return '📱';
      case MessageChannel.PUSH:
        return '🔔';
      case MessageChannel.IN_APP:
        return '💬';
      default:
        return '📨';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <div className={`p-3 bg-${color}-100 rounded-lg flex-shrink-0`}>
            <span className="text-2xl">{icon}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {automation.name}
              </h3>
              <Badge className={`bg-${statusColor}-100 text-${statusColor}-700 border-${statusColor}-200`}>
                {automation.status}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {automation.description}
            </p>

            {/* Schedule/Trigger Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{formatCronSchedule(automation.schedule)}</span>
              </div>
              <div className="flex items-center gap-1">
                {automation.channels.map((channel, idx) => (
                  <span key={idx} title={channel}>
                    {getChannelIcon(channel)}
                  </span>
                ))}
              </div>
            </div>

            {/* Last Run Info */}
            {automation.lastRun && (
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span>Last run:</span>
                  <span className="font-medium">
                    {new Date(automation.lastRun).toLocaleString()}
                  </span>
                </div>
                {automation.successRate !== undefined && (
                  <div className="flex items-center gap-1">
                    {automation.successRate >= 95 ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    <span>Success: {automation.successRate.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            )}

            {!automation.lastRun && (
              <div className="text-xs text-gray-400">
                Never run
              </div>
            )}
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={() => onEdit(automation)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit automation"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          
          <Switch
            checked={automation.isEnabled}
            onCheckedChange={(checked) => onToggle(automation.id, checked)}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      {/* Next Run (if scheduled) */}
      {automation.nextRun && automation.isEnabled && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next scheduled run:</span>
            <span className="font-medium text-gray-900">
              {new Date(automation.nextRun).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
