"use client";

import React from "react";
import {
  XCircleIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  ShareIcon,
  CloudArrowDownIcon,
  DocumentIcon,
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon as SolidPlayIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SermonEntity } from "@/graphql/hooks/useSermon";

interface SermonDetailsModalProps {
  open: boolean;
  onClose: () => void;
  sermon: SermonEntity | null;
  onEdit: (sermon: SermonEntity) => void;
  onDelete: (sermon: SermonEntity) => void;
}

// Utility function for formatting dates
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Utility function for formatting duration
function formatDuration(minutes: number) {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function SermonDetailsModal({
  open,
  onClose,
  sermon,
  onEdit,
  onDelete,
}: SermonDetailsModalProps) {
  if (!open || !sermon) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/sermons/${sermon.id}`,
      );
      // You could add a toast notification here
      alert("Sermon link copied to clipboard");
    }
  };

  const handleDownloadNotes = () => {
    if (sermon.notesUrl) {
      window.open(sermon.notesUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-4xl mx-4 my-8 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Sermon Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left: Thumbnail/Media */}
          <div className="w-full lg:w-2/5 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <BookOpenIcon className="h-10 w-10 text-white/80" />
            </div>

            <div className="text-center mb-6">
              <h3 className="font-bold text-xl mb-2 line-clamp-2">
                {sermon.title}
              </h3>
              <p className="text-blue-100 text-sm mb-1">
                {sermon.speaker?.name || "Unknown Speaker"}
              </p>
              <p className="text-blue-200 text-xs">
                {formatDate(sermon.datePreached)}
              </p>
            </div>

            {/* Media Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              {sermon.videoUrl && (
                <a
                  href={sermon.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Watch Video"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <VideoCameraIcon className="h-5 w-5" />
                </a>
              )}
              {sermon.audioUrl && (
                <a
                  href={sermon.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Listen Audio"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <SolidPlayIcon className="h-5 w-5" />
                </a>
              )}
              <button
                onClick={handleShare}
                title="Share"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              {sermon.notesUrl && (
                <button
                  onClick={handleDownloadNotes}
                  title="Download Notes"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <CloudArrowDownIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-3/5 p-6 flex flex-col">
            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon className="w-4 h-4" />
                <span className="font-medium">Speaker:</span>
                <span>{sermon.speaker?.name || "Unknown"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDaysIcon className="w-4 h-4" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(sermon.datePreached)}</span>
              </div>

              {sermon.duration && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4" />
                  <span className="font-medium">Duration:</span>
                  <span>{formatDuration(sermon.duration)}</span>
                </div>
              )}

              {sermon.mainScripture && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpenIcon className="w-4 h-4" />
                  <span className="font-medium">Scripture:</span>
                  <span>{sermon.mainScripture}</span>
                </div>
              )}
            </div>

            {/* Category and Series */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sermon.category && (
                <Badge variant="secondary" className="text-xs">
                  {sermon.category.name}
                </Badge>
              )}
              {sermon.series && (
                <Badge variant="outline" className="text-xs">
                  Series: {sermon.series.title}
                </Badge>
              )}
              <Badge
                variant={
                  sermon.status === "PUBLISHED" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {sermon.status}
              </Badge>
            </div>

            {/* Description */}
            {sermon.description && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Description
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {sermon.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {sermon.tags && sermon.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {sermon.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript Preview */}
            {sermon.transcriptText && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Transcript Preview
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700 line-clamp-4">
                    {sermon.transcriptText.substring(0, 200)}
                    {sermon.transcriptText.length > 200 && "..."}
                  </p>
                </div>
                {sermon.transcriptUrl && (
                  <a
                    href={sermon.transcriptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-flex items-center gap-1"
                  >
                    <DocumentIcon className="w-4 h-4" />
                    View Full Transcript
                  </a>
                )}
              </div>
            )}

            {/* Media Links */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Media</h4>
              <div className="space-y-2">
                {sermon.audioUrl && (
                  <a
                    href={sermon.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <SpeakerWaveIcon className="w-4 h-4" />
                    Audio Recording
                  </a>
                )}
                {sermon.videoUrl && (
                  <a
                    href={sermon.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <VideoCameraIcon className="w-4 h-4" />
                    Video Recording
                  </a>
                )}
                {sermon.notesUrl && (
                  <a
                    href={sermon.notesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <DocumentIcon className="w-4 h-4" />
                    Sermon Notes
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => onEdit(sermon)}
                size="sm"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(sermon)}
                size="sm"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                size="sm"
                className="ml-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
