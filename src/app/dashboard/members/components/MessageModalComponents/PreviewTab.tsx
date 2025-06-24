"use client";

import React from 'react';
import { DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { FileAttachment, MessageType, Recipient } from './types';

interface PreviewTabProps {
  subject: string;
  message: string;
  sendType: MessageType;
  isTextBold: boolean;
  isTextItalic: boolean;
  isTextBullet: boolean;
  attachments: FileAttachment[];
  recipients: Recipient[];
  ccRecipients: Recipient[];
  bccRecipients: Recipient[];
  showCcBcc: boolean;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  subject,
  message,
  sendType,
  isTextBold,
  isTextItalic,
  isTextBullet,
  attachments,
  recipients,
  ccRecipients,
  bccRecipients,
  showCcBcc
}) => {
  // Format message with basic styling
  const formattedMessage = () => {
    let formatted = message;
    
    // Handle bullet points (very simple implementation)
    if (isTextBullet) {
      formatted = formatted.split('\n').map(line => `• ${line}`).join('\n');
    }
    
    return formatted;
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Message Preview
        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {sendType === 'email' ? (
            <EnvelopeIcon className="mr-1 h-3 w-3" />
          ) : (
            <DevicePhoneMobileIcon className="mr-1 h-3 w-3" />
          )}
          {sendType === 'email' ? 'Email' : 'SMS'}
        </span>
      </h3>
      
      {sendType === 'email' ? (
        // Email preview
        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 border-b px-4 py-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-900">Email Preview</h4>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">To: </span>
                <span>{recipients.map(r => r.name).join(', ')}</span>
              </div>
              
              {showCcBcc && ccRecipients.length > 0 && (
                <div>
                  <span className="font-medium">Cc: </span>
                  <span>{ccRecipients.map(r => r.name).join(', ')}</span>
                </div>
              )}
              
              {showCcBcc && bccRecipients.length > 0 && (
                <div>
                  <span className="font-medium">Bcc: </span>
                  <span>{bccRecipients.map(r => r.name).join(', ')}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium">Subject: </span>
                <span>{subject}</span>
              </div>
              
              {attachments.length > 0 && (
                <div>
                  <span className="font-medium">Attachments: </span>
                  <span>{attachments.map(a => a.name).join(', ')}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 border rounded bg-gray-50">
              <div
                className={`text-sm whitespace-pre-wrap ${isTextBold ? 'font-bold' : ''} ${
                  isTextItalic ? 'italic' : ''
                }`}
              >
                {formattedMessage()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // SMS preview
        <div className="max-w-sm mx-auto">
          <div className="border-2 border-gray-300 rounded-3xl overflow-hidden p-1 bg-gray-100">
            <div className="bg-white rounded-2xl overflow-hidden shadow">
              <div className="bg-gray-50 p-2 text-center border-b">
                <p className="text-xs text-gray-500">SMS Message</p>
              </div>
              <div className="p-4">
                <div className="inline-block bg-gray-200 rounded-lg p-3 max-w-[85%]">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{message}</p>
                </div>
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewTab;
