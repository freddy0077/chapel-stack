"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/graphql/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useMessages } from "@/graphql/hooks/useMessages";
import { Message } from "../components/MessagesList";
import MessageModal from "../components/MessageModal";
import NewMessageModal from "../components/NewMessageModal";

// UI Components
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// Icons
import {
  EnvelopeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  XCircleIcon,
  CheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function MessagesPage() {
  const { user } = useAuth();
  const { isSuperAdmin, isBranchAdmin } = usePermissions();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageType, setMessageType] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get branch ID from user context
  const branchId = user?.userBranches && user.userBranches.length > 0 
    ? user.userBranches[0]?.branch?.id 
    : undefined;
  
  // Fetch messages with proper branch filtering
  const { messages, loading, error, refetch } = useMessages(branchId);

  // Filter messages based on search term and type
  const filteredMessages = messages.filter((message) => {
    const matchesSearch = searchTerm === "" || 
      (('subject' in message && message.subject?.toLowerCase().includes(searchTerm.toLowerCase())) ||
       ('title' in message && message.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
       ('body' in message && message.body?.toLowerCase().includes(searchTerm.toLowerCase())) ||
       ('message' in message && message.message?.toLowerCase().includes(searchTerm.toLowerCase())));
       
    const matchesType = messageType === "all" || 
      (messageType === "email" && 'subject' in message) ||
      (messageType === "sms" && 'body' in message) ||
      (messageType === "notification" && 'title' in message);
      
    return matchesSearch && matchesType;
  });

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get message status badge styling
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch(status.toLowerCase()) {
      case "sent":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
      case "sending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Get message type icon
  const getMessageTypeIcon = (message: Message) => {
    if ('subject' in message) {
      return <EnvelopeIcon className="h-5 w-5 text-indigo-500" />;
    } else if ('body' in message) {
      return <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500" />;
    } else {
      return <BellIcon className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Gradient header */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-600 shadow-lg backdrop-blur-md rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-start gap-4 w-full md:w-auto">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow">Communication Center</h1>
              <p className="text-white/90 max-w-2xl text-base">
                Send and manage messages across multiple channels. Reach your congregation through email, SMS, and in-app notifications.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setNewMessageOpen(true)}
            className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-indigo-700 font-bold shadow-lg hover:bg-indigo-50 transition"
            size="lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter and Search Card */}
        <Card className="mb-6 border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={messageType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMessageType("all")}
                  className="rounded-full"
                >
                  All
                </Button>
                <Button
                  variant={messageType === "email" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMessageType("email")}
                  className="rounded-full"
                >
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button
                  variant={messageType === "sms" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMessageType("sms")}
                  className="rounded-full"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  SMS
                </Button>
                <Button
                  variant={messageType === "notification" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMessageType("notification")}
                  className="rounded-full"
                >
                  <BellIcon className="h-4 w-4 mr-1" />
                  Notifications
                </Button>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:w-64">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  className={`${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table Card */}
        <Card className="overflow-hidden border-none shadow-xl">
          <CardHeader className="bg-gray-50 border-b border-gray-100 py-4 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-800">Messages</CardTitle>
              <div className="text-sm text-gray-500">
                {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center">
                  <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center">
                  <XCircleIcon className="h-12 w-12 text-red-500 mb-3" />
                  <p className="text-gray-700 font-medium">Failed to load messages</p>
                  <p className="text-gray-500 mt-1">Please try refreshing the page</p>
                  <Button onClick={handleRefresh} variant="outline" className="mt-4">
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center">
                  <EnvelopeIcon className="h-12 w-12 text-indigo-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Messages Found</h3>
                  <p className="text-gray-500 text-center max-w-sm mt-2">
                    {searchTerm || messageType !== "all" 
                      ? "Try changing your search or filter settings."
                      : "When you send or receive messages, they will appear here."}
                  </p>
                  <Button onClick={() => setNewMessageOpen(true)} className="mt-6">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Message
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Subject</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow 
                        key={message.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {getMessageTypeIcon(message)}
                            </div>
                            <div className="truncate max-w-[250px]">
                              {('subject' in message && message.subject) || 
                               ('title' in message && message.title) || 
                               ('body' in message && message.body?.substring(0, 30)) || 
                               'Untitled'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[120px]">
                            {'senderEmail' in message ? message.senderEmail : 
                             ('senderNumber' in message ? message.senderNumber : 
                              (message.memberId || ''))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <UserGroupIcon className="mr-1 h-4 w-4 text-gray-400" />
                            <span className="truncate max-w-[120px]">
                              {Array.isArray(message.recipients) 
                                ? `${message.recipients.length} recipient${message.recipients.length !== 1 ? 's' : ''}`
                                : ''}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-500">
                            <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" />
                            {formatDate(message.sentAt || message.createdAt || message.updatedAt || '')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            'status' in message && message.status 
                              ? getStatusBadge(message.status) 
                              : ('type' in message 
                                  ? getStatusBadge(message.type) 
                                  : 'bg-gray-100 text-gray-800')
                          }`}>
                            {('status' in message && message.status) || 
                             ('type' in message && message.type) || 
                             'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessage(message);
                            }}
                          >
                            <span className="sr-only">View</span>
                            <ChevronRightIcon className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between bg-gray-50 border-t border-gray-100 py-3 px-6">
            <div className="text-sm text-gray-500">
              {isSuperAdmin || isBranchAdmin ? (
                <span className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  You have permission to manage all messages
                </span>
              ) : (
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-amber-500 mr-1" />
                  Showing your branch messages only
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewMessageOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Message
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Message Modal */}
      <MessageModal message={selectedMessage} onClose={() => setSelectedMessage(null)} />
      
      {/* New Message Modal */}
      <NewMessageModal open={newMessageOpen} onClose={() => setNewMessageOpen(false)} />
    </div>
  );
}
