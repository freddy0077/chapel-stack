"use client";
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

interface NewPrayerRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { memberName: string; requestText: string }) => void;
}

export default function NewPrayerRequestModal({ open, onClose, onSubmit }: NewPrayerRequestModalProps) {
  const [memberName, setMemberName] = useState("");
  const [requestText, setRequestText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ memberName, requestText });
    setSubmitting(false);
    setMemberName("");
    setRequestText("");
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center rounded-xl bg-indigo-100 p-2">
                    <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-indigo-600" />
                  </span>
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                    New Prayer Request
                  </Dialog.Title>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={memberName}
                      onChange={e => setMemberName(e.target.value)}
                      required
                      placeholder="Enter member's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Request</label>
                    <textarea
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={requestText}
                      onChange={e => setRequestText(e.target.value)}
                      required
                      rows={4}
                      placeholder="Type the prayer request here..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                      onClick={onClose}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Add Request"}
                    </button>
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
