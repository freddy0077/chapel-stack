'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HeartIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useQuery } from '@apollo/client';
import { GET_MEMBERS_LIST } from '../../graphql/queries/memberQueries';
import { 
  DeathRegister, 
  CreateDeathRegisterInput, 
  UpdateDeathRegisterInput, 
  BurialType,
  DeathRegisterFormData 
} from '../../types/deathRegister';
import { formatDateForInput } from '../../utils/dateUtils';
import { 
  DeathDetailsStep, 
  FuneralArrangementsStep, 
  FamilyContactStep, 
  DocumentsStep 
} from './DeathRegisterFormSteps';

interface ModernDeathRegisterFormProps {
  deathRegister?: DeathRegister;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeathRegisterInput | UpdateDeathRegisterInput) => Promise<void>;
  loading: boolean;
  organisationId: string;
  branchId?: string;
}

interface Member {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  profileImageUrl?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

const FORM_STEPS = [
  {
    id: 'member',
    title: 'Select Member',
    description: 'Choose the deceased member from your records',
    icon: UserIcon,
  },
  {
    id: 'death-details',
    title: 'Death Details',
    description: 'Record the circumstances and details of passing',
    icon: HeartIcon,
  },
  {
    id: 'funeral-arrangements',
    title: 'Funeral Arrangements',
    description: 'Plan and record funeral service details',
    icon: CalendarDaysIcon,
  },
  {
    id: 'family-contact',
    title: 'Family Contact',
    description: 'Next of kin and notification information',
    icon: UserGroupIcon,
  },
  {
    id: 'documents',
    title: 'Documents & Photos',
    description: 'Upload certificates, photos, and other documents',
    icon: DocumentTextIcon,
  },
];

export const ModernDeathRegisterForm: React.FC<ModernDeathRegisterFormProps> = ({
  deathRegister,
  isOpen,
  onClose,
  onSubmit,
  loading,
  organisationId,
  branchId,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DeathRegisterFormData>({
    selectedMember: undefined,
    dateOfDeath: '',
    timeOfDeath: '',
    placeOfDeath: '',
    causeOfDeath: '',
    circumstances: '',
    funeralDate: '',
    funeralLocation: '',
    funeralOfficiant: '',
    burialCremation: BurialType.BURIAL,
    cemeteryLocation: '',
    nextOfKin: '',
    nextOfKinPhone: '',
    nextOfKinEmail: '',
    familyNotified: false,
    notificationDate: '',
    deathCertificateUrl: '',
    obituaryUrl: '',
    photoUrls: [],
    additionalDocuments: [],
    branchId: branchId || undefined,
    organisationId,
    funeralEventId: '',
  });

  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch members for selection
  const { data: membersData, loading: membersLoading } = useQuery(GET_MEMBERS_LIST, {
    variables: {
      organisationId,
      branchId,
      search: memberSearchTerm,
      memberStatus: ['ACTIVE'],
      take: 20,
    },
    skip: currentStep !== 0,
  });

  const members: Member[] = membersData?.members || [];

  const handleInputChange = (field: keyof DeathRegisterFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0:
        if (!formData.selectedMember) {
          newErrors.selectedMember = 'Please select a member';
        }
        break;
      case 1:
        if (!formData.dateOfDeath) {
          newErrors.dateOfDeath = 'Date of death is required';
        }
        if (!formData.placeOfDeath) {
          newErrors.placeOfDeath = 'Place of death is required';
        }
        break;
      case 2:
        if (!formData.funeralDate) {
          newErrors.funeralDate = 'Funeral date is required';
        }
        if (!formData.funeralLocation) {
          newErrors.funeralLocation = 'Funeral location is required';
        }
        break;
      case 3:
        if (!formData.nextOfKin) {
          newErrors.nextOfKin = 'Next of kin name is required';
        }
        if (!formData.nextOfKinPhone) {
          newErrors.nextOfKinPhone = 'Next of kin phone is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // Helper function to convert date string to ISO 8601 format
      const formatDateToISO = (dateString: string): string | undefined => {
        if (!dateString || dateString.trim() === '') return undefined;
        try {
          // Handle different date input formats
          let date: Date;
          
          // If it's already in YYYY-MM-DD format from date input
          if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            date = new Date(dateString + 'T00:00:00.000Z');
          } else {
            date = new Date(dateString);
          }
          
          // Check if date is valid
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateString);
            return undefined;
          }
          
          const isoString = date.toISOString();
          console.log(`Formatted date: ${dateString} -> ${isoString}`);
          return isoString;
        } catch (error) {
          console.error('Error formatting date:', dateString, error);
          return undefined;
        }
      };

      const submitData = {
        ...formData,
        memberId: formData.selectedMember?.id,
        selectedMember: undefined,
        // Convert date strings to ISO 8601 format, filter out undefined values
        dateOfDeath: formatDateToISO(formData.dateOfDeath) || formData.dateOfDeath, // Fallback to original if formatting fails
        funeralDate: formatDateToISO(formData.funeralDate),
        notificationDate: formData.familyNotified && formData.notificationDate 
          ? formatDateToISO(formData.notificationDate) 
          : undefined,
      };

      // Remove undefined date fields to avoid sending them, but keep required fields
      Object.keys(submitData).forEach(key => {
        // Don't delete required fields even if they're undefined
        const requiredFields = ['dateOfDeath', 'memberId', 'placeOfDeath', 'organisationId'];
        if (submitData[key] === undefined && !requiredFields.includes(key)) {
          delete submitData[key];
        }
        // Also remove empty strings for optional foreign key fields
        if (submitData[key] === '' && ['branchId', 'funeralEventId'].includes(key)) {
          delete submitData[key];
        }
      });

      console.log('Submitting death register data:', submitData);
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting death register:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-purple-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {deathRegister ? 'Edit Death Record' : 'Add Death Record'}
              </h2>
              <p className="text-slate-300 text-sm">
                {FORM_STEPS[currentStep].description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {FORM_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  index <= currentStep 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < FORM_STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-200 ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <h3 className="font-semibold text-gray-900">{FORM_STEPS[currentStep].title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step content will be rendered here based on currentStep */}
          {currentStep === 0 && (
            <MemberSelectionStep 
              members={members}
              membersLoading={membersLoading}
              selectedMember={formData.selectedMember}
              onSelectMember={(member) => handleInputChange('selectedMember', member)}
              searchTerm={memberSearchTerm}
              onSearchChange={setMemberSearchTerm}
              error={errors.selectedMember}
            />
          )}
          {currentStep === 1 && (
            <DeathDetailsStep 
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <FuneralArrangementsStep 
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <FamilyContactStep 
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <DocumentsStep 
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentStep === FORM_STEPS.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      <span>Save Record</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <span>Next</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const MemberSelectionStep: React.FC<{
  members: Member[];
  membersLoading: boolean;
  selectedMember?: Member;
  onSelectMember: (member: Member) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  error?: string;
}> = ({ members, membersLoading, selectedMember, onSelectMember, searchTerm, onSearchChange, error }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search for Member
      </label>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>

    {selectedMember && (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedMember.firstName} {selectedMember.middleName} {selectedMember.lastName}
            </h3>
            <p className="text-sm text-gray-600">{selectedMember.email}</p>
          </div>
        </div>
      </div>
    )}

    <div className="space-y-2 max-h-64 overflow-y-auto">
      {membersLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : members.length > 0 ? (
        members.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelectMember(member)}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
              selectedMember?.id === member.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {member.firstName} {member.middleName} {member.lastName}
                </h4>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No members found matching your search.' : 'Start typing to search for members.'}
        </div>
      )}
    </div>
  </div>
);
