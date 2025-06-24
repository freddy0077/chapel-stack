"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon, MusicalNoteIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import type { ServicePlan } from '../ServicesList';

interface ServiceDetailsModalProps {
  service: ServicePlan;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceDetailsModal({ service, isOpen, onClose }: ServiceDetailsModalProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
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
                  <div className="mt-3 sm:mt-0">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {service.title}
                    </Dialog.Title>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{service.description}</p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                            Date
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDate(service.date)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <ClockIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                            Time
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatTime(service.date)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Location</dt>
                          <dd className="mt-1 text-sm text-gray-900">{service.location}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900">{service.status}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Type</dt>
                          <dd className="mt-1 text-sm text-gray-900">{service.serviceType}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Theme</dt>
                          <dd className="mt-1 text-sm text-gray-900">{service.theme}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <UserGroupIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                        Leadership
                      </h4>
                      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Lead Pastor</dt>
                          <dd className="mt-1 text-sm text-gray-900">{service.leadPastor}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Worship Leader</dt>
                          <dd className="mt-1 text-sm text-gray-900">{service.worshipLeader}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <MusicalNoteIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                        Songs
                      </h4>
                      <ul className="mt-3 divide-y divide-gray-100">
                        {service.songs.map((song, index) => (
                          <li key={index} className="py-2 flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{song.title}</p>
                              <p className="text-xs text-gray-500">{song.artist}</p>
                            </div>
                            <p className="text-sm text-gray-500 font-mono">{song.key}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <UserGroupIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                        Team
                      </h4>
                      <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                        {service.team.map((member, index) => (
                          <li key={index} className="flex items-center">
                            <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <UserGroupIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                            </span>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.role}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Edit Service
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
