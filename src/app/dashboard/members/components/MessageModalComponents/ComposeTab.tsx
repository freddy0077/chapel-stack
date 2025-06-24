"use client";

import React, { useRef } from 'react';
import { XMarkIcon, PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import { FileAttachment, MessageType, Recipient, RecipientType, TextFormat } from './types';
import EmojiPicker from "./EmojiPicker";

interface ComposeTabProps {
  subject: string;
  setSubject: (subject: string) => void;
  message: string;
  setMessage: (message: string) => void;
  sendType: MessageType;
  setSendType: (type: MessageType) => void;
  recipients: Recipient[];
  handleRemoveRecipient: (type: RecipientType, id: string) => void;
  ccRecipients: Recipient[];
  bccRecipients: Recipient[];
  showCcBcc: boolean;
  setShowCcBcc: (show: boolean) => void;
  isTextBold: boolean;
  isTextItalic: boolean; 
  isTextBullet: boolean;
  handleFormatText: (format: TextFormat) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleAddEmoji?: (emoji: string) => void;
  attachments: FileAttachment[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAttachment: (id: string) => void;
  smsCharCount: number;
  smsMessageCount: number;
  isScheduled: boolean;
  setIsScheduled: (scheduled: boolean) => void;
  scheduleDate: string;
  setScheduleDate: (date: string) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  isDraftSaved: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
}

const ComposeTab: React.FC<ComposeTabProps> = ({
  subject,
  setSubject,
  message,
  setMessage,
  sendType,
  setSendType,
  recipients,
  handleRemoveRecipient,
  ccRecipients,
  bccRecipients,
  showCcBcc,
  setShowCcBcc,
  isTextBold,
  isTextItalic,
  isTextBullet,
  handleFormatText,
  showEmojiPicker,
  setShowEmojiPicker,
  attachments,
  handleFileUpload,
  handleRemoveAttachment,
  smsCharCount,
  smsMessageCount,
  isScheduled,
  setIsScheduled,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  isDraftSaved,
  fileInputRef
}) => {
  // Use provided fileInputRef or create a local one
  const localFileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = fileInputRef || localFileInputRef;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Recipients section with CC/BCC */}
      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">To:</label>
          {!showCcBcc && (
            <button
              type="button"
              onClick={() => setShowCcBcc(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Add Cc/Bcc
            </button>
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[40px]">
          {recipients.map((recipient) => (
            <span 
              key={recipient.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {recipient.name}
              <button
                type="button"
                onClick={() => handleRemoveRecipient('to', recipient.id)}
                className="ml-1.5 inline-flex text-indigo-500 hover:text-indigo-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* CC/BCC fields */}
      {showCcBcc && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cc:</label>
            <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[40px]">
              {ccRecipients.map((recipient) => (
                <span 
                  key={recipient.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {recipient.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient('cc', recipient.id)}
                    className="ml-1.5 inline-flex text-gray-500 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bcc:</label>
            <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[40px]">
              {bccRecipients.map((recipient) => (
                <span 
                  key={recipient.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {recipient.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient('bcc', recipient.id)}
                    className="ml-1.5 inline-flex text-gray-500 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Message type selector */}
      <div className="flex items-center justify-start space-x-4 mb-4">
        <div className="flex items-center">
          <input
            id="email"
            name="notification-method"
            type="radio"
            checked={sendType === "email"}
            onChange={() => setSendType("email")}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label htmlFor="email" className="ml-2 block text-sm font-medium text-gray-900">
            Email
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="sms"
            name="notification-method"
            type="radio"
            checked={sendType === "sms"}
            onChange={() => setSendType("sms")}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label htmlFor="sms" className="ml-2 block text-sm font-medium text-gray-900">
            SMS
          </label>
        </div>
      </div>
      
      {/* Subject field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Message subject"
        />
      </div>
      
      {/* Rich text toolbar for email */}
      {sendType === "email" && (
        <div className="flex space-x-2 border-b pb-2">
          <button
            type="button"
            onClick={() => handleFormatText('bold')}
            className={`p-1 rounded ${isTextBold ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Bold"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormatText('italic')}
            className={`p-1 rounded ${isTextItalic ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Italic"
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormatText('bullet')}
            className={`p-1 rounded ${isTextBullet ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Bullet List"
          >
            • List
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 rounded hover:bg-gray-100"
              title="Add Emoji"
            >
              <FaceSmileIcon className="h-5 w-5 text-gray-500" />
            </button>
            
            {/* Emoji Picker positioned relative to its button */}
            {showEmojiPicker && (
              <div className="absolute right-0 bottom-10 z-50">
                <EmojiPicker onEmojiSelect={(emoji: string) => {
                  // Add emoji to the message
                  const newMessage = message + emoji;
                  setMessage(newMessage);
                  setShowEmojiPicker(false);
                }} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="p-1 rounded hover:bg-gray-100"
            title="Attach File"
          >
            <PaperClipIcon className="h-5 w-5 text-gray-500" />
          </button>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
        </div>
      )}
      
      {/* Message content */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <div className="mt-1">
          <textarea
            id="message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              isTextBold ? 'font-bold' : ''
            } ${isTextItalic ? 'italic' : ''}`}
            placeholder="Type your message here..."
          />
        </div>
        
        {/* SMS character counter */}
        {sendType === "sms" && (
          <div className="mt-1 text-sm text-gray-500 flex justify-between">
            <span>{smsCharCount} characters</span>
            <span>{smsMessageCount} message{smsMessageCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        {/* Draft indicator */}
        {isDraftSaved && (
          <div className="mt-1 text-sm text-green-600">
            Draft saved
          </div>
        )}
      </div>
      
      {/* File attachments (for email only) */}
      {sendType === "email" && attachments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
            {attachments.map((file) => (
              <li key={file.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center">
                  <span className="text-xs text-gray-500 mr-3">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(file.id)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Scheduled message option */}
      <div className="mt-4">
        <div className="flex items-center">
          <input
            id="scheduled"
            name="scheduled"
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="scheduled" className="ml-2 block text-sm text-gray-900">
            Schedule for later
          </label>
        </div>
        
        {isScheduled && (
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="scheduleDate"
                name="scheduleDate"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                id="scheduleTime"
                name="scheduleTime"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposeTab;
