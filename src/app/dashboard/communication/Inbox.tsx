import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Data
const CONVERSATIONS = [
  {
    id: 1,
    name: "Jane Smith",
    lastMessage: "That sounds great! See you then.",
    time: "10:42 AM",
    unread: true,
  },
  {
    id: 2,
    name: "Youth Group",
    lastMessage: "Reminder: Pizza night this Friday at 6 PM!",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    name: "Pastor John",
    lastMessage: "Can you please prepare the slides for Sunday?",
    time: "3d ago",
    unread: false,
  },
  {
    id: 4,
    name: "Choir Practice",
    lastMessage: "We are meeting in the main hall this week.",
    time: "Mar 12",
    unread: true,
  },
];

const MESSAGES = {
  1: [
    {
      from: "Jane Smith",
      text: "Hey, are we still on for the meeting tomorrow?",
      time: "10:30 AM",
      sent: false,
    },
    {
      from: "You",
      text: "Yes, absolutely! Looking forward to it.",
      time: "10:35 AM",
      sent: true,
    },
    {
      from: "Jane Smith",
      text: "That sounds great! See you then.",
      time: "10:42 AM",
      sent: false,
    },
  ],
  2: [
    {
      from: "Youth Group",
      text: "Reminder: Pizza night this Friday at 6 PM!",
      time: "Yesterday",
      sent: false,
    },
  ],
  3: [
    {
      from: "Pastor John",
      text: "Can you please prepare the slides for Sunday?",
      time: "3d ago",
      sent: false,
    },
  ],
  4: [
    {
      from: "Choir Practice",
      text: "We are meeting in the main hall this week.",
      time: "Mar 12",
      sent: false,
    },
  ],
};

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(
    CONVERSATIONS[0],
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Left Pane: Conversation List */}
      <Card className="w-1/3 flex flex-col shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
          <Input placeholder="Search conversations..." className="mt-2" />
        </div>
        <div className="flex-grow overflow-y-auto">
          {CONVERSATIONS.map((convo) => (
            <div
              key={convo.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedConversation.id === convo.id ? "bg-violet-50" : ""}`}
              onClick={() => setSelectedConversation(convo)}
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-gray-800">{convo.name}</div>
                <div className="text-xs text-gray-500">{convo.time}</div>
              </div>
              <p
                className={`text-sm mt-1 ${convo.unread ? "text-gray-800 font-medium" : "text-gray-500"}`}
              >
                {convo.lastMessage.substring(0, 40)}...
              </p>
              {convo.unread && (
                <Badge className="mt-2 bg-violet-500">New</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Right Pane: Conversation View */}
      <Card className="w-2/3 flex flex-col shadow-sm">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedConversation.name}
              </h3>
              <Button variant="outline">Conversation Details</Button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50 space-y-4">
              {MESSAGES[selectedConversation.id].map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-lg ${msg.sent ? "bg-violet-600 text-white" : "bg-white border"}`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-xs mt-1 ${msg.sent ? "text-violet-200" : "text-gray-400"} text-right`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-white">
              <div className="relative">
                <Input
                  placeholder={`Message ${selectedConversation.name}...`}
                  className="pr-24"
                />
                <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Select a conversation to start messaging.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
