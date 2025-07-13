"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { 
  CalendarIcon, 
  ClockIcon, 
  XMarkIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useScheduledMessages, ScheduledMessage } from "@/graphql/hooks/useScheduledMessages";
import { usePermissions } from "@/hooks/usePermissions";
import EmptyState from "../components/EmptyState";

export default function ScheduledMessagesPage() {
  const { canManageMessages } = usePermissions();
  
  const [messageType, setMessageType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ScheduledMessage | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  // Fetch scheduled messages
  const { scheduledMessages, loading, error, refetch, cancelMessage, cancelling } = useScheduledMessages({
    messageType: messageType as any,
    status: 'PENDING',
    searchTerm
  });
  
  // Filter messages based on search term (client-side filtering as backup)
  const filteredMessages = scheduledMessages.filter(message => 
    !searchTerm || 
    message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle message cancellation
  const handleCancelMessage = async () => {
    if (!selectedMessage) return;
    
    const success = await cancelMessage(selectedMessage.id);
    if (success) {
      setIsCancelModalOpen(false);
      setSelectedMessage(null);
    }
  };
  
  // Format date for display
  const formatScheduledDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get icon for message type
  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'SMS':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />;
      case 'NOTIFICATION':
        return <BellIcon className="h-5 w-5 text-amber-500" />;
      default:
        return <EnvelopeIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0">Pending</Badge>;
      case 'SENT':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-0">Sent</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-0">Cancelled</Badge>;
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-0">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Scheduled Messages
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage your upcoming scheduled communications
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex items-center"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search scheduled messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filter
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <Tabs 
          value={messageType || "all"} 
          onValueChange={(value) => setMessageType(value === "all" ? null : value)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="EMAIL" className="flex items-center justify-center">
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              Email
            </TabsTrigger>
            <TabsTrigger value="SMS" className="flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="NOTIFICATION" className="flex items-center justify-center">
              <BellIcon className="h-4 w-4 mr-1" />
              Notifications
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Scheduled Messages List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading scheduled messages: {error.message}
          </AlertDescription>
        </Alert>
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="h-12 w-12 text-gray-400" />}
          title="No scheduled messages"
          description={
            searchTerm
              ? "Try adjusting your search or filters"
              : "Schedule messages to be sent at a later time"
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getMessageTypeIcon(message.messageType)}
                    <h3 className="text-lg font-medium text-gray-900">
                      {message.subject || message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')}
                    </h3>
                    {getStatusBadge(message.status)}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    {message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Scheduled for: {formatScheduledDate(message.scheduledFor)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{message.recipientCount} recipient{message.recipientCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                {canManageMessages && message.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    onClick={() => {
                      setSelectedMessage(message);
                      setIsCancelModalOpen(true);
                    }}
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Scheduled Message</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to cancel this scheduled message?</p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone. The message will not be sent at the scheduled time.
            </p>
            
            {selectedMessage && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  {getMessageTypeIcon(selectedMessage.messageType)}
                  <span className="font-medium">
                    {selectedMessage.subject || 'No subject'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Scheduled for: {formatScheduledDate(selectedMessage.scheduledFor)}
                </div>
                <div className="text-sm text-gray-600">
                  Recipients: {selectedMessage.recipientCount}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={cancelling}
            >
              Keep Scheduled
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelMessage}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
