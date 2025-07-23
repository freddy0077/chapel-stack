import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecipientSelector from './RecipientSelector';
import { useSendEmail, useSendSms, useSendNotification } from '@/graphql/hooks/useSendMessage';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import Link from 'next/link';
import ChannelSelector from './components/ChannelSelector';
import MessageContent from './components/MessageContent';
import SchedulingSection from './components/SchedulingSection';
import CustomPlaceholders from './components/CustomPlaceholders';
import { EmailTemplate } from './components/RichHtmlEditor';

// SMS constants
const SMS_CHAR_LIMIT_SINGLE = 160;
const SMS_CHAR_LIMIT_MULTI = 153; // Characters per segment in multi-segment SMS
const SMS_PLACEHOLDERS = [
  { key: '{firstName}', description: 'Recipient\'s first name' },
  { key: '{lastName}', description: 'Recipient\'s last name' },
  { key: '{fullName}', description: 'Recipient\'s full name' },
  { key: '{churchName}', description: 'Your church name' },
  { key: '{date}', description: 'Current date' },
];

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
  const creditsPerSegment = 1; // 1 credit per segment per recipient
  return segments * recipients * creditsPerSegment;
};

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

// Utility function to resolve frontend placeholders
const resolveFrontendPlaceholders = (content: string, user: any): string => {
  let resolvedContent = content;
  
  // Get current date in a readable format
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get church name from user's organization or use default
  const churchName = user?.organisation?.name || user?.organizationName || 'Your Church';
  
  // Replace frontend-handled placeholders
  resolvedContent = resolvedContent
    .replace(/{date}/g, currentDate)
    .replace(/{churchName}/g, churchName);
  
  // Note: {firstName}, {lastName}, {fullName}, {email} are left for backend processing
  
  return resolvedContent;
};

// Utility function to resolve custom placeholders defined by user
const resolveCustomPlaceholders = (content: string, customPlaceholders: { key: string; value: string }[]): string => {
  let resolvedContent = content;
  
  customPlaceholders.forEach(placeholder => {
    const regex = new RegExp(placeholder.key.replace(/[{}]/g, '\\$&'), 'g');
    resolvedContent = resolvedContent.replace(regex, placeholder.value);
  });
  
  return resolvedContent;
};

// Template data - moved from EmailTemplatePicker for use in RichHtmlEditor
const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ... existing templates
];

const CHANNELS = [
  { key: 'email', label: 'Email' },
  { key: 'sms', label: 'SMS' },
  { key: 'inapp', label: 'In-App' },
  { key: 'push', label: 'Push' },
];

export default function ComposeMessage({ onBack }: { onBack?: () => void }) {
  const { user } = useAuth();
  const { organisationId, branchId } = useOrganisationBranch();
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email']);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [recipients, setRecipients] = useState<any[]>([]);
  const [birthdayRange, setBirthdayRange] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState('');
  const [smsSegmentInfo, setSmsSegmentInfo] = useState({ count: 0, remaining: SMS_CHAR_LIMIT_SINGLE, total: 0 });
  const [customPlaceholders, setCustomPlaceholders] = useState<{ key: string; value: string }[]>([]);

  // GraphQL mutations
  const { sendEmail } = useSendEmail();
  const { sendSms } = useSendSms();
  const { sendNotification } = useSendNotification();

  // Helper functions
  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleInsertTemplate = (html: string) => {
    setBody(html);
  };

  const insertSmsPlaceholder = (placeholder: string) => {
    setBody((prevBody) => prevBody + placeholder);
  };

  const insertEmailPlaceholder = (placeholder: string) => {
    // For email, we can insert at cursor position or append
    setBody((prevBody) => prevBody + placeholder);
  };

  const getTotalRecipientCount = (): number => {
    const recipientCount = recipients.length;
    const birthdayCount = birthdayRange ? 1 : 0; // Simplified count
    return Math.max(recipientCount + birthdayCount, 1);
  };

  // Validation
  const isFormValid = () => {
    if (selectedChannels.length === 0) return false;
    if (selectedChannels.includes('email') && !subject.trim()) return false;
    if (!body.trim()) return false;
    return true;
  };

  // Send message handler
  const handleSend = async () => {
    if (!isFormValid()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccess('');

    try {
      // Process recipients and filters
      const memberIds = recipients.map(r => r.id);
      const groupIds = recipients.filter(r => r.type === 'group').map(r => r.id);
      const filterKeys = recipients.filter(r => r.type === 'filter').map(r => r.key);

      // Handle scheduling
      let scheduledDateTime = null;
      if (isScheduled && scheduledDate && scheduledTime) {
        const [hours, minutes] = scheduledTime.split(':');
        const dateTime = new Date(scheduledDate);
        dateTime.setHours(parseInt(hours), parseInt(minutes));
        scheduledDateTime = dateTime.toISOString();
      }

      let action = '';

      // Email
      if (selectedChannels.includes('email')) {
        const resolvedSubject = resolveCustomPlaceholders(resolveFrontendPlaceholders(subject, user), customPlaceholders);
        const resolvedBody = resolveCustomPlaceholders(resolveFrontendPlaceholders(body, user), customPlaceholders);
        await sendEmail({
          variables: {
            input: {
              subject: resolvedSubject,
              bodyHtml: resolvedBody,
              bodyText: stripHtmlTags(resolvedBody), // Strip HTML for text version
              recipients: filterKeys.length > 0 ? [] : memberIds,
              groupIds: groupIds.length ? groupIds : undefined,
              birthdayRange: birthdayRange || undefined,
              filters: filterKeys.length ? filterKeys : undefined,
              organisationId,
              branchId,
              scheduledAt: scheduledDateTime,
              // attachments: []
            }
          }
        });
        action = 'Email sent';
      }

      // SMS
      if (selectedChannels.includes('sms')) {
        const resolvedBody = resolveCustomPlaceholders(resolveFrontendPlaceholders(body, user), customPlaceholders);
        const plainTextBody = stripHtmlTags(resolvedBody);
        await sendSms({
          variables: {
            input: {
              message: plainTextBody,
              recipients: filterKeys.length > 0 ? [] : memberIds,
              groupIds: groupIds.length ? groupIds : undefined,
              birthdayRange: birthdayRange || undefined,
              filters: filterKeys.length ? filterKeys : undefined,
              organisationId,
              branchId,
              scheduledAt: scheduledDateTime,
            }
          }
        });
        action = action ? `${action} and SMS sent` : 'SMS sent';
      }

      // In-App Notification
      if (selectedChannels.includes('inapp')) {
        const resolvedBody = resolveCustomPlaceholders(resolveFrontendPlaceholders(body, user), customPlaceholders);
        await sendNotification({
          variables: {
            input: {
              title: subject || 'Notification',
              message: resolvedBody,
              recipients: filterKeys.length > 0 ? [] : memberIds,
              groupIds: groupIds.length ? groupIds : undefined,
              birthdayRange: birthdayRange || undefined,
              filters: filterKeys.length ? filterKeys : undefined,
              organisationId,
              branchId,
              scheduledAt: scheduledDateTime,
            }
          }
        });
        action = action ? `${action} and notification sent` : 'Notification sent';
      }

      setSuccess(isScheduled ? `${action} and scheduled successfully!` : `${action} successfully!`);
      
      // Reset form
      setSubject('');
      setBody('');
      setRecipients([]);
      setBirthdayRange('');
      setSelectedTemplate(null);
      setIsScheduled(false);
      setScheduledDate(undefined);
      setScheduledTime('');

    } catch (error) {
      console.error('Send error:', error);
      setErrorMsg('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate SMS segments whenever body changes and SMS is selected
  useEffect(() => {
    if (selectedChannels.includes('sms')) {
      setSmsSegmentInfo(calculateSmsSegments(body));
    }
  }, [body, selectedChannels]);

  return (
    <div className="relative min-h-[90vh]">
      {/* Gradient Header */}
      <div className="absolute left-0 right-0 -top-10 h-60 bg-gradient-to-tr from-violet-500 via-fuchsia-400 to-pink-400 blur-2xl opacity-60 pointer-events-none z-0" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10 pt-6">
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">Compose Message</h2>
          </div>

          {/* Channel Selection */}
          <ChannelSelector 
            selectedChannels={selectedChannels}
            onToggleChannel={toggleChannel}
          />

          {/* Recipient Selection */}
          <Card className="p-8 rounded-3xl shadow-2xl bg-white/90 border-0">
            <RecipientSelector
              recipients={recipients}
              setRecipients={setRecipients}
              birthdayRange={birthdayRange}
              setBirthdayRange={setBirthdayRange}
            />
          </Card>

          {/* Message Content */}
          <MessageContent
            selectedChannels={selectedChannels}
            subject={subject}
            setSubject={setSubject}
            body={body}
            setBody={setBody}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onInsertTemplate={handleInsertTemplate}
            onInsertSmsPlaceholder={insertSmsPlaceholder}
            onInsertEmailPlaceholder={insertEmailPlaceholder}
            getTotalRecipientCount={getTotalRecipientCount}
            customPlaceholders={customPlaceholders}
            smsSegmentInfo={smsSegmentInfo}
          />

          {/* Custom Placeholders Section */}
          <CustomPlaceholders
            subject={subject}
            body={body}
            customPlaceholders={customPlaceholders}
            onCustomPlaceholdersChange={setCustomPlaceholders}
          />

          {/* Scheduling */}
          <SchedulingSection
            isScheduled={isScheduled}
            setIsScheduled={setIsScheduled}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
            scheduledTime={scheduledTime}
            setScheduledTime={setScheduledTime}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Send Button */}
          <Card className="p-6 rounded-3xl shadow-2xl bg-white/90 border-0">
            <Button
              onClick={handleSend}
              disabled={loading || !isFormValid()}
              className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : isScheduled ? (
                'Schedule Message'
              ) : (
                'Send Message'
              )}
            </Button>

            {/* Status Messages */}
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-xl">
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
              </div>
            )}
          </Card>

          {/* Message Summary */}
          <Card className="p-6 rounded-3xl shadow-2xl bg-white/90 border-0">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Message Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Channels:</span>
                <div className="flex gap-1">
                  {selectedChannels.map(channel => (
                    <Badge key={channel} variant="secondary" className="text-xs">
                      {channel.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium">{getTotalRecipientCount()}</span>
              </div>
              {subject && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium truncate ml-2" title={subject}>
                    {subject.length > 20 ? `${subject.substring(0, 20)}...` : subject}
                  </span>
                </div>
              )}
              {isScheduled && scheduledDate && scheduledTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium text-xs">
                    {scheduledDate.toLocaleDateString()} at {scheduledTime}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Help & Tips */}
          <Card className="p-6 rounded-3xl shadow-2xl bg-white/90 border-0">
            <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use templates for consistent messaging</li>
              <li>• Preview SMS messages to check length</li>
              <li>• Schedule messages for optimal timing</li>
              <li>• Test with a small group first</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/dashboard/communication" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
                ← Back to Communications
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
