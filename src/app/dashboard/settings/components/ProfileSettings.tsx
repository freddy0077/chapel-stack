"use client";

import { useState, useEffect } from "react";
import { PhotoIcon, CheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useQuery, useMutation, gql } from "@apollo/client";
import { toast } from "react-hot-toast";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      phoneNumber
    }
  }
`;

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      phoneNumber
    }
  }
`;

export default function ProfileSettings() {
  const { state } = useAuth();
  const userId = state.user?.id;

  const { data, loading, refetch } = useQuery(GET_CURRENT_USER);

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_PROFILE);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load user data from API
  useEffect(() => {
    if (data?.me) {
      setProfile({
        firstName: data.me.firstName || "",
        lastName: data.me.lastName || "",
        email: data.me.email || "",
        phoneNumber: data.me.phoneNumber || "",
      });
    } else if (state.user) {
      // Fallback to auth context data
      setProfile({
        firstName: state.user.firstName || "",
        lastName: state.user.lastName || "",
        email: state.user.email || "",
        phoneNumber: state.user.phoneNumber || "",
      });
    }
  }, [data, state.user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser({
        variables: {
          id: userId,
          input: profile,
        },
      });
      
      setSaveSuccess(true);
      toast.success("Profile updated successfully!");
      refetch();
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Not logged in
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Profile Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information and preferences
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <h4 className="text-base font-semibold leading-6 text-gray-900 mb-6">
          Personal Information
        </h4>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={profile.email}
            onChange={handleInputChange}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Email cannot be changed
          </p>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      </div>

      <div className="flex items-center justify-end gap-x-6 pt-4">
        {saveSuccess && (
          <div className="flex items-center text-green-600">
            <CheckIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Profile saved successfully!</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={updating}
          className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {updating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </div>
  );
}
