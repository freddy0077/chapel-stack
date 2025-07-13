"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  XMarkIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon,
  ArrowPathIcon,
  ForwardIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { useMessageById } from "@/graphql/hooks/useMessages";
import { usePermissions } from "@/hooks/usePermissions";

interface MessageModalProps {
  messageId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageModal({ messageId, isOpen, onClose }: MessageModalProps) {
  const [messageType, setMessageType] = useState<string>("email");
  const { canSendMessages } = usePermissions();
  
  // Fetch message details
  const { message, loading, error } = useMessageById(messageId, messageType);
  
  // Handle forward message
  const handleForward = () => {
    // Implementation will be added later
    console.log("Forward message:", messageId);
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Determine message type from message data
  const determineMessageType = (msg: any): string => {
    if (!msg) return "unknown";
    if ('subject' in msg) return "email";
    if ('body' in msg) return "sms";
    return "notification";
  };
  
  // Get message type icon
  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-6 w-6 text-blue-500" />;
      case 'sms':
        return <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500" />;
      case 'notification':
        return <BellIcon className="h-6 w-6 text-amber-500" />;
      default:
        return <EnvelopeIcon className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    let color = "";
    let icon = null;
    
    switch (status.toLowerCase()) {
      case 'sent':
      case 'delivered':
        color = "bg-green-100 text-green-800";
        icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
        break;
      case 'failed':
        color = "bg-red-100 text-red-800";
        icon = <ExclamationCircleIcon className="h-4 w-4 mr-1" />;
        break;
      case 'pending':
      case 'processing':
        color = "bg-yellow-100 text-yellow-800";
        icon = <ClockIcon className="h-4 w-4 mr-1" />;
        break;
      case 'scheduled':
        color = "bg-purple-100 text-purple-800";
        icon = <ClockIcon className="h-4 w-4 mr-1" />;
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    
    return (
      <Badge variant="outline" className={`${color} border-0 flex items-center`}>
        {icon}
        {status}
      </Badge>
    );
  };
  
  // Render message content based on type
  const renderMessageContent = () => {
    if (!message) return null;
    
    const type = determineMessageType(message);
    
    switch (type) {
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Subject</h3>
              <p className="text-base font-medium">{message.subject}</p>
            </div>
            
            {message.bodyHtml ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Content</h3>
                <div 
                  className="prose max-w-none mt-1 p-4 border rounded-md bg-white"
                  dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
                />
              </div>
            ) : message.bodyText ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Content</h3>
                <div className="whitespace-pre-wrap mt-1 p-4 border rounded-md bg-white">
                  {message.bodyText}
                </div>
              </div>
            ) : null}
          </div>
        );
        
      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Message</h3>
              <div className="whitespace-pre-wrap mt-1 p-4 border rounded-md bg-white">
                {message.body}
              </div>
            </div>
          </div>
        );
        
      case 'notification':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="text-base font-medium">{message.title}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Message</h3>
              <div className="whitespace-pre-wrap mt-1 p-4 border rounded-md bg-white">
                {message.message}
              </div>
            </div>
            
            {message.link && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Link</h3>
                <a 
                  href={message.link} 
                  className="text-blue-600 hover:underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {message.link}
                </a>
              </div>
            )}
          </div>
        );
        
      default:
        return <p>Unknown message type</p>;
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                <Card>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-4 flex justify-between items-center">
                    <Dialog.Title as="h3" className="text-lg font-medium text-white flex items-center">
                      {loading ? (
                        <Skeleton className="h-6 w-32" />
                      ) : message ? (
                        <>
                          {getMessageTypeIcon(determineMessageType(message))}
                          <span className="ml-2">
                            Message Details
                          </span>
                        </>
                      ) : (
                        <span>Message Details</span>
                      )}
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
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-32 w-full" />
                        <div className="flex space-x-4">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    ) : error ? (
                      <Alert variant="destructive">
                        <AlertDescription>
                          Error loading message: {error.message}
                        </AlertDescription>
                      </Alert>
                    ) : message ? (
                      <div className="space-y-6">
                        {/* Message details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <div className="mt-1">
                              {getStatusBadge(message.status)}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              {message.sentAt ? "Sent At" : "Created At"}
                            </h3>
                            <p className="text-sm">
                              {formatDate(message.sentAt || message.createdAt)}
                            </p>
                          </div>
                          
                          {determineMessageType(message) === 'email' && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">From</h3>
                              <p className="text-sm">{message.senderEmail}</p>
                            </div>
                          )}
                          
                          {determineMessageType(message) === 'sms' && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">From</h3>
                              <p className="text-sm">{message.senderNumber}</p>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Recipients</h3>
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 text-gray-500 mr-1" />
                              <p className="text-sm">
                                {Array.isArray(message.recipients) 
                                  ? `${message.recipients.length} recipients` 
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Message content */}
                        <div className="mt-4">
                          {renderMessageContent()}
                        </div>
                      </div>
                    ) : (
                      <p>No message found</p>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                    
                    {canSendMessages && message && (
                      <Button
                        onClick={handleForward}
                        className="flex items-center"
                      >
                        <ForwardIcon className="h-4 w-4 mr-1" />
                        Forward
                      </Button>
                    )}
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
