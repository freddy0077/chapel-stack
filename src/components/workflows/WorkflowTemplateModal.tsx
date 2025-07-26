"use client";

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { X, Plus, Trash2, Clock, Settings, Mail, MessageSquare, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import {
  CREATE_WORKFLOW_TEMPLATE,
  UPDATE_WORKFLOW_TEMPLATE,
  WorkflowTemplate,
  WorkflowAction,
  CreateWorkflowTemplateInput,
  UpdateWorkflowTemplateInput,
} from '@/graphql/workflows';

interface WorkflowTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: WorkflowTemplate | null;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
}

const TRIGGER_TYPES = [
  { value: 'MEMBER_CREATED', label: 'New Member Registration' },
  { value: 'MEMBER_UPDATED', label: 'Member Information Updated' },
  { value: 'EVENT_CREATED', label: 'Event Created' },
  { value: 'DONATION_RECEIVED', label: 'Donation Received' },
  { value: 'ATTENDANCE_RECORDED', label: 'Attendance Recorded' },
  { value: 'MEMBERSHIP_EXPIRING', label: 'Membership Expiring' },
  { value: 'SCHEDULED', label: 'Scheduled Trigger' },
];

const ACTION_TYPES = [
  { value: 'EMAIL', label: 'Send Email', icon: Mail },
  { value: 'SMS', label: 'Send SMS', icon: MessageSquare },
  { value: 'NOTIFICATION', label: 'Send Notification', icon: Bell },
];

const RECIPIENT_TYPES = [
  { value: 'member', label: 'Specific Member' },
  { value: 'all_members', label: 'All Members' },
  { value: 'active_members', label: 'Active Members' },
  { value: 'group', label: 'Group Members' },
  { value: 'role', label: 'Role-based' },
];

export default function WorkflowTemplateModal({
  isOpen,
  onClose,
  template,
  mode,
  onSuccess,
}: WorkflowTemplateModalProps) {
  const { user } = useAuth();
  const { organisationId, branchId } = useOrganisationBranch();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<CreateWorkflowTemplateInput>>({
    name: '',
    description: '',
    type: 'AUTOMATED',
    triggerType: 'MEMBER_CREATED',
    triggerConfig: {},
    actions: [],
    organisationId: organisationId || '',
    branchId: branchId,
  });

  const [createWorkflowTemplate, { loading: creating }] = useMutation(CREATE_WORKFLOW_TEMPLATE, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Workflow template created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [updateWorkflowTemplate, { loading: updating }] = useMutation(UPDATE_WORKFLOW_TEMPLATE, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Workflow template updated successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (template && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: template.name,
        description: template.description || '',
        type: template.type,
        triggerType: template.triggerType,
        triggerConfig: template.triggerConfig || {},
        actions: template.actions.map(action => ({
          actionType: action.actionType,
          actionConfig: action.actionConfig,
          stepNumber: action.stepNumber,
          delayMinutes: action.delayMinutes,
          conditions: action.conditions,
        })),
        organisationId: template.organisationId,
        branchId: template.branchId,
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        type: 'AUTOMATED',
        triggerType: 'MEMBER_CREATED',
        triggerConfig: {},
        actions: [],
        organisationId: organisationId || '',
        branchId: branchId,
      });
    }
  }, [template, mode, organisationId, branchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.triggerType || !formData.actions?.length) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one action",
        variant: "destructive",
      });
      return;
    }

    try {
      if (mode === 'create') {
        await createWorkflowTemplate({
          variables: {
            input: formData as CreateWorkflowTemplateInput,
          },
        });
      } else if (mode === 'edit' && template) {
        await updateWorkflowTemplate({
          variables: {
            input: {
              id: template.id,
              ...formData,
            } as UpdateWorkflowTemplateInput,
          },
        });
      }
    } catch (error) {
      console.error('Error saving workflow template:', error);
    }
  };

  const addAction = () => {
    const newAction: Omit<WorkflowAction, 'id'> = {
      actionType: 'EMAIL',
      actionConfig: {
        subject: '',
        template: '',
        recipients: { type: 'member' },
      },
      stepNumber: (formData.actions?.length || 0) + 1,
      delayMinutes: 0,
      conditions: {},
    };

    setFormData(prev => ({
      ...prev,
      actions: [...(prev.actions || []), newAction],
    }));
  };

  const updateAction = (index: number, updates: Partial<WorkflowAction>) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.map((action, i) => 
        i === index ? { ...action, ...updates } : action
      ) || [],
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index) || [],
    }));
  };

  const renderActionConfig = (action: Omit<WorkflowAction, 'id'>, index: number) => {
    const ActionIcon = ACTION_TYPES.find(type => type.value === action.actionType)?.icon || Mail;

    return (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ActionIcon className="h-4 w-4" />
              <CardTitle className="text-sm">{action.actionType}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{action.actionType}</Badge>
              {mode !== 'view' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAction(index)}
                  disabled={creating || updating}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`action-type-${index}`}>Action Type</Label>
              <Select
                value={action.actionType}
                onValueChange={(value) => updateAction(index, { actionType: value as any })}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor={`action-delay-${index}`}>Delay (minutes)</Label>
            <Input
              id={`action-delay-${index}`}
              type="number"
              value={action.delayMinutes || 0}
              onChange={(e) => updateAction(index, { delayMinutes: parseInt(e.target.value) || 0 })}
              disabled={mode === 'view'}
            />
          </div>

          {action.actionType === 'EMAIL' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor={`action-subject-${index}`}>Email Subject</Label>
                <Input
                  id={`action-subject-${index}`}
                  value={action.actionConfig.subject || ''}
                  onChange={(e) => updateAction(index, {
                    actionConfig: { ...action.actionConfig, subject: e.target.value }
                  })}
                  placeholder="Welcome to {{organisation.name}}!"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <Label htmlFor={`action-template-${index}`}>Email Template</Label>
                <Textarea
                  id={`action-template-${index}`}
                  value={action.actionConfig.template || ''}
                  onChange={(e) => updateAction(index, {
                    actionConfig: { ...action.actionConfig, template: e.target.value }
                  })}
                  placeholder="Hello {{member.firstName}}, welcome to our church family!"
                  rows={4}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
          )}

          {action.actionType === 'SMS' && (
            <div>
              <Label htmlFor={`action-message-${index}`}>SMS Message</Label>
              <Textarea
                id={`action-message-${index}`}
                value={action.actionConfig.message || ''}
                onChange={(e) => updateAction(index, {
                  actionConfig: { ...action.actionConfig, message: e.target.value }
                })}
                placeholder="Hi {{member.firstName}}, thanks for joining us!"
                rows={3}
                disabled={mode === 'view'}
              />
            </div>
          )}

          {action.actionType === 'NOTIFICATION' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor={`action-title-${index}`}>Notification Title</Label>
                <Input
                  id={`action-title-${index}`}
                  value={action.actionConfig.title || ''}
                  onChange={(e) => updateAction(index, {
                    actionConfig: { ...action.actionConfig, title: e.target.value }
                  })}
                  placeholder="New Member Alert"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <Label htmlFor={`action-notification-message-${index}`}>Notification Message</Label>
                <Textarea
                  id={`action-notification-message-${index}`}
                  value={action.actionConfig.message || ''}
                  onChange={(e) => updateAction(index, {
                    actionConfig: { ...action.actionConfig, message: e.target.value }
                  })}
                  placeholder="{{member.firstName}} {{member.lastName}} has joined the church"
                  rows={3}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor={`action-recipients-${index}`}>Recipients</Label>
            <Select
              value={action.actionConfig.recipients?.type || 'member'}
              onValueChange={(value) => updateAction(index, {
                actionConfig: { 
                  ...action.actionConfig, 
                  recipients: { ...action.actionConfig.recipients, type: value }
                }
              })}
              disabled={mode === 'view'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECIPIENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? 'Create Workflow Template' : 
             mode === 'edit' ? 'Edit Workflow Template' : 
             'View Workflow Template'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="trigger">Trigger</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Workflow Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="New Member Welcome"
                      disabled={mode === 'view'}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Workflow Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AUTOMATED">Automated</SelectItem>
                        <SelectItem value="MANUAL">Manual</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this workflow does..."
                    rows={3}
                    disabled={mode === 'view'}
                  />
                </div>
              </TabsContent>

              <TabsContent value="trigger" className="space-y-4">
                <div>
                  <Label htmlFor="triggerType">Trigger Type *</Label>
                  <Select
                    value={formData.triggerType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, triggerType: value as any }))}
                    disabled={mode === 'view'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.triggerType === 'SCHEDULED' && (
                  <div>
                    <Label htmlFor="schedule">Schedule (Cron Expression)</Label>
                    <Input
                      id="schedule"
                      value={formData.triggerConfig?.schedule || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        triggerConfig: { ...prev.triggerConfig, schedule: e.target.value }
                      }))}
                      placeholder="0 9 * * *"
                      disabled={mode === 'view'}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Example: "0 9 * * *" runs daily at 9 AM
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Workflow Actions</h3>
                  {mode !== 'view' && (
                    <Button
                      type="button"
                      onClick={addAction}
                      disabled={creating || updating}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Action</span>
                    </Button>
                  )}
                </div>

                {formData.actions?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-8 w-8 mx-auto mb-2" />
                    <p>No actions configured yet</p>
                    {mode !== 'view' && (
                      <Button
                        type="button"
                        onClick={addAction}
                        className="mt-3"
                        disabled={creating || updating}
                      >
                        Add First Action
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.actions?.map((action, index) => 
                      renderActionConfig(action, index)
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {mode !== 'view' && (
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={creating || updating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating || updating}
                >
                  {creating || updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    mode === 'create' ? 'Create Workflow' : 'Update Workflow'
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
