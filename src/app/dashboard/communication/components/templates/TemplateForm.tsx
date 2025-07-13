"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { useMutation } from "@apollo/client";
import { CREATE_EMAIL_TEMPLATE, UPDATE_EMAIL_TEMPLATE } from "@/graphql/mutations/messageMutations";
import RichTextEditor from "../message-composer/RichTextEditor";

interface TemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  template?: any;
  isEdit?: boolean;
  onSuccess: () => void;
}

export default function TemplateForm({
  isOpen,
  onClose,
  template,
  isEdit = false,
  onSuccess
}: TemplateFormProps) {
  const { organisationId, branchId } = useOrganizationBranchFilter();
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [category, setCategory] = useState("General");
  const [error, setError] = useState<string | null>(null);
  
  // Mutations
  const [createTemplate, { loading: isCreating }] = useMutation(CREATE_EMAIL_TEMPLATE, {
    onCompleted: () => {
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const [updateTemplate, { loading: isUpdating }] = useMutation(UPDATE_EMAIL_TEMPLATE, {
    onCompleted: () => {
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Initialize form with template data if editing
  useEffect(() => {
    if (template) {
      setName(template.name || "");
      setDescription(template.description || "");
      setSubject(template.subject || "");
      setBodyHtml(template.bodyHtml || "");
      setBodyText(template.bodyText || "");
      setCategory(template.category || "General");
    } else {
      resetForm();
    }
  }, [template, isOpen]);
  
  // Reset form fields
  const resetForm = () => {
    setName("");
    setDescription("");
    setSubject("");
    setBodyHtml("");
    setBodyText("");
    setCategory("General");
    setError(null);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setError(null);
      
      // Validate form
      if (!name) throw new Error("Template name is required");
      if (!subject) throw new Error("Subject is required");
      if (!bodyHtml) throw new Error("Template content is required");
      
      const templateData = {
        name,
        description,
        subject,
        bodyHtml,
        bodyText,
        category,
        organisationId,
        branchId
      };
      
      if (isEdit && template?.id) {
        // Update existing template
        await updateTemplate({
          variables: {
            id: template.id,
            input: templateData
          }
        });
      } else {
        // Create new template
        await createTemplate({
          variables: {
            input: templateData
          }
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to save template");
    }
  };
  
  // Available template categories
  const templateCategories = [
    "General",
    "Welcome",
    "Events",
    "Announcements",
    "Newsletters",
    "Follow-up",
    "Pastoral",
    "Fundraising",
    "Volunteer",
    "Other"
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Template" : "Create New Template"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Template Name */}
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              className="mt-1"
            />
          </div>
          
          {/* Template Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of this template"
              className="mt-1"
              rows={2}
            />
          </div>
          
          {/* Template Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {templateCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Email Subject */}
          <div>
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="mt-1"
            />
          </div>
          
          {/* Email Content */}
          <div>
            <Label htmlFor="content">Email Content</Label>
            <div className="mt-1">
              <RichTextEditor
                value={bodyHtml}
                onChange={(value) => {
                  setBodyHtml(value);
                  // Extract plain text from HTML for text version
                  const div = document.createElement('div');
                  div.innerHTML = value;
                  setBodyText(div.textContent || '');
                }}
              />
            </div>
          </div>
          
          {/* Template Variables Help */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Available Template Variables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="text-xs text-gray-600">
                <code className="bg-gray-200 px-1 py-0.5 rounded">{"{{firstName}}"}</code> - Recipient's first name
              </div>
              <div className="text-xs text-gray-600">
                <code className="bg-gray-200 px-1 py-0.5 rounded">{"{{lastName}}"}</code> - Recipient's last name
              </div>
              <div className="text-xs text-gray-600">
                <code className="bg-gray-200 px-1 py-0.5 rounded">{"{{email}}"}</code> - Recipient's email address
              </div>
              <div className="text-xs text-gray-600">
                <code className="bg-gray-200 px-1 py-0.5 rounded">{"{{churchName}}"}</code> - Your church name
              </div>
              <div className="text-xs text-gray-600">
                <code className="bg-gray-200 px-1 py-0.5 rounded">{"{{date}}"}</code> - Current date
              </div>
              <div className="text-xs text-gray-600">
                <code className="bg-gray-200 px-1 py-0.5 rounded">{"{{unsubscribeLink}}"}</code> - Unsubscribe link
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreating || isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating
              ? isEdit ? "Updating..." : "Creating..."
              : isEdit ? "Update Template" : "Create Template"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
