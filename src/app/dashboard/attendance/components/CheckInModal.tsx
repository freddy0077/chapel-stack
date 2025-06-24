"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, CheckIcon, QrCodeIcon, PrinterIcon } from "@heroicons/react/24/outline";

interface ChildInfo {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  birthdate: string;
  parentName: string;
  parentPhone: string;
  allergies: string;
  emergencyContact: string;
  checkedIn: boolean;
  lastCheckIn: string;
  className: string;
}

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildInfo;
  mode: "in" | "out";
  onComplete: (childId: string, isCheckedIn: boolean) => void;
  eventName: string;
}

export default function CheckInModal({
  isOpen,
  onClose,
  child,
  mode,
  onComplete,
  eventName,
}: CheckInModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityCode, setSecurityCode] = useState(generateSecurityCode());
  const [pickupPerson, setPickupPerson] = useState("Parent");
  const [printLabel, setPrintLabel] = useState(true);
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // Generate a random 3-character alphanumeric security code
  function generateSecurityCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const handleComplete = () => {
    setIsProcessing(true);
    
    // Simulate processing time (would be actual check-in/out logic in a real app)
    setTimeout(() => {
      onComplete(child.id, mode === "in");
      setIsProcessing(false);
    }, 1200);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
                
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    {mode === "in" ? (
                      <QrCodeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    ) : (
                      <CheckIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {mode === "in" ? "Child Check-In" : "Child Check-Out"}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {mode === "in" 
                          ? "Check in the child to the selected event and print their name tag." 
                          : "Check out the child from the current event."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900">Child Information</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{child.firstName} {child.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Age</p>
                      <p className="text-sm font-medium text-gray-900">{child.age} years (DOB: {formatDate(child.birthdate)})</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-sm font-medium text-gray-900">{child.className}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Parents</p>
                      <p className="text-sm font-medium text-gray-900">{child.parentName}</p>
                    </div>
                    {child.allergies !== "None" && (
                      <div className="col-span-2">
                        <p className="text-xs text-red-500 font-medium">Allergies</p>
                        <p className="text-sm font-medium text-red-500">{child.allergies}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Event Details</h4>
                  <p className="text-sm text-gray-500">{eventName} - {new Date().toLocaleDateString()}</p>
                </div>

                {mode === "in" ? (
                  // Check-in specific fields
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="security-code" className="block text-sm font-medium text-gray-700">
                        Security Code (for pickup)
                      </label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="text"
                          name="security-code"
                          id="security-code"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={securityCode}
                          onChange={(e) => setSecurityCode(e.target.value)}
                        />
                        <button
                          type="button"
                          className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                          onClick={() => setSecurityCode(generateSecurityCode())}
                        >
                          Regenerate
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        This code will be required for child pickup
                      </p>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="print-label"
                        name="print-label"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={printLabel}
                        onChange={(e) => setPrintLabel(e.target.checked)}
                      />
                      <label htmlFor="print-label" className="ml-2 block text-sm text-gray-900">
                        Print name tag and security label
                      </label>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Additional Notes (Optional)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          name="notes"
                          rows={2}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          placeholder="Any special instructions for today"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Check-out specific fields
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="pickup-person" className="block text-sm font-medium text-gray-700">
                        Pickup Person
                      </label>
                      <select
                        id="pickup-person"
                        name="pickup-person"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={pickupPerson}
                        onChange={(e) => setPickupPerson(e.target.value)}
                      >
                        <option>Parent</option>
                        <option>Guardian</option>
                        <option>Authorized Family Member</option>
                        <option>Other (specify in notes)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="security-code-verification" className="block text-sm font-medium text-gray-700">
                        Verify Security Code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="security-code-verification"
                          id="security-code-verification"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Ask for the security code"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        The pickup person must provide the security code from the child&apos;s name tag
                      </p>
                    </div>

                    <div>
                      <label htmlFor="checkout-notes" className="block text-sm font-medium text-gray-700">
                        Checkout Notes (Optional)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="checkout-notes"
                          name="checkout-notes"
                          rows={2}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          placeholder="Any notes about the checkout"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={handleComplete}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : mode === "in" ? (
                      "Complete Check-in"
                    ) : (
                      "Complete Check-out"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>

                {mode === "in" && printLabel && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <PrinterIcon className="inline-block mr-1 h-4 w-4" />
                        Name tag will be printed automatically
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none"
                      >
                        <PrinterIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                        Print Preview
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
