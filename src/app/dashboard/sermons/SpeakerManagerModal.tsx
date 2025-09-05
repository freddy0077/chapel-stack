"use client";

import { useState } from "react";
import { useGetSpeakers } from "@/graphql/hooks/useSermon";
import { useSpeakerMutations } from "@/graphql/hooks/useSpeakerMutations";
import {
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";

// Speaker Form Modal (for create/edit within the manager)
const SpeakerFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [bio, setBio] = useState(initialData?.bio || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: initialData?.id, name, title, bio });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Speaker" : "Add Speaker"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="speaker-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Speaker Name
            </label>
            <input
              id="speaker-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="speaker-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title/Position (Optional)
            </label>
            <input
              id="speaker-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Pastor, Guest Speaker"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="speaker-bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Biography (Optional)
            </label>
            <textarea
              id="speaker-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief biography of the speaker"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Speaker Manager Modal
export const SpeakerManagerModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const branchId = user?.userBranches?.[0]?.branch?.id;
  const { speakers, loading, error } = useGetSpeakers(branchId);
  const { createSpeaker, updateSpeaker, removeSpeaker, isSaving } =
    useSpeakerMutations();
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);

  const handleSaveSpeaker = async (data) => {
    try {
      if (data.id) {
        await updateSpeaker({
          variables: {
            updateSpeakerInput: {
              id: data.id,
              name: data.name,
              title: data.title,
              bio: data.bio,
              branchId,
            },
          },
        });
      } else {
        await createSpeaker({
          variables: {
            createSpeakerInput: {
              name: data.name,
              title: data.title,
              bio: data.bio,
              branchId,
            },
          },
        });
      }
      setFormModalOpen(false);
      setEditingSpeaker(null);
    } catch (error) {
      console.error("Error saving speaker:", error);
      alert("Failed to save speaker. Please try again.");
    }
  };

  const handleEdit = (speaker) => {
    setEditingSpeaker(speaker);
    setFormModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this speaker?")) {
      try {
        await removeSpeaker({ variables: { id } });
      } catch (error) {
        console.error("Error deleting speaker:", error);
        alert("Failed to delete speaker. Please try again.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Manage Speakers</h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => {
            setEditingSpeaker(null);
            setFormModalOpen(true);
          }}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Speaker
        </button>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            Error loading speakers: {error.message}
          </div>
        )}

        {!loading && speakers?.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No speakers found. Create your first speaker!
            </p>
          </div>
        )}

        {!loading && speakers?.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {speakers.map((speaker) => (
                  <tr key={speaker.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {speaker.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {speaker.title || (
                        <span className="text-gray-400 italic">No title</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(speaker)}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1 mr-4"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(speaker.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <SpeakerFormModal
          open={isFormModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleSaveSpeaker}
          initialData={editingSpeaker}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};
