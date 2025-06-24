"use client";

import { Fragment, useState, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { TeamMemberProfile } from '../TeamScheduling';
import { ServicePlan } from '../ServicesList';
import { Rehearsal, RehearsalAttendee } from '../features/RehearsalTracker';

interface CreateRehearsalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rehearsal: Omit<Rehearsal, 'id'>) => void;
  teamMembers: TeamMemberProfile[];
  services: ServicePlan[];
  editRehearsal?: Rehearsal; // For editing existing rehearsals
}

export default function CreateRehearsalModal({ 
  isOpen, 
  onClose, 
  onSave, 
  teamMembers, 
  services,
  editRehearsal
}: CreateRehearsalModalProps) {
  // Use useMemo to memoize the initial state to avoid recreating it on every render
  const initialFormState = useMemo(() => ({
    title: '',
    serviceId: '',
    date: '',
    time: '19:00',
    duration: 90,
    location: '',
    description: '',
    notes: '',
    selectedTeamMembers: [] as number[],
    songs: [] as string[],
    completed: false
  }), []); // Empty dependency array means this object is created only once
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSongs, setAvailableSongs] = useState<string[]>([]);
  const [customSong, setCustomSong] = useState('');
  
  // Initialize form with edit data if provided
  useEffect(() => {
    if (editRehearsal) {
      setFormData({
        title: editRehearsal.title,
        serviceId: editRehearsal.serviceId?.toString() || '',
        date: editRehearsal.date,
        time: editRehearsal.time,
        duration: editRehearsal.duration,
        location: editRehearsal.location,
        description: editRehearsal.description,
        notes: editRehearsal.notes,
        selectedTeamMembers: editRehearsal.teamMembers.map(m => m.teamMemberId),
        songs: editRehearsal.songs,
        completed: editRehearsal.completed
      });
    } else {
      // Reset form to initial state
      setFormData({
        title: '',
        serviceId: '',
        date: '',
        time: '19:00',
        duration: 90,
        location: '',
        description: '',
        notes: '',
        selectedTeamMembers: [],
        songs: [],
        completed: false
      });
    }
  }, [editRehearsal, isOpen]); // Removed initialFormState from dependencies
  
  // Update available songs when service is selected
  useEffect(() => {
    if (formData.serviceId) {
      const service = services.find(s => s.id === parseInt(formData.serviceId));
      if (service) {
        setAvailableSongs(service.songs.map(s => s.title));
      }
    } else {
      setAvailableSongs([]);
    }
  }, [formData.serviceId, services]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };
  
  const handleTeamMemberToggle = (memberId: number) => {
    setFormData(prev => {
      const isSelected = prev.selectedTeamMembers.includes(memberId);
      
      if (isSelected) {
        return {
          ...prev,
          selectedTeamMembers: prev.selectedTeamMembers.filter(id => id !== memberId)
        };
      } else {
        return {
          ...prev,
          selectedTeamMembers: [...prev.selectedTeamMembers, memberId]
        };
      }
    });
  };
  
  const handleSongToggle = (song: string) => {
    setFormData(prev => {
      const isSelected = prev.songs.includes(song);
      
      if (isSelected) {
        return {
          ...prev,
          songs: prev.songs.filter(s => s !== song)
        };
      } else {
        return {
          ...prev,
          songs: [...prev.songs, song]
        };
      }
    });
  };
  
  const addCustomSong = () => {
    if (customSong.trim()) {
      if (!formData.songs.includes(customSong.trim())) {
        setFormData(prev => ({
          ...prev,
          songs: [...prev.songs, customSong.trim()]
        }));
      }
      setCustomSong('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    if (formData.selectedTeamMembers.length === 0) {
      newErrors.team = 'At least one team member must be selected';
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Create team members array
    const teamMembersData: RehearsalAttendee[] = formData.selectedTeamMembers.map(memberId => {
      const member = teamMembers.find(m => m.id === memberId);
      return {
        teamMemberId: memberId,
        name: member?.name || 'Unknown Member',
        role: member?.role || 'Unknown Role',
        confirmed: false,
        attended: null,
        notes: ''
      };
    });
    
    // Create the rehearsal object
    const rehearsalData: Omit<Rehearsal, 'id'> = {
      title: formData.title,
      serviceId: formData.serviceId ? parseInt(formData.serviceId) : undefined,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      location: formData.location,
      description: formData.description,
      teamMembers: teamMembersData,
      songs: formData.songs,
      notes: formData.notes,
      completed: formData.completed
    };
    
    // If editing, include the ID
    if (editRehearsal) {
      onSave({
        ...rehearsalData,
        id: editRehearsal.id
      } as Rehearsal);
    } else {
      onSave(rehearsalData);
    }
    
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                      <CalendarDaysIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        {editRehearsal ? 'Edit Rehearsal' : 'Schedule New Rehearsal'}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">Fill out the form below to schedule a rehearsal.</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="mt-6">
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                        {/* Basic Information */}
                        <div>
                          <h2 className="text-base font-semibold leading-7 text-gray-900">Basic Information</h2>
                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            Provide the essential details for this rehearsal.
                          </p>

                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                Rehearsal Title*
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="title"
                                  id="title"
                                  value={formData.title}
                                  onChange={handleChange}
                                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.title ? 'ring-red-500' : ''}`}
                                  placeholder="e.g. Sunday Morning Service Rehearsal"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="serviceId" className="block text-sm font-medium leading-6 text-gray-900">
                                For Service (Optional)
                              </label>
                              <div className="mt-2">
                                <select
                                  id="serviceId"
                                  name="serviceId"
                                  value={formData.serviceId}
                                  onChange={handleChange}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                  <option value="">Select a service (optional)</option>
                                  {services.filter(s => !s.completed).map((service) => (
                                    <option key={service.id} value={service.id}>
                                      {service.title} ({new Date(service.date).toLocaleDateString()})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                                Date*
                              </label>
                              <div className="mt-2">
                                <input
                                  type="date"
                                  name="date"
                                  id="date"
                                  value={formData.date}
                                  onChange={handleChange}
                                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.date ? 'ring-red-500' : ''}`}
                                />
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">
                                Time*
                              </label>
                              <div className="mt-2">
                                <input
                                  type="time"
                                  name="time"
                                  id="time"
                                  value={formData.time}
                                  onChange={handleChange}
                                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.time ? 'ring-red-500' : ''}`}
                                />
                                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="duration" className="block text-sm font-medium leading-6 text-gray-900">
                                Duration (minutes)*
                              </label>
                              <div className="mt-2">
                                <input
                                  type="number"
                                  name="duration"
                                  id="duration"
                                  min="15"
                                  step="15"
                                  value={formData.duration}
                                  onChange={handleNumberInputChange}
                                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.duration ? 'ring-red-500' : ''}`}
                                  placeholder="90"
                                />
                                {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                Location*
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="location"
                                  id="location"
                                  value={formData.location}
                                  onChange={handleChange}
                                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.location ? 'ring-red-500' : ''}`}
                                  placeholder="e.g. Main Sanctuary"
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                              </div>
                            </div>
                            
                            <div className="sm:col-span-6">
                              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={3}
                                  value={formData.description}
                                  onChange={handleChange}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="Brief description of the rehearsal..."
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                                Notes
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="notes"
                                  name="notes"
                                  rows={3}
                                  value={formData.notes}
                                  onChange={handleChange}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="Additional notes or instructions..."
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Team & Songs */}
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8">
                          <div>
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Team Members*</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              Select the team members who should attend this rehearsal.
                            </p>
                            {errors.team && <p className="mt-1 text-sm text-red-600">{errors.team}</p>}

                            <div className="mt-3 max-h-60 overflow-y-auto pr-2">
                              <fieldset>
                                <legend className="sr-only">Team Members</legend>
                                <div className="space-y-2">
                                  {teamMembers
                                    .filter(member => member.status === 'Active')
                                    .map((member) => (
                                    <div key={member.id} className="relative flex items-start py-1">
                                      <div className="min-w-0 flex-1 text-sm leading-6">
                                        <label 
                                          htmlFor={`team-member-${member.id}`} 
                                          className="select-none font-medium text-gray-900 flex items-center"
                                        >
                                          <span>{member.name}</span>
                                          <span className="ml-2 text-xs text-gray-500">({member.role})</span>
                                        </label>
                                      </div>
                                      <div className="ml-3 flex h-6 items-center">
                                        <input
                                          id={`team-member-${member.id}`}
                                          name={`team-member-${member.id}`}
                                          type="checkbox"
                                          checked={formData.selectedTeamMembers.includes(member.id)}
                                          onChange={() => handleTeamMemberToggle(member.id)}
                                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </fieldset>
                            </div>
                          </div>
                          
                          <div>
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Songs</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              Select songs to rehearse. 
                              {formData.serviceId && availableSongs.length > 0 &&
                                " Songs from the selected service are available below."}
                            </p>

                            {formData.serviceId && availableSongs.length > 0 && (
                              <div className="mt-3 max-h-40 overflow-y-auto pr-2">
                                <fieldset>
                                  <legend className="sr-only">Songs from Service</legend>
                                  <div className="space-y-2">
                                    {availableSongs.map((song, idx) => (
                                      <div key={idx} className="relative flex items-start py-1">
                                        <div className="min-w-0 flex-1 text-sm leading-6">
                                          <label 
                                            htmlFor={`song-${idx}`} 
                                            className="select-none font-medium text-gray-900"
                                          >
                                            {song}
                                          </label>
                                        </div>
                                        <div className="ml-3 flex h-6 items-center">
                                          <input
                                            id={`song-${idx}`}
                                            name={`song-${idx}`}
                                            type="checkbox"
                                            checked={formData.songs.includes(song)}
                                            onChange={() => handleSongToggle(song)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </fieldset>
                              </div>
                            )}
                            
                            <div className="mt-3">
                              <label htmlFor="custom-song" className="block text-sm font-medium leading-6 text-gray-900">
                                Add Custom Song
                              </label>
                              <div className="mt-2 flex rounded-md shadow-sm">
                                <input
                                  type="text"
                                  name="custom-song"
                                  id="custom-song"
                                  value={customSong}
                                  onChange={(e) => setCustomSong(e.target.value)}
                                  className="block w-full rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="Enter song name"
                                />
                                <button
                                  type="button"
                                  onClick={addCustomSong}
                                  className="relative -ml-px inline-flex items-center rounded-r-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                            
                            {formData.songs.length > 0 && (
                              <div className="mt-3">
                                <h3 className="text-sm font-medium leading-6 text-gray-900">Selected Songs:</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {formData.songs.map((song, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                                    >
                                      {song}
                                      <button
                                        type="button"
                                        onClick={() => handleSongToggle(song)}
                                        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
                                      >
                                        <span className="sr-only">Remove {song}</span>
                                        <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {editRehearsal ? 'Save Changes' : 'Schedule Rehearsal'}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
