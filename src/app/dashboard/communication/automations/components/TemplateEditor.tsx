"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageTemplate, 
  TemplateCategory,
  TEMPLATE_VARIABLES,
  extractVariables,
  renderTemplate
} from '../types/template.types';
import { MessageChannel } from '../types/automation.types';

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  template: MessageTemplate | null;
  onSave: (template: Partial<MessageTemplate>) => void;
}

export default function TemplateEditor({
  isOpen,
  onClose,
  template,
  onSave,
}: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: TemplateCategory.GENERAL,
    type: MessageChannel.EMAIL,
    subject: '',
    bodyText: '',
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        category: template.category,
        type: template.type,
        subject: template.subject || '',
        bodyText: template.bodyText,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: TemplateCategory.GENERAL,
        type: MessageChannel.EMAIL,
        subject: '',
        bodyText: '',
      });
    }
  }, [template]);

  const detectedVariables = extractVariables(formData.bodyText);

  const handleSave = () => {
    const variables = TEMPLATE_VARIABLES.filter(v => 
      detectedVariables.includes(v.key)
    );

    onSave({
      ...formData,
      variables,
    });
  };

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      bodyText: prev.bodyText + variable,
    }));
  };

  // Sample data for preview
  const previewData = {
    '{firstName}': 'John',
    '{lastName}': 'Doe',
    '{fullName}': 'John Doe',
    '{email}': 'john@example.com',
    '{phoneNumber}': '+233 24 123 4567',
    '{churchName}': 'Grace Chapel',
    '{branchName}': 'Accra Branch',
    '{date}': new Date().toLocaleDateString(),
    '{eventName}': 'Sunday Service',
    '{eventDate}': 'November 10, 2025',
    '{eventTime}': '9:00 AM',
    '{eventLocation}': 'Main Sanctuary',
    '{amount}': 'GH₵ 100.00',
    '{paymentDate}': new Date().toLocaleDateString(),
    '{receiptNumber}': 'RCP-2025-001',
  };

  const previewText = renderTemplate(formData.bodyText, previewData);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Birthday Wishes"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TemplateCategory })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={TemplateCategory.CELEBRATIONS}>Celebrations</option>
                <option value={TemplateCategory.MEMBERSHIP}>Membership</option>
                <option value={TemplateCategory.ATTENDANCE}>Attendance</option>
                <option value={TemplateCategory.GIVING}>Giving</option>
                <option value={TemplateCategory.EVENTS}>Events</option>
                <option value={TemplateCategory.PASTORAL}>Pastoral</option>
                <option value={TemplateCategory.GENERAL}>General</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this template"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="type">Message Channel *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MessageChannel })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={MessageChannel.EMAIL}>Email</option>
              <option value={MessageChannel.SMS}>SMS</option>
              <option value={MessageChannel.PUSH}>Push Notification</option>
              <option value={MessageChannel.IN_APP}>In-App Message</option>
            </select>
          </div>

          {/* Subject (for email) */}
          {formData.type === MessageChannel.EMAIL && (
            <div>
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Happy Birthday {firstName}!"
                className="mt-1"
              />
            </div>
          )}

          {/* Message Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="bodyText">Message Content *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
            <Textarea
              id="bodyText"
              value={formData.bodyText}
              onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
              placeholder="Type your message here... Use {firstName}, {churchName}, etc."
              rows={10}
              className="mt-1 font-mono text-sm"
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
              <div className="bg-white p-4 rounded border border-gray-200 whitespace-pre-wrap">
                {previewText}
              </div>
            </div>
          )}

          {/* Available Variables */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Available Variables (Click to insert)
            </h4>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_VARIABLES.map((variable) => (
                <button
                  key={variable.key}
                  type="button"
                  onClick={() => insertVariable(variable.key)}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
                  title={variable.description}
                >
                  {variable.key}
                </button>
              ))}
            </div>
          </div>

          {/* Detected Variables */}
          {detectedVariables.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Detected Variables
              </h4>
              <div className="flex flex-wrap gap-2">
                {detectedVariables.map((variable) => (
                  <Badge key={variable} className="bg-green-100 text-green-700">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name || !formData.bodyText}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
