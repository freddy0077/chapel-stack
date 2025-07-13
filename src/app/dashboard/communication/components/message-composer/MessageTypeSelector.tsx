"use client";

import { EnvelopeIcon, ChatBubbleLeftRightIcon, BellIcon } from "@heroicons/react/24/outline";

export type MessageType = "email" | "sms" | "notification";

interface MessageTypeSelectorProps {
  messageType: MessageType;
  onChangeType: (type: MessageType) => void;
}

export default function MessageTypeSelector({ messageType, onChangeType }: MessageTypeSelectorProps) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        type="button"
        className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors flex items-center justify-center ${
          messageType === "email" 
            ? "bg-indigo-600 border-indigo-600 text-white" 
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => onChangeType("email")}
      >
        <EnvelopeIcon className="h-4 w-4 mr-1.5" />
        Email
      </button>
      
      <button
        type="button"
        className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors flex items-center justify-center ${
          messageType === "sms" 
            ? "bg-indigo-600 border-indigo-600 text-white" 
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => onChangeType("sms")}
      >
        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
        SMS
      </button>
      
      <button
        type="button"
        className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors flex items-center justify-center ${
          messageType === "notification" 
            ? "bg-indigo-600 border-indigo-600 text-white" 
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => onChangeType("notification")}
      >
        <BellIcon className="h-4 w-4 mr-1.5" />
        Notification
      </button>
    </div>
  );
}
