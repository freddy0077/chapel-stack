import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MessageModalProps } from './types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  EnvelopeIcon, 
  XMarkIcon, 
  ArrowUturnRightIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon 
} from '@heroicons/react/24/outline';

const MessageModal = ({ message, onClose }: MessageModalProps) => {
  if (!message) return null;
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get message type icon
  const getMessageTypeIcon = () => {
    if ('subject' in message) {
      return <EnvelopeIcon className="h-6 w-6 text-indigo-500" />;
    } else if ('body' in message) {
      return <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500" />;
    } else {
      return <BellIcon className="h-6 w-6 text-amber-500" />;
    }
  };
  
  // Get message subject/title
  const getMessageSubject = () => {
    if ('subject' in message && message.subject) {
      return message.subject;
    } else if ('title' in message && message.title) {
      return message.title;
    } else if ('body' in message && message.body) {
      return message.body.substring(0, 30) + (message.body.length > 30 ? '...' : '');
    } else {
      return 'Message Details';
    }
  };
  
  // Get message content
  const getMessageContent = () => {
    if ('body' in message && message.body) {
      return message.body;
    } else if ('message' in message && message.message) {
      return message.message;
    } else if ('content' in message && message.content) {
      return message.content;
    } else {
      return 'No content available';
    }
  };
  
  // Get message sender
  const getMessageSender = () => {
    if ('senderEmail' in message && message.senderEmail) {
      return message.senderEmail;
    } else if ('senderNumber' in message && message.senderNumber) {
      return message.senderNumber;
    } else if ('sender' in message && message.sender) {
      return message.sender;
    } else if ('memberId' in message && message.memberId) {
      return `Member ID: ${message.memberId}`;
    } else {
      return 'System';
    }
  };
  
  // Get message date
  const getMessageDate = () => {
    return formatDate(message.sentAt || message.createdAt || message.updatedAt || '');
  };
  
  // Get message channel
  const getMessageChannel = () => {
    if ('channel' in message && message.channel) {
      return message.channel;
    } else if ('subject' in message) {
      return 'Email';
    } else if ('body' in message) {
      return 'SMS';
    } else if ('title' in message) {
      return 'Notification';
    } else {
      return 'Unknown';
    }
  };
  
  // Get message recipients
  const getMessageRecipients = () => {
    if (Array.isArray(message.recipients) && message.recipients.length > 0) {
      return `${message.recipients.length} recipient${message.recipients.length !== 1 ? 's' : ''}`;
    } else if (message.recipients && typeof message.recipients === 'object' && 'type' in message.recipients) {
      return `${message.recipients.type}${message.recipients.count ? ` (${message.recipients.count})` : ''}`;
    } else if (typeof message.recipients === 'string') {
      return message.recipients;
    } else {
      return 'N/A';
    }
  };

  return (
    <Transition.Root show={!!message} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <Card className="border-0 shadow-none">
                  <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getMessageTypeIcon()}
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          {getMessageSubject()}
                        </CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-full h-8 w-8 p-0" 
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                          <EnvelopeIcon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-gray-500">From</div>
                          <div className="font-medium text-gray-900">{getMessageSender()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100">
                          <UserGroupIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-gray-500">Recipients</div>
                          <div className="font-medium text-gray-900">{getMessageRecipients()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                          <CalendarIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-gray-500">Date</div>
                          <div className="font-medium text-gray-900">{getMessageDate()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-gray-500">Channel</div>
                          <div className="font-medium text-gray-900">{getMessageChannel()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Message Content</h4>
                      <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
                        {getMessageContent()}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => alert('Forward functionality to be implemented')}
                    >
                      <ArrowUturnRightIcon className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                    <Button onClick={onClose}>
                      Close
                    </Button>
                  </CardFooter>
                </Card>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MessageModal;
