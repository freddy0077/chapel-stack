"use client";

import { useState } from "react";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

// Mock SMS templates
const smsTemplates = [
  { id: 1, name: "Service Reminder", content: "Reminder: Our church service starts tomorrow at 10 AM. We hope to see you there!" },
  { id: 2, name: "Event Invitation", content: "You're invited to our [Event Name] on [Date] at [Time]. Please RSVP by replying YES or NO." },
  { id: 3, name: "Thank You", content: "Thank you for your contribution to our church community! Your support means a lot to us." },
];

// Common emojis for quick insertion
const commonEmojis = ["🙏", "❤️", "✝️", "🕊️", "🙌", "✨", "🎵", "📖", "🌈", "🔔"];

interface SmsEditorProps {
  content: string;
  onChangeContent: (content: string) => void;
}

export default function SmsEditor({ content, onChangeContent }: SmsEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [charCount, setCharCount] = useState(content.length);
  
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = parseInt(e.target.value);
    if (templateId) {
      const template = smsTemplates.find(t => t.id === templateId);
      if (template) {
        onChangeContent(template.content);
        setCharCount(template.content.length);
      }
    }
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeContent(e.target.value);
    setCharCount(e.target.value.length);
  };
  
  const insertEmoji = (emoji: string) => {
    onChangeContent(content + emoji);
    setCharCount(content.length + emoji.length);
  };

  // Calculate SMS segments (1 segment = 160 characters)
  const smsSegments = Math.ceil(charCount / 160);
  
  return (
    <div className="space-y-4">
      {/* Template selector */}
      <div>
        <label htmlFor="sms-template" className="block text-sm font-medium text-gray-700">
          SMS Template
        </label>
        <select
          id="sms-template"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleTemplateSelect}
          defaultValue=""
        >
          <option value="">Select a template</option>
          {smsTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* SMS content */}
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="sms-content" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <button
            type="button"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaceSmileIcon className="h-4 w-4 mr-1" />
            Add Emoji
          </button>
        </div>
        
        {showEmojiPicker && (
          <div className="my-2 p-2 border border-gray-200 rounded-md bg-white">
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className="text-xl hover:bg-gray-100 rounded p-1"
                  onClick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <textarea
          id="sms-content"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-[120px]"
          placeholder="Type your SMS message here..."
          value={content}
          onChange={handleContentChange}
          required
        />
        
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{charCount} characters</span>
          <span>{smsSegments} SMS segment{smsSegments !== 1 ? 's' : ''} (160 chars each)</span>
        </div>
      </div>
    </div>
  );
}
