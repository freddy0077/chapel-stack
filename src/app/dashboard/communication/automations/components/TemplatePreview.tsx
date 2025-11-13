"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageTemplate, renderTemplate, getChannelIcon } from '../types/template.types';

interface TemplatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template: MessageTemplate | null;
}

export default function TemplatePreview({
  isOpen,
  onClose,
  template,
}: TemplatePreviewProps) {
  if (!template) return null;

  // Sample data for preview
  const sampleData = {
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

  const previewText = renderTemplate(template.bodyText, sampleData);
  const previewSubject = template.subject ? renderTemplate(template.subject, sampleData) : null;

  const channelIcon = getChannelIcon(template.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{channelIcon}</span>
            <span>Template Preview: {template.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Info */}
          <div className="flex items-center gap-2">
            <Badge>{template.category}</Badge>
            <Badge variant="outline">{template.type}</Badge>
            {template.isSystem && (
              <Badge className="bg-blue-100 text-blue-700">System</Badge>
            )}
          </div>

          {/* Description */}
          {template.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          )}

          {/* Subject (for email) */}
          {previewSubject && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Subject</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">{previewSubject}</p>
              </div>
            </div>
          )}

          {/* Message Body */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Message Content</h4>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              {template.bodyHtml ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: renderTemplate(template.bodyHtml, sampleData) }}
                  className="prose prose-sm max-w-none"
                />
              ) : (
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{previewText}</p>
              )}
            </div>
          </div>

          {/* Variables Used */}
          {template.variables.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Variables ({template.variables.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {template.variables.map((variable) => (
                  <div key={variable.key} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-mono text-blue-600 mb-1">{variable.key}</p>
                    <p className="text-xs text-gray-600">{variable.label}</p>
                    {variable.example && (
                      <p className="text-xs text-gray-500 mt-1">
                        Example: {variable.example}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This preview uses sample data. Actual messages will use real member data.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
