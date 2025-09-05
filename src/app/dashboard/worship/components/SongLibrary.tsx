"use client";

import {
  MusicalNoteIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

// Mock data for the song library
export const mockSongs = [
  {
    id: 1,
    title: "Amazing Grace",
    author: "John Newton",
    defaultKey: "G",
    tempo: "Slow",
    timeSignature: "3/4",
    ccli: "4755360",
    themes: ["Grace", "Redemption", "Salvation"],
    lastUsed: "2025-03-16",
    lyrics:
      "Amazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost, but now I'm found\nWas blind, but now I see\n\n'Twas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed",
    chordChart:
      "G       D        Em        C\nAmazing grace how sweet the sound\nG         D             G\nThat saved a wretch like me\nG        D       Em        C\nI once was lost, but now I'm found\nG        D         G\nWas blind, but now I see",
    audioUrl: "https://example.com/songs/amazing-grace.mp3",
    videoUrl: "https://example.com/songs/amazing-grace.mp4",
    usageCount: 12,
    lastReported: "2025-03-31",
  },
  {
    id: 2,
    title: "How Great Thou Art",
    author: "Stuart K. Hine",
    defaultKey: "D",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "14181",
    themes: ["God's Greatness", "Creation", "Worship"],
    lastUsed: "2025-03-30",
  },
  {
    id: 3,
    title: "10,000 Reasons (Bless The Lord)",
    author: "Matt Redman",
    defaultKey: "G",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "6016351",
    themes: ["Worship", "Praise", "God's Attributes"],
    lastUsed: "2025-04-06",
    lyrics:
      "Bless the Lord, O my soul\nO my soul, worship His holy name\nSing like never before, O my soul\nI'll worship Your holy name\n\nThe sun comes up, it's a new day dawning\nIt's time to sing Your song again\nWhatever may pass and whatever lies before me\nLet me be singing when the evening comes",
    chordChart:
      "G             D          Em         C\nBless the Lord, O my soul, O my soul\nG             D          C\nWorship His holy name\nG              D            Em          C\nSing like never before, O my soul\nG               D            C      G\nI'll worship Your holy name",
    audioUrl: "https://example.com/songs/10000-reasons.mp3",
    videoUrl: "https://example.com/songs/10000-reasons.mp4",
    usageCount: 8,
    lastReported: "2025-03-31",
  },
  {
    id: 4,
    title: "Cornerstone",
    author: "Hillsong Worship",
    defaultKey: "C",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "6158927",
    themes: ["Foundation", "Faith", "Trust"],
    lastUsed: "2025-03-09",
  },
  {
    id: 5,
    title: "Great Is Thy Faithfulness",
    author: "Thomas O. Chisholm",
    defaultKey: "E",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "18723",
    themes: ["Faithfulness", "God's Attributes", "Trust"],
    lastUsed: "2025-04-06",
  },
  {
    id: 6,
    title: "Way Maker",
    author: "Sinach",
    defaultKey: "E",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "7115744",
    themes: ["Miracles", "God's Power", "Faith"],
    lastUsed: "2025-04-06",
    lyrics:
      "You are here, moving in our midst\nI worship You, I worship You\nYou are here, working in this place\nI worship You, I worship You\n\nWay maker, miracle worker\nPromise keeper, light in the darkness\nMy God, that is who You are",
    chordChart:
      "E                   B\nYou are here, moving in our midst\nC#m               A\nI worship You, I worship You\nE                      B\nYou are here, working in this place\nC#m               A\nI worship You, I worship You",
    audioUrl: "https://example.com/songs/way-maker.mp3",
    videoUrl: "https://example.com/songs/way-maker.mp4",
    usageCount: 10,
    lastReported: "2025-03-31",
  },
  {
    id: 7,
    title: "Blessed Assurance",
    author: "Fanny Crosby",
    defaultKey: "D",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "22324",
    themes: ["Assurance", "Joy", "Testimony"],
    lastUsed: "2025-04-06",
  },
  {
    id: 8,
    title: "Living Hope",
    author: "Phil Wickham",
    defaultKey: "C",
    tempo: "Medium-Fast",
    timeSignature: "4/4",
    ccli: "7106807",
    themes: ["Easter", "Resurrection", "Hope"],
    lastUsed: "2025-03-23",
  },
  {
    id: 9,
    title: "Oceans (Where Feet May Fail)",
    author: "Hillsong United",
    defaultKey: "D",
    tempo: "Slow",
    timeSignature: "4/4",
    ccli: "6428767",
    themes: ["Trust", "Faith", "Surrender"],
    lastUsed: "2025-03-02",
  },
  {
    id: 10,
    title: "Christ Is Risen",
    author: "Matt Maher",
    defaultKey: "G",
    tempo: "Medium-Fast",
    timeSignature: "4/4",
    ccli: "5242683",
    themes: ["Easter", "Resurrection", "Victory"],
    lastUsed: "2025-03-23",
  },
  {
    id: 11,
    title: "Goodness of God",
    author: "Bethel Music",
    defaultKey: "C",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "7117726",
    themes: ["God's Goodness", "Testimony", "Worship"],
    lastUsed: "2025-04-06",
  },
  {
    id: 12,
    title: "King of Kings",
    author: "Hillsong Worship",
    defaultKey: "D",
    tempo: "Medium",
    timeSignature: "4/4",
    ccli: "7127647",
    themes: ["Jesus", "Gospel Story", "Kingdom"],
    lastUsed: "2025-02-16",
  },
];

export interface Song {
  id: number;
  title: string;
  author: string;
  defaultKey: string;
  tempo: string;
  timeSignature: string;
  ccli: string;
  themes: string[];
  lastUsed: string;
  lyrics?: string; // For lyrics projection system
  chordChart?: string; // Base chord chart in default key
  audioUrl?: string; // Link to audio recording
  videoUrl?: string; // Link to video recording
  usageCount?: number; // For CCLI reporting
  lastReported?: string; // Last CCLI report date
}

interface SongLibraryProps {
  songs: Song[];
  onViewSong: (song: Song) => void;
  onAddSong: () => void;
}

export default function SongLibrary({
  songs,
  onViewSong,
  onAddSong,
}: SongLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");

  // Get all unique themes from songs
  const allThemes = [
    "All Themes",
    ...new Set(songs.flatMap((song) => song.themes)),
  ].sort();

  // Filter songs based on search term and theme
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTheme =
      selectedTheme === "All Themes" || song.themes.includes(selectedTheme);

    return matchesSearch && matchesTheme;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">Song Library</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredSongs.length} songs •{" "}
            {selectedTheme !== "All Themes"
              ? `Filtered by "${selectedTheme}"`
              : "All themes"}
          </p>
        </div>

        {/* Search and Filter Tools */}
        <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full">
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border-gray-200 py-2 pl-10 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search songs..."
            />
          </div>
          <select
            id="theme-filter"
            name="theme-filter"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="block w-full sm:w-44 rounded-lg border-gray-200 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {allThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAddSong}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
          >
            <MusicalNoteIcon
              className="-ml-0.5 mr-1.5 h-4 w-4"
              aria-hidden="true"
            />
            Add Song
          </button>
        </div>
      </div>

      {/* Song Cards Grid */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onViewSong(song)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
            >
              {/* Song Card Header */}
              <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-600">{song.author}</p>
                  </div>
                  <div className="bg-white h-10 w-10 rounded-full border border-indigo-200 flex items-center justify-center">
                    <span className="text-sm font-mono font-medium text-indigo-700">
                      {song.defaultKey}
                    </span>
                  </div>
                </div>
              </div>

              {/* Song Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Song Technical Details */}
                  <div className="flex space-x-3 text-xs mb-3">
                    <div className="bg-gray-100 text-gray-700 rounded-md px-2 py-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      {song.tempo}
                    </div>
                    <div className="bg-gray-100 text-gray-700 rounded-md px-2 py-1">
                      {song.timeSignature}
                    </div>
                  </div>

                  {/* Song Themes */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {song.themes.map(
                        (theme, index) =>
                          index < 3 && (
                            <span
                              key={theme}
                              className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                            >
                              {theme}
                            </span>
                          ),
                      )}
                      {song.themes.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                          +{song.themes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Song Footer */}
                <div className="flex justify-between items-center pt-3 text-xs text-gray-500 border-t border-gray-100">
                  <div>
                    <span className="font-medium">Last used:</span>{" "}
                    {formatDate(song.lastUsed)}
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    CCLI #{song.ccli}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No songs found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
          {searchTerm || selectedTheme !== "All Themes" ? (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTheme("All Themes");
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <button
                type="button"
                onClick={onAddSong}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add your first song
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
