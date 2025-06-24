"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

// Define milestone types
export type MilestoneType = 
  | "Baptism" 
  | "Confirmation" 
  | "FirstCommunion" 
  | "Wedding"
  | "MinistryEnrollment"
  | "Leadership"
  | "MissionTrip"
  | "Other";

export interface Milestone {
  id: string;
  type: MilestoneType;
  date: string;
  description: string;
  location?: string;
  officiant?: string;
}

interface SpiritualMilestonesProps {
  milestones: Milestone[];
  onAddMilestone?: (milestone: Milestone) => void;
  onRemoveMilestone?: (id: string) => void;
  isEditable?: boolean;
}

// Helper function to get milestone icon based on type
const getMilestoneIcon = (type: MilestoneType) => {
  const baseClasses = "h-8 w-8 text-white";
  
  switch (type) {
    case "Baptism":
      return (
        <svg className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "Confirmation":
      return (
        <svg className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "FirstCommunion":
      return (
        <svg className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "Wedding":
      return (
        <svg className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    default:
      return (
        <svg className={baseClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
  }
};

// Helper function to get color based on milestone type
const getMilestoneColor = (type: MilestoneType) => {
  switch (type) {
    case "Baptism":
      return "bg-blue-600";
    case "Confirmation":
      return "bg-purple-600";
    case "FirstCommunion":
      return "bg-green-600";
    case "Wedding":
      return "bg-pink-600";
    case "MinistryEnrollment":
      return "bg-yellow-600";
    case "Leadership":
      return "bg-red-600";
    case "MissionTrip":
      return "bg-indigo-600";
    default:
      return "bg-gray-600";
  }
};

// Helper function to format milestone type for display
const formatMilestoneType = (type: MilestoneType) => {
  switch (type) {
    case "FirstCommunion":
      return "First Communion";
    case "MinistryEnrollment":
      return "Ministry Enrollment";
    case "MissionTrip":
      return "Mission Trip";
    default:
      return type;
  }
};

export default function SpiritualMilestones({ 
  milestones, 
  onAddMilestone, 
  onRemoveMilestone,
  isEditable = false 
}: SpiritualMilestonesProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, "id">>({
    type: "Baptism",
    date: "",
    description: "",
    location: "",
    officiant: ""
  });

  const handleAddMilestone = () => {
    if (!onAddMilestone) return;
    
    onAddMilestone({
      ...newMilestone,
      id: Date.now().toString(),
    });

    // Reset form and close modal
    setNewMilestone({
      type: "Baptism",
      date: "",
      description: "",
      location: "",
      officiant: ""
    });
    setIsAddModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMilestone(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Spiritual Milestones</h3>
        {isEditable && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Milestone
          </button>
        )}
      </div>
      <div className="p-6">
        {milestones.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No spiritual milestones recorded yet.</p>
        ) : (
          <ol className="relative border-l border-gray-200 ml-3">
            {milestones.map((milestone) => (
              <li className="mb-10 ml-6" key={milestone.id}>
                <span className={`absolute flex items-center justify-center w-10 h-10 rounded-full -left-5 ring-4 ring-white ${getMilestoneColor(milestone.type)}`}>
                  {getMilestoneIcon(milestone.type)}
                </span>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                      {formatMilestoneType(milestone.type)}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                      {new Date(milestone.date).toLocaleDateString()}
                    </time>
                    <p className="mb-2 text-base font-normal text-gray-700">
                      {milestone.description}
                    </p>
                    {milestone.location && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Location:</span> {milestone.location}
                      </p>
                    )}
                    {milestone.officiant && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Officiant:</span> {milestone.officiant}
                      </p>
                    )}
                  </div>
                  {isEditable && onRemoveMilestone && (
                    <button
                      type="button"
                      onClick={() => onRemoveMilestone(milestone.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Add Milestone Modal */}
      <Transition.Root show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsAddModalOpen}>
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
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Add New Spiritual Milestone
                      </Dialog.Title>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                            Milestone Type
                          </label>
                          <div className="mt-2">
                            <select
                              id="type"
                              name="type"
                              value={newMilestone.type}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              <option value="Baptism">Baptism</option>
                              <option value="Confirmation">Confirmation</option>
                              <option value="FirstCommunion">First Communion</option>
                              <option value="Wedding">Wedding</option>
                              <option value="MinistryEnrollment">Ministry Enrollment</option>
                              <option value="Leadership">Leadership Role</option>
                              <option value="MissionTrip">Mission Trip</option>
                              <option value="Other">Other</option>
                            </select>
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
                              value={newMilestone.date}
                              onChange={handleInputChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                              value={newMilestone.description}
                              onChange={handleInputChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                            Location (Optional)
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="location"
                              id="location"
                              value={newMilestone.location}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="officiant" className="block text-sm font-medium leading-6 text-gray-900">
                            Officiant (Optional)
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="officiant"
                              id="officiant"
                              value={newMilestone.officiant}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleAddMilestone}
                    >
                      Add Milestone
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
