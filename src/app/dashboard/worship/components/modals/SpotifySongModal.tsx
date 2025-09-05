"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SpotifySearch from "../SpotifySearch";
import SpotifyPlayer from "../SpotifyPlayer";
import Image from "next/image";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  uri: string;
  duration_ms: number;
}

interface SpotifySongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToLibrary?: (song: unknown) => void;
}

export default function SpotifySongModal({
  isOpen,
  onClose,
  onAddToLibrary,
}: SpotifySongModalProps) {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<SpotifyTrack[]>([]);
  const [activeTab, setActiveTab] = useState<"search" | "playlist">("search");

  const handleSelectTrack = (track: SpotifyTrack) => {
    setCurrentTrack(track);

    // Check if track is already selected
    const isAlreadySelected = selectedTracks.some((t) => t.id === track.id);

    if (!isAlreadySelected) {
      setSelectedTracks((prev) => [...prev, track]);
    }
  };

  const handleRemoveTrack = (trackId: string) => {
    setSelectedTracks((prev) => prev.filter((track) => track.id !== trackId));
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
    }
  };

  const handleAddSongToLibrary = (track: SpotifyTrack) => {
    if (onAddToLibrary) {
      // Convert Spotify track to app song format
      const song = {
        title: track.name,
        author: track.artists.map((a) => a.name).join(", "),
        defaultKey: "", // We don't get this from Spotify API
        tempo: "", // We don't get this from Spotify API
        timeSignature: "", // We don't get this from Spotify API
        ccli: "", // We don't get this from Spotify API
        themes: [], // We don't get this from Spotify API
        lastUsed: new Date().toISOString().split("T")[0],
        audioUrl: track.uri,
        usageCount: 0,
      };

      onAddToLibrary(song);
    }
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
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
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Spotify Integration
                    </Dialog.Title>

                    <div className="mt-4">
                      {/* Tab Navigation */}
                      <div className="border-b border-gray-200">
                        <nav
                          className="-mb-px flex space-x-8"
                          aria-label="Tabs"
                        >
                          <button
                            onClick={() => setActiveTab("search")}
                            className={`${
                              activeTab === "search"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                          >
                            Search Songs
                          </button>
                          <button
                            onClick={() => setActiveTab("playlist")}
                            className={`${
                              activeTab === "playlist"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                          >
                            Worship Playlists
                          </button>
                        </nav>
                      </div>

                      {/* Current track player */}
                      {currentTrack && (
                        <div className="mt-4">
                          <SpotifyPlayer trackUri={currentTrack.uri} />
                        </div>
                      )}

                      {/* Tab Content */}
                      <div className="mt-4">
                        {activeTab === "search" && (
                          <SpotifySearch
                            onSelectTrack={handleSelectTrack}
                            onAddToLibrary={handleAddSongToLibrary}
                          />
                        )}

                        {activeTab === "playlist" && (
                          <div>Selected Tracks: {selectedTracks.length}</div>
                        )}
                      </div>

                      {/* Selected Songs List */}
                      {selectedTracks.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900">
                            Selected Songs ({selectedTracks.length})
                          </h4>
                          <ul className="mt-2 divide-y divide-gray-200 max-h-60 overflow-y-auto">
                            {selectedTracks.map((track) => (
                              <li
                                key={track.id}
                                className="py-2 flex justify-between items-center"
                              >
                                <div className="flex items-center">
                                  {track.album.images[0] && (
                                    <Image
                                      src={track.album.images[0].url}
                                      alt={track.album.name}
                                      width={64}
                                      height={64}
                                      className="rounded mr-2"
                                    />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {track.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {track.artists
                                        .map((a) => a.name)
                                        .join(", ")}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveTrack(track.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={onClose}
                  >
                    Done
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
