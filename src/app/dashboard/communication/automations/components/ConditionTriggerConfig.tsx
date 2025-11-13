"use client";

import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import {
  ConditionTriggerConfig as ConditionTriggerConfigType,
  ConditionGroup,
} from '../types/trigger.types';
import ConditionBuilder from './ConditionBuilder';

interface ConditionTriggerConfigProps {
  value: ConditionTriggerConfigType | null;
  onChange: (value: ConditionTriggerConfigType) => void;
}

const CHECK_INTERVAL_PRESETS = [
  { label: 'Every Hour', value: '0 * * * *' },
  { label: 'Every 6 Hours', value: '0 */6 * * *' },
  { label: 'Daily at 9:00 AM', value: '0 9 * * *' },
  { label: 'Daily at 6:00 PM', value: '0 18 * * *' },
  { label: 'Weekly on Monday at 9:00 AM', value: '0 9 * * 1' },
  { label: 'Custom', value: 'custom' },
];

export default function ConditionTriggerConfig({
  value,
  onChange,
}: ConditionTriggerConfigProps) {
  const [customInterval, setCustomInterval] = React.useState('');
  const [selectedPreset, setSelectedPreset] = React.useState('0 9 * * *');

  const config = value || {
    conditions: {
      id: generateId(),
      operator: 'AND' as const,
      conditions: [],
    },
    checkInterval: '0 9 * * *',
    delay: 0,
  };

  const handleConditionsChange = (conditions: ConditionGroup) => {
    onChange({
      ...config,
      conditions,
    });
  };

  const handleIntervalChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === 'custom') {
      onChange({
        ...config,
        checkInterval: customInterval,
      });
    } else {
      onChange({
        ...config,
        checkInterval: preset,
      });
    }
  };

  const handleCustomIntervalChange = (interval: string) => {
    setCustomInterval(interval);
    if (selectedPreset === 'custom') {
      onChange({
        ...config,
        checkInterval: interval,
      });
    }
  };

  const handleDelayChange = (delay: number) => {
    onChange({
      ...config,
      delay,
    });
  };

  return (
    <div className="space-y-6">
      {/* Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Define Conditions *
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Messages will be sent to members who match these conditions when the system checks.
        </p>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <ConditionBuilder
            value={config.conditions}
            onChange={handleConditionsChange}
          />
        </div>
      </div>

      {/* Check Interval */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Check Interval *
        </label>
        <p className="text-sm text-gray-600 mb-3">
          How often should the system check if members match these conditions?
        </p>
        <select
          value={selectedPreset}
          onChange={(e) => handleIntervalChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
        >
          {CHECK_INTERVAL_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>

        {selectedPreset === 'custom' && (
          <div>
            <input
              type="text"
              value={customInterval}
              onChange={(e) => handleCustomIntervalChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0 9 * * *"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a cron expression (e.g., "0 9 * * *" for daily at 9 AM)
            </p>
          </div>
        )}

        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Current interval:</strong> {config.checkInterval}
          </p>
        </div>
      </div>

      {/* Delay Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          Delay Before Sending
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            value={config.delay || 0}
            onChange={(e) => handleDelayChange(parseInt(e.target.value) || 0)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600">minutes after condition is met</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Set to 0 for immediate delivery
        </p>
      </div>

      {/* Important Note */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Important Notes</h4>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>
            The system will check for matching members at the specified interval
          </li>
          <li>
            Each member will only receive the message once (unless they stop matching and match again later)
          </li>
          <li>
            More frequent checks will use more system resources
          </li>
        </ul>
      </div>

      {/* Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Trigger Summary</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Type:</strong> Condition-Based
          </p>
          <p>
            <strong>Check Interval:</strong> {config.checkInterval}
          </p>
          {config.delay > 0 && (
            <p>
              <strong>Delay:</strong> {config.delay} minute{config.delay !== 1 ? 's' : ''}
            </p>
          )}
          <p>
            <strong>Conditions:</strong> {config.conditions.conditions.length} condition
            {config.conditions.conditions.length !== 1 ? 's' : ''} defined
          </p>
        </div>
      </div>
    </div>
  );
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
