"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

export interface ServiceFormData {
  title: string;
  date: string;
  theme: string;
  description: string;
  location: string;
  status: 'Planning' | 'Confirmed' | 'Draft' | 'Completed';
  serviceType: string;
  leadPastor: string;
  worshipLeader: string;
  songs: any[];
  team: any[];
  completed: boolean;
}

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: ServiceFormData) => void;
}

export default function CreateServiceModal({ isOpen, onClose, onSave }: CreateServiceModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Main Sanctuary');
  const [serviceType, setServiceType] = useState('Weekly Service');
  const [leadPastor, setLeadPastor] = useState('');
  const [worshipLeader, setWorshipLeader] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time into a single datetime string
    const dateTime = new Date(`${date}T${time}`).toISOString();
    
    // Create service data object
    const serviceData: ServiceFormData = {
      title,
      date: dateTime,
      theme,
      description,
      location,
      status: 'Planning',
      serviceType,
      leadPastor,
      worshipLeader,
      songs: [],
      team: [],
      completed: false
    };
    
    onSave(serviceData);
    
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setTheme('');
    setDescription('');
    setLocation('Main Sanctuary');
    setServiceType('Weekly Service');
    setLeadPastor('');
    setWorshipLeader('');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Create New Service Plan
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-500">
                      Fill out the form below to create a new worship service plan.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                        Service Title
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="e.g., Sunday Morning Service"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                        Date
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">
                        Time
                      </label>
                      <div className="mt-2">
                        <input
                          type="time"
                          name="time"
                          id="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="theme" className="block text-sm font-medium leading-6 text-gray-900">
                        Theme
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="theme"
                          id="theme"
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="e.g., Amazing Grace"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Brief description of the service..."
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                        Location
                      </label>
                      <div className="mt-2">
                        <select
                          id="location"
                          name="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option>Main Sanctuary</option>
                          <option>Fellowship Hall</option>
                          <option>Youth Center</option>
                          <option>Chapel</option>
                          <option>Outdoor Area</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="serviceType" className="block text-sm font-medium leading-6 text-gray-900">
                        Service Type
                      </label>
                      <div className="mt-2">
                        <select
                          id="serviceType"
                          name="serviceType"
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option>Weekly Service</option>
                          <option>Prayer Service</option>
                          <option>Special Service</option>
                          <option>Youth Service</option>
                          <option>Communion Service</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="leadPastor" className="block text-sm font-medium leading-6 text-gray-900">
                        Lead Pastor
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="leadPastor"
                          id="leadPastor"
                          value={leadPastor}
                          onChange={(e) => setLeadPastor(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="e.g., Pastor John Smith"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="worshipLeader" className="block text-sm font-medium leading-6 text-gray-900">
                        Worship Leader
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="worshipLeader"
                          id="worshipLeader"
                          value={worshipLeader}
                          onChange={(e) => setWorshipLeader(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="e.g., Sarah Williams"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-200 pt-5">
                    <div className="flex justify-end gap-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Create Service
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
