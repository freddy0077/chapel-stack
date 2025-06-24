"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  XMarkIcon, 
  PencilIcon,
  DocumentTextIcon,
  InboxIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

// Import our components
import {
  TabButton,
  ComposeTab,
  TemplatesTab,
  HistoryTab,
  PreviewTab,
  MessageTab,
  FileAttachment,
  MessageTemplate,
  MessageHistory,
  Recipient,
  MessageType,
  TextFormat,
  RecipientType
} from "./MessageModalComponents";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberEmail: string;
  memberPhone?: string;
}

export default function MessageModal({ isOpen, onClose, memberName, memberEmail, memberPhone }: MessageModalProps) {
  // Basic message state
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendType, setSendType] = useState<MessageType>("email");
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<MessageTab>("compose");
  
  // Rich text editor state (simplified)
  const [isTextBold, setIsTextBold] = useState(false);
  const [isTextItalic, setIsTextItalic] = useState(false);
  const [isTextBullet, setIsTextBullet] = useState(false);
  
  // File attachments state
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Scheduled message state
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  
  // Message templates
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "Welcome Message",
      subject: "Welcome to Our Church Family!",
      content: "Dear [Name],\n\nWe're delighted to welcome you to our church family!"
    },
    {
      id: "2",
      name: "Event Invitation",
      subject: "You're Invited: Upcoming Church Event",
      content: "Dear [Name],\n\nWe would like to invite you to our upcoming event."
    },
    {
      id: "3",
      name: "Birthday Wishes",
      subject: "Happy Birthday!",
      content: "Dear [Name],\n\nWishing you a blessed birthday filled with joy and God's grace."
    }
  ]);
  
  // Draft auto-save
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const draftTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Message history
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([
    {
      id: "1",
      date: "2025-04-01",
      subject: "Welcome to Our Church!",
      content: "Dear Member, Welcome to our church family...",
      type: "email",
      status: "read"
    },
    {
      id: "2",
      date: "2025-03-25",
      subject: "Easter Service Invitation",
      content: "You're invited to our special Easter service...",
      type: "email",
      status: "delivered"
    }
  ]);
  
  // Character counter for SMS
  const [smsCharCount, setSmsCharCount] = useState(0);
  const [smsMessageCount, setSmsMessageCount] = useState(1);
  
  // Recipients management
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [ccRecipients, setCcRecipients] = useState<Recipient[]>([]);
  const [bccRecipients, setBccRecipients] = useState<Recipient[]>([]);
  
  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Auto-save draft timer
  useEffect(() => {
    if (message || subject) {
      if (draftTimeoutRef.current) {
        clearTimeout(draftTimeoutRef.current);
      }
      
      draftTimeoutRef.current = setTimeout(() => {
        localStorage.setItem("message_draft", JSON.stringify({ subject, message }));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 3000);
      }, 2000);
    }
    
    return () => {
      if (draftTimeoutRef.current) {
        clearTimeout(draftTimeoutRef.current);
      }
    };
  }, [message, subject]);
  
  // Load draft on open and initialize recipient
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem("message_draft");
      if (savedDraft) {
        try {
          const { subject: draftSubject, message: draftMessage } = JSON.parse(savedDraft);
          setSubject(draftSubject || "");
          setMessage(draftMessage || "");
        } catch (e) {
          console.error("Error loading draft:", e);
        }
      }
      
      // Initialize recipient with the member
      if (memberName && memberEmail) {
        const newRecipient = {
          id: "primary",
          name: memberName,
          email: memberEmail,
          phone: memberPhone
        };
        setRecipients([newRecipient]);
      }
    }
  }, [isOpen, memberName, memberEmail, memberPhone]);
  
  // Update SMS character count
  useEffect(() => {
    if (sendType === "sms") {
      const count = message.length;
      setSmsCharCount(count);
      setSmsMessageCount(Math.ceil(count / 160) || 1);
    }
  }, [message, sendType]);

  // Handler for file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(2),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };
  
  // Handler for removing attachments
  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(file => file.id !== id));
  };
  
  // Handler for applying a template
  const handleApplyTemplate = (template: MessageTemplate) => {
    const personalizedContent = template.content.replace(/\[Name\]/g, memberName);
    setSubject(template.subject);
    setMessage(personalizedContent);
    setActiveTab("compose");
  };
  
  // Handler for formatting text
  const handleFormatText = (format: TextFormat) => {
    if (format === 'bold') setIsTextBold(!isTextBold);
    if (format === 'italic') setIsTextItalic(!isTextItalic);
    if (format === 'bullet') setIsTextBullet(!isTextBullet);
  };
  

  
  // Handler for saving template
  const handleSaveTemplate = () => {
    if (!subject || !message) return;
    
    const newTemplate: MessageTemplate = {
      id: Math.random().toString(36).substring(2),
      name: `Template - ${subject.substring(0, 20)}${subject.length > 20 ? '...' : ''}`,
      subject,
      content: message
    };
    
    setTemplates(prev => [...prev, newTemplate]);
  };
  

  
  // Handler for removing recipients
  const handleRemoveRecipient = (type: RecipientType, id: string) => {
    if (type === 'to') {
      setRecipients(prev => prev.filter(r => r.id !== id));
    } else if (type === 'cc') {
      setCcRecipients(prev => prev.filter(r => r.id !== id));
    } else if (type === 'bcc') {
      setBccRecipients(prev => prev.filter(r => r.id !== id));
    }
  };
  
  // Handler for sending message
  const handleSend = () => {
    if (!message || !subject) return;
    
    setIsSending(true);
    
    // Prepare message data
    const messageData = {
      subject,
      message,
      sendType,
      recipients,
      ccRecipients: showCcBcc ? ccRecipients : [],
      bccRecipients: showCcBcc ? bccRecipients : [],
      attachments: sendType === 'email' ? attachments : [],
      isScheduled,
      scheduleDate: isScheduled ? scheduleDate : null,
      scheduleTime: isScheduled ? scheduleTime : null,
      sentAt: isScheduled ? null : new Date().toISOString(),
      formatting: {
        bold: isTextBold,
        italic: isTextItalic,
        bullet: isTextBullet
      }
    };
    
    // Simulate sending a message
    setTimeout(() => {
      console.log("Message data:", messageData);
      
      // Add to message history if not scheduled
      if (!isScheduled) {
        const newHistoryItem: MessageHistory = {
          id: Math.random().toString(36).substring(2),
          date: new Date().toISOString().split('T')[0],
          subject,
          content: message,
          type: sendType,
          status: 'sent'
        };
        
        setMessageHistory(prev => [newHistoryItem, ...prev]);
      }
      
      // Clear form and draft
      localStorage.removeItem("message_draft");
      setIsSending(false);
      setMessage("");
      setSubject("");
      setAttachments([]);
      setIsScheduled(false);
      setScheduleDate("");
      setScheduleTime("");
      setIsTextBold(false);
      setIsTextItalic(false);
      setIsTextBullet(false);
      
      onClose();
    }, 1500);
  };
  
  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-6 pb-6 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-8">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div>
                  <div className="mt-2 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-7 text-gray-900">
                      {isSending ? "Sending..." : "Send Message to " + memberName}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Send a message to {memberName} {sendType === "email" ? `at ${memberEmail}` : "via SMS"}.
                      </p>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="mt-6 border-b border-gray-200">
                      <div className="flex -mb-px space-x-6">
                        <TabButton 
                          active={activeTab === "compose"} 
                          onClick={() => setActiveTab("compose")} 
                          icon={<PencilIcon className="h-4 w-4" />} 
                          label="Compose" 
                        />
                        <TabButton 
                          active={activeTab === "templates"} 
                          onClick={() => setActiveTab("templates")} 
                          icon={<DocumentTextIcon className="h-4 w-4" />} 
                          label="Templates" 
                        />
                        <TabButton 
                          active={activeTab === "history"} 
                          onClick={() => setActiveTab("history")} 
                          icon={<InboxIcon className="h-4 w-4" />} 
                          label="History" 
                        />
                        <TabButton 
                          active={activeTab === "preview"} 
                          onClick={() => setActiveTab("preview")} 
                          icon={<EyeIcon className="h-4 w-4" />} 
                          label="Preview" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Area with increased spacing */}
                <div className="mt-6 space-y-6">
                  {/* Render the active tab */}
                  {activeTab === "compose" && (
                    <ComposeTab
                      subject={subject}
                      setSubject={setSubject}
                      message={message}
                      setMessage={setMessage}
                      sendType={sendType}
                      setSendType={setSendType}
                      recipients={recipients}
                      handleRemoveRecipient={handleRemoveRecipient}
                      ccRecipients={ccRecipients}
                      bccRecipients={bccRecipients}
                      showCcBcc={showCcBcc}
                      setShowCcBcc={setShowCcBcc}
                      isTextBold={isTextBold}
                      isTextItalic={isTextItalic}
                      isTextBullet={isTextBullet}
                      handleFormatText={handleFormatText}
                      showEmojiPicker={showEmojiPicker}
                      setShowEmojiPicker={setShowEmojiPicker}
                      attachments={attachments}
                      handleFileUpload={handleFileUpload}
                      handleRemoveAttachment={handleRemoveAttachment}
                      smsCharCount={smsCharCount}
                      smsMessageCount={smsMessageCount}
                      isScheduled={isScheduled}
                      setIsScheduled={setIsScheduled}
                      scheduleDate={scheduleDate}
                      setScheduleDate={setScheduleDate}
                      scheduleTime={scheduleTime}
                      setScheduleTime={setScheduleTime}
                      isDraftSaved={isDraftSaved}
                      fileInputRef={fileInputRef}
                    />
                  )}
                  
                  {activeTab === "templates" && (
                    <TemplatesTab
                      templates={templates}
                      handleApplyTemplate={handleApplyTemplate}
                      handleSaveTemplate={handleSaveTemplate}
                      hasCurrentContent={!!(subject && message)}
                    />
                  )}
                  
                  {activeTab === "history" && (
                    <HistoryTab messageHistory={messageHistory} />
                  )}
                  
                  {activeTab === "preview" && (
                    <PreviewTab
                      subject={subject}
                      message={message}
                      sendType={sendType}
                      isTextBold={isTextBold}
                      isTextItalic={isTextItalic}
                      isTextBullet={isTextBullet}
                      attachments={attachments}
                      recipients={recipients}
                      ccRecipients={ccRecipients}
                      bccRecipients={bccRecipients}
                      showCcBcc={showCcBcc}
                    />
                  )}
                  
                  {/* Emoji Picker moved to ComposeTab component for better positioning */}
                  
                  {/* Modal Footer - Send/Cancel Buttons */}
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <div className="sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-4">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        onClick={handleSend}
                        disabled={isSending || !message || !subject || activeTab !== "compose"}
                      >
                        {isSending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : isScheduled ? "Schedule Message" : "Send Message"}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
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