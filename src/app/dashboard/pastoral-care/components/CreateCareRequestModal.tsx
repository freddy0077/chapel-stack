"use client";

import React, { useState, useEffect } from 'react';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { useCreateCareRequest } from '@/graphql/hooks/usePastoralCare';
import { useSearchMembers } from '@/graphql/hooks/useSearchMembers';
import { useSearchPastoralStaff, useSearchPastors } from '@/graphql/hooks/useSearchPastoralStaff';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

interface CreateCareRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface PastoralStaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userBranches: Array<{
    branch: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
    };
  }>;
}

const requestTypes = [
  { value: 'PRAYER_REQUEST', label: 'Prayer Request' },
  { value: 'MASS_INTENTION', label: 'Mass Intention' },
  { value: 'HOSPITAL_VISIT', label: 'Hospital Visit' },
  { value: 'HOME_VISIT', label: 'Home Visit' },
  { value: 'COUNSELING', label: 'Counseling' },
  { value: 'CRISIS_SUPPORT', label: 'Crisis Support' },
  { value: 'BEREAVEMENT', label: 'Bereavement Support' },
  { value: 'FINANCIAL_ASSISTANCE', label: 'Financial Assistance' },
  { value: 'SPIRITUAL_GUIDANCE', label: 'Spiritual Guidance' },
  { value: 'FAMILY_CRISIS', label: 'Family Crisis' },
  { value: 'GENERAL_SUPPORT', label: 'General Support' },
];

const priorities = [
  { value: 'LOW', label: 'Low', color: 'text-green-600' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
  { value: 'HIGH', label: 'High', color: 'text-orange-600' },
  { value: 'URGENT', label: 'Urgent', color: 'text-red-600' },
];

export default function CreateCareRequestModal({ isOpen, onClose, onSuccess }: CreateCareRequestModalProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const { createCareRequest, loading, error } = useCreateCareRequest();

  // Form state
  const [formData, setFormData] = useState({
    memberId: '',
    title: '',
    description: '',
    requestType: 'PRAYER_REQUEST',
    priority: 'MEDIUM',
    requestDate: new Date().toISOString().split('T')[0],
    assignedPastorId: '',
    assistantId: '',
    notes: '',
  });

  // Member search state
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  // Pastor search state
  const [pastorSearch, setPastorSearch] = useState('');
  const [selectedPastor, setSelectedPastor] = useState<PastoralStaffUser | null>(null);
  const [showPastorDropdown, setShowPastorDropdown] = useState(false);

  // Assistant search state
  const [assistantSearch, setAssistantSearch] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState<PastoralStaffUser | null>(null);
  const [showAssistantDropdown, setShowAssistantDropdown] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Search for members
  const { data: members, loading: memberLoading, error: memberError } = useSearchMembers(
    memberSearch,
    organisationId || '',
    branchId
  );

  // Search for pastors (using dedicated pastor search hook)
  const { pastoralStaff: pastors, loading: pastorLoading } = useSearchPastors(
    pastorSearch,
    organisationId || '',
    branchId
  );

  // Search for assistants (using pastoral staff search hook for broader roles)
  const { pastoralStaff: assistants, loading: assistantLoading } = useSearchPastoralStaff(
    assistantSearch,
    organisationId || '',
    branchId,
    ['PASTOR', 'BRANCH_ADMIN', 'STAFF'] // All pastoral roles for assistants
  );

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setFormData(prev => ({ ...prev, memberId: member.id }));
    setMemberSearch(`${member.firstName} ${member.lastName}`);
    setShowMemberDropdown(false);
    // Clear member error if it exists
    if (errors.memberId) {
      setErrors(prev => ({ ...prev, memberId: '' }));
    }
  };

  const handlePastorSelect = (pastor: PastoralStaffUser) => {
    setSelectedPastor(pastor);
    setFormData(prev => ({ ...prev, assignedPastorId: pastor.id }));
    setPastorSearch(`${pastor.firstName} ${pastor.lastName}`);
    setShowPastorDropdown(false);
  };

  const handleAssistantSelect = (assistant: PastoralStaffUser) => {
    setSelectedAssistant(assistant);
    setFormData(prev => ({ ...prev, assistantId: assistant.id }));
    setAssistantSearch(`${assistant.firstName} ${assistant.lastName}`);
    setShowAssistantDropdown(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMemberSearchChange = (value: string) => {
    setMemberSearch(value);
    setShowMemberDropdown(value.length > 0);
    // Clear selection if user is typing a new search
    if (selectedMember && value !== `${selectedMember.firstName} ${selectedMember.lastName}`) {
      setSelectedMember(null);
      setFormData(prev => ({ ...prev, memberId: '' }));
    }
  };

  const handlePastorSearchChange = (value: string) => {
    setPastorSearch(value);
    setShowPastorDropdown(value.length > 0);
    // Clear selection if user is typing a new search
    if (selectedPastor && value !== `${selectedPastor.firstName} ${selectedPastor.lastName}`) {
      setSelectedPastor(null);
      setFormData(prev => ({ ...prev, assignedPastorId: '' }));
    }
  };

  const handleAssistantSearchChange = (value: string) => {
    setAssistantSearch(value);
    setShowAssistantDropdown(value.length > 0);
    // Clear selection if user is typing a new search
    if (selectedAssistant && value !== `${selectedAssistant.firstName} ${selectedAssistant.lastName}`) {
      setSelectedAssistant(null);
      setFormData(prev => ({ ...prev, assistantId: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.memberId.trim()) {
      newErrors.memberId = 'Member is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.requestDate) {
      newErrors.requestDate = 'Request date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      title: '',
      description: '',
      requestType: 'PRAYER_REQUEST',
      priority: 'MEDIUM',
      requestDate: new Date().toISOString().split('T')[0],
      assignedPastorId: '',
      assistantId: '',
      notes: '',
    });
    setMemberSearch('');
    setSelectedMember(null);
    setShowMemberDropdown(false);
    setPastorSearch('');
    setSelectedPastor(null);
    setShowPastorDropdown(false);
    setAssistantSearch('');
    setSelectedAssistant(null);
    setShowAssistantDropdown(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!organisationId) {
      setErrors({ submit: 'Organisation information is missing' });
      return;
    }

    try {
      const input = {
        memberId: formData.memberId.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        requestType: formData.requestType,
        priority: formData.priority,
        requestDate: formData.requestDate,
        assignedPastorId: formData.assignedPastorId.trim() || undefined,
        assistantId: formData.assistantId.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        organisationId,
        branchId: branchId || undefined,
      };

      await createCareRequest(input);
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ submit: 'Failed to create care request. Please try again.' });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">New Care Request</h2>
                <p className="mt-1 text-indigo-100">Create a new pastoral care request</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {errors.submit && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Member Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Member *
                </label>
                <div className="relative">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => handleMemberSearchChange(e.target.value)}
                      onFocus={() => setShowMemberDropdown(memberSearch.length > 0)}
                      className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                        errors.memberId ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                      }`}
                      placeholder="Search for a member..."
                    />
                  </div>
                  
                  {showMemberDropdown && memberSearch.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full rounded-xl bg-white border border-gray-200 shadow-xl max-h-64 overflow-auto">
                      {memberLoading && (
                        <div className="p-4 text-center">
                          <div className="inline-flex items-center gap-3 text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                            <span className="text-sm font-medium">Searching members...</span>
                          </div>
                        </div>
                      )}
                      {!memberLoading && members.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          <UserIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                          <p className="text-sm font-medium">No members found</p>
                        </div>
                      )}
                      {!memberLoading && members.length > 0 && members.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => handleMemberSelect(member)}
                          className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {member.firstName} {member.lastName}
                              </p>
                              {member.email && (
                                <p className="text-sm text-gray-500 truncate">{member.email}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Click outside to close dropdown */}
                  {showMemberDropdown && (
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowMemberDropdown(false)}
                    />
                  )}
                </div>
                {errors.memberId && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.memberId}</p>
                )}
              </div>

              {/* Request Type */}
              <div>
                <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type *
                </label>
                <select
                  id="requestType"
                  value={formData.requestType}
                  onChange={(e) => handleInputChange('requestType', e.target.value)}
                  className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200"
                >
                  {requestTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                    errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                  }`}
                  placeholder="Enter a brief title for the request"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                    errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                  }`}
                  placeholder="Describe the care request in detail"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>
                )}
              </div>

              <div className="space-y-6">
                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Request Date */}
                <div>
                  <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Request Date *
                  </label>
                  <input
                    type="date"
                    id="requestDate"
                    value={formData.requestDate}
                    onChange={(e) => handleInputChange('requestDate', e.target.value)}
                    className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                      errors.requestDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                    }`}
                  />
                  {errors.requestDate && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.requestDate}</p>
                  )}
                </div>
              </div>

              {/* Assigned Pastor */}
              <div>
                <label htmlFor="assignedPastor" className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Pastor (Optional)
                </label>
                <div className="relative">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="assignedPastor"
                      value={pastorSearch}
                      onChange={(e) => handlePastorSearchChange(e.target.value)}
                      onFocus={() => setShowPastorDropdown(pastorSearch.length > 0)}
                      className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200"
                      placeholder="Search for pastor"
                    />
                  </div>
                  
                  {showPastorDropdown && pastorSearch.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full rounded-xl bg-white border border-gray-200 shadow-xl max-h-64 overflow-auto">
                      {pastorLoading && (
                        <div className="p-4 text-center">
                          <div className="inline-flex items-center gap-3 text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                            <span className="text-sm font-medium">Searching pastors...</span>
                          </div>
                        </div>
                      )}
                      {!pastorLoading && pastors.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          <UserIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                          <p className="text-sm font-medium">No pastors found</p>
                        </div>
                      )}
                      {!pastorLoading && pastors.length > 0 && pastors.map((pastor) => (
                        <button
                          key={pastor.id}
                          type="button"
                          onClick={() => handlePastorSelect(pastor)}
                          className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {pastor.firstName} {pastor.lastName}
                              </p>
                              {pastor.email && (
                                <p className="text-sm text-gray-500 truncate">{pastor.email}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Click outside to close dropdown */}
                  {showPastorDropdown && (
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowPastorDropdown(false)}
                    />
                  )}
                </div>
              </div>

              {/* Assistant/Delegate */}
              <div>
                <label htmlFor="assistant" className="block text-sm font-medium text-gray-700 mb-2">
                  Assistant/Delegate (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Assign a group head or member to assist the pastor with this request
                </p>
                <div className="relative">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="assistant"
                      value={assistantSearch}
                      onChange={(e) => handleAssistantSearchChange(e.target.value)}
                      onFocus={() => setShowAssistantDropdown(assistantSearch.length > 0)}
                      className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200"
                      placeholder="Search for assistant or delegate"
                    />
                  </div>
                  
                  {showAssistantDropdown && assistantSearch.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full rounded-xl bg-white border border-gray-200 shadow-xl max-h-64 overflow-auto">
                      {assistantLoading && (
                        <div className="p-4 text-center">
                          <div className="inline-flex items-center gap-3 text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                            <span className="text-sm font-medium">Searching assistants...</span>
                          </div>
                        </div>
                      )}
                      {!assistantLoading && assistants.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          <UserIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                          <p className="text-sm font-medium">No assistants found</p>
                        </div>
                      )}
                      {!assistantLoading && assistants.length > 0 && assistants.map((assistant) => (
                        <button
                          key={assistant.id}
                          type="button"
                          onClick={() => handleAssistantSelect(assistant)}
                          className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {assistant.firstName} {assistant.lastName}
                              </p>
                              {assistant.email && (
                                <p className="text-sm text-gray-500 truncate">{assistant.email}</p>
                              )}
                              <p className="text-xs text-green-600 font-medium">
                                Assistant/Delegate
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Click outside to close dropdown */}
                  {showAssistantDropdown && (
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowAssistantDropdown(false)}
                    />
                  )}
                </div>
              </div>

              {/* Notes (Optional) */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-3">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200 resize-none"
                  placeholder="Any additional notes or special instructions..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {loading ? 'Creating Request...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
