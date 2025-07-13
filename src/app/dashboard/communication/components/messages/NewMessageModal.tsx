"use client";

import { useState } from "react";
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PaperClipIcon
} from "@heroicons/react/24/outline";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useMutation } from "@apollo/client";
import { SEND_EMAIL, SEND_SMS, CREATE_NOTIFICATION } from "@/graphql/mutations/messageMutations";

import MessageTypeSelector from "../message-composer/MessageTypeSelector";
import RecipientSelector, { Recipient } from "../message-composer/RecipientSelector";
import MessageComposer from "../message-composer/MessageComposer";
import MessageScheduler from "../message-composer/MessageScheduler";
import TemplateSelector from "../message-composer/TemplateSelector";
import { MediaAttachment } from "../message-composer/MediaAttachmentUploader";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewMessageModal({ isOpen, onClose, onSuccess }: NewMessageModalProps) {
  // Message type state
  const [messageType, setMessageType] = useState<"EMAIL" | "SMS" | "NOTIFICATION">("EMAIL");
  // Recipients state
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  // Message content state
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  // Media attachments state
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  // Scheduling state
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Mutations
  const [sendEmail, { loading: sendingEmail }] = useMutation(SEND_EMAIL);
  const [sendSms, { loading: sendingSms }] = useMutation(SEND_SMS);
  const [sendNotification, { loading: sendingNotification }] = useMutation(CREATE_NOTIFICATION);
  const isSending = sendingEmail || sendingSms || sendingNotification;
  // Reset form
  const resetForm = () => {
    setMessageType("EMAIL");
    setRecipients([]);
    setSubject("");
    setContent("");
    setSelectedTemplate(null);
    setAttachments([]);
    setIsScheduled(false);
    setScheduledDate(null);
    setError(null);
  };
  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };
  // Validate form
  const validateForm = () => {
    if (recipients.length === 0) {
      setError("Please select at least one recipient");
      return false;
    }
    if (messageType === "EMAIL" && !subject.trim()) {
      setError("Please enter a subject for your email");
      return false;
    }
    if (!content.trim()) {
      setError("Please enter message content");
      return false;
    }
    if (isScheduled && !scheduledDate) {
      setError("Please select a date and time for your scheduled message");
      return false;
    }
    return true;
  };
  // Handle send message
  const handleSendMessage = async () => {
    if (!validateForm()) return;
    try {
      const recipientIds = recipients.map(r => r.id);
      // Prepare attachment data for API
      const attachmentData = attachments
        .filter(att => att.uploadProgress === 100 && att.url)
        .map(att => ({
          name: att.name,
          type: att.type,
          size: att.size,
          url: att.url
        }));
      const commonVariables = {
        recipientIds,
        content,
        scheduled: isScheduled,
        scheduledFor: isScheduled ? scheduledDate?.toISOString() : null
      };
      let result;
      switch (messageType) {
        case "EMAIL":
          result = await sendEmail({
            variables: {
              input: {
                ...commonVariables,
                subject,
                templateId: selectedTemplate?.id,
                attachments: attachmentData.length > 0 ? attachmentData : undefined
              }
            }
          });
          break;
        case "SMS":
          result = await sendSms({
            variables: {
              input: commonVariables
            }
          });
          break;
        case "NOTIFICATION":
          result = await sendNotification({
            variables: {
              input: commonVariables
            }
          });
          break;
      }
      if (result?.data) {
        resetForm();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  // Get message type info
  const getMessageTypeInfo = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return {
          icon: <EnvelopeIcon className="h-7 w-7" />, bgColor: "bg-blue-100", textColor: "text-blue-600", gradientFrom: "from-blue-500", gradientTo: "to-blue-600", title: "Email Message"
        };
      case 'SMS':
        return {
          icon: <ChatBubbleLeftRightIcon className="h-7 w-7" />, bgColor: "bg-purple-100", textColor: "text-purple-600", gradientFrom: "from-purple-500", gradientTo: "to-purple-600", title: "SMS Message"
        };
      case 'NOTIFICATION':
        return {
          icon: <BellIcon className="h-7 w-7" />, bgColor: "bg-amber-100", textColor: "text-amber-600", gradientFrom: "from-amber-500", gradientTo: "to-amber-600", title: "App Notification"
        };
      default:
        return {
          icon: <EnvelopeIcon className="h-7 w-7" />, bgColor: "bg-slate-100", textColor: "text-slate-600", gradientFrom: "from-slate-500", gradientTo: "to-slate-600", title: "New Message"
        };
    }
  };
  const typeInfo = getMessageTypeInfo(messageType);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl w-full max-w-[98vw] p-0 overflow-visible border-0 shadow-2xl rounded-2xl bg-transparent">
        {/* Sticky Gradient Header */}
        <div className={`sticky top-0 z-20 bg-gradient-to-r ${typeInfo.gradientFrom} ${typeInfo.gradientTo} p-6 pb-4 flex items-center gap-4 rounded-t-2xl shadow-md`}> 
          <div className={`rounded-full bg-white/30 p-2`}>{typeInfo.icon}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white tracking-tight">{typeInfo.title}</h2>
            <p className="text-sm text-white/80 truncate">
              {recipients.length > 0 ? `To ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}` : 'Create and send a new message'}
            </p>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10" size="icon" onClick={handleClose} aria-label="Close">
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative z-10 bg-white rounded-b-2xl px-0 pb-0 pt-0 md:px-8 md:pb-0 space-y-7 shadow-none">
          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="border-0 shadow-md mt-6 mx-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Message Type Selector */}
          <Card className="overflow-visible border-0 shadow-md rounded-xl mx-4 mt-6">
            <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl"></div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full bg-indigo-100 text-indigo-600 p-2">
                  <DocumentTextIcon className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Message Type</h3>
              </div>
              <MessageTypeSelector
                selectedType={messageType}
                onSelectType={(type) => {
                  setMessageType(type as any);
                  if (type !== "EMAIL" && attachments.length > 0) setAttachments([]);
                }}
              />
            </div>
          </Card>

          {/* Recipients Selector */}
          <Card className="overflow-visible border-0 shadow-md rounded-xl mx-4">
            <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl"></div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full bg-green-100 text-green-600 p-2">
                  <UserGroupIcon className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Recipients</h3>
              </div>
              <RecipientSelector
                selectedRecipients={recipients}
                onChange={setRecipients}
                messageType={messageType.toLowerCase() as 'email' | 'sms' | 'notification'}
              />
            </div>
          </Card>

          {/* Template Selector (Email only) */}
          {messageType === "EMAIL" && (
            <Card className="overflow-visible border-0 shadow-md rounded-xl mx-4">
              <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl"></div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-blue-100 text-blue-600 p-2">
                    <CheckCircleIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">Template (Optional)</h3>
                </div>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={(template) => {
                    setSelectedTemplate(template);
                    if (template) {
                      setSubject(template.subject || "");
                      setContent(template.content || "");
                    }
                  }}
                />
              </div>
            </Card>
          )}

          {/* Message Composer */}
          <Card className="overflow-visible border-0 shadow-md rounded-xl mx-4">
            <div className={`h-1 bg-gradient-to-r ${typeInfo.gradientFrom} ${typeInfo.gradientTo} rounded-t-xl`}></div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`rounded-full ${typeInfo.bgColor} ${typeInfo.textColor} p-2`}>
                  {typeInfo.icon}
                </div>
                <h3 className="font-medium flex items-center gap-2">
                  Compose Message
                  {messageType === "EMAIL" && attachments.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500 font-normal flex items-center gap-1">
                      <PaperClipIcon className="inline-block h-4 w-4" />
                      {attachments.length} attachment{attachments.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </h3>
              </div>
              <MessageComposer
                messageType={messageType}
                subject={subject}
                content={content}
                onSubjectChange={setSubject}
                onContentChange={setContent}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
            </div>
          </Card>

          {/* Message Scheduler */}
          <Card className="overflow-visible border-0 shadow-md rounded-xl mx-4 mb-4">
            <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl"></div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full bg-amber-100 text-amber-600 p-2">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Schedule</h3>
              </div>
              <MessageScheduler
                isScheduled={isScheduled}
                scheduledDate={scheduledDate}
                onIsScheduledChange={setIsScheduled}
                onScheduledDateChange={setScheduledDate}
              />
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center px-6 py-5 bg-gray-50 border-t border-gray-100 rounded-b-2xl sticky bottom-0 z-30 shadow-sm">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSending}
            className="w-full md:w-auto order-2 md:order-1"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isSending}
            className={`w-full md:w-auto order-1 md:order-2 bg-gradient-to-r ${typeInfo.gradientFrom} ${typeInfo.gradientTo} text-white shadow-md hover:shadow-lg transition-all duration-200`}
          >
            {isScheduled ? (
              <>
                <ClockIcon className="h-4 w-4 mr-2" />
                {isSending ? "Scheduling..." : "Schedule Message"}
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                {isSending ? "Sending..." : "Send Message"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
