import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AnnouncementModalProps } from './types';

const AnnouncementModal = ({ announcement, onClose }: AnnouncementModalProps) => {
  if (!announcement) return null;
  
  // Format dates if they exist
  let formattedStartDate = "Not specified";
  let formattedEndDate = "Not specified";
  
  if (announcement.startDate) {
    const startDate = new Date(announcement.startDate);
    formattedStartDate = startDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  if (announcement.endDate) {
    const endDate = new Date(announcement.endDate);
    formattedEndDate = endDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  return (
    <Dialog as="div" className="relative z-10" open={!!announcement} onClose={onClose}>
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
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {announcement.title}
                </Dialog.Title>
                <div className="mt-2 text-sm text-gray-500 flex justify-between">
                  <div>Author: {announcement.author}</div>
                  <div>Date: {announcement.date}</div>
                </div>
                <div className="mt-2 text-sm text-gray-500 flex justify-between">
                  <div>Status: {announcement.status}</div>
                  {announcement.priority && (
                    <div>Priority: {announcement.priority}</div>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <div>Start: {formattedStartDate}</div>
                  <div>End: {formattedEndDate}</div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <p>{announcement.content}</p>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => alert('Share functionality to be implemented')}
                >
                  Share
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  );
};

export default AnnouncementModal;
