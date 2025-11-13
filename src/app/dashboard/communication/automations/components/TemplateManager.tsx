"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import TemplateCard from './TemplateCard';
import { 
  MessageTemplate, 
  TemplateCategory,
  getCategoryIcon 
} from '../types/template.types';
import { MessageChannel } from '../types/automation.types';

interface TemplateManagerProps {
  templates: MessageTemplate[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (template: MessageTemplate) => void;
  onDuplicateTemplate: (template: MessageTemplate) => void;
  onPreviewTemplate: (template: MessageTemplate) => void;
}

export default function TemplateManager({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onPreviewTemplate,
}: TemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | TemplateCategory>('all');
  const [filterChannel, setFilterChannel] = useState<'all' | MessageChannel>('all');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search filter
      const matchesSearch = 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.bodyText.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
      
      // Channel filter
      const matchesChannel = filterChannel === 'all' || template.type === filterChannel;
      
      return matchesSearch && matchesCategory && matchesChannel;
    });
  }, [templates, searchTerm, filterCategory, filterChannel]);

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    const groups: Record<TemplateCategory, MessageTemplate[]> = {
      [TemplateCategory.CELEBRATIONS]: [],
      [TemplateCategory.MEMBERSHIP]: [],
      [TemplateCategory.ATTENDANCE]: [],
      [TemplateCategory.GIVING]: [],
      [TemplateCategory.EVENTS]: [],
      [TemplateCategory.PASTORAL]: [],
      [TemplateCategory.GENERAL]: [],
    };

    filteredTemplates.forEach((template) => {
      groups[template.category].push(template);
    });

    return groups;
  }, [filteredTemplates]);

  // Category labels
  const categoryLabels: Record<TemplateCategory, string> = {
    [TemplateCategory.CELEBRATIONS]: 'Celebrations & Life Events',
    [TemplateCategory.MEMBERSHIP]: 'Membership & Onboarding',
    [TemplateCategory.ATTENDANCE]: 'Attendance & Engagement',
    [TemplateCategory.GIVING]: 'Giving & Payments',
    [TemplateCategory.EVENTS]: 'Events & Reminders',
    [TemplateCategory.PASTORAL]: 'Pastoral Care',
    [TemplateCategory.GENERAL]: 'General Communication',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
          <p className="text-gray-600 mt-1">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={onCreateTemplate}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Channels</option>
              <option value={MessageChannel.EMAIL}>Email</option>
              <option value={MessageChannel.SMS}>SMS</option>
              <option value={MessageChannel.PUSH}>Push</option>
              <option value={MessageChannel.IN_APP}>In-App</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Templates by Category */}
      {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => {
        if (categoryTemplates.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>{getCategoryIcon(category as TemplateCategory)}</span>
              <span>{categoryLabels[category as TemplateCategory]}</span>
              <span className="text-sm font-normal text-gray-500">
                ({categoryTemplates.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {categoryTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={onEditTemplate}
                  onDelete={onDeleteTemplate}
                  onDuplicate={onDuplicateTemplate}
                  onPreview={onPreviewTemplate}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* No results */}
      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={onCreateTemplate} variant="outline">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Your First Template
          </Button>
        </Card>
      )}
    </div>
  );
}
