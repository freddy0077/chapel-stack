"use client";
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@apollo/client";
import { CREATE_PRAYER_REQUEST } from "@/graphql/mutations/prayer-requests";
import { useAuth } from "@/graphql/hooks/useAuth";

interface NewPrayerRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewPrayerRequestModal({ open, onClose, onSuccess }: NewPrayerRequestModalProps) {
  const { user } = useAuth();
  console.log("user from modal", user);
  const [requestText, setRequestText] = useState("");
  const [touched, setTouched] = useState(false);

  const [createPrayerRequest, { loading: submitting, error }] = useMutation(CREATE_PRAYER_REQUEST, {
    onCompleted: () => {
      onSuccess();
      handleClose();
    },
  });

  const handleClose = () => {
    setRequestText("");
    setTouched(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!requestText.trim()) return;
    createPrayerRequest({
      variables: {
        data: {
          memberId: user?.member?.id,
          requestText: requestText.trim(),
          branchId: user?.userBranches?.[0]?.branch?.id,
          organisationId: user?.organisationId,
        },
      },
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-4xl bg-white p-12 text-left align-middle shadow-2xl transition-all border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center justify-center rounded-xl bg-indigo-100 p-3">
                    <ChatBubbleLeftEllipsisIcon className="h-7 w-7 text-indigo-600" />
                  </span>
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                    New Prayer Request
                  </Dialog.Title>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Request</label>
                    <textarea
                      className={`w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none ${touched && !requestText.trim() ? 'border-red-400' : 'border-gray-300'}`}
                      value={requestText}
                      onChange={e => setRequestText(e.target.value)}
                      required
                      rows={5}
                      placeholder="Type your prayer request here..."
                      onBlur={() => setTouched(true)}
                      maxLength={1000}
                    />
                    {touched && !requestText.trim() && (
                      <div className="text-red-500 text-xs mt-1">Prayer request is required.</div>
                    )}
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm mb-2">Error: {error.message}</div>
                  )}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                      onClick={handleClose}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                      disabled={submitting || !requestText.trim()}
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
