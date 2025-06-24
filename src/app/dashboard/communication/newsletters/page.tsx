"use client";

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EnvelopeIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { mockNewsletters, mockBranches } from '../components/mockBranchData';
import { Newsletter } from '../components/types';

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState(mockNewsletters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter newsletters by status
  const filteredNewsletters = selectedStatus === 'all'
    ? newsletters
    : newsletters.filter(newsletter => newsletter.status.toLowerCase() === selectedStatus.toLowerCase());

  const handleEditNewsletter = (newsletter: Newsletter) => {
    setCurrentNewsletter(newsletter);
    setIsModalOpen(true);
  };

  const handleDeleteNewsletter = (id: number) => {
    setNewsletters(newsletters.filter(newsletter => newsletter.id !== id));
  };

  const handleCreateNewsletter = () => {
    setCurrentNewsletter(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNewsletter(null);
  };

  const saveNewsletter = (formData: FormData) => {
    const newNewsletter: Newsletter = {
      id: currentNewsletter ? currentNewsletter.id : newsletters.length + 1,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      author: formData.get('author') as string,
      templateId: parseInt(formData.get('templateId') as string) || undefined,
      createdDate: new Date().toISOString().split('T')[0],
      scheduledDate: (formData.get('scheduledDate') as string) || undefined,
      status: (formData.get('status') as 'Draft' | 'Scheduled' | 'Sent') || 'Draft',
      targetBranches: Array.from(formData.getAll('branches') as string[]),
      recipients: {
        count: parseInt(formData.get('recipientCount') as string) || 0,
        groups: Array.from(formData.getAll('recipientGroups') as string[]),
      }
    };

    if (currentNewsletter) {
      setNewsletters(newsletters.map(n => n.id === currentNewsletter.id ? newNewsletter : n));
    } else {
      setNewsletters([...newsletters, newNewsletter]);
    }

    closeModal();
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />;
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
      case 'sent':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Newsletters</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage newsletters with branch-specific templates
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNewsletter}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Newsletter
        </button>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 mt-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['all', 'draft', 'scheduled', 'sent'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`${
                selectedStatus === status
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {status === 'all' ? 'All Status' : status}
            </button>
          ))}
        </nav>
      </div>

      {/* Newsletters list */}
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
        {filteredNewsletters.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {filteredNewsletters.map((newsletter) => (
              <li key={newsletter.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(newsletter.status)}
                      <p className="ml-3 truncate text-sm font-medium text-indigo-600">{newsletter.title}</p>
                    </div>
                    <div className="ml-2 flex flex-shrink-0">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(newsletter.status)}`}>
                        {newsletter.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:flex-col">
                      <p className="flex items-center text-sm text-gray-500">
                        By: {newsletter.author}
                      </p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        {newsletter.status === 'Scheduled' ? 
                          `Scheduled: ${newsletter.scheduledDate}` : 
                          newsletter.status === 'Sent' ? 
                          `Sent: ${newsletter.sentDate}` : 
                          `Created: ${newsletter.createdDate}`}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Branches: <span className="font-medium">{newsletter.targetBranches.length === mockBranches.length ? 'All' : newsletter.targetBranches.join(', ')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm text-gray-500">
                      Recipients: <span className="font-medium">{newsletter.recipients.count}</span> ({newsletter.recipients.groups.join(', ')})
                      {newsletter.openRate && (
                        <span className="ml-2">
                          Open Rate: <span className="font-medium">{newsletter.openRate}%</span>
                        </span>
                      )}
                    </p>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => handleEditNewsletter(newsletter)}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNewsletter(newsletter.id)}
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
            <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No newsletters</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new newsletter.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateNewsletter}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Newsletter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for creating/editing newsletters */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              saveNewsletter(formData);
            }}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentNewsletter ? 'Edit Newsletter' : 'Create New Newsletter'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input 
                          type="text" 
                          name="title" 
                          id="title" 
                          defaultValue={currentNewsletter?.title || ''}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                        <input 
                          type="text" 
                          name="author" 
                          id="author" 
                          defaultValue={currentNewsletter?.author || ''}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">Template</label>
                        <select 
                          id="templateId" 
                          name="templateId" 
                          defaultValue={currentNewsletter?.templateId || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">-- Select Template --</option>
                          <option value="1">Standard Weekly Update</option>
                          <option value="2">Branch Specific Template</option>
                          <option value="3">Ministry Specific Template</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea 
                          id="content" 
                          name="content" 
                          rows={4}
                          defaultValue={currentNewsletter?.content || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select 
                          id="status" 
                          name="status" 
                          defaultValue={currentNewsletter?.status || 'Draft'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Sent">Sent</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                        <input 
                          type="date" 
                          name="scheduledDate" 
                          id="scheduledDate" 
                          defaultValue={currentNewsletter?.scheduledDate || ''}
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
                                defaultChecked={currentNewsletter ? currentNewsletter.targetBranches.includes(branch.name) : true}
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
                        <label htmlFor="recipientCount" className="block text-sm font-medium text-gray-700">Recipient Count</label>
                        <input 
                          type="number" 
                          name="recipientCount" 
                          id="recipientCount" 
                          min="0"
                          defaultValue={currentNewsletter?.recipients.count || 0}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Recipient Groups</label>
                        <div className="mt-2 space-y-2">
                          {['All Members', 'Staff', 'Youth Group', 'Parents', 'Volunteers', 'Visitors'].map((group) => (
                            <div key={group} className="flex items-center">
                              <input
                                id={`group-${group}`}
                                name="recipientGroups"
                                type="checkbox"
                                value={group}
                                defaultChecked={currentNewsletter ? 
                                  currentNewsletter.recipients.groups.includes(group) : 
                                  group === 'All Members'}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`group-${group}`} className="ml-3 block text-sm font-medium text-gray-700">
                                {group}
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
                  {currentNewsletter ? 'Save Changes' : 'Create Newsletter'}
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
    </div>
  );
}
