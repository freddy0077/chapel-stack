"use client";

import React from 'react';
import { CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { MessageHistory } from './types';

interface HistoryTabProps {
  messageHistory: MessageHistory[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ messageHistory }) => {
  // Helper function to get the status icon
  const getStatusIcon = (status: MessageHistory['status']) => {
    switch (status) {
      case 'sent':
        return <ArrowPathIcon className="h-4 w-4 text-yellow-500" title="Sent" />;
      case 'delivered':
        return <CheckIcon className="h-4 w-4 text-blue-500" title="Delivered" />;
      case 'read':
        return <CheckIcon className="h-4 w-4 text-green-500" title="Read" />;
      case 'failed':
        return <span className="text-red-500 text-xs">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Message History</h3>
      
      {messageHistory.length > 0 ? (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messageHistory.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {message.date}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {message.subject}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      message.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {message.type === 'email' ? 'Email' : 'SMS'}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(message.status)}
                      <span className="ml-1 capitalize">{message.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="mt-2 text-sm text-gray-500">No messages sent yet.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
