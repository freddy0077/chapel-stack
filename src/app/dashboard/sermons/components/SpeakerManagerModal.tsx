"use client";

import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetSpeakers, useCreateSpeaker, useUpdateSpeaker, useDeleteSpeaker, SpeakerEntity } from '@/graphql/hooks/useSermon';
import { useAuth } from '@/contexts/AuthContextEnhanced';

interface SpeakerManagerModalProps {
  open: boolean;
  onClose: () => void;
}

interface SpeakerFormData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  imageUrl: string;
}

export const SpeakerManagerModal = ({ open, onClose }: SpeakerManagerModalProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<SpeakerEntity | null>(null);
  const [formData, setFormData] = useState<SpeakerFormData>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    imageUrl: ''
  });

  const { state } = useAuth();
  const user = state.user;
  const { data: speakersData, loading: speakersLoading, refetch: refetchSpeakers } = useGetSpeakers();
  const [createSpeaker, { loading: createLoading }] = useCreateSpeaker();
  const [updateSpeaker, { loading: updateLoading }] = useUpdateSpeaker();
  const [deleteSpeaker, { loading: deleteLoading }] = useDeleteSpeaker();

  const mutationLoading = createLoading || updateLoading || deleteLoading;
  const speakers = speakersData?.speakers || [];

  const handleAddSpeaker = () => {
    setEditingSpeaker(null);
    setFormData({
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      website: '',
      imageUrl: ''
    });
    setShowForm(true);
  };

  const handleEditSpeaker = (speaker: SpeakerEntity) => {
    setEditingSpeaker(speaker);
    setFormData({
      name: speaker.name || '',
      title: speaker.title || '',
      bio: speaker.bio || '',
      email: speaker.email || '',
      phone: speaker.phone || '',
      website: speaker.website || '',
      imageUrl: speaker.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDeleteSpeaker = async (speaker: SpeakerEntity) => {
    if (window.confirm(`Are you sure you want to delete "${speaker.name}"?`)) {
      try {
        await deleteSpeaker({ variables: { id: speaker.id } });
        await refetchSpeakers();
      } catch (error) {
        console.error('Error deleting speaker:', error);
        alert('Failed to delete speaker. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get branchId from user context
      const branchId = user?.userBranches?.[0]?.branch?.id;
      if (!branchId) {
        alert('Branch ID is required but not found. Please contact support.');
        return;
      }

      if (editingSpeaker) {
        await updateSpeaker({
          variables: {
            updateSpeakerInput: {
              id: editingSpeaker.id,
              name: formData.name,
              bio: formData.bio || undefined,
              imageUrl: formData.imageUrl || undefined,
              memberId: formData.memberId || undefined,
            }
          }
        });
      } else {
        await createSpeaker({
          variables: {
            createSpeakerInput: {
              name: formData.name,
              bio: formData.bio || undefined,
              imageUrl: formData.imageUrl || undefined,
              memberId: formData.memberId || undefined,
              branchId: branchId,
            }
          }
        });
      }
      
      await refetchSpeakers();
      setShowForm(false);
      setEditingSpeaker(null);
    } catch (error) {
      console.error('Error saving speaker:', error);
      alert('Failed to save speaker. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Manage Speakers</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showForm ? (
            <>
              {/* Header with Add Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Speakers ({speakers.length})
                </h3>
                <Button 
                  onClick={handleAddSpeaker}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Speaker
                </Button>
              </div>

              {/* Speakers List */}
              {speakersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : speakers.length === 0 ? (
                <div className="text-center py-12">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No speakers found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first speaker.</p>
                  <Button onClick={handleAddSpeaker} className="bg-green-600 hover:bg-green-700 text-white">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add First Speaker
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {speakers.map((speaker) => (
                    <Card key={speaker.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            {speaker.imageUrl ? (
                              <img 
                                src={speaker.imageUrl} 
                                alt={speaker.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{speaker.name}</h4>
                            {speaker.title && (
                              <p className="text-sm text-gray-600">{speaker.title}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditSpeaker(speaker)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSpeaker(speaker)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {speaker.bio && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{speaker.bio}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {speaker.email && (
                          <Badge variant="outline" className="text-xs">Email</Badge>
                        )}
                        {speaker.phone && (
                          <Badge variant="outline" className="text-xs">Phone</Badge>
                        )}
                        {speaker.website && (
                          <Badge variant="outline" className="text-xs">Website</Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Speaker Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
                </h3>
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Back to List
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter speaker's full name"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Title/Position
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Pastor, Minister, Guest Speaker"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="speaker@example.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Image URL
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Enter speaker's biography..."
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutationLoading}
                  className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 font-medium transition-colors"
                >
                  {mutationLoading ? 'Saving...' : editingSpeaker ? 'Update Speaker' : 'Create Speaker'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
