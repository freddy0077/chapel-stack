"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import TemplateManager from '../components/TemplateManager';
import TemplateEditor from '../components/TemplateEditor';
import TemplatePreview from '../components/TemplatePreview';
import { MessageTemplate } from '../types/template.types';
import {
  GET_MESSAGE_TEMPLATES,
  CREATE_MESSAGE_TEMPLATE,
  UPDATE_MESSAGE_TEMPLATE,
  DELETE_MESSAGE_TEMPLATE,
  DUPLICATE_MESSAGE_TEMPLATE,
} from '../graphql/template.mutations';

export default function TemplatesPage() {
  // Get organisation and branch context
  const { organisationId, branchId } = useOrganisationBranch();

  // Fetch templates from backend
  const { data, loading, error, refetch } = useQuery(GET_MESSAGE_TEMPLATES, {
    fetchPolicy: 'cache-and-network',
  });

  const [createTemplate] = useMutation(CREATE_MESSAGE_TEMPLATE);
  const [updateTemplate] = useMutation(UPDATE_MESSAGE_TEMPLATE);
  const [deleteTemplate] = useMutation(DELETE_MESSAGE_TEMPLATE);
  const [duplicateTemplate] = useMutation(DUPLICATE_MESSAGE_TEMPLATE);

  const templates: MessageTemplate[] = data?.messageTemplates || [];

  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Handlers
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    if (template.isSystem) {
      toast('System templates cannot be edited. You can duplicate them instead.', {
        icon: 'ℹ️',
      });
      return;
    }
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  const handleDeleteTemplate = async (template: MessageTemplate) => {
    if (template.isSystem) {
      toast.error('System templates cannot be deleted');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        await deleteTemplate({
          variables: { id: template.id },
        });
        await refetch();
        toast.success('Template deleted successfully');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete template');
      }
    }
  };

  const handleDuplicateTemplate = async (template: MessageTemplate) => {
    try {
      await duplicateTemplate({
        variables: { id: template.id },
      });
      await refetch();
      toast.success('Template duplicated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to duplicate template');
    }
  };

  const handlePreviewTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleSaveTemplate = async (templateData: Partial<MessageTemplate>) => {
    try {
      if (selectedTemplate) {
        // Update existing template
        await updateTemplate({
          variables: {
            input: {
              id: selectedTemplate.id,
              ...templateData,
            },
          },
        });
        toast.success('Template updated successfully');
      } else {
        // Create new template
        await createTemplate({
          variables: {
            input: templateData,
          },
        });
        toast.success('Template created successfully');
      }

      await refetch();
      setShowEditor(false);
      setSelectedTemplate(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save template');
    }
  };

  // Show loading state
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading templates: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TemplateManager
        templates={templates}
        onCreateTemplate={handleCreateTemplate}
        onEditTemplate={handleEditTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onDuplicateTemplate={handleDuplicateTemplate}
        onPreviewTemplate={handlePreviewTemplate}
      />

      {/* Editor Modal */}
      <TemplateEditor
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
      />

      {/* Preview Modal */}
      <TemplatePreview
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
      />
    </div>
  );
}
