"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { useEmailTemplates } from "@/graphql/hooks/useEmailTemplates";
import { usePermissions } from "@/hooks/usePermissions";
import { useMutation } from "@apollo/client";
import { DELETE_EMAIL_TEMPLATE } from "@/graphql/mutations/messageMutations";
import EmptyState from "../components/EmptyState";
import TemplateForm from "../components/templates/TemplateForm";

export default function TemplatesPage() {
  const router = useRouter();
  const { organisationId, branchId } = useOrganizationBranchFilter();
  const { canManageTemplates } = usePermissions();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Fetch templates
  const { templates, loading, error, refetch } = useEmailTemplates(organisationId || "", branchId);
  
  // Delete template mutation
  const [deleteTemplate, { loading: isDeleting }] = useMutation(DELETE_EMAIL_TEMPLATE, {
    onCompleted: () => {
      setIsDeleteModalOpen(false);
      refetch();
    },
    onError: (error) => {
      setDeleteError(error.message);
    }
  });
  
  // Filter templates based on search term
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group templates by category
  const groupedTemplates = filteredTemplates.reduce<Record<string, any[]>>(
    (groups, template) => {
      const category = template.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(template);
      return groups;
    },
    {}
  );
  
  // Sort categories
  const sortedCategories = Object.keys(groupedTemplates).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });
  
  // Handle template edit
  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };
  
  // Handle template duplicate
  const handleDuplicateTemplate = (template: any) => {
    setSelectedTemplate({
      ...template,
      name: `${template.name} (Copy)`,
      id: null
    });
    setIsCreateModalOpen(true);
  };
  
  // Handle template delete
  const handleDeleteTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };
  
  // Confirm template delete
  const confirmDelete = async () => {
    if (!selectedTemplate) return;
    
    try {
      await deleteTemplate({
        variables: {
          id: selectedTemplate.id
        }
      });
    } catch (error) {
      // Error is handled by the onError callback
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Email Templates
            </h1>
            <p className="text-gray-500 mt-1">
              Create and manage reusable email templates
            </p>
          </div>
          {canManageTemplates && (
            <Button 
              onClick={() => {
                setSelectedTemplate(null);
                setIsCreateModalOpen(true);
              }}
              className="mt-4 md:mt-0 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              New Template
            </Button>
          )}
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="flex items-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filter
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Templates List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading templates: {error.message}
          </AlertDescription>
        </Alert>
      ) : filteredTemplates.length === 0 ? (
        <EmptyState
          icon={<DocumentDuplicateIcon className="h-12 w-12 text-gray-400" />}
          title="No templates found"
          description={
            searchTerm
              ? "Try adjusting your search"
              : "Start by creating a new email template"
          }
          action={
            canManageTemplates ? (
              <Button onClick={() => {
                setSelectedTemplate(null);
                setIsCreateModalOpen(true);
              }}>
                <PlusIcon className="h-5 w-5 mr-1" />
                New Template
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-8">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span>{category}</span>
                <Badge className="ml-2 bg-gray-100 text-gray-800">
                  {groupedTemplates[category].length}
                </Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedTemplates[category].map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{template.name}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                      )}
                      <div className="text-sm text-gray-500 mb-2">
                        <strong>Subject:</strong> {template.subject}
                      </div>
                      <div className="text-xs text-gray-400">
                        Last updated: {formatDate(template.updatedAt)}
                      </div>
                    </div>
                    {canManageTemplates && (
                      <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create/Edit Template Modal */}
      <TemplateForm
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        template={selectedTemplate}
        isEdit={isEditModalOpen}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          refetch();
        }}
      />
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the template &quot;{selectedTemplate?.name}&quot;?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            
            {deleteError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
