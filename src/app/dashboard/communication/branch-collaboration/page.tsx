"use client";

import { useState } from 'react';
import { PlusIcon, TrashIcon, ChatBubbleLeftRightIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { mockInterBranchMessages, mockBranches } from '../components/mockBranchData';
import { InterBranchMessage } from '../components/types';

export default function BranchCollaborationPage() {
  const [messages, setMessages] = useState(mockInterBranchMessages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<InterBranchMessage | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [newResponse, setNewResponse] = useState('');

  // Filter messages by priority
  const filteredMessages = selectedPriority === 'all'
    ? messages
    : messages.filter(message => message.priority.toLowerCase() === selectedPriority.toLowerCase());

  const handleViewMessage = (message: InterBranchMessage) => {
    setCurrentMessage(message);
    setIsViewModalOpen(true);
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  const handleCreateMessage = () => {
    setCurrentMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMessage(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentMessage(null);
    setNewResponse('');
  };

  const addResponse = () => {
    if (!currentMessage || !newResponse.trim()) return;
    
    const updatedMessage = {
      ...currentMessage,
      responses: [
        ...(currentMessage.responses || []),
        {
          id: Date.now(),
          content: newResponse,
          sender: {
            name: 'You',
            branch: 'Main Campus',
            role: 'Staff'
          },
          dateSent: new Date().toISOString()
        }
      ]
    };
    
    setMessages(messages.map(m => m.id === currentMessage.id ? updatedMessage : m));
    setCurrentMessage(updatedMessage);
    setNewResponse('');
  };

  const saveMessage = (formData: FormData) => {
    const branches = Array.from(formData.getAll('branches') as string[]);
    const roles = Array.from(formData.getAll('roles') as string[]);
    
    const newMessage: InterBranchMessage = {
      id: currentMessage ? currentMessage.id : messages.length + 1,
      subject: formData.get('subject') as string,
      content: formData.get('content') as string,
      sender: {
        name: 'You',
        branch: 'Main Campus',
        role: 'Staff'
      },
      recipients: {
        branches: branches,
        roles: roles.length > 0 ? roles : undefined
      },
      dateSent: new Date().toISOString(),
      status: 'Sent',
      priority: formData.get('priority') as 'Low' | 'Medium' | 'High' | 'Urgent',
      attachments: [],
      responses: []
    };

    if (currentMessage) {
      setMessages(messages.map(m => m.id === currentMessage.id ? newMessage : m));
    } else {
      setMessages([...messages, newMessage]);
    }

    closeModal();
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Branch Collaboration</h1>
          <p className="mt-2 text-sm text-gray-700">
            Communicate and coordinate with staff across different branches
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateMessage}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Message
        </button>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 mt-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['all', 'low', 'medium', 'high', 'urgent'].map((priority) => (
            <button
              key={priority}
              onClick={() => setSelectedPriority(priority)}
              className={`${
                selectedPriority === priority
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {priority === 'all' ? 'All Priorities' : priority}
            </button>
          ))}
        </nav>
      </div>

      {/* Messages list */}
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
        {filteredMessages.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <li key={message.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      <button 
                        onClick={() => handleViewMessage(message)}
                        className="ml-3 truncate text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {message.subject}
                      </button>
                    </div>
                    <div className="ml-2 flex flex-shrink-0">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityBadgeColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        From: {message.sender.name} ({message.sender.branch}, {message.sender.role})
                      </p>
                      {message.attachments && message.attachments.length > 0 && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <PaperClipIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                          {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Sent: {formatDate(message.dateSent)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm text-gray-500">
                      To: {message.recipients.branches.length === mockBranches.length ? 'All Branches' : message.recipients.branches.join(', ')}
                      {message.recipients.roles && (
                        <span className="ml-2">
                          Roles: {message.recipients.roles.join(', ')}
                        </span>
                      )}
                    </p>
                    <div className="flex space-x-4">
                      {message.responses && message.responses.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {message.responses.length} response{message.responses.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(message.id)}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new inter-branch message.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateMessage}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Message
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for creating new messages */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              saveMessage(formData);
            }}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      New Inter-Branch Message
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input 
                          type="text" 
                          name="subject" 
                          id="subject" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select 
                          id="priority" 
                          name="priority" 
                          defaultValue="Medium"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea 
                          id="content" 
                          name="content" 
                          rows={4}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Target Branches</label>
                        <div className="mt-2 space-y-2">
                          {mockBranches.map((branch) => (
                            <div key={branch.id} className="flex items-center">
                              <input
                                id={`branch-${branch.id}`}
                                name="branches"
                                type="checkbox"
                                value={branch.name}
                                defaultChecked={branch.name !== 'Main Campus'}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`branch-${branch.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                                {branch.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Target Roles</label>
                        <div className="mt-2 space-y-2">
                          {['Campus Pastor', 'Worship Director', 'Children\'s Director', 'Youth Pastor', 'Volunteer Coordinator', 'Finance Manager', 'All Staff'].map((role) => (
                            <div key={role} className="flex items-center">
                              <input
                                id={`role-${role}`}
                                name="roles"
                                type="checkbox"
                                value={role}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`role-${role}`} className="ml-3 block text-sm font-medium text-gray-700">
                                {role}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for viewing messages and responses */}
      {isViewModalOpen && currentMessage && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full max-h-[90vh] flex flex-col">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto flex-grow">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentMessage.subject}
                    </h3>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityBadgeColor(currentMessage.priority)}`}>
                      {currentMessage.priority}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p>From: {currentMessage.sender.name} ({currentMessage.sender.branch}, {currentMessage.sender.role})</p>
                    <p className="mt-1">
                      To: {currentMessage.recipients.branches.length === mockBranches.length ? 'All Branches' : currentMessage.recipients.branches.join(', ')}
                      {currentMessage.recipients.roles && (
                        <span className="ml-2">
                          Roles: {currentMessage.recipients.roles.join(', ')}
                        </span>
                      )}
                    </p>
                    <p className="mt-1">Sent: {formatDate(currentMessage.dateSent)}</p>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {currentMessage.content}
                    </p>
                  </div>

                  {currentMessage.attachments && currentMessage.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 text-sm">Attachments:</h4>
                      <ul className="mt-2 space-y-2">
                        {currentMessage.attachments.map((attachment, index) => (
                          <li key={index} className="flex items-center text-sm text-blue-600">
                            <PaperClipIcon className="h-5 w-5 mr-1 text-gray-400" />
                            <a href={attachment.url} className="hover:underline">
                              {attachment.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentMessage.responses && currentMessage.responses.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 text-sm">Responses:</h4>
                      <div className="mt-2 space-y-4">
                        {currentMessage.responses.map((response) => (
                          <div key={response.id} className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{response.sender.name} ({response.sender.branch}, {response.sender.role})</span>
                              <span>{formatDate(response.dateSent)}</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-700">
                              {response.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <label htmlFor="newResponse" className="block text-sm font-medium text-gray-700 mb-2">Add Response</label>
              <textarea 
                id="newResponse" 
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={2}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Type your response here..."
              />
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={addResponse}
                disabled={!newResponse.trim()}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Send Response
              </button>
              <button
                type="button"
                onClick={closeViewModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
