"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { 
  XMarkIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon,
  PaperClipIcon,
  CalendarIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useMutation } from "@apollo/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { useEmailTemplates } from "@/graphql/hooks/useEmailTemplates";
import { SEND_EMAIL, SEND_SMS } from "@/graphql/mutations/messageMutations";

import RecipientSelector from "./message-composer/RecipientSelector";
import MessageScheduler from "./message-composer/MessageScheduler";
import RichTextEditor from "./message-composer/RichTextEditor";
import TemplateSelector from "./message-composer/TemplateSelector";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: () => void;
}

type MessageType = "email" | "sms" | "notification";

export default function NewMessageModal({ isOpen, onClose, onMessageSent }: NewMessageModalProps) {
  const { organisationId, branchId } = useOrganizationBranchFilter();
  
  // State for message composition
  const [messageType, setMessageType] = useState<MessageType>("email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Array<{ id: string; name: string; type: "member" | "group" }>>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  // Fetch email templates
  const { templates, loading: loadingTemplates } = useEmailTemplates(organisationId || "", branchId);
  
  // GraphQL mutations
  const [sendEmail] = useMutation(SEND_EMAIL);
  const [sendSms] = useMutation(SEND_SMS);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  // Reset form fields
  const resetForm = () => {
    setMessageType("email");
    setSubject("");
    setContent("");
    setHtmlContent("");
    setSelectedRecipients([]);
    setIsScheduled(false);
    setScheduledDate(null);
    setSelectedTemplateId(null);
    setAttachments([]);
    setError(null);
  };
  
  // Handle recipient selection
  const handleRecipientChange = (recipients: Array<{ id: string; name: string; type: "member" | "group" }>) => {
    setSelectedRecipients(recipients);
  };
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    // Find the selected template
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject || "");
      setContent(template.bodyText || "");
      setHtmlContent(template.bodyHtml || "");
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };
  
  // Remove attachment
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSending(true);
      
      // Validate form
      if (selectedRecipients.length === 0) {
        throw new Error("Please select at least one recipient");
      }
      
      // Extract recipient IDs
      const recipientIds = selectedRecipients.map(r => r.id);
      
      // Send message based on type
      if (messageType === "email") {
        // Validate email fields
        if (!subject) throw new Error("Subject is required");
        if (!htmlContent && !content) throw new Error("Message content is required");
        
        // Send email
        await sendEmail({
          variables: {
            input: {
              subject,
              bodyHtml: htmlContent || content,
              bodyText: content,
              recipients: recipientIds,
              templateId: selectedTemplateId,
              organisationId,
              branchId,
              scheduledFor: isScheduled && scheduledDate ? scheduledDate.toISOString() : undefined
            }
          }
        });
      } else if (messageType === "sms") {
        // Validate SMS fields
        if (!content) throw new Error("Message content is required");
        
        // Send SMS
        await sendSms({
          variables: {
            input: {
              message: content,
              recipients: recipientIds,
              organisationId,
              branchId,
              scheduledFor: isScheduled && scheduledDate ? scheduledDate.toISOString() : undefined
            }
          }
        });
      } else if (messageType === "notification") {
        // Notification functionality will be implemented later
        throw new Error("In-app notifications are not yet supported");
      }
      
      // Success
      onMessageSent();
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                <Card>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-4 flex justify-between items-center">
                    <Dialog.Title as="h3" className="text-lg font-medium text-white">
                      New Message
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-white hover:text-gray-200"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Message Type Selector */}
                    <div className="mb-6">
                      <Tab.Group selectedIndex={["email", "sms", "notification"].indexOf(messageType)} onChange={(index) => setMessageType(["email", "sms", "notification"][index] as MessageType)}>
                        <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={`flex items-center w-full rounded-md py-2 px-4 text-sm font-medium leading-5 ${
                                  selected
                                    ? 'bg-white shadow text-indigo-600'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                                }`}
                              >
                                <EnvelopeIcon className="h-5 w-5 mr-2" />
                                Email
                              </button>
                            )}
                          </Tab>
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={`flex items-center w-full rounded-md py-2 px-4 text-sm font-medium leading-5 ${
                                  selected
                                    ? 'bg-white shadow text-indigo-600'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                                }`}
                              >
                                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                                SMS
                              </button>
                            )}
                          </Tab>
                          <Tab as={Fragment} disabled>
                            {({ selected }) => (
                              <button
                                className={`flex items-center w-full rounded-md py-2 px-4 text-sm font-medium leading-5 ${
                                  selected
                                    ? 'bg-white shadow text-indigo-600'
                                    : 'text-gray-400'
                                }`}
                                disabled
                              >
                                <BellIcon className="h-5 w-5 mr-2" />
                                Notification
                              </button>
                            )}
                          </Tab>
                        </Tab.List>
                      </Tab.Group>
                    </div>
                    
                    {/* Error Alert */}
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Recipients */}
                    <div className="mb-6">
                      <Label>Recipients</Label>
                      <RecipientSelector 
                        selectedRecipients={selectedRecipients}
                        onChange={handleRecipientChange}
                      />
                    </div>
                    
                    {/* Email Template Selector (Email only) */}
                    {messageType === "email" && (
                      <div className="mb-6">
                        <Label>Template (Optional)</Label>
                        <TemplateSelector
                          templates={templates}
                          loading={loadingTemplates}
                          selectedTemplateId={selectedTemplateId}
                          onSelect={handleTemplateSelect}
                        />
                      </div>
                    )}
                    
                    {/* Subject (Email only) */}
                    {messageType === "email" && (
                      <div className="mb-6">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Enter email subject"
                        />
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div className="mb-6">
                      <Label htmlFor="content">Message</Label>
                      {messageType === "email" ? (
                        <RichTextEditor
                          value={htmlContent}
                          onChange={(value) => {
                            setHtmlContent(value);
                            // Extract plain text from HTML for text version
                            const div = document.createElement('div');
                            div.innerHTML = value;
                            setContent(div.textContent || '');
                          }}
                        />
                      ) : (
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Enter your message"
                          rows={6}
                        />
                      )}
                    </div>
                    
                    {/* Attachments (Email only) */}
                    {messageType === "email" && (
                      <div className="mb-6">
                        <Label>Attachments</Label>
                        <div className="mt-1 flex items-center">
                          <label className="cursor-pointer">
                            <div className="flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                              <PaperClipIcon className="h-5 w-5 text-gray-500" />
                              <span>Attach files</span>
                            </div>
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                        
                        {/* Display attachments */}
                        {attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
                                <div className="flex items-center">
                                  <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                                  <span>{file.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(index)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Schedule Message */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isScheduled}
                          onCheckedChange={setIsScheduled}
                          id="schedule-toggle"
                        />
                        <Label htmlFor="schedule-toggle" className="cursor-pointer">
                          Schedule for later
                        </Label>
                      </div>
                      
                      {isScheduled && (
                        <div className="mt-4">
                          <MessageScheduler
                            selectedDate={scheduledDate}
                            onDateChange={setScheduledDate}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={isSending}
                      className="flex items-center"
                    >
                      {isSending ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </Card>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
