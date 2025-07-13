"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  EyeIcon,
  CheckCircleIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "../EmptyState";
import MessageModal from "./MessageModal";

interface RecentMessagesProps {
  limit?: number;
}

export default function RecentMessages({ limit = 10 }: RecentMessagesProps) {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  
  // Mock messages data since the backend doesn't have the messages query yet
  const mockMessages = [
    {
      id: "msg-1",
      type: "EMAIL",
      subject: "Sunday Service Reminder",
      content: "Don't forget about our special Sunday service this weekend!",
      recipientCount: 124,
      status: "SENT",
      createdAt: "2025-07-10T09:30:00Z",
      stats: { openRate: 0.67, clickRate: 0.32, deliveryRate: 0.98 }
    },
    {
      id: "msg-2",
      type: "SMS",
      subject: "",
      content: "Youth group meeting tonight at 7pm in the fellowship hall.",
      recipientCount: 45,
      status: "DELIVERED",
      createdAt: "2025-07-11T14:15:00Z",
      stats: { openRate: 0, clickRate: 0, deliveryRate: 0.95 }
    },
    {
      id: "msg-3",
      type: "NOTIFICATION",
      subject: "Prayer Request",
      content: "New prayer request submitted. Please check the prayer board.",
      recipientCount: 12,
      status: "OPENED",
      createdAt: "2025-07-12T11:45:00Z",
      stats: { openRate: 0.83, clickRate: 0.5, deliveryRate: 1.0 }
    },
    {
      id: "msg-4",
      type: "EMAIL",
      subject: "Monthly Newsletter",
      content: "Here's our monthly newsletter with all the latest church updates and events.",
      recipientCount: 230,
      status: "SENT",
      createdAt: "2025-07-05T08:00:00Z",
      stats: { openRate: 0.58, clickRate: 0.25, deliveryRate: 0.97 }
    },
    {
      id: "msg-5",
      type: "SMS",
      subject: "",
      content: "Service canceled due to weather. Stay safe!",
      recipientCount: 185,
      status: "DELIVERED",
      createdAt: "2025-07-02T16:30:00Z",
      stats: { openRate: 0, clickRate: 0, deliveryRate: 0.99 }
    }
  ];
  
  // Limit the number of messages based on the prop
  const messages = mockMessages.slice(0, limit);
  
  // Message type icon and color
  const getMessageTypeInfo = (type: string) => {
    switch (type) {
      case "EMAIL":
        return {
          icon: <EnvelopeIcon className="h-4 w-4" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600"
        };
      case "SMS":
        return {
          icon: <ChatBubbleLeftRightIcon className="h-4 w-4" />,
          bgColor: "bg-purple-100",
          textColor: "text-purple-600"
        };
      case "NOTIFICATION":
        return {
          icon: <BellIcon className="h-4 w-4" />,
          bgColor: "bg-amber-100",
          textColor: "text-amber-600"
        };
      default:
        return {
          icon: <EnvelopeIcon className="h-4 w-4" />,
          bgColor: "bg-slate-100",
          textColor: "text-slate-600"
        };
    }
  };
  
  // Message status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">Sent</Badge>;
      case "DELIVERED":
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">Delivered</Badge>;
      case "OPENED":
        return <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">Opened</Badge>;
      case "FAILED":
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0">Failed</Badge>;
      case "SCHEDULED":
        return <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <>
      <div className="space-y-3">
        {messages.map((message: any) => {
          const typeInfo = getMessageTypeInfo(message.type);
          
          return (
            <div 
              key={message.id}
              className="group flex items-center justify-between p-4 border-0 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${typeInfo.bgColor} ${typeInfo.textColor} group-hover:scale-110 transition-transform duration-200`}>
                  {typeInfo.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {message.type === "EMAIL" ? message.subject : message.content.substring(0, 30) + (message.content.length > 30 ? "..." : "")}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span className="font-medium text-gray-500">{message.recipientCount} recipients</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{format(new Date(message.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(message.status)}
                
                {message.type === "EMAIL" && (
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex items-center text-xs font-medium text-blue-600">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      {Math.round(message.stats.openRate * 100)}% opened
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full" 
                        style={{ width: `${Math.round(message.stats.openRate * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {message.type === "SMS" && (
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex items-center text-xs font-medium text-purple-600">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      {Math.round(message.stats.deliveryRate * 100)}% delivered
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-1 rounded-full" 
                        style={{ width: `${Math.round(message.stats.deliveryRate * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <ChevronRightIcon className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </>
  );
}
