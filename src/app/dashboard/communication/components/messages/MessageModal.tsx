"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  XMarkIcon,
  ArrowUturnRightIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  CursorArrowRaysIcon
} from "@heroicons/react/24/outline";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: any | null;
}

export default function MessageModal({ isOpen, onClose, message }: MessageModalProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  if (!message) return null;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get icon and colors for message type
  const getMessageTypeInfo = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return {
          icon: <EnvelopeIcon className="h-6 w-6" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          gradientFrom: "from-blue-500",
          gradientTo: "to-blue-600"
        };
      case 'SMS':
        return {
          icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
          bgColor: "bg-purple-100",
          textColor: "text-purple-600",
          gradientFrom: "from-purple-500",
          gradientTo: "to-purple-600"
        };
      case 'NOTIFICATION':
        return {
          icon: <BellIcon className="h-6 w-6" />,
          bgColor: "bg-amber-100",
          textColor: "text-amber-600",
          gradientFrom: "from-amber-500",
          gradientTo: "to-amber-600"
        };
      default:
        return {
          icon: <EnvelopeIcon className="h-6 w-6" />,
          bgColor: "bg-slate-100",
          textColor: "text-slate-600",
          gradientFrom: "from-slate-500",
          gradientTo: "to-slate-600"
        };
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">Sent</Badge>;
      case 'DELIVERED':
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">Delivered</Badge>;
      case 'OPENED':
        return <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">Opened</Badge>;
      case 'FAILED':
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0">Failed</Badge>;
      case 'PENDING':
        return <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Copy message content to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const typeInfo = getMessageTypeInfo(message.type || message.messageType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0 shadow-xl">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${typeInfo.gradientFrom} ${typeInfo.gradientTo} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-full bg-white/20 p-2 backdrop-blur-sm`}>
                {typeInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {message.subject || (message.content?.substring(0, 30) + (message.content?.length > 30 ? "..." : ""))}
                </h2>
                <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                  <span>{message.type || message.messageType}</span>
                  <span>•</span>
                  <span>{formatDate(message.createdAt)}</span>
                </div>
              </div>
            </div>
            {getStatusBadge(message.status)}
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Message Details */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full ${typeInfo.bgColor} ${typeInfo.textColor} p-2`}>
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Recipients</h3>
                    <p className="font-semibold">{message.recipientCount} recipient{message.recipientCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 text-green-600 p-2">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sent</h3>
                    <p className="font-semibold">{formatDate(message.createdAt)}</p>
                  </div>
                </div>
                
                {message.scheduledFor && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-amber-100 text-amber-600 p-2">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Scheduled For</h3>
                      <p className="font-semibold">{formatDate(message.scheduledFor)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* Message Content */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className={`h-1 bg-gradient-to-r ${typeInfo.gradientFrom} ${typeInfo.gradientTo}`}></div>
            <div className="p-4 relative">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(message.content)}
                  className="text-gray-500 hover:text-gray-700 group"
                >
                  {copySuccess ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <DocumentDuplicateIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  )}
                  <span className="sr-only">Copy content</span>
                </Button>
              </div>
              
              <h3 className="text-sm font-medium text-gray-500 mb-3">Content</h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-100">
                {(message.type || message.messageType) === 'EMAIL' ? (
                  <div dangerouslySetInnerHTML={{ __html: message.content }} />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          </Card>
          
          {/* Message Stats */}
          {(message.type || message.messageType) === 'EMAIL' && message.stats && (
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">Delivered</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {Math.round(message.stats.deliveryRate * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={message.stats.deliveryRate * 100} 
                      className="h-1.5 bg-blue-100" 
                      indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-indigo-100 p-1.5">
                          <EyeIcon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium">Opened</span>
                      </div>
                      <span className="font-bold text-indigo-600">
                        {Math.round(message.stats.openRate * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={message.stats.openRate * 100} 
                      className="h-1.5 bg-indigo-100" 
                      indicatorClassName="bg-gradient-to-r from-indigo-500 to-indigo-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-purple-100 p-1.5">
                          <CursorArrowRaysIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">Clicked</span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {Math.round(message.stats.clickRate * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={message.stats.clickRate * 100} 
                      className="h-1.5 bg-purple-100" 
                      indicatorClassName="bg-gradient-to-r from-purple-500 to-purple-600"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {/* Error Message */}
          {message.errorMessage && (
            <Alert variant="destructive" className="border-0 shadow-md">
              <AlertDescription>
                Error: {message.errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex justify-between p-6 bg-gray-50 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Close
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ArrowUturnRightIcon className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
