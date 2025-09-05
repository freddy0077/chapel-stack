"use client";

import { useState } from "react";
import { useSpotify } from "@/lib/spotify/spotifyContext";
import {
  MusicalNoteIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import SpotifySongModal from "./modals/SpotifySongModal";

// Define the song interface
interface SongData {
  title: string;
  author: string;
  defaultKey: string;
  tempo: string;
  timeSignature: string;
  ccli: string;
  themes: string[];
  lastUsed: string;
  audioUrl?: string;
  videoUrl?: string;
  usageCount?: number;
}

// Component for integrating Spotify features into the Song Library
export default function SpotifyIntegration({
  onAddSongToLibrary,
}: {
  onAddSongToLibrary?: (song: SongData) => void;
}) {
  const { isAuthenticated, login } = useSpotify();
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState(false);

  const handleAddFromSpotify = () => {
    if (isAuthenticated) {
      setIsSpotifyModalOpen(true);
    } else {
      login();
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <MusicalNoteIcon className="h-5 w-5 text-green-500 mr-2" />
                Spotify Integration
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Search for worship songs, create service playlists, and play
                music directly within the app.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                onClick={handleAddFromSpotify}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isAuthenticated ? (
                  <>
                    <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                    Search Spotify
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                    Connect to Spotify
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isAuthenticated ? (
            <div className="text-sm text-gray-600">
              <p>Your Spotify account is connected. You can now:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Search for worship songs on Spotify</li>
                <li>Create playlists for your worship services</li>
                <li>Import songs from Spotify to your library</li>
                <li>Play and listen to songs directly in the app</li>
              </ul>
              <p className="mt-3 italic">
                Click &quot;Search Spotify&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="mt-2 text-gray-600">
              <p>
                Connect your Spotify account to enhance your worship planning
                experience:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Find new worship songs to add to your services</li>
                <li>Create playlists for your worship team to rehearse</li>
                <li>Easily share song selections with your congregation</li>
                <li>Listen to songs while planning your worship sets</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Spotify Modal */}
      <SpotifySongModal
        isOpen={isSpotifyModalOpen}
        onClose={() => setIsSpotifyModalOpen(false)}
        onAddToLibrary={onAddSongToLibrary}
      />
    </div>
  );
}
