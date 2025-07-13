"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon, 
  XMarkIcon,
  PaperAirplaneIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/graphql/hooks/useAuth";
import { useSendEmail } from "@/graphql/hooks/useSendEmail";
import { useSendSms } from "@/graphql/hooks/useSendSms";
import { useCreateNotification } from "@/graphql/hooks/useCreateNotification";

// UI Components
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

// Import our modular components
import MessageTypeSelector, { MessageType } from "./message-composer/MessageTypeSelector";
import RecipientSelector, { Recipient } from "./message-composer/RecipientSelector";
import EmailEditor from "./message-composer/EmailEditor";
import SmsEditor from "./message-composer/SmsEditor";
import NotificationEditor from "./message-composer/NotificationEditor";
import MessageScheduler from "./message-composer/MessageScheduler";

interface NewMessageModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewMessageModal({ open, onClose }: NewMessageModalProps) {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0]?.branch?.id : undefined;
  
  // Message type state
  const [messageType, setMessageType] = useState<MessageType>("email");
  
  // Recipients state
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  
  // Email specific state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  
  // SMS specific state
  const [smsContent, setSmsContent] = useState("");
  
  // Notification specific state
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");
  const [notificationLink, setNotificationLink] = useState("");
  
  // Scheduling state
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  // Loading state
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email mutation
  const { sendEmail, loading: emailSending, error: emailError } = useSendEmail();
  // SMS mutation
  const { sendSms, loading: smsSending, error: smsError } = useSendSms();
  // Notification mutation
  const { createNotification, loading: notificationSending, error: notificationError } = useCreateNotification();
  
  async function handleSend() {
    setIsSending(true);
    setError(null);
    
    // Prepare message data based on type
    if (messageType === "email") {
      const emailInput = {
        branchId,
        recipients: selectedRecipients.map(r => r.email || r.phone || r.id.toString()),
        subject: emailSubject,
        bodyHtml: emailContent,
        // Add scheduledAt if scheduled
        ...(isScheduled && scheduledDate && scheduledTime ? {
          scheduledAt: new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        } : {})
      };
      
      try {
        await sendEmail({ variables: { input: emailInput } });
        setIsSending(false);
        onClose();
        resetForm();
      } catch (err) {
        setIsSending(false);
        setError("Failed to send email. Please try again.");
        console.error(err);
      }
      return;
    }
    
    if (messageType === "sms") {
      const smsInput = {
        branchId,
        recipients: selectedRecipients.map(r => r.phone || r.email || r.id.toString()),
        body: smsContent,
        // Add scheduledAt if scheduled
        ...(isScheduled && scheduledDate && scheduledTime ? {
          scheduledAt: new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        } : {})
      };
      
      try {
        await sendSms({ variables: { input: smsInput } });
        setIsSending(false);
        onClose();
        resetForm();
      } catch (err) {
        setIsSending(false);
        setError("Failed to send SMS. Please try again.");
        console.error(err);
      }
      return;
    }
    
    if (messageType === "notification") {
      const notificationInput = {
        branchId,
        // If your backend expects memberId or userId, add them here
        title: notificationTitle,
        message: notificationContent,
        link: notificationLink,
        // Add scheduledAt if scheduled
        ...(isScheduled && scheduledDate && scheduledTime ? {
          scheduledAt: new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        } : {})
      };
      
      try {
        await createNotification({ variables: { input: notificationInput } });
        setIsSending(false);
        onClose();
        resetForm();
      } catch (err) {
        setIsSending(false);
        setError("Failed to create notification. Please try again.");
        console.error(err);
      }
      return;
    }
    
    setIsSending(false);
  }
  
  function resetForm() {
    setSelectedRecipients([]);
    setEmailSubject("");
    setEmailContent("");
    setSmsContent("");
    setNotificationTitle("");
    setNotificationContent("");
    setNotificationLink("");
    setIsScheduled(false);
    setScheduledDate("");
    setScheduledTime("");
    setError(null);
  }

  // Get icon based on message type
  const getMessageTypeIcon = () => {
    switch(messageType) {
      case "email":
        return <EnvelopeIcon className="h-6 w-6 text-white" />;
      case "sms":
        return <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />;
      case "notification":
        return <BellIcon className="h-6 w-6 text-white" />;
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={isSending ? () => {} : onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />
        </Transition.Child>
        
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8">
                <div className="border-0 shadow-none">
                  {/* Header with gradient background */}
                  <div className="px-6 py-4 bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getMessageTypeIcon()}
                        <h2 className="text-xl font-semibold text-white">
                          New {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Message
                        </h2>
                      </div>
                      <button
                        type="button"
                        className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                        onClick={onClose}
                        disabled={isSending}
                      >
                        <XMarkIcon className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="space-y-6"
                    >
                      {/* Message type selector */}
                      <div className="mb-6">
                        <MessageTypeSelector 
                          messageType={messageType} 
                          onChangeType={setMessageType} 
                        />
                      </div>
                      
                      {/* Recipients selector */}
                      <div className="mb-6">
                        <RecipientSelector
                          selectedRecipients={selectedRecipients}
                          onSelectRecipient={setSelectedRecipients}
                        />
                      </div>
                      
                      {/* Message content based on type */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Message Content</h3>
                        
                        {messageType === "email" && (
                          <EmailEditor
                            subject={emailSubject}
                            content={emailContent}
                            onChangeSubject={setEmailSubject}
                            onChangeContent={setEmailContent}
                          />
                        )}
                        
                        {messageType === "sms" && (
                          <SmsEditor
                            content={smsContent}
                            onChangeContent={setSmsContent}
                          />
                        )}
                        
                        {messageType === "notification" && (
                          <NotificationEditor
                            title={notificationTitle}
                            content={notificationContent}
                            link={notificationLink}
                            onChangeTitle={setNotificationTitle}
                            onChangeContent={setNotificationContent}
                            onChangeLink={setNotificationLink}
                          />
                        )}
                      </div>
                      
                      {/* Scheduling options */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Delivery Options</h3>
                        <MessageScheduler
                          scheduled={isScheduled}
                          scheduledDate={scheduledDate}
                          scheduledTime={scheduledTime}
                          onToggleSchedule={setIsScheduled}
                          onChangeScheduledDate={setScheduledDate}
                          onChangeScheduledTime={setScheduledTime}
                        />
                      </div>
                      
                      {/* Error message */}
                      {error && (
                        <div className="rounded-md bg-red-50 p-4 mt-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                  
                  <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSending}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isSending || selectedRecipients.length === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : isScheduled ? (
                        <>
                          <CalendarIcon className="h-4 w-4" />
                          Schedule Message
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
