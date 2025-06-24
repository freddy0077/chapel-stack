"use client";

import { useState, useEffect } from 'react';
import { useSpotify } from '@/lib/spotify/spotifyContext';
import { searchSpotify } from '@/lib/spotify/spotifyApi';
import { MagnifyingGlassIcon, PlusIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

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

interface SpotifySearchProps {
  onSelectTrack?: (track: SpotifyTrack) => void;
  onAddToLibrary?: (track: SpotifyTrack) => void;
  onAddToPlaylist?: (track: SpotifyTrack) => void;
}

export default function SpotifySearch({ 
  onSelectTrack, 
  onAddToLibrary, 
  onAddToPlaylist 
}: SpotifySearchProps) {
  const { isAuthenticated, getToken, login } = useSpotify();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);

  // Search when the search term changes (with debounce)
  useEffect(() => {
    if (!searchTerm || !isAuthenticated) return;

    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, isAuthenticated]);

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError('No valid Spotify token available');
        setIsLoading(false);
        return;
      }

      const result = await searchSpotify(searchTerm, token);
      setSearchResults(result.tracks.items);
    } catch (error) {
      console.error('Error searching Spotify:', error);
      setError('Failed to search Spotify. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = (track: SpotifyTrack) => {
    setSelectedTrack(track);
    if (onSelectTrack) {
      onSelectTrack(track);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <MusicalNoteIcon className="h-12 w-12 text-indigo-500 mx-auto" />
        <h2 className="mt-2 text-lg font-medium text-gray-900">Connect to Spotify</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect to your Spotify account to search for worship songs, create playlists, and more.
        </p>
        <button
          onClick={login}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Connect to Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search for worship songs on Spotify..."
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button
              onClick={performSearch}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Searching Spotify...</p>
        </div>
      )}

      {error && (
        <div className="p-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {!isLoading && !error && searchResults.length === 0 && searchTerm && (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">No songs found for "{searchTerm}"</p>
        </div>
      )}

      {!isLoading && !error && searchResults.length > 0 && (
        <div className="overflow-y-auto max-h-96">
          <ul className="divide-y divide-gray-200">
            {searchResults.map((track) => (
              <li 
                key={track.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedTrack?.id === track.id ? 'bg-indigo-50' : ''}`}
                onClick={() => handleTrackSelect(track)}
              >
                <div className="flex items-center space-x-4">
                  {track.album.images[0] && (
                    <img 
                      src={track.album.images[0].url} 
                      alt={track.album.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{track.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-400">{track.album.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {formatDuration(track.duration_ms)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectTrack) onSelectTrack(track);
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none"
                    >
                      <PlayIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {onAddToLibrary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToLibrary(track);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none"
                        title="Add to library"
                      >
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
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
