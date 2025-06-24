"use client";

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, BellIcon } from '@heroicons/react/24/outline';
import { mockReminders } from '../components/mockBranchData';
import { mockBranches } from '../components/mockBranchData';
import { Reminder } from '../components/types';

export default function RemindersPage() {
  const [reminders, setReminders] = useState(mockReminders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter reminders by type
  const filteredReminders = selectedType === 'all'
    ? reminders
    : reminders.filter(reminder => reminder.type.toLowerCase() === selectedType.toLowerCase());

  const handleEditReminder = (reminder: Reminder) => {
    setCurrentReminder(reminder);
    setIsModalOpen(true);
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const handleCreateReminder = () => {
    setCurrentReminder(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentReminder(null);
  };

  const saveReminder = (formData: FormData) => {
    const newReminder: Reminder = {
      id: currentReminder ? currentReminder.id : reminders.length + 1,
      title: formData.get('title') as string,
      type: formData.get('type') as 'Birthday' | 'Anniversary' | 'Event' | 'Meeting' | 'Other',
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      recurring: formData.get('recurring') === 'true',
      for: formData.get('for') as 'Member' | 'Group' | 'Staff' | 'All',
      targetBranches: Array.from(formData.getAll('branches') as string[]),
      notificationChannel: Array.from(formData.getAll('channels') as ('Email' | 'SMS' | 'App')[]),
      daysInAdvance: parseInt(formData.get('daysInAdvance') as string),
      status: 'Active',
      customMessage: formData.get('customMessage') as string,
    };

    if (currentReminder) {
      setReminders(reminders.map(r => r.id === currentReminder.id ? newReminder : r));
    } else {
      setReminders([...reminders, newReminder]);
    }

    closeModal();
  };

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'birthday':
        return 'bg-blue-100 text-blue-800';
      case 'anniversary':
        return 'bg-purple-100 text-purple-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Gradient header */}
      <div className="sticky top-0 z-10 -mx-6 mb-8 pb-4 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-lg backdrop-blur-md rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">Reminders</h1>
            <p className="text-white/80 max-w-2xl">Manage birthday, anniversary, event, and meeting reminders for your church community. Use filters, search, and quick actions to stay organized.</p>
          </div>
          <button
            type="button"
            onClick={handleCreateReminder}
            className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-indigo-600 font-semibold shadow hover:bg-indigo-50 transition"
          >
            <PlusIcon className="h-6 w-6 mr-2" />
            New Reminder
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 mt-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['all', 'birthday', 'anniversary', 'event', 'meeting', 'other'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`${
                selectedType === type
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </nav>
      </div>

      {/* Reminders list */}
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
        {filteredReminders.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {filteredReminders.map((reminder) => (
              <li key={reminder.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BellIcon className="h-5 w-5 text-gray-400 mr-3" aria-hidden="true" />
                      <p className="truncate text-sm font-medium text-indigo-600">{reminder.title}</p>
                    </div>
                    <div className="ml-2 flex flex-shrink-0">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getBadgeColor(reminder.type)}`}>
                        {reminder.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {reminder.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        For: <span className="font-medium">{reminder.for}</span>
                        {reminder.targetBranches.length > 0 && (
                          <span className="ml-2">
                            Branches: <span className="font-medium">{reminder.targetBranches.length === mockBranches.length ? 'All' : reminder.targetBranches.join(', ')}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => handleEditReminder(reminder)}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reminders</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new reminder.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateReminder}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Reminder
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for creating/editing reminders */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              saveReminder(formData);
            }}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentReminder ? 'Edit Reminder' : 'Create New Reminder'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input 
                          type="text" 
                          name="title" 
                          id="title" 
                          defaultValue={currentReminder?.title || ''}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select 
                          id="type" 
                          name="type" 
                          defaultValue={currentReminder?.type || 'Birthday'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="Birthday">Birthday</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Event">Event</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea 
                          id="description" 
                          name="description" 
                          rows={2}
                          defaultValue={currentReminder?.description || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date/Schedule</label>
                        <input 
                          type="text" 
                          name="date" 
                          id="date" 
                          defaultValue={currentReminder?.date || ''}
                          placeholder="e.g., Daily at 8:00 AM or 2023-06-15"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Recurring</label>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center">
                            <input
                              id="recurring-yes"
                              name="recurring"
                              type="radio"
                              value="true"
                              defaultChecked={currentReminder ? currentReminder.recurring : true}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="recurring-yes" className="ml-3 block text-sm font-medium text-gray-700">
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="recurring-no"
                              name="recurring"
                              type="radio"
                              value="false"
                              defaultChecked={currentReminder ? !currentReminder.recurring : false}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="recurring-no" className="ml-3 block text-sm font-medium text-gray-700">
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="for" className="block text-sm font-medium text-gray-700">For</label>
                        <select 
                          id="for" 
                          name="for" 
                          defaultValue={currentReminder?.for || 'Member'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="Member">Individual Member</option>
                          <option value="Group">Group</option>
                          <option value="Staff">Staff</option>
                          <option value="All">All Members</option>
                        </select>
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
                                defaultChecked={currentReminder ? currentReminder.targetBranches.includes(branch.name) : true}
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
                        <label className="block text-sm font-medium text-gray-700">Notification Channels</label>
                        <div className="mt-2 space-y-2">
                          {['Email', 'SMS', 'App'].map((channel) => (
                            <div key={channel} className="flex items-center">
                              <input
                                id={`channel-${channel}`}
                                name="channels"
                                type="checkbox"
                                value={channel}
                                defaultChecked={currentReminder ? 
                                  currentReminder.notificationChannel.includes(channel as any) : 
                                  channel === 'Email'}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`channel-${channel}`} className="ml-3 block text-sm font-medium text-gray-700">
                                {channel}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="daysInAdvance" className="block text-sm font-medium text-gray-700">Days in Advance</label>
                        <input 
                          type="number" 
                          name="daysInAdvance" 
                          id="daysInAdvance" 
                          min="0"
                          max="30"
                          defaultValue={currentReminder?.daysInAdvance || 1}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700">Custom Message</label>
                        <textarea 
                          id="customMessage" 
                          name="customMessage" 
                          rows={3}
                          defaultValue={currentReminder?.customMessage || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        />
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
                  {currentReminder ? 'Save Changes' : 'Create Reminder'}
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
