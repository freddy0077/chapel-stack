"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EnvelopeIcon, ChatBubbleLeftRightIcon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../../graphql/hooks/useAuth";
import { useSendEmail } from "../../../../graphql/hooks/useSendEmail";
import { useSendSms } from "../../../../graphql/hooks/useSendSms";
import { useCreateNotification } from "../../../../graphql/hooks/useCreateNotification";

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

  // Email mutation
  const { sendEmail, loading: emailSending, error: emailError } = useSendEmail();
  // SMS mutation
  const { sendSms, loading: smsSending, error: smsError } = useSendSms();
  // Notification mutation
  const { createNotification, loading: notificationSending, error: notificationError } = useCreateNotification();
  
  async function handleSend() {
    setIsSending(true);
    
    // Prepare message data based on type
    if (messageType === "email") {
      const emailInput = {
        branchId,
        recipients: selectedRecipients.map(r => r.email || r.phone || r.id.toString()),
        subject: emailSubject,
        bodyHtml: emailContent,
        // Optionally add bodyText, templateId, scheduledAt, etc.
      };
      try {
        await sendEmail({ variables: { input: emailInput } });
        setIsSending(false);
        onClose();
        resetForm();
      } catch (err) {
        setIsSending(false);
        // Optionally show error feedback
      }
      return;
    }
    if (messageType === "sms") {
      const smsInput = {
        branchId,
        recipients: selectedRecipients.map(r => r.phone || r.email || r.id.toString()),
        body: smsContent,
        // Optionally add senderNumber, scheduledAt, etc.
      };
      try {
        await sendSms({ variables: { input: smsInput } });
        setIsSending(false);
        onClose();
        resetForm();
      } catch (err) {
        setIsSending(false);
        // Optionally show error feedback
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
        // Optionally add type, scheduledAt, etc.
      };
      try {
        await createNotification({ variables: { input: notificationInput } });
        setIsSending(false);
        onClose();
        resetForm();
      } catch (err) {
        setIsSending(false);
        // Optionally show error feedback
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
  }

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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {messageType === "email" && <EnvelopeIcon className="h-6 w-6 text-white" />}
                      {messageType === "sms" && <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />}
                      {messageType === "notification" && <BellIcon className="h-6 w-6 text-white" />}
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                        New {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Message
                      </Dialog.Title>
                    </div>
                    <button
                      type="button"
                      className="rounded-md bg-transparent text-white hover:text-gray-200 focus:outline-none"
                      onClick={onClose}
                      disabled={isSending}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                
                {/* Message type selector */}
                <div className="px-6 pt-5">
                  <MessageTypeSelector 
                    messageType={messageType} 
                    onChangeType={setMessageType} 
                  />
                </div>
                
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="px-6 pb-6 space-y-6"
                >
                  {/* Recipients selector */}
                  <RecipientSelector
                    selectedRecipients={selectedRecipients}
                    onSelectRecipient={setSelectedRecipients}
                  />
                  
                  {/* Message content based on type */}
                  <div className="border-t border-gray-200 pt-4">
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
                  <MessageScheduler
                    scheduled={isScheduled}
                    scheduledDate={scheduledDate}
                    scheduledTime={scheduledTime}
                    onToggleSchedule={setIsScheduled}
                    onChangeScheduledDate={setScheduledDate}
                    onChangeScheduledTime={setScheduledTime}
                  />
                  
                  {/* Send button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      disabled={isSending || selectedRecipients.length === 0}
                    >
                      {isSending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : isScheduled ? (
                        `Schedule for ${scheduledDate} at ${scheduledTime}`
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
