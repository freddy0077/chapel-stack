"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { X, Save, Loader2, Calendar, MessageSquare, Settings, Zap } from 'lucide-react';
import { AutomationConfig, AutomationType, TriggerType, MessageChannel } from '../types/automation.types';
import { TriggerConfig, EventTriggerConfig, ConditionTriggerConfig as ConditionTriggerConfigType } from '../types/trigger.types';
import { CREATE_AUTOMATION_CONFIG, UPDATE_AUTOMATION_CONFIG } from '../graphql/automation.mutations';
import { GET_MESSAGE_TEMPLATES } from '../graphql/template.mutations';
import EventSelector from './EventSelector';
import ConditionTriggerConfig from './ConditionTriggerConfig';

interface AutomationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation?: AutomationConfig | null;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  type: AutomationType;
  triggerType: TriggerType;
  schedule: string;
  templateId: string;
  channels: MessageChannel[];
  isEnabled: boolean;
  triggerConfig: TriggerConfig;
}

const AUTOMATION_TYPE_OPTIONS = [
  { value: AutomationType.BIRTHDAY, label: 'Birthday Greetings', icon: '🎂' },
  { value: AutomationType.ANNIVERSARY, label: 'Anniversary Wishes', icon: '💑' },
  { value: AutomationType.SACRAMENTAL_ANNIVERSARY, label: 'Sacramental Anniversary', icon: '✝️' },
  { value: AutomationType.ABSENCE, label: 'Absence Follow-up', icon: '👋' },
  { value: AutomationType.FIRST_TIMER, label: 'First Timer Welcome', icon: '🆕' },
  { value: AutomationType.VISITOR_FOLLOWUP, label: 'Visitor Follow-up', icon: '👥' },
  { value: AutomationType.NEW_CONVERT, label: 'New Convert Welcome', icon: '🙏' },
  { value: AutomationType.PAYMENT_RECEIPT, label: 'Payment Receipt', icon: '🧾' },
  { value: AutomationType.PAYMENT_THANK_YOU, label: 'Payment Thank You', icon: '💝' },
  { value: AutomationType.RECURRING_GIVING_REMINDER, label: 'Giving Reminder', icon: '🔔' },
  { value: AutomationType.RETURN_WELCOME, label: 'Return Welcome', icon: '🏠' },
  { value: AutomationType.EVENT_REMINDER, label: 'Event Reminder', icon: '📅' },
];

const TRIGGER_TYPE_OPTIONS = [
  { value: TriggerType.TIME_BASED, label: 'Time-Based (Scheduled)', description: 'Run on a schedule (daily, weekly, etc.)' },
  { value: TriggerType.EVENT_BASED, label: 'Event-Based', description: 'Trigger when an event occurs' },
  { value: TriggerType.CONDITION_BASED, label: 'Condition-Based', description: 'Run when conditions are met' },
];

const SCHEDULE_PRESETS = [
  { label: 'Daily at 9:00 AM', value: '0 9 * * *' },
  { label: 'Weekly on Monday at 9:00 AM', value: '0 9 * * 1' },
  { label: 'Monthly on 1st at 9:00 AM', value: '0 9 1 * *' },
  { label: 'Every Hour', value: '0 * * * *' },
  { label: 'Custom', value: 'custom' },
];

export default function AutomationEditorModal({
  isOpen,
  onClose,
  automation,
  onSuccess,
}: AutomationEditorModalProps) {
  const isEditMode = !!automation;

  // Fetch templates
  const { data: templatesData } = useQuery(GET_MESSAGE_TEMPLATES, {
    fetchPolicy: 'cache-and-network',
  });

  const templates = templatesData?.messageTemplates || [];

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: AutomationType.BIRTHDAY,
    triggerType: TriggerType.TIME_BASED,
    schedule: '0 9 * * *',
    templateId: '',
    channels: [MessageChannel.EMAIL],
    isEnabled: false,
    triggerConfig: null,
  });

  const [customSchedule, setCustomSchedule] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('0 9 * * *');
  const [activeTab, setActiveTab] = useState<'basic' | 'trigger' | 'message'>('basic');

  // Mutations
  const [createAutomation, { loading: creating }] = useMutation(CREATE_AUTOMATION_CONFIG);
  const [updateAutomation, { loading: updating }] = useMutation(UPDATE_AUTOMATION_CONFIG);

  const loading = creating || updating;

  // Initialize form with automation data
  useEffect(() => {
    if (automation) {
      setFormData({
        name: automation.name,
        description: automation.description || '',
        type: automation.type,
        triggerType: automation.triggerType,
        schedule: automation.schedule || '0 9 * * *',
        templateId: automation.templateId || '',
        channels: automation.channels,
        isEnabled: automation.isEnabled,
        triggerConfig: (automation as any).triggerConfig || null,
      });
      setSelectedPreset(automation.schedule || '0 9 * * *');
    } else {
      // Reset form for new automation
      setFormData({
        name: '',
        description: '',
        type: AutomationType.BIRTHDAY,
        triggerType: TriggerType.TIME_BASED,
        schedule: '0 9 * * *',
        templateId: '',
        channels: [MessageChannel.EMAIL],
        isEnabled: false,
        triggerConfig: null,
      });
      setSelectedPreset('0 9 * * *');
      setCustomSchedule('');
      setActiveTab('basic');
    }
  }, [automation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (!formData.templateId) {
      toast.error('Please select a message template');
      return;
    }

    if (formData.channels.length === 0) {
      toast.error('Please select at least one channel');
      return;
    }

    if (formData.triggerType === TriggerType.TIME_BASED && !formData.schedule) {
      toast.error('Please enter a schedule');
      return;
    }

    try {
      const input = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        triggerType: formData.triggerType,
        schedule: formData.triggerType === TriggerType.TIME_BASED ? formData.schedule : null,
        templateId: formData.templateId,
        channels: formData.channels,
        isEnabled: formData.isEnabled,
        triggerConfig: formData.triggerConfig,
      };

      if (isEditMode) {
        await updateAutomation({
          variables: {
            input: {
              id: automation.id,
              ...input,
            },
          },
        });
        toast.success('Automation updated successfully');
      } else {
        await createAutomation({
          variables: { input },
        });
        toast.success('Automation created successfully');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save automation');
    }
  };

  const handleChannelToggle = (channel: MessageChannel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleScheduleChange = (value: string) => {
    setSelectedPreset(value);
    if (value === 'custom') {
      setFormData(prev => ({ ...prev, schedule: customSchedule }));
    } else {
      setFormData(prev => ({ ...prev, schedule: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Automation' : 'Create New Automation'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('trigger')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'trigger'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Trigger
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'message'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Message
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6 space-y-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Automation Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Birthday Greetings"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe what this automation does..."
                    />
                  </div>

                  {/* Automation Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Automation Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {AUTOMATION_TYPE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: option.value })}
                          className={`p-3 border-2 rounded-lg text-left transition-all ${
                            formData.type === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-sm font-medium">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable Automation
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Start running this automation immediately after creation
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isEnabled: !formData.isEnabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Trigger Tab */}
              {activeTab === 'trigger' && (
                <div className="space-y-4">
                  {/* Trigger Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trigger Type *
                    </label>
                    <div className="space-y-2">
                      {TRIGGER_TYPE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, triggerType: option.value })}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            formData.triggerType === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schedule (for TIME_BASED) */}
                  {formData.triggerType === TriggerType.TIME_BASED && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Schedule *
                      </label>
                      <select
                        value={selectedPreset}
                        onChange={(e) => handleScheduleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      >
                        {SCHEDULE_PRESETS.map((preset) => (
                          <option key={preset.value} value={preset.value}>
                            {preset.label}
                          </option>
                        ))}
                      </select>

                      {selectedPreset === 'custom' && (
                        <div>
                          <input
                            type="text"
                            value={customSchedule}
                            onChange={(e) => {
                              setCustomSchedule(e.target.value);
                              setFormData({ ...formData, schedule: e.target.value });
                            }}
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
                          <strong>Current schedule:</strong> {formData.schedule}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Event-Based Configuration */}
                  {formData.triggerType === TriggerType.EVENT_BASED && (
                    <EventSelector
                      value={formData.triggerConfig as EventTriggerConfig | null}
                      onChange={(config) => setFormData({ ...formData, triggerConfig: config })}
                    />
                  )}

                  {/* Condition-Based Configuration */}
                  {formData.triggerType === TriggerType.CONDITION_BASED && (
                    <ConditionTriggerConfig
                      value={formData.triggerConfig as ConditionTriggerConfigType | null}
                      onChange={(config) => setFormData({ ...formData, triggerConfig: config })}
                    />
                  )}
                </div>
              )}

              {/* Message Tab */}
              {activeTab === 'message' && (
                <div className="space-y-4">
                  {/* Template Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Template *
                    </label>
                    <select
                      value={formData.templateId}
                      onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a template...</option>
                      {templates.map((template: any) => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.type})
                        </option>
                      ))}
                    </select>
                    {templates.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        No templates available. Please create a template first.
                      </p>
                    )}
                  </div>

                  {/* Channels */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Channels *
                    </label>
                    <div className="space-y-2">
                      {Object.values(MessageChannel).map((channel) => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => handleChannelToggle(channel)}
                          className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                            formData.channels.includes(channel)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{channel}</span>
                            {formData.channels.includes(channel) && (
                              <span className="text-blue-600">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {formData.channels.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Please select at least one channel
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEditMode ? 'Update Automation' : 'Create Automation'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
