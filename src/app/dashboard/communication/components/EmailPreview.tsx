import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Calendar, Building } from 'lucide-react';

// Email placeholders
const EMAIL_PLACEHOLDERS = [
  { key: '{firstName}', description: 'Recipient\'s first name', icon: User },
  { key: '{lastName}', description: 'Recipient\'s last name', icon: User },
  { key: '{fullName}', description: 'Recipient\'s full name', icon: User },
  { key: '{churchName}', description: 'Your church name', icon: Building },
  { key: '{date}', description: 'Current date', icon: Calendar },
  { key: '{email}', description: 'Recipient\'s email address', icon: Mail },
];

// Function to calculate email stats
const calculateEmailStats = (subject: string, body: string) => {
  const subjectLength = subject.length;
  const bodyLength = body.length;
  const totalLength = subjectLength + bodyLength;
  
  // Estimate reading time (average 200 words per minute)
  const wordCount = body.split(/\s+/).filter(word => word.length > 0).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  
  return {
    subjectLength,
    bodyLength,
    totalLength,
    wordCount,
    readingTimeMinutes: readingTimeMinutes || 1
  };
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
  
  // Note: {firstName}, {lastName}, {fullName}, {email} are left as-is for preview
  
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

interface EmailPreviewProps {
  subject: string;
  body: string;
  onInsertPlaceholder: (placeholder: string) => void;
  getTotalRecipientCount: () => number;
  customPlaceholders?: { key: string; value: string }[];
}

export default function EmailPreview({ 
  subject, 
  body, 
  onInsertPlaceholder, 
  getTotalRecipientCount,
  customPlaceholders = []
}: EmailPreviewProps) {
  // Resolve frontend and custom placeholders for preview display
  const frontendResolved = resolveFrontendPlaceholdersForPreview(subject);
  const resolvedSubject = resolveCustomPlaceholders(frontendResolved, customPlaceholders);
  
  const frontendResolvedBody = resolveFrontendPlaceholdersForPreview(body);
  const resolvedBody = resolveCustomPlaceholders(frontendResolvedBody, customPlaceholders);
  
  const emailStats = calculateEmailStats(resolvedSubject, resolvedBody);

  return (
    <>
      {/* Email Placeholders */}
      <div className="mb-3 space-y-3">
        <div className="flex flex-wrap gap-2">
          {EMAIL_PLACEHOLDERS.map((placeholder) => {
            const IconComponent = placeholder.icon;
            return (
              <Badge 
                key={placeholder.key} 
                onClick={() => onInsertPlaceholder(placeholder.key)}
                className="px-3 py-1 bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer flex items-center gap-1"
                title={placeholder.description}
              >
                <IconComponent size={12} />
                {placeholder.key}
              </Badge>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <span className="font-medium">{emailStats.wordCount}</span> words
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">
              <span className="font-medium">{emailStats.readingTimeMinutes}</span> min read
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">
              Subject: <span className={emailStats.subjectLength > 50 ? "text-amber-500 font-medium" : "text-green-600 font-medium"}>
                {emailStats.subjectLength} chars
              </span>
            </span>
          </div>
        </div>

        {/* Subject Length Warning */}
        {emailStats.subjectLength > 50 && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
            ⚠️ Subject line is long ({emailStats.subjectLength} chars). Consider keeping it under 50 characters for better mobile display.
          </div>
        )}
      </div>

      {/* Email Preview */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-3">Email Preview</h4>
        <div className="border rounded-lg bg-white shadow-sm max-w-2xl mx-auto">
          {/* Email Header */}
          <div className="border-b bg-gray-50 p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Building size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Your Church</div>
                  <div className="text-xs text-gray-500">church@example.com</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">To:</span> {getTotalRecipientCount() || 1} recipient{getTotalRecipientCount() !== 1 ? 's' : ''}
            </div>
            
            <div className="text-lg font-semibold text-gray-800 mt-2">
              {resolvedSubject || "Your email subject will appear here"}
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6">
            <div 
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: resolvedBody || "<p class='text-gray-400 italic'>Your email content will appear here...</p>" 
              }}
            />
            
            {/* Email Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Sent from Your Church Communication System</span>
                <span>Unsubscribe | Preferences</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Stats */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Recipients: </span>
            <span className="text-blue-600 font-semibold">
              {getTotalRecipientCount() || 1}
            </span>
            <span className="text-gray-500"> • </span>
            <span className="font-medium">Estimated delivery: </span>
            <span className="text-green-600 font-semibold">Immediate</span>
          </p>
        </div>
      </div>
    </>
  );
}
