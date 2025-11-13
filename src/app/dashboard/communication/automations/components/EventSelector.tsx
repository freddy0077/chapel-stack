"use client";

import React, { useState } from 'react';
import { Clock, Filter } from 'lucide-react';
import {
  EventType,
  EventTriggerConfig,
  ConditionGroup,
  EVENT_TYPE_METADATA,
} from '../types/trigger.types';
import ConditionBuilder from './ConditionBuilder';

interface EventSelectorProps {
  value: EventTriggerConfig | null;
  onChange: (value: EventTriggerConfig) => void;
}

export default function EventSelector({ value, onChange }: EventSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const config = value || {
    eventType: EventType.MEMBER_CREATED,
    delay: 0,
    maxOccurrences: undefined,
    conditions: undefined,
  };

  const handleEventTypeChange = (eventType: EventType) => {
    onChange({
      ...config,
      eventType,
    });
  };

  const handleDelayChange = (delay: number) => {
    onChange({
      ...config,
      delay,
    });
  };

  const handleMaxOccurrencesChange = (maxOccurrences: number | undefined) => {
    onChange({
      ...config,
      maxOccurrences,
    });
  };

  const handleConditionsChange = (conditions: ConditionGroup | undefined) => {
    onChange({
      ...config,
      conditions,
    });
  };

  // Group events by category
  const eventsByCategory = Object.entries(EVENT_TYPE_METADATA).reduce((acc, [key, meta]) => {
    const category = meta.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ type: key as EventType, ...meta });
    return acc;
  }, {} as Record<string, Array<{ type: EventType } & typeof EVENT_TYPE_METADATA[EventType]>>);

  return (
    <div className="space-y-6">
      {/* Event Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Event Type *
        </label>
        <div className="space-y-4">
          {Object.entries(eventsByCategory).map(([category, events]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {events.map((event) => (
                  <button
                    key={event.type}
                    type="button"
                    onClick={() => handleEventTypeChange(event.type)}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      config.eventType === event.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{event.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {event.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
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
          <span className="text-sm text-gray-600">minutes after event occurs</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Set to 0 for immediate delivery
        </p>
      </div>

      {/* Max Occurrences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Occurrences (Optional)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            value={config.maxOccurrences || ''}
            onChange={(e) => handleMaxOccurrencesChange(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Unlimited"
          />
          <span className="text-sm text-gray-600">times per member</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Limit how many times this automation can trigger for each member
        </p>
      </div>

      {/* Advanced Conditions */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Filter className="w-4 h-4" />
          {showAdvanced ? 'Hide' : 'Add'} Additional Conditions
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Add conditions to filter which members receive this message when the event occurs.
            </p>
            <ConditionBuilder
              value={config.conditions || null}
              onChange={handleConditionsChange}
            />
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Trigger Summary</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Event:</strong> {EVENT_TYPE_METADATA[config.eventType].label}
          </p>
          {config.delay > 0 && (
            <p>
              <strong>Delay:</strong> {config.delay} minute{config.delay !== 1 ? 's' : ''}
            </p>
          )}
          {config.maxOccurrences && (
            <p>
              <strong>Max Occurrences:</strong> {config.maxOccurrences} per member
            </p>
          )}
          {config.conditions && config.conditions.conditions.length > 0 && (
            <p>
              <strong>Conditions:</strong> {config.conditions.conditions.length} condition
              {config.conditions.conditions.length !== 1 ? 's' : ''} applied
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
