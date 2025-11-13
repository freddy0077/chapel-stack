"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AutomationConfig, getAutomationIcon, formatCronSchedule } from '../types/automation.types';

interface AutomationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation: AutomationConfig | null;
}

export default function AutomationConfigModal({
  isOpen,
  onClose,
  automation,
}: AutomationConfigModalProps) {
  if (!automation) return null;

  const icon = getAutomationIcon(automation.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <span>{automation.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{automation.description}</p>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="flex items-center gap-2">
              <Badge className={automation.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {automation.isEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Badge>{automation.status}</Badge>
            </div>
          </div>

          {/* Schedule */}
          {automation.schedule && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule</h3>
              <p className="text-gray-600">{formatCronSchedule(automation.schedule)}</p>
              <p className="text-xs text-gray-500 mt-1">Cron: {automation.schedule}</p>
            </div>
          )}

          {/* Channels */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Message Channels</h3>
            <div className="flex gap-2">
              {automation.channels.map((channel) => (
                <Badge key={channel} variant="outline">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>

          {/* Last Run */}
          {automation.lastRun && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Last Run</h3>
              <p className="text-gray-600">
                {new Date(automation.lastRun).toLocaleString()}
              </p>
              {automation.successRate !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  Success Rate: {automation.successRate.toFixed(1)}%
                </p>
              )}
            </div>
          )}

          {/* Next Run */}
          {automation.nextRun && automation.isEnabled && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Next Scheduled Run</h3>
              <p className="text-gray-600">
                {new Date(automation.nextRun).toLocaleString()}
              </p>
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Advanced Configuration Coming Soon!</strong>
              <br />
              Full editing capabilities including custom schedules, message templates, 
              and trigger conditions will be available in the next update.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button disabled className="bg-gray-400">
            Edit (Coming Soon)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
