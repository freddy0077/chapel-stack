"use client";

import React from 'react';
import { DocumentDuplicateIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MessageTemplate } from './types';

interface TemplatesTabProps {
  templates: MessageTemplate[];
  handleApplyTemplate: (template: MessageTemplate) => void;
  handleSaveTemplate: () => void;
  hasCurrentContent: boolean;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({
  templates,
  handleApplyTemplate,
  handleSaveTemplate,
  hasCurrentContent
}) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Message Templates</h3>
        {hasCurrentContent && (
          <button
            type="button"
            onClick={handleSaveTemplate}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
            Save Current as Template
          </button>
        )}
      </div>
      
      {templates.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {templates.map((template) => (
            <li key={template.id} className="py-4">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <p className="mt-1 text-sm text-gray-600 truncate">{template.subject}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(template)}
                  className="ml-3 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <DocumentDuplicateIcon className="-ml-0.5 mr-1 h-4 w-4" />
                  Use
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {template.content.replace(/\n/g, ' ')}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">No templates saved yet.</p>
          {hasCurrentContent && (
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
              Save Current Message as Template
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplatesTab;
