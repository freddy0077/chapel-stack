"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XCircleIcon,
  CalendarDaysIcon,
  UserIcon,
  PlayIcon,
  VideoCameraIcon,
  DocumentIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  CloudArrowDownIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { PlayIcon as SolidPlayIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/graphql/hooks/useAuth';
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Popover } from "@/components/ui/popover";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { gql, useMutation } from "@apollo/client";
import { GET_PRESIGNED_UPLOAD_URL } from "@/graphql/mutations/memberMutations";
import { useSermonMutations, useSermons, useSpeakers, useCategories } from "@/graphql/hooks/useSermon";
import { SpeakerManagerModal } from './SpeakerManagerModal';

// Utility function for formatting dates
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Modal component for adding/editing sermons
function SermonFormModal({ 
  open, 
  onClose, 
  onSubmit, 
  initialData, 
  categories, 
  speakers,
  series,
  isSaving,
  onUploadComplete
}: { 
  open: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
  initialData?: any;
  categories: any[];
  speakers: any[];
  series: any[];
  isSaving: boolean;
  onUploadComplete?: (type: string, fileUrl: string) => void;
}) {
  const [form, setForm] = useState(() => {
    if (!initialData) {
      return { title: '', speaker: '', date: undefined, category: '', tags: [], duration: '', description: '', videoUrl: '', audioUrl: '', notesUrl: '' };
    }
    return {
      ...initialData,
      tags: normalizeTags(initialData.tags),
      date: normalizeDate(initialData.date)
    };
  });
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [uploading, setUploading] = useState({ video: false, audio: false });
  const [selectedFiles, setSelectedFiles] = useState({ videoUrl: null, audioUrl: null });
  const [uploadErrors, setUploadErrors] = useState({ videoUrl: '', audioUrl: '' });
  const [getPresignedUploadUrl] = useMutation(GET_PRESIGNED_UPLOAD_URL);
  const {user} = useAuth();

  // S3 upload logic matching member image upload
  const handleFileSelect = (file, type) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleFileUpload = async (type) => {
    const file = selectedFiles[type];
    if (!file) {
      setUploadErrors(prev => ({ ...prev, [type]: 'No file selected!' }));
      return;
    }
    setUploading(u => ({ ...u, [type === 'videoUrl' ? 'video' : 'audio']: true }));
    try {
      // 1. Request presigned URL
      const { data } = await getPresignedUploadUrl({
        variables: {
          input: {
            fileName: file.name,
            contentType: file.type,
            mediaType: type === "videoUrl" ? "VIDEO" : "AUDIO",
            description: `${type === "videoUrl" ? "Sermon video" : "Sermon audio"} for new sermon`,
            branchId: user?.userBranches[0]?.branch?.id,
          },
        },
      });
      const { uploadUrl, fileUrl } = data.getPresignedUploadUrl;
      // 2. Proxy upload through backend to avoid CORS
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadUrl', uploadUrl);
      const uploadResp = await fetch('/api/proxy-upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResp.ok) {
        const errorText = await uploadResp.text();
        throw new Error(`Proxy upload failed: ${errorText}`);
      }
      // 3. Set URL in form
      setForm(prev => ({ ...prev, [type]: fileUrl }));
      // 4. Trigger any logic needed after upload (success notification, callback, etc.)
      if (typeof onUploadComplete === 'function') {
        onUploadComplete(type, fileUrl);
      }
      // 5. Clear selected file & error
      setSelectedFiles(prev => ({ ...prev, [type]: null }));
      setUploadErrors(prev => ({ ...prev, [type]: '' }));
    } catch (err) {
      setUploadErrors(prev => ({ ...prev, [type]: 'Failed to upload file. Please try again.' }));
    } finally {
      setUploading(u => ({ ...u, [type === 'videoUrl' ? 'video' : 'audio']: false }));
    }
  };

  function normalizeTags(tags: any): string[] {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    return [];
  }

  function normalizeDate(date: any): Date | undefined {
    if (!date) return undefined;
    if (date instanceof Date) return date;
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d;
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const newCat = { id: newCategory.trim().toLowerCase().replace(/\s+/g, '-'), name: newCategory.trim() };
    setForm({ ...form, category: newCat.id });
    setNewCategory('');
    setAddingCategory(false);
  };

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, tags: normalizeTags(initialData.tags), date: normalizeDate(initialData.date) });
    }
  }, [initialData]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 my-8 rounded-3xl shadow-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-white overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-r from-indigo-100/60 to-white border-b border-indigo-200 rounded-t-3xl">
          <h2 className="text-xl font-extrabold text-indigo-900 tracking-tight flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-indigo-500" />
            {initialData ? 'Edit Sermon' : 'Add New Sermon'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-indigo-500 transition"><XCircleIcon className="h-7 w-7" /></button>
        </div>
        {/* Modal Body */}
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="px-8 py-8 space-y-7 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-indigo-800 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 text-indigo-900 shadow-sm"
                placeholder="Sermon title"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-indigo-800 mb-1">Speaker</label>
              <select
                name="speaker"
                value={form.speaker}
                onChange={handleChange}
                className="border border-indigo-100 rounded-lg px-3 py-2 flex-1 bg-white/90 text-indigo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="" disabled>Select speaker</option>
                {speakers.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-indigo-800 mb-1">Date</label>
              <DatePicker
                date={form.date}
                onDateChange={(date: Date | undefined) => setForm(prev => ({ ...prev, date }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-indigo-800 mb-1">Category</label>
              <div className="flex items-center gap-2">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border border-indigo-100 rounded-lg px-3 py-2 flex-1 bg-white/90 text-indigo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {!addingCategory && (
                  <button type="button" onClick={() => setAddingCategory(true)} className="text-indigo-600 hover:underline text-xs font-semibold">+ Add</button>
                )}
              </div>
              {addingCategory && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="border border-indigo-100 rounded-lg px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    autoFocus
                  />
                  <button type="button" onClick={handleAddCategory} className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-xs font-semibold">Add</button>
                  <button type="button" onClick={() => { setAddingCategory(false); setNewCategory(''); }} className="text-gray-400 hover:text-red-400 text-xs font-semibold">Cancel</button>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-800 mb-1">Description</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 text-indigo-900 shadow-sm"
              rows={4}
              placeholder="Sermon description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-indigo-800 mb-1">Video URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleChange}
                  className="flex-1 border border-indigo-100 rounded-lg px-3 py-2 bg-white/90 text-indigo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Paste or upload video..."
                />
                <input
                  type="file"
                  accept="video/*"
                  ref={videoInputRef}
                  style={{ display: 'none' }}
                  onChange={e => handleFileSelect(e.target.files[0], 'videoUrl')}
                />
                <button
                  type="button"
                  className="rounded bg-indigo-500 text-white px-3 py-2 font-semibold hover:bg-indigo-600 disabled:opacity-50"
                  onClick={() => videoInputRef.current && videoInputRef.current.click()}
                  disabled={uploading.video}
                  title="Select video file"
                >
                  Select File
                </button>
                <button
                  type="button"
                  className="rounded bg-indigo-600 text-white px-3 py-2 font-semibold hover:bg-indigo-700 disabled:opacity-50"
                  onClick={() => handleFileUpload('videoUrl')}
                  disabled={uploading.video || !selectedFiles.videoUrl}
                  title="Upload video to S3"
                >
                  {uploading.video ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {uploadErrors.videoUrl && (
                <div className="text-sm text-red-600 mt-2">{uploadErrors.videoUrl}</div>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-indigo-800 mb-1">Audio URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="audioUrl"
                  value={form.audioUrl}
                  onChange={handleChange}
                  className="flex-1 border border-indigo-100 rounded-lg px-3 py-2 bg-white/90 text-indigo-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Paste or upload audio..."
                />
                <input
                  type="file"
                  accept="audio/*"
                  ref={audioInputRef}
                  style={{ display: 'none' }}
                  onChange={e => handleFileSelect(e.target.files[0], 'audioUrl')}
                />
                <button
                  type="button"
                  className="rounded bg-indigo-500 text-white px-3 py-2 font-semibold hover:bg-indigo-600 disabled:opacity-50"
                  onClick={() => audioInputRef.current && audioInputRef.current.click()}
                  disabled={uploading.audio}
                  title="Select audio file"
                >
                  Select File
                </button>
                <button
                  type="button"
                  className="rounded bg-indigo-600 text-white px-3 py-2 font-semibold hover:bg-indigo-700 disabled:opacity-50"
                  onClick={() => handleFileUpload('audioUrl')}
                  disabled={uploading.audio || !selectedFiles.audioUrl}
                  title="Upload audio to S3"
                >
                  {uploading.audio ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {uploadErrors.audioUrl && (
                <div className="text-sm text-red-600 mt-2">{uploadErrors.audioUrl}</div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-800 mb-1">Tags</label>
            <TagsInput
              value={form.tags || []}
              onChange={tags => setForm({ ...form, tags })}
              placeholder="Type a tag and press Enter"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-indigo-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold shadow-sm border border-indigo-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md border border-indigo-700 transition"
              disabled={isSaving}
            >
              {initialData ? 'Update Sermon' : 'Add Sermon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TagsInput({ value, onChange, placeholder }: { value: string[]; onChange: (tags: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    tag = tag.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) {
        addTag(input);
        setInput("");
      }
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-wrap gap-2 px-2 py-2 border border-indigo-100 rounded-lg bg-white/90 shadow-sm min-h-[46px]">
      {value.map((tag, idx) => (
        <span key={tag + idx} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
          {tag}
          <button type="button" onClick={() => removeTag(idx)} className="ml-1 text-indigo-400 hover:text-red-500 focus:outline-none">
            <XCircleIcon className="h-4 w-4" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[80px] border-none bg-transparent focus:outline-none text-indigo-900 text-sm"
        placeholder={placeholder || "Add tag and press Enter"}
      />
    </div>
  );
}

// Sermon Card Component
function SermonCard({ sermon, onViewDetails, onPlay, onVideo, onAudio }: { sermon: any; onViewDetails: (sermon: any) => void; onPlay: (sermon: any) => void; onVideo: (sermon: any) => void; onAudio: (sermon: any) => void; }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative w-full h-40 bg-gray-200">
        {sermon.thumbnailUrl ? (
          <img src={sermon.thumbnailUrl} alt={sermon.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <VideoCameraIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => onPlay(sermon)}>
            <SolidPlayIcon className="h-10 w-10" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{sermon.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <UserIcon className="h-4 w-4 mr-2" />
          <span>{sermon.speaker?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <CalendarDaysIcon className="h-4 w-4 mr-2" />
          <span>{formatDate(sermon.datePreached)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Badge variant={sermon.status === 'PUBLISHED' ? 'default' : 'secondary'}>{sermon.status}</Badge>
          {sermon.category && <Badge variant="outline" className="ml-2">{sermon.category.name}</Badge>}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(sermon)}>Details</Button>
        </div>
      </div>
    </Card>
  );
}

// Sermon Details Modal
function SermonDetailsModal({ open, onClose, sermon, onEdit, onDelete }: { open: boolean; onClose: () => void; sermon: any | null; onEdit: (sermon: any) => void; onDelete: (sermon: any) => void; }) {
  if (!open || !sermon) return null;
  const categoryInfo = sermon.category || { name: "Other" };
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/sermons/${sermon.id}`);
    alert('Sermon link copied to clipboard');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-3xl mx-4 my-8 overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-br from-indigo-50 to-white border-b border-indigo-100">
          <h2 className="text-xl font-bold text-indigo-900">Sermon Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-indigo-500 transition"><XCircleIcon className="h-6 w-6" /></button>
        </div>
        <div className="flex flex-col md:flex-row">
          {/* Left: Thumbnail/Video */}
          <div className="w-full md:w-2/5 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-6">
            <DocumentTextIcon className="h-20 w-20 opacity-40 mb-2" />
            <div className="font-bold text-lg text-center mb-2">{sermon.title}</div>
            <div className="text-indigo-100 text-sm mb-2">{sermon.speaker}</div>
            <div className="text-indigo-200 text-xs mb-4">{formatDate(sermon.datePreached)}</div>
            <div className="flex gap-2 mt-2">
              <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer" title="Watch Video" className="bg-white/90 hover:bg-white text-indigo-700 rounded-full p-2 transition"><VideoCameraIcon className="h-5 w-5" /></a>
              <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer" title="Listen Audio" className="bg-white/90 hover:bg-white text-indigo-700 rounded-full p-2 transition"><SolidPlayIcon className="h-5 w-5" /></a>
              <button onClick={handleShare} title="Share" className="bg-white/90 hover:bg-white text-indigo-700 rounded-full p-2 transition"><ShareIcon className="h-5 w-5" /></button>
              <button onClick={() => alert('Download notes')} title="Download Notes" className="bg-white/90 hover:bg-white text-indigo-700 rounded-full p-2 transition"><CloudArrowDownIcon className="h-5 w-5" /></button>
            </div>
          </div>
          {/* Right: Details */}
          <div className="w-full md:w-3/5 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700">{categoryInfo.name}</Badge>
              <span className="text-xs text-gray-400">{sermon.duration}</span>
            </div>
            <div className="mb-4 text-gray-700 whitespace-pre-line">{sermon.description}</div>
            <div className="mb-4">
              <span className="font-semibold text-gray-800">Tags:</span> {sermon.tags.map((tag: string) => <Badge key={tag} className="ml-1 text-xs">{tag}</Badge>)}
            </div>
            <div className="flex gap-3 mt-auto">
              <Button variant="outline" onClick={() => onEdit(sermon)} size="sm"><PencilIcon className="h-4 w-4 mr-1" />Edit</Button>
              <Button variant="destructive" onClick={() => onDelete(sermon)} size="sm"><TrashIcon className="h-4 w-4 mr-1" />Delete</Button>
              <Button variant="ghost" onClick={onClose} size="sm">Close</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sermon Play Modal
function SermonPlayModal({ open, onClose, sermon }: { open: boolean; onClose: () => void; sermon: any | null; }) {
  if (!open || !sermon) return null;
  const hasVideo = Boolean(sermon.videoUrl);
  const hasAudio = Boolean(sermon.audioUrl);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-2xl mx-4 my-8 overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-br from-indigo-50 to-white border-b border-indigo-100">
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <SolidPlayIcon className="h-6 w-6 text-indigo-500" /> Playing: {sermon.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-indigo-500 transition"><XCircleIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          {hasVideo ? (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <video controls src={sermon.videoUrl} className="w-full h-full" poster="/sermon-thumbnails/placeholder.jpg">
                Sorry, your browser does not support embedded videos.
              </video>
            </div>
          ) : hasAudio ? (
            <div className="w-full flex flex-col items-center justify-center">
              <audio controls src={sermon.audioUrl} className="w-full mt-8">
                Sorry, your browser does not support embedded audio.
              </audio>
            </div>
          ) : (
            <div className="text-gray-500">No media available for this sermon.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sermon Video Modal
function SermonVideoModal({ open, onClose, sermon }: { open: boolean; onClose: () => void; sermon: any | null; }) {
  if (!open || !sermon) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-3xl mx-4 my-8 overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-br from-indigo-50 to-white border-b border-indigo-100">
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <VideoCameraIcon className="h-6 w-6 text-indigo-500" /> Video: {sermon.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-indigo-500 transition"><XCircleIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          {sermon.videoUrl ? (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <video controls src={sermon.videoUrl} className="w-full h-full" poster="/sermon-thumbnails/placeholder.jpg">
                Sorry, your browser does not support embedded videos.
              </video>
            </div>
          ) : (
            <div className="text-gray-500">No video available for this sermon.</div>
          )}
          <div className="mt-4 w-full flex flex-col items-center">
            <div className="font-bold text-lg text-indigo-900">{sermon.title}</div>
            <div className="text-sm text-gray-500">{sermon.speaker} &bull; {formatDate(sermon.datePreached)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sermon Audio Modal
function SermonAudioModal({ open, onClose, sermon }: { open: boolean; onClose: () => void; sermon: any | null; }) {
  if (!open || !sermon) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-md mx-4 my-8 overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-br from-indigo-50 to-white border-b border-indigo-100">
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <ArrowTopRightOnSquareIcon className="h-6 w-6 text-indigo-500" /> Listen: {sermon.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-indigo-500 transition"><XCircleIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          {sermon.audioUrl ? (
            <audio controls src={sermon.audioUrl} className="w-full">
              Sorry, your browser does not support embedded audio.
            </audio>
          ) : (
            <div className="text-gray-500">No audio available for this sermon.</div>
          )}
          <div className="mt-4 w-full flex flex-col items-center">
            <div className="font-bold text-lg text-indigo-900">{sermon.title}</div>
            <div className="text-sm text-gray-500">{sermon.speaker} &bull; {formatDate(sermon.datePreached)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Sermons Page Component
export default function SermonsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isPlayModalOpen, setPlayModalOpen] = useState(false);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);
  const [isAudioModalOpen, setAudioModalOpen] = useState(false);
  const [isSpeakerManagerOpen, setSpeakerManagerOpen] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [editingSermon, setEditingSermon] = useState(null);

  const { selectedBranchId } = useOrganizationBranchFilter();
  const { canManageContent } = usePermissions();
  const { sermons, loading, error } = useSermons(selectedBranchId);
  const { speakers } = useSpeakers(selectedBranchId);
  const { categories } = useCategories(selectedBranchId);
  const { createSermon, updateSermon, deleteSermon, loading: isSaving } = useSermonMutations();

  const filteredSermons = useMemo(() => {
    if (!sermons) return [];
    let result = sermons;
    if (searchTerm) {
      result = result.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeCategory !== 'all') {
      result = result.filter(sermon => sermon.category?.id === activeCategory);
    }
    return result;
  }, [sermons, searchTerm, activeCategory]);

  const handleOpenFormModal = (sermon = null) => {
    setEditingSermon(sermon);
    setFormModalOpen(true);
  };

  const handleOpenDetailsModal = (sermon) => {
    setSelectedSermon(sermon);
    setDetailsModalOpen(true);
  };

  const handleOpenPlayModal = (sermon) => {
    setSelectedSermon(sermon);
    setPlayModalOpen(true);
  };

  const handleOpenVideoModal = (sermon) => {
    setSelectedSermon(sermon);
    setVideoModalOpen(true);
  };

  const handleOpenAudioModal = (sermon) => {
    setSelectedSermon(sermon);
    setAudioModalOpen(true);
  };

  const handleOpenSpeakerManager = () => {
    setSpeakerManagerOpen(true);
  };

  const handleSaveSermon = async (formData: any) => {
    const { id, tags, datePreached, speaker, ...rest } = formData;
    
    const input = {
      ...rest,
      tags: Array.isArray(tags) ? tags : [],
      datePreached: datePreached ? new Date(datePreached).toISOString() : new Date().toISOString(),
      status: 'PUBLISHED',
      speakerId: speaker, // Assuming form returns speakerId
    };

    try {
      if (id) {
        await updateSermon({ variables: { updateSermonInput: { id, ...input } } });
      } else {
        await createSermon({ variables: { createSermonInput: input } });
      }
      setFormModalOpen(false);
      setEditingSermon(null);
      // refetchSermons();
    } catch (error) {
      console.error("Failed to save sermon:", error);
    }
  };

  const handleDeleteSermon = async (sermon: any) => {
    if (window.confirm(`Are you sure you want to delete "${sermon.title}"?`)) {
      try {
        await deleteSermon({ variables: { id: sermon.id } });
        // refetchSermons();
      } catch (error) {
        console.error("Failed to delete sermon:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading sermons...</div>;
  }

  if (error) {
    return <div>Error loading sermons: {error.message}</div>;
  }

  return (
    <div className="flex-1 bg-gray-50/50 p-6">
      <div className="text-center mb-10">
        <DashboardHeader 
          title="Sermon Library" 
          description="Manage and organize your church's sermon collection" 
          icon={<DocumentTextIcon className="h-6 w-6" />}
        />
      </div>
      
      {/* Filters and actions section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10 mx-auto max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sermons..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <div className="w-full lg:w-48">
            <select
              value={activeCategory || ""}
              onChange={(e) => setActiveCategory(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Manage Speakers button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleOpenSpeakerManager}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow-sm border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              Manage Speakers
            </button>
          </div>
          {/* Add sermon button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleOpenFormModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
            >
              + Add Sermon
            </button>
          </div>
        </div>
      </div>
      
      {/* Sermons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {filteredSermons.map((sermon) => (
          <SermonCard
            key={sermon.id}
            sermon={sermon}
            onViewDetails={handleOpenDetailsModal}
            onPlay={handleOpenPlayModal}
            onVideo={handleOpenVideoModal}
            onAudio={handleOpenAudioModal}
          />
        ))}
      </div>
      
      {/* Empty state - shown when no sermons match filters */}
      {filteredSermons.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-md mx-auto mt-16">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
            <DocumentTextIcon className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">No sermons found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm || activeCategory 
              ? "Try adjusting your filters or search term" 
              : "Get started by adding your first sermon"}
          </p>
          <Button onClick={handleOpenFormModal} className="mt-6" size="lg">
            <PlusIcon className="h-5 w-5 mr-2" /> 
            Add Your First Sermon
          </Button>
        </div>
      )}
      
      {/* Modals */}
      <SermonFormModal
        open={isFormModalOpen}
        onClose={() => { setFormModalOpen(false); setEditingSermon(null); }}
        onSubmit={handleSaveSermon}
        initialData={editingSermon}
        categories={categories} 
        speakers={speakers || []}
        series={[]}
        isSaving={isSaving}
      />
      
      <SermonDetailsModal 
        open={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        sermon={selectedSermon}
        onEdit={handleOpenFormModal}
        onDelete={handleDeleteSermon}
      />
      
      <SermonPlayModal 
        open={isPlayModalOpen}
        onClose={() => setPlayModalOpen(false)}
        sermon={selectedSermon}
      />
      
      <SermonVideoModal 
        open={isVideoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        sermon={selectedSermon}
      />
      
      <SermonAudioModal 
        open={isAudioModalOpen}
        onClose={() => setAudioModalOpen(false)}
        sermon={selectedSermon}
      />
      
      <SpeakerManagerModal 
        open={isSpeakerManagerOpen}
        onClose={() => setSpeakerManagerOpen(false)}
      />
      
      {/* Pagination placeholder - would be implemented with real data */}
      {filteredSermons.length > 0 && (
        <div className="flex justify-center mt-16 mb-8">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
              1
            </a>
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              3
            </a>
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      )}
      
      {/* Optionally show loading/error UI */}
      {isSaving && <div className="text-indigo-600">Saving sermon...</div>}
    </div>
  );
}
