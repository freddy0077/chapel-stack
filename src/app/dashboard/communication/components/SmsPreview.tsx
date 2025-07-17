import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// SMS constants
const SMS_CHAR_LIMIT_SINGLE = 160;
const SMS_CHAR_LIMIT_MULTI = 153;
const SMS_PLACEHOLDERS = [
  { key: '{firstName}', description: 'Recipient\'s first name' },
  { key: '{lastName}', description: 'Recipient\'s last name' },
  { key: '{fullName}', description: 'Recipient\'s full name' },
  { key: '{churchName}', description: 'Your church name' },
  { key: '{date}', description: 'Current date' },
];

// Utility function to strip HTML tags and convert to plain text
const stripHtmlTags = (html: string): string => {
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get text content and clean up whitespace
  let text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Replace multiple whitespaces/newlines with single spaces
  text = text.replace(/\s+/g, ' ').trim();
  
  // Convert common HTML entities
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  
  return text;
};

// Utility function to resolve frontend placeholders for preview
const resolveFrontendPlaceholdersForPreview = (content: string): string => {
  let resolvedContent = content;
  
  // Get current date in a readable format
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Use default church name for preview
  const churchName = 'Your Church';
  
  // Replace frontend-handled placeholders
  resolvedContent = resolvedContent
    .replace(/{date}/g, currentDate)
    .replace(/{churchName}/g, churchName);
  
  // Note: {firstName}, {lastName}, {fullName} are left as-is for preview
  
  return resolvedContent;
};

// Utility function to resolve custom placeholders
const resolveCustomPlaceholders = (content: string, customPlaceholders: { key: string; value: string }[]): string => {
  let resolvedContent = content;
  
  customPlaceholders.forEach(placeholder => {
    const regex = new RegExp(placeholder.key.replace(/[{}]/g, '\\$&'), 'g');
    resolvedContent = resolvedContent.replace(regex, placeholder.value || `[${placeholder.key}]`);
  });
  
  return resolvedContent;
};

// Function to calculate SMS segments
const calculateSmsSegments = (text: string): { count: number, remaining: number, total: number } => {
  const length = text.length;
  if (length <= SMS_CHAR_LIMIT_SINGLE) {
    return { 
      count: 1, 
      remaining: SMS_CHAR_LIMIT_SINGLE - length,
      total: length 
    };
  } else {
    const segments = Math.ceil(length / SMS_CHAR_LIMIT_MULTI);
    return { 
      count: segments, 
      remaining: (segments * SMS_CHAR_LIMIT_MULTI) - length,
      total: length 
    };
  }
};

// Simple SMS credit estimation function
const estimateSmsCredits = (segments: number, recipients: number): number => {
  const creditsPerSegment = 1;
  return segments * recipients * creditsPerSegment;
};

interface SmsPreviewProps {
  body: string;
  onInsertPlaceholder: (placeholder: string) => void;
  getTotalRecipientCount: () => number;
  customPlaceholders?: { key: string; value: string }[];
}

export default function SmsPreview({ 
  body, 
  onInsertPlaceholder, 
  getTotalRecipientCount,
  customPlaceholders = []
}: SmsPreviewProps) {
  // Strip HTML from body and resolve frontend and custom placeholders for SMS preview and calculations
  const strippedBody = stripHtmlTags(body);
  const frontendResolved = resolveFrontendPlaceholdersForPreview(strippedBody);
  const plainTextBody = resolveCustomPlaceholders(frontendResolved, customPlaceholders);
  const smsSegmentInfo = calculateSmsSegments(plainTextBody);

  return (
    <>
      {/* SMS Placeholders */}
      <div className="mb-3 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SMS_PLACEHOLDERS.map((placeholder) => (
            <Badge 
              key={placeholder.key} 
              onClick={() => onInsertPlaceholder(placeholder.key)}
              className="px-3 py-1 bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-200 cursor-pointer"
              title={placeholder.description}
            >
              {placeholder.key}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <span className={smsSegmentInfo.count > 1 ? "text-amber-500 font-semibold" : "text-green-600 font-semibold"}>
              {smsSegmentInfo.total} characters
            </span>
            <span className="text-gray-500 mx-1">•</span>
            <span className={smsSegmentInfo.count > 3 ? "text-red-500 font-medium" : "text-gray-600 font-medium"}>
              {smsSegmentInfo.count} segment{smsSegmentInfo.count !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-500 mx-1">•</span>
            <span className="text-gray-500">
              {smsSegmentInfo.remaining} remaining in current segment
            </span>
          </div>
        </div>

        {/* SMS Length Progress Bar */}
        <div>
          <Progress 
            value={(smsSegmentInfo.total / (smsSegmentInfo.count * SMS_CHAR_LIMIT_MULTI)) * 100} 
            className={`h-2 ${smsSegmentInfo.count > 2 ? "bg-gradient-to-r from-amber-400 to-red-500" : "bg-gradient-to-r from-green-400 to-blue-500"}`}
          />
        </div>
      </div>

      {/* SMS Preview */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-3">SMS Preview</h4>
        <div className="border rounded-2xl bg-gray-100 p-6 max-w-xs mx-auto">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-300">
            <div className="flex items-center mb-2">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-500">Your Church</span>
            </div>
            <div className="bg-blue-100 rounded-xl p-3 text-gray-800 text-sm font-medium break-words overflow-hidden overflow-wrap-anywhere">
              {plainTextBody || "Your SMS message will appear here"}
            </div>
            <div className="text-xs text-gray-400 text-right mt-1">
              Now
            </div>
          </div>
          
          {/* SMS Cost Estimation */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Estimated cost: </span>
              <span className="text-violet-600 font-semibold">
                {estimateSmsCredits(smsSegmentInfo.count, getTotalRecipientCount())} credits
              </span>
              <span className="text-gray-500"> ({smsSegmentInfo.count} segments × {getTotalRecipientCount() || 1} recipients)</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
