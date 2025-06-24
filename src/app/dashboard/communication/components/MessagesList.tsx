"use client";

import { EnvelopeIcon, UsersIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Mock data for messages
// Type guards for backend message types

type EmailMessageDto = {
  __typename?: 'EmailMessageDto';
  id: string;
  subject: string;
  bodyHtml?: string;
  bodyText?: string;
  senderEmail: string;
  recipients: string[];
  sentAt: string;
  status?: string;
  branchId?: string;
  templateId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type SmsMessageDto = {
  __typename?: 'SmsMessageDto';
  id: string;
  body: string;
  senderNumber: string;
  recipients: string[];
  sentAt: string;
  status?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type NotificationDto = {
  __typename?: 'NotificationDto';
  id: string;
  title: string;
  message: string;
  isRead?: boolean;
  readAt?: string;
  link?: string;
  type?: string;
  memberId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Message = EmailMessageDto | SmsMessageDto | NotificationDto;

// Message type is now a union of EmailMessageDto, SmsMessageDto, NotificationDto (see above)

interface MessagesListProps {
  messages: Message[];
  onViewMessage: (message: Message) => void;
}

export default function MessagesList({ messages, onViewMessage }: MessagesListProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Subject
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Sender
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Sent To
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date Sent
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Channel
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <EnvelopeIcon className="h-12 w-12 text-indigo-400 mb-4" aria-hidden="true" />
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">No Messages</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          There are no messages to display for your branch yet.<br />
                          When you send or receive messages, they will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          <EnvelopeIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                          {('subject' in message && message.subject) || ('title' in message && message.title) || 'Untitled'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {'senderEmail' in message ? message.senderEmail : ('senderNumber' in message ? message.senderNumber : (message.memberId || ''))}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UsersIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                          <span>{Array.isArray(message.recipients) ? message.recipients.join(', ') : ''}</span>
                        </div>
                        <div className="text-xs flex items-center">
                          <CheckCircleIcon className="mr-1 h-3 w-3 text-green-500" aria-hidden="true" />
                          {/* Delivery rate not available from backend */}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                          {formatDate((message.sentAt || message.createdAt || message.updatedAt || ''))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {'status' in message && message.status ? message.status : ('type' in message && message.type ? message.type : '')}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => onViewMessage(message)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View<span className="sr-only">, {message.subject}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
