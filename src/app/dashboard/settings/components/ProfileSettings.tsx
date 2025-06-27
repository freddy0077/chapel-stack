'use client';

import { useState, useEffect } from 'react';
import { PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useSettings, useUpdateSetting, useCreateBranchSetting } from '@/graphql/hooks/useSettings';

export default function ProfileSettings() {
  // Use global settings for profile fields (for demonstration)
  const { data, refetch } = useSettings();
  const [updateSetting] = useUpdateSetting();
  const [createSetting] = useCreateBranchSetting();

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    bio: '',
    photoUrl: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings from API (keys: firstName, lastName, email, phone, position, bio, photoUrl)
  useEffect(() => {
    if (data?.settings) {
      setProfile(prev => ({
        ...prev,
        ...Object.fromEntries(
          data.settings
            .filter(s => Object.keys(prev).includes(s.key))
            .map(s => [s.key, s.value])
        ),
      }));
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsMap = {};
      if (data?.settings) {
        for (const s of data.settings) settingsMap[s.key] = s.id;
      }
      const updates = Object.entries(profile).map(([key, value]) => {
        if (settingsMap[key]) {
          return updateSetting({
            variables: {
              id: settingsMap[key],
              input: { key, value }
            },
          });
        } else {
          return createSetting({
            variables: {
              input: { key, value },
            },
          });
        }
      });
      await Promise.all(updates);
      setSaveSuccess(true);
      refetch();
    } catch {
      setIsSaving(false);
      setSaveSuccess(false);
    }
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information and preferences
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
          {profile.photoUrl ? (
            <img 
              src={profile.photoUrl} 
              alt="Profile" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PhotoIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Change photo
          </button>
          <button
            type="button"
            className="ml-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border border-blue-100 bg-white/70 shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 backdrop-blur placeholder:text-blue-300 text-blue-900 font-medium transition-all duration-150"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border border-blue-100 bg-white/70 shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 backdrop-blur placeholder:text-blue-300 text-blue-900 font-medium transition-all duration-150"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={profile.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border border-blue-100 bg-white/70 shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 backdrop-blur placeholder:text-blue-300 text-blue-900 font-medium transition-all duration-150"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={profile.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border border-blue-100 bg-white/70 shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 backdrop-blur placeholder:text-blue-300 text-blue-900 font-medium transition-all duration-150"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            name="position"
            id="position"
            value={profile.position}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border border-blue-100 bg-white/70 shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 backdrop-blur placeholder:text-blue-300 text-blue-900 font-medium transition-all duration-150"
          />
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            value={profile.bio}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-xl border border-blue-100 bg-white/70 shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 backdrop-blur placeholder:text-blue-300 text-blue-900 font-medium transition-all duration-150"
          />
          <p className="mt-2 text-sm text-gray-500">
            Brief description for your profile.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-sm text-green-600">
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Profile saved successfully
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-lg hover:from-indigo-700 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 border-2 border-white/80 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
