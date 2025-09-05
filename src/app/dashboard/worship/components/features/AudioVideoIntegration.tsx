"use client";

import { useState } from "react";
import { Song } from "../SongLibrary";

interface AudioVideoIntegrationProps {
  song: Song;
}

export default function AudioVideoIntegration({
  song,
}: AudioVideoIntegrationProps) {
  const [activeTab, setActiveTab] = useState<"audio" | "video">("audio");
  const [customAudioUrl, setCustomAudioUrl] = useState(song.audioUrl || "");
  const [customVideoUrl, setCustomVideoUrl] = useState(song.videoUrl || "");
  const [audioError, setAudioError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Determine if audio or video is available
  const hasAudio = !!song.audioUrl || !!customAudioUrl;
  const hasVideo = !!song.videoUrl || !!customVideoUrl;

  // Handle media error
  const handleMediaError = () => {
    if (activeTab === "audio") {
      setAudioError(true);
    } else {
      setVideoError(true);
    }
  };

  // Reset error when changing tab
  const handleTabChange = (tab: "audio" | "video") => {
    setActiveTab(tab);
    setAudioError(false);
    setVideoError(false);
  };

  // Save custom URL
  const saveCustomUrl = () => {
    // This would typically update the song in the database
    alert(
      `Custom ${activeTab} URL saved. In a real application, this would update the database.`,
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Audio/Video Resources</h3>

      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "audio"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("audio")}
          >
            Audio Recording
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "video"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("video")}
          >
            Video Recording
          </button>
        </div>
      </div>

      {activeTab === "audio" && (
        <div className="space-y-4">
          {!hasAudio ? (
            <div className="text-gray-500 italic">
              No audio recording available for this song.
            </div>
          ) : audioError ? (
            <div className="text-red-500">
              Error loading audio. The URL may be invalid or inaccessible.
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              <audio
                controls
                className="w-full"
                src={customAudioUrl || song.audioUrl}
                onError={handleMediaError}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div>
            <label
              htmlFor="custom-audio-url"
              className="block text-sm font-medium text-gray-700"
            >
              Custom Audio URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="custom-audio-url"
                value={customAudioUrl}
                onChange={(e) => setCustomAudioUrl(e.target.value)}
                placeholder="https://example.com/song-audio.mp3"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={saveCustomUrl}
                className="ml-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Enter a direct link to an audio file (mp3, wav, etc.)
            </p>
          </div>

          <div className="mt-4 bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-700 mb-2">
              Practice Tips
            </h4>
            <ul className="text-sm text-blue-600 ml-5 list-disc">
              <li>
                Listen to the original recording multiple times to internalize
                the melody
              </li>
              <li>Practice with a metronome to maintain consistent timing</li>
              <li>Record yourself and compare with the original</li>
              <li>
                Practice in the song&apos;s original key first, then in the
                performance key
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "video" && (
        <div className="space-y-4">
          {!hasVideo ? (
            <div className="text-gray-500 italic">
              No video recording available for this song.
            </div>
          ) : videoError ? (
            <div className="text-red-500">
              Error loading video. The URL may be invalid or inaccessible.
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-64"
                src={customVideoUrl || song.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={handleMediaError}
              ></iframe>
            </div>
          )}

          <div>
            <label
              htmlFor="custom-video-url"
              className="block text-sm font-medium text-gray-700"
            >
              Custom Video URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="custom-video-url"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="https://youtube.com/embed/video-id or https://example.com/song-video.mp4"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={saveCustomUrl}
                className="ml-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Enter a YouTube embed URL or direct link to a video file
            </p>
          </div>

          <div className="mt-4 bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-700 mb-2">
              Visual Learning Tips
            </h4>
            <ul className="text-sm text-blue-600 ml-5 list-disc">
              <li>Watch performances to observe technique and expression</li>
              <li>Pay attention to stage positioning and movements</li>
              <li>Study the flow and dynamics of the song visually</li>
              <li>Notice transitions between song sections</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
