'use client';

import { useState } from 'react';
import { useSpeakers } from '@/graphql/hooks/useSermon';
import { useSpeakerMutations } from '@/graphql/hooks/useSpeakerMutations';

// Speaker Form Modal (for create/edit within the manager)
const SpeakerFormModal = ({ open, onClose, onSubmit, initialData, isSaving }) => {
  const [name, setName] = useState(initialData?.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: initialData?.id, name });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Speaker' : 'Add Speaker'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Speaker Name"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 rounded bg-indigo-600 text-white disabled:bg-indigo-300">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Speaker Manager Modal
export const SpeakerManagerModal = ({ open, onClose }) => {
  const { speakers, loading, error } = useSpeakers();
  const { createSpeaker, updateSpeaker, removeSpeaker, isSaving } = useSpeakerMutations();
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);

  const handleSaveSpeaker = async (data) => {
    if (data.id) {
      await updateSpeaker({ variables: { input: { id: data.id, name: data.name } } });
    } else {
      await createSpeaker({ variables: { input: { name: data.name } } });
    }
    setFormModalOpen(false);
    setEditingSpeaker(null);
  };

  const handleEdit = (speaker) => {
    setEditingSpeaker(speaker);
    setFormModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this speaker?')) {
      await removeSpeaker({ variables: { id } });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Speakers</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">X</button>
        </div>
        
        <button onClick={() => { setEditingSpeaker(null); setFormModalOpen(true); }} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add Speaker
        </button>

        {loading && <p>Loading speakers...</p>}
        {error && <p>Error loading speakers: {error.message}</p>}

        <div className="bg-white shadow-md rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {speakers?.map((speaker) => (
                <tr key={speaker.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{speaker.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(speaker)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(speaker.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
