import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichHtmlEditor } from './RichHtmlEditor';
import SmsPreview from './SmsPreview';
import EmailPreview from './EmailPreview';
import AttachmentUploader from '../AttachmentUploader';
import { EmailTemplate } from './RichHtmlEditor';

interface MessageContentProps {
  selectedChannels: string[];
  subject: string;
  setSubject: (subject: string) => void;
  body: string;
  setBody: (body: string) => void;
  selectedTemplate: EmailTemplate | null;
  setSelectedTemplate: (template: EmailTemplate | null) => void;
  onInsertTemplate: (html: string) => void;
  onInsertSmsPlaceholder: (placeholder: string) => void;
  onInsertEmailPlaceholder: (placeholder: string) => void;
  getTotalRecipientCount: () => number;
  customPlaceholders?: { key: string; value: string }[];
}

export default function MessageContent({
  selectedChannels,
  subject,
  setSubject,
  body,
  setBody,
  selectedTemplate,
  setSelectedTemplate,
  onInsertTemplate,
  onInsertSmsPlaceholder,
  onInsertEmailPlaceholder,
  getTotalRecipientCount,
  customPlaceholders = []
}: MessageContentProps) {
  const smsSelected = selectedChannels.includes('sms');
  const emailSelected = selectedChannels.includes('email');
  const onlyEmailSelected = selectedChannels.length === 1 && emailSelected;

  return (
    <Card className="p-8 rounded-3xl shadow-2xl bg-white/90 border-0 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Content</h3>
      
      {/* Email Subject */}
      {emailSelected && (
        <div>
          <label htmlFor="subject" className="font-semibold text-gray-700">
            Subject <span className="text-red-500">*</span>
          </label>
          <Input
            id="subject"
            placeholder="Enter message subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="mt-1 rounded-xl border-gray-300 focus:ring-violet-400"
            required={emailSelected}
          />
          {/* Show error if subject is empty and email is selected */}
          {emailSelected && !subject.trim() && (
            <p className="text-red-500 text-sm mt-1">Subject is required for email.</p>
          )}
        </div>
      )}

      {/* Message Body */}
      <div>
        <label htmlFor="body" className="font-semibold text-gray-700">Message</label>
        
        {/* SMS-specific features */}
        {smsSelected && (
          <SmsPreview 
            body={body}
            onInsertPlaceholder={onInsertSmsPlaceholder}
            getTotalRecipientCount={getTotalRecipientCount}
            customPlaceholders={customPlaceholders}
          />
        )}

        {/* Email-specific features */}
        {emailSelected && !smsSelected && (
          <EmailPreview 
            subject={subject}
            body={body}
            onInsertPlaceholder={onInsertEmailPlaceholder}
            getTotalRecipientCount={getTotalRecipientCount}
            customPlaceholders={customPlaceholders}
          />
        )}

        {/* Editor - Rich HTML for email, plain textarea for SMS */}
        {emailSelected ? (
          <RichHtmlEditor
            value={body}
            onChange={setBody}
            onInsertTemplate={onInsertTemplate}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        ) : (
          <Textarea 
            id="body" 
            placeholder={smsSelected ? "Type your SMS message here... Use placeholders above for personalization" : "Type your message here..."} 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            className="mt-1 min-h-[150px] rounded-xl border-gray-300 focus:ring-violet-400" 
          />
        )}
      </div>

      {/* Only show attachment uploader if only email is selected */}
      {onlyEmailSelected && <AttachmentUploader />}
    </Card>
  );
}
