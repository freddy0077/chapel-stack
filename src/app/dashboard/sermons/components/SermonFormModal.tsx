"use client";

import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, CheckCircleIcon, VideoCameraIcon, SpeakerWaveIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@apollo/client';
import { GET_PRESIGNED_UPLOAD_URL } from '@/graphql/mutations/memberMutations';
import { CreateSermonInput, UpdateSermonInput, ContentStatus, SermonEntity, SpeakerEntity, SeriesEntity, CategoryEntity } from '@/graphql/hooks/useSermon';

interface SermonFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSermonInput | UpdateSermonInput) => void;
  initialData?: SermonEntity | null;
  categories: CategoryEntity[];
  speakers: SpeakerEntity[];
  series: SeriesEntity[];
  isSaving: boolean;
  isEditMode: boolean; // Explicit mode flag
  user: any; // User context for branch ID
  onUploadComplete?: (type: string, fileUrl: string) => void;
}

export function SermonFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  categories,
  speakers,
  series,
  isSaving,
  isEditMode,
  user,
  onUploadComplete
}: SermonFormModalProps) {
  const [form, setForm] = useState(() => {
    if (!initialData) {
      return {
        title: '',
        description: '',
        datePreached: new Date().toISOString().split('T')[0],
        speakerId: '',
        seriesId: '',
        categoryId: '',
        mainScripture: '',
        duration: '',
        audioUrl: '',
        videoUrl: '',
        transcriptUrl: '',
        notesUrl: '',
        transcriptText: '',
        status: ContentStatus.DRAFT,
        tags: [] as string[]
      };
    }
    return {
      ...initialData,
      datePreached: initialData.datePreached ? new Date(initialData.datePreached).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      duration: initialData.duration?.toString() || '',
      tags: initialData.tags?.map(tag => tag.name) || []
    };
  });

  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState({ video: false, audio: false, notes: false, transcript: false });
  const [uploadProgress, setUploadProgress] = useState({ video: 0, audio: 0, notes: 0, transcript: 0 });
  const [uploadErrors, setUploadErrors] = useState({ videoUrl: '', audioUrl: '', notesUrl: '', transcriptUrl: '' });
  const [selectedFiles, setSelectedFiles] = useState({ videoUrl: null as File | null, audioUrl: null as File | null, notesUrl: null as File | null, transcriptUrl: null as File | null });

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);

  const [getPresignedUploadUrl] = useMutation(GET_PRESIGNED_UPLOAD_URL);

  // File upload logic
  const handleFileSelect = (file: File | null, type: keyof typeof selectedFiles) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadToS3 = async (file: File, type: string) => {
    if (!file) return;
    
    // Map the type to the correct state key
    const stateKey = type.replace('Url', ''); // 'videoUrl' -> 'video', 'audioUrl' -> 'audio', etc.
    
    try {
      setUploading(prev => ({ ...prev, [stateKey]: true }));
      setUploadProgress(prev => ({ ...prev, [stateKey]: 0 }));
      setUploadErrors(prev => ({ ...prev, [type]: '' }));
      
      console.log(`Starting upload for ${type} (stateKey: ${stateKey})`);
      
      // Determine media type based on file type
      let mediaType = 'DOCUMENT';
      if (file.type.startsWith('video/')) {
        mediaType = 'VIDEO';
      } else if (file.type.startsWith('audio/')) {
        mediaType = 'AUDIO';
      }
      
      const { data } = await getPresignedUploadUrl({
        variables: {
          input: {
            fileName: file.name,
            contentType: file.type,
            mediaType: mediaType,
            branchId: user?.userBranches?.[0]?.branch?.id, // Use user.branchId for file uploads
            description: `Sermon ${type} file: ${file.name}`
          }
        }
      });
      
      if (!data || !data.getPresignedUploadUrl) {
        throw new Error('Failed to get presigned URL');
      }
      
      // Use XMLHttpRequest for progress tracking
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadUrl', data.getPresignedUploadUrl.uploadUrl);
      
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          console.log(`Upload progress for ${type} (stateKey: ${stateKey}):`, percentComplete + '%');
          setUploadProgress(prev => {
            const newProgress = { ...prev, [stateKey]: percentComplete };
            console.log('Updated progress state:', newProgress);
            return newProgress;
          });
        }
      });
      
      // Send the request
      xhr.open('POST', '/api/proxy-upload');
      console.log(`Starting upload for ${type}:`, file.name);
      
      // Fallback progress simulation in case XMLHttpRequest progress doesn't work
      let progressInterval: NodeJS.Timeout;
      let simulatedProgress = 0;
      
      // Start simulated progress
      progressInterval = setInterval(() => {
        if (simulatedProgress < 90) {
          simulatedProgress += Math.random() * 10;
          if (simulatedProgress > 90) simulatedProgress = 90;
          setUploadProgress(prev => {
            const newProgress = { ...prev, [stateKey]: Math.round(simulatedProgress) };
            console.log('Simulated progress state:', newProgress);
            return newProgress;
          });
        }
      }, 500);
      
      // Clear interval when upload completes
      xhr.addEventListener('load', () => {
        clearInterval(progressInterval);
      });
      
      xhr.addEventListener('error', () => {
        clearInterval(progressInterval);
      });
      
      xhr.send(formData);
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const fileUrl = data.getPresignedUploadUrl.fileUrl;
          setForm(prev => ({ ...prev, [type]: fileUrl }));
          setUploadProgress(prev => ({ ...prev, [stateKey]: 100 }));
          console.log(`Upload completed for ${type}:`, fileUrl);
          if (onUploadComplete) {
            onUploadComplete(type, fileUrl);
          }
        } else {
          console.error(`Upload failed for ${type}:`, xhr.status, xhr.statusText);
          setUploadErrors(prev => ({ ...prev, [type]: `Failed to upload file: ${xhr.statusText}` }));
        }
      });
      
      // Handle errors
      xhr.addEventListener('error', () => {
        console.error(`Upload error for ${type}`);
        setUploadErrors(prev => ({ ...prev, [type]: 'Upload failed due to network error' }));
      });
      
      // Wait for completion
      await new Promise((resolve, reject) => {
        xhr.addEventListener('load', resolve);
        xhr.addEventListener('error', reject);
      });
      
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setUploadErrors(prev => ({ ...prev, [type]: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    } finally {
      setUploading(prev => ({ ...prev, [stateKey]: false }));
    }
  };

  // Auto-upload when files are selected
  useEffect(() => {
    if (selectedFiles.videoUrl) {
      uploadToS3(selectedFiles.videoUrl, 'videoUrl');
    }
  }, [selectedFiles.videoUrl]);

  useEffect(() => {
    if (selectedFiles.audioUrl) {
      uploadToS3(selectedFiles.audioUrl, 'audioUrl');
    }
  }, [selectedFiles.audioUrl]);

  useEffect(() => {
    if (selectedFiles.notesUrl) {
      uploadToS3(selectedFiles.notesUrl, 'notesUrl');
    }
  }, [selectedFiles.notesUrl]);

  useEffect(() => {
    if (selectedFiles.transcriptUrl) {
      uploadToS3(selectedFiles.transcriptUrl, 'transcriptUrl');
    }
  }, [selectedFiles.transcriptUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTagAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !form.tags.includes(newTag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      title: form.title,
      description: form.description || undefined,
      datePreached: new Date(form.datePreached).toISOString(),
      speakerId: form.speakerId || undefined,
      seriesId: form.seriesId || undefined,
      mainScripture: form.mainScripture || undefined,
      audioUrl: form.audioUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      transcriptUrl: form.transcriptUrl || undefined,
      notesUrl: form.notesUrl || undefined,
      transcriptText: form.transcriptText || undefined,
      duration: form.duration ? parseInt(form.duration) : undefined,
      status: form.status,
      tags: form.tags?.filter(tag => tag.trim()) || [],
      categoryId: form.categoryId || undefined,
      branchId: user?.userBranches?.[0]?.branch?.id || '',
      organisationId: user?.userBranches?.[0]?.branch?.organisation?.id || '',
    };

    if (isEditMode) {
      onSubmit({ id: initialData!.id, ...submitData } as UpdateSermonInput);
    } else {
      onSubmit(submitData as CreateSermonInput);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditMode ? 'Edit Sermon' : 'Create New Sermon'}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Sermon Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter sermon title"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          
          {/* Two column layout for speaker and date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speaker */}
            <div>
              <label htmlFor="speakerId" className="block text-sm font-semibold text-gray-700 mb-2">
                Speaker *
              </label>
              <select
                id="speakerId"
                name="speakerId"
                value={form.speakerId || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select a speaker</option>
                {speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date */}
            <div>
              <label htmlFor="datePreached" className="block text-sm font-semibold text-gray-700 mb-2">
                Date Preached *
              </label>
              <input
                id="datePreached"
                name="datePreached"
                type="date"
                value={form.datePreached}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>
          
          {/* Two column layout for category and series */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Series */}
            <div>
              <label htmlFor="seriesId" className="block text-sm font-semibold text-gray-700 mb-2">
                Series (Optional)
              </label>
              <select
                id="seriesId"
                name="seriesId"
                value={form.seriesId || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a series</option>
                {series.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scripture and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Scripture */}
            <div>
              <label htmlFor="mainScripture" className="block text-sm font-semibold text-gray-700 mb-2">
                Main Scripture
              </label>
              <input
                id="mainScripture"
                name="mainScripture"
                type="text"
                value={form.mainScripture || ''}
                onChange={handleChange}
                placeholder="e.g. John 3:16"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                value={form.duration || ''}
                onChange={handleChange}
                placeholder="e.g. 45"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              placeholder="Enter sermon description"
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map(tag => (
                <Badge key={tag} className="bg-blue-100 text-blue-800 flex items-center gap-1 py-1 px-3">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleTagRemove(tag)}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-grow p-3 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="bg-blue-600 text-white px-4 py-3 rounded-r-xl hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Media uploads section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Media Files</h3>
            
            {/* Video upload */}
            <div>
              <label htmlFor="video-upload" className="block text-sm font-semibold text-gray-700 mb-2">
                Video (Optional)
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="video-upload"
                  ref={videoInputRef}
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'videoUrl')}
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={uploading.video}
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2 text-gray-500" />
                  {uploading.video ? `Uploading... (${uploadProgress.video}%)` : 'Upload Video'}
                </button>
                {form.videoUrl && (
                  <span className="ml-3 text-sm text-green-600 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-1" /> Video uploaded
                  </span>
                )}
              </div>
              {uploading.video && (
                <div className="mt-3 w-full">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading video...</span>
                    <span>{uploadProgress.video}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress.video}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {uploadErrors.videoUrl && (
                <p className="mt-1 text-sm text-red-600">{uploadErrors.videoUrl}</p>
              )}
            </div>
            
            {/* Audio upload */}
            <div>
              <label htmlFor="audio-upload" className="block text-sm font-semibold text-gray-700 mb-2">
                Audio (Optional)
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="audio-upload"
                  ref={audioInputRef}
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'audioUrl')}
                />
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={uploading.audio}
                >
                  <SpeakerWaveIcon className="h-5 w-5 mr-2 text-gray-500" />
                  {uploading.audio ? `Uploading... (${uploadProgress.audio}%)` : 'Upload Audio'}
                </button>
                {form.audioUrl && (
                  <span className="ml-3 text-sm text-green-600 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-1" /> Audio uploaded
                  </span>
                )}
              </div>
              {uploading.audio && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading audio...</span>
                    <span>{uploadProgress.audio}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress.audio}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {uploadErrors.audioUrl && (
                <p className="mt-1 text-sm text-red-600">{uploadErrors.audioUrl}</p>
              )}
            </div>
            
            {/* Notes upload */}
            <div>
              <label htmlFor="notes-upload" className="block text-sm font-semibold text-gray-700 mb-2">
                Notes PDF (Optional)
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="notes-upload"
                  ref={notesInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'notesUrl')}
                />
                <button
                  type="button"
                  onClick={() => notesInputRef.current?.click()}
                  className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={uploading.notes}
                >
                  <DocumentIcon className="h-5 w-5 mr-2 text-gray-500" />
                  {uploading.notes ? `Uploading... (${uploadProgress.notes}%)` : 'Upload Notes'}
                </button>
                {form.notesUrl && (
                  <span className="ml-3 text-sm text-green-600 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-1" /> Notes uploaded
                  </span>
                )}
              </div>
              {uploading.notes && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading notes...</span>
                    <span>{uploadProgress.notes}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress.notes}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {uploadErrors.notesUrl && (
                <p className="mt-1 text-sm text-red-600">{uploadErrors.notesUrl}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value={ContentStatus.DRAFT}>Draft</option>
                <option value={ContentStatus.PUBLISHED}>Published</option>
                <option value={ContentStatus.PENDING_REVIEW}>Pending Review</option>
                <option value={ContentStatus.ARCHIVED}>Archived</option>
              </select>
            </div>
          </div>
          
          {/* Form actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploading.video || uploading.audio || uploading.notes || uploading.transcript}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors"
            >
              {isSaving ? 'Saving...' : (isEditMode ? 'Update Sermon' : 'Create Sermon')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
