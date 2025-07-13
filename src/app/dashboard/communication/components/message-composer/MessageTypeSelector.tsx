"use client";

import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";

interface MessageTypeSelectorProps {
  selectedType: "EMAIL" | "SMS" | "NOTIFICATION";
  onSelectType: (type: string) => void;
}

export default function MessageTypeSelector({ 
  selectedType, 
  onSelectType 
}: MessageTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant={selectedType === "EMAIL" ? "default" : "outline"}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
          selectedType === "EMAIL" 
            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg" 
            : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
        }`}
        onClick={() => onSelectType("EMAIL")}
      >
        <div className={`rounded-full ${selectedType === "EMAIL" ? "bg-white/20" : "bg-blue-100"} p-1`}>
          <EnvelopeIcon className={`h-4 w-4 ${selectedType === "EMAIL" ? "text-white" : "text-blue-600"}`} />
        </div>
        Email
      </Button>
      
      <Button
        type="button"
        variant={selectedType === "SMS" ? "default" : "outline"}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
          selectedType === "SMS" 
            ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg" 
            : "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
        }`}
        onClick={() => onSelectType("SMS")}
      >
        <div className={`rounded-full ${selectedType === "SMS" ? "bg-white/20" : "bg-purple-100"} p-1`}>
          <ChatBubbleLeftRightIcon className={`h-4 w-4 ${selectedType === "SMS" ? "text-white" : "text-purple-600"}`} />
        </div>
        SMS
      </Button>
      
      <Button
        type="button"
        variant={selectedType === "NOTIFICATION" ? "default" : "outline"}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
          selectedType === "NOTIFICATION" 
            ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg" 
            : "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
        }`}
        onClick={() => onSelectType("NOTIFICATION")}
      >
        <div className={`rounded-full ${selectedType === "NOTIFICATION" ? "bg-white/20" : "bg-amber-100"} p-1`}>
          <BellIcon className={`h-4 w-4 ${selectedType === "NOTIFICATION" ? "text-white" : "text-amber-600"}`} />
        </div>
        Notification
      </Button>
    </div>
  );
}
