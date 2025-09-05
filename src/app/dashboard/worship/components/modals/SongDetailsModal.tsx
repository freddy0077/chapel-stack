"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import {
  XMarkIcon,
  MusicalNoteIcon,
  HashtagIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  DocumentChartBarIcon,
  PresentationChartBarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type { Song } from "../SongLibrary";
import ChordChartGenerator from "../features/ChordChartGenerator";
import LyricsProjection from "../features/LyricsProjection";
import AudioVideoIntegration from "../features/AudioVideoIntegration";
import CCLIReporting from "../features/CCLIReporting";

interface SongDetailsModalProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
}

export default function SongDetailsModal({
  song,
  isOpen,
  onClose,
}: SongDetailsModalProps) {
  const [tabIndex, setTabIndex] = useState(0);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Tab content definitions
  const tabs = [
    { name: "Details", icon: MusicalNoteIcon },
    { name: "Chord Chart", icon: DocumentChartBarIcon },
    { name: "Lyrics Projection", icon: PresentationChartBarIcon },
    { name: "Audio/Video", icon: VideoCameraIcon },
    { name: "CCLI Reporting", icon: DocumentTextIcon },
  ];

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
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
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MusicalNoteIcon
                        className="h-6 w-6 text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        {song.title}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">{song.author}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
                      <Tab.List className="flex space-x-1 rounded-xl bg-indigo-50 p-1">
                        {tabs.map((tab) => (
                          <Tab
                            key={tab.name}
                            className={({ selected }) =>
                              `flex items-center w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5 ${selected ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600"}`
                            }
                          >
                            <tab.icon
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            {tab.name}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="mt-4">
                        <Tab.Panel>
                          <div className="border-t border-gray-100 pt-4">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                  <span className="font-mono mr-1">♯</span>
                                  Default Key
                                </dt>
                                <dd className="mt-1 text-lg font-mono text-gray-900">
                                  {song.defaultKey}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                  <ClockIcon
                                    className="mr-1 h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  Tempo
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {song.tempo}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  Time Signature
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {song.timeSignature}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  CCLI #
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {song.ccli}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                  <CalendarIcon
                                    className="mr-1 h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  Last Used
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {formatDate(song.lastUsed)}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="mt-6 border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-medium text-gray-500 flex items-center">
                              <HashtagIcon
                                className="mr-1 h-4 w-4"
                                aria-hidden="true"
                              />
                              Themes
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {song.themes.map((theme, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                                >
                                  {theme}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-medium text-gray-500">
                              Recent Usage
                            </h4>
                            <div className="mt-2">
                              <p className="text-sm text-gray-700">
                                This song has been used in{" "}
                                {song.usageCount || 3} services in the past 6
                                months.
                              </p>
                            </div>
                          </div>
                        </Tab.Panel>

                        <Tab.Panel>
                          <ChordChartGenerator song={song} />
                        </Tab.Panel>

                        <Tab.Panel>
                          <LyricsProjection song={song} />
                        </Tab.Panel>

                        <Tab.Panel>
                          <AudioVideoIntegration song={song} />
                        </Tab.Panel>

                        <Tab.Panel>
                          <CCLIReporting songs={[song]} />
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
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
                      Edit Song
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
