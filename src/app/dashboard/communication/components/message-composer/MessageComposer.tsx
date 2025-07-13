"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import MediaAttachmentUploader, { MediaAttachment } from "./MediaAttachmentUploader";

interface MessageComposerProps {
  messageType: "EMAIL" | "SMS" | "NOTIFICATION";
  subject: string;
  content: string;
  onSubjectChange: (subject: string) => void;
  onContentChange: (content: string) => void;
  attachments?: MediaAttachment[];
  onAttachmentsChange?: (attachments: MediaAttachment[]) => void;
}

export default function MessageComposer({
  messageType,
  subject,
  content,
  onSubjectChange,
  onContentChange,
  attachments = [],
  onAttachmentsChange = () => {}
}: MessageComposerProps) {
  // Character limit for SMS
  const SMS_CHAR_LIMIT = 160;
  
  // Calculate remaining characters for SMS
  const remainingChars = SMS_CHAR_LIMIT - content.length;
  
  // Show attachment uploader state
  const [showAttachments, setShowAttachments] = useState(false);
  
  // Determine if attachments are allowed for this message type
  const allowAttachments = messageType === "EMAIL"; // Only allow attachments for email for now
  
  return (
    <div className="space-y-4">
      {/* Subject field (Email only) */}
      {messageType === "EMAIL" && (
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>
      )}
      
      {/* Message content */}
      <div>
        <div className="flex justify-between mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          
          {/* Character counter for SMS */}
          {messageType === "SMS" && (
            <span className={`text-xs ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {remainingChars} characters remaining
            </span>
          )}
        </div>
        
        {messageType === "EMAIL" ? (
          // Rich text editor for email
          <div className="border rounded-md">
            <Textarea
              id="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Compose your message..."
              className="min-h-[200px]"
            />
          </div>
        ) : (
          // Simple textarea for SMS and notifications
          <Textarea
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={
              messageType === "SMS"
                ? "Type your SMS message..."
                : "Type your notification message..."
            }
            className={`min-h-[120px] ${
              messageType === "SMS" && remainingChars < 0 ? "border-red-500" : ""
            }`}
          />
        )}
        
        {/* Warning for SMS character limit */}
        {messageType === "SMS" && remainingChars < 0 && (
          <p className="text-xs text-red-500 mt-1">
            Your message exceeds the character limit and may be split into multiple messages.
          </p>
        )}
      </div>
      
      {/* Attachments section (Email only) */}
      {allowAttachments && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAttachments(!showAttachments)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <PaperClipIcon className="h-4 w-4 mr-1" />
              {showAttachments ? "Hide attachments" : `Attachments${attachments.length > 0 ? ` (${attachments.length})` : ''}`}
            </button>
            
            {attachments.length > 0 && !showAttachments && (
              <span className="text-xs text-gray-500">
                {attachments.length} file{attachments.length !== 1 ? 's' : ''} attached
              </span>
            )}
          </div>
          
          {showAttachments && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <MediaAttachmentUploader
                attachments={attachments}
                onChange={onAttachmentsChange}
                maxSize={10} // 10MB
                maxFiles={5}
                allowedTypes={["image/*", "application/pdf", "audio/*"]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
