"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PencilIcon, 
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  MessageTemplate, 
  getCategoryIcon, 
  getCategoryColor,
  getChannelIcon
} from '../types/template.types';

interface TemplateCardProps {
  template: MessageTemplate;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (template: MessageTemplate) => void;
  onDuplicate: (template: MessageTemplate) => void;
  onPreview: (template: MessageTemplate) => void;
}

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: TemplateCardProps) {
  const categoryIcon = getCategoryIcon(template.category);
  const categoryColor = getCategoryColor(template.category);
  const channelIcon = getChannelIcon(template.type);

  return (
    <Card className="p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className={`p-2 bg-${categoryColor}-100 rounded-lg flex-shrink-0`}>
            <span className="text-xl">{categoryIcon}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {template.name}
              </h3>
              {template.isSystem && (
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  System
                </Badge>
              )}
              {!template.isActive && (
                <Badge className="bg-gray-100 text-gray-700 text-xs">
                  Inactive
                </Badge>
              )}
            </div>
            
            {template.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {template.description}
              </p>
            )}

            {/* Subject (for email) */}
            {template.subject && (
              <p className="text-xs text-gray-500 mb-2 italic">
                Subject: {template.subject}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span>{channelIcon}</span>
                <span className="capitalize">{template.type.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📝</span>
                <span>{template.variables.length} variables</span>
              </div>
              {template.usageCount !== undefined && (
                <div className="flex items-center gap-1">
                  <span>📊</span>
                  <span>Used {template.usageCount}x</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={() => onPreview(template)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Preview template"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDuplicate(template)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Duplicate template"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onEdit(template)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit template"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          {!template.isSystem && (
            <button
              onClick={() => onDelete(template)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete template"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preview snippet */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 line-clamp-2">
          {template.bodyText}
        </p>
      </div>
    </Card>
  );
}
