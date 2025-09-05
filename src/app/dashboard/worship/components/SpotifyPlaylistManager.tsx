"use client";

import { useState, useEffect, useCallback } from "react";
import { useSpotify } from "@/lib/spotify/spotifyContext";
import {
  getUserPlaylists,
  createPlaylist,
  addTracksToPlaylist,
} from "@/lib/spotify/spotifyApi";
import { DocumentTextIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
}

interface SpotifyPlaylistManagerProps {
  onSelectPlaylist?: (playlist: SpotifyPlaylist) => void;
  selectedTracks?: SpotifyTrack[];
}

export default function SpotifyPlaylistManager({
  onSelectPlaylist,
  selectedTracks = [],
}: SpotifyPlaylistManagerProps) {
  const { isAuthenticated, getToken } = useSpotify();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserId = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUserId(data.id);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  }, [isAuthenticated, getToken]);

  const fetchUserPlaylists = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("No valid Spotify token available");
        setIsLoading(false);
        return;
      }

      const result = await getUserPlaylists(token);
      setPlaylists(result.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setError("Failed to fetch playlists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserId();
      fetchUserPlaylists();
    }
  }, [isAuthenticated, fetchUserId, fetchUserPlaylists]);

  // Handle playlist selection
  const handlePlaylistSelect = (playlist: SpotifyPlaylist) => {
    if (onSelectPlaylist) {
      onSelectPlaylist(playlist);
    }
  };

  // Create a new playlist
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPlaylistName || !userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("No valid Spotify token available");
        setIsLoading(false);
        return;
      }

      const result = await createPlaylist(
        token,
        userId,
        newPlaylistName,
        newPlaylistDescription ||
          `Worship set created in Church Management System`,
      );

      // Reset form
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setShowCreateForm(false);

      // Add to playlists list
      setPlaylists((prev) => [result, ...prev]);

      // Add selected tracks to the new playlist if any
      if (selectedTracks.length > 0) {
        await addTracksToPlaylist(
          token,
          result.id,
          selectedTracks.map((track) => track.uri),
        );
      }

      // Select the new playlist
      if (onSelectPlaylist) {
        onSelectPlaylist(result);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      setError("Failed to create playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add selected tracks to an existing playlist
  const handleAddToPlaylist = async (playlistId: string) => {
    if (selectedTracks.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("No valid Spotify token available");
        setIsLoading(false);
        return;
      }

      await addTracksToPlaylist(
        token,
        playlistId,
        selectedTracks.map((track) => track.uri),
      );

      // Refresh playlists to show updated track count
      fetchUserPlaylists();
    } catch (error) {
      console.error("Error adding tracks to playlist:", error);
      setError("Failed to add tracks to playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-gray-500">
          Please connect to Spotify to manage playlists
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Worship Playlists</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircleIcon className="h-4 w-4 mr-1" />
          New Playlist
        </button>
      </div>

      {showCreateForm && (
        <div className="p-4 bg-gray-50">
          <form onSubmit={handleCreatePlaylist}>
            <div className="mb-3">
              <label
                htmlFor="playlist-name"
                className="block text-sm font-medium text-gray-700"
              >
                Playlist Name
              </label>
              <input
                type="text"
                id="playlist-name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Sunday Worship - April 7, 2025"
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="playlist-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <textarea
                id="playlist-description"
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Worship songs for the Sunday service"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading playlists...</p>
        </div>
      )}

      {error && (
        <div className="p-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {!isLoading && !error && playlists.length === 0 && (
        <div className="p-6 text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No playlists
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new playlist.
          </p>
        </div>
      )}

      {!isLoading && !error && playlists.length > 0 && (
        <div className="overflow-y-auto max-h-96">
          <ul className="divide-y divide-gray-200">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {playlist.images[0] ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {playlist.name}
                    </p>
                    {playlist.description && (
                      <p className="text-sm text-gray-500 truncate">
                        {playlist.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {playlist.tracks.total} tracks
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {selectedTracks.length > 0 && (
                      <button
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Songs
                      </button>
                    )}
                    <button
                      onClick={() => handlePlaylistSelect(playlist)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
