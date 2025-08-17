'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  DocumentTextIcon,
  CheckCircleIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MEMBERS_LIST } from '../../graphql/queries/memberQueries';
import { GET_PRESIGNED_UPLOAD_URL } from '../../graphql/mutations/memberMutations';
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

  // File upload state management (following sermons pattern)
  const [uploading, setUploading] = useState({ 
    deathCertificate: false, 
    obituary: false, 
    photos: false, 
    additionalDocuments: false 
  });
  const [uploadProgress, setUploadProgress] = useState({ 
    deathCertificate: 0, 
    obituary: 0, 
    photos: 0, 
    additionalDocuments: 0 
  });
  const [uploadErrors, setUploadErrors] = useState({ 
    deathCertificateUrl: '', 
    obituaryUrl: '', 
    photoUrls: '', 
    additionalDocuments: '' 
  });
  const [selectedFiles, setSelectedFiles] = useState({ 
    deathCertificateUrl: null as File | null, 
    obituaryUrl: null as File | null, 
    photoUrls: null as File | null, 
    additionalDocuments: null as File | null 
  });

  // File input refs
  const deathCertificateInputRef = useRef<HTMLInputElement>(null);
  const obituaryInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const additionalDocumentsInputRef = useRef<HTMLInputElement>(null);

  // GraphQL mutation for presigned upload URL
  const [getPresignedUploadUrl] = useMutation(GET_PRESIGNED_UPLOAD_URL);

  // Initialize form data when editing an existing record
  useEffect(() => {
    if (deathRegister && isOpen) {
      // Format dates for input fields
      const formatDateForInput = (date: string | Date | null | undefined): string => {
        if (!date) return '';
        try {
          const dateObj = typeof date === 'string' ? new Date(date) : date;
          if (isNaN(dateObj.getTime())) return '';
          return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };

      // Populate form with existing data
      setFormData({
        selectedMember: deathRegister.member ? {
          id: deathRegister.member.id,
          firstName: deathRegister.member.firstName,
          middleName: deathRegister.member.middleName || '',
          lastName: deathRegister.member.lastName,
          profileImageUrl: deathRegister.member.profileImageUrl,
          dateOfBirth: deathRegister.member.dateOfBirth,
          phoneNumber: deathRegister.member.phoneNumber,
          email: deathRegister.member.email,
          address: deathRegister.member.address,
        } : undefined,
        dateOfDeath: formatDateForInput(deathRegister.dateOfDeath),
        timeOfDeath: deathRegister.timeOfDeath || '',
        placeOfDeath: deathRegister.placeOfDeath || '',
        causeOfDeath: deathRegister.causeOfDeath || '',
        circumstances: deathRegister.circumstances || '',
        funeralDate: formatDateForInput(deathRegister.funeralDate),
        funeralLocation: deathRegister.funeralLocation || '',
        funeralOfficiant: deathRegister.funeralOfficiant || '',
        burialCremation: deathRegister.burialCremation || BurialType.BURIAL,
        cemeteryLocation: deathRegister.cemeteryLocation || '',
        nextOfKin: deathRegister.nextOfKin || '',
        nextOfKinPhone: deathRegister.nextOfKinPhone || '',
        nextOfKinEmail: deathRegister.nextOfKinEmail || '',
        familyNotified: deathRegister.familyNotified || false,
        notificationDate: formatDateForInput(deathRegister.notificationDate),
        deathCertificateUrl: deathRegister.deathCertificateUrl || '',
        obituaryUrl: deathRegister.obituaryUrl || '',
        photoUrls: deathRegister.photoUrls || [],
        additionalDocuments: deathRegister.additionalDocuments || [],
        branchId: deathRegister.branchId || branchId || undefined,
        organisationId: deathRegister.organisationId || organisationId,
        funeralEventId: deathRegister.funeralEventId || '',
      });

      // Start at step 1 (Death Details) when editing since member is already selected
      setCurrentStep(1);
      // Clear any existing errors
      setErrors({});
    } else if (!deathRegister && isOpen) {
      // Reset form for create mode
      setFormData({
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
      // Start at step 0 (Member Selection) for create mode
      setCurrentStep(0);
      setErrors({});
    }
  }, [deathRegister, isOpen, organisationId, branchId]);

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
        // Skip member validation in edit mode since member is already selected
        if (!deathRegister && !formData.selectedMember) {
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
        // Include ID for update operations
        ...(deathRegister && { id: deathRegister.id }),
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

  // File upload functions (following sermons pattern)
  const handleFileSelect = (file: File | null, type: keyof typeof selectedFiles) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadToS3 = async (file: File, type: string) => {
    if (!file) return;
    
    // Map the type to the correct state key
    const stateKey = type.replace('Url', '').replace('death', 'death').replace('Certificate', 'Certificate'); 
    // 'deathCertificateUrl' -> 'deathCertificate', 'obituaryUrl' -> 'obituary', etc.
    const uploadStateKey = type === 'deathCertificateUrl' ? 'deathCertificate' : 
                          type === 'obituaryUrl' ? 'obituary' :
                          type === 'photoUrls' ? 'photos' : 'additionalDocuments';
    
    try {
      setUploading(prev => ({ ...prev, [uploadStateKey]: true }));
      setUploadProgress(prev => ({ ...prev, [uploadStateKey]: 0 }));
      setUploadErrors(prev => ({ ...prev, [type]: '' }));
      
      // Determine media type based on file type
      let mediaType = 'DOCUMENT';
      if (file.type.startsWith('image/')) {
        mediaType = 'IMAGE';
      } else if (file.type.includes('pdf')) {
        mediaType = 'DOCUMENT';
      }
      
      const { data } = await getPresignedUploadUrl({
        variables: {
          input: {
            fileName: file.name,
            contentType: file.type,
            mediaType: mediaType,
            branchId: branchId,
            description: `Death Register ${type} file: ${file.name}`
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
          setUploadProgress(prev => ({
            ...prev, 
            [uploadStateKey]: percentComplete
          }));
        }
      });
      
      // Send the request
      xhr.open('POST', '/api/proxy-upload');
      
      // Fallback progress simulation
      let progressInterval: NodeJS.Timeout;
      let simulatedProgress = 0;
      
      progressInterval = setInterval(() => {
        if (simulatedProgress < 90) {
          simulatedProgress += Math.random() * 10;
          if (simulatedProgress > 90) simulatedProgress = 90;
          setUploadProgress(prev => ({
            ...prev, 
            [uploadStateKey]: Math.round(simulatedProgress)
          }));
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
          
          // Update form data based on file type
          if (type === 'photoUrls') {
            // For photos, add to array
            setFormData(prev => ({ 
              ...prev, 
              photoUrls: [...(prev.photoUrls || []), fileUrl]
            }));
          } else if (type === 'additionalDocuments') {
            // For additional documents, add to array
            setFormData(prev => ({ 
              ...prev, 
              additionalDocuments: [...(prev.additionalDocuments || []), fileUrl]
            }));
          } else {
            // For single files (death certificate, obituary)
            setFormData(prev => ({ ...prev, [type]: fileUrl }));
          }
          
          setUploadProgress(prev => ({ ...prev, [uploadStateKey]: 100 }));
        } else {
          console.error(`Upload failed for ${type}:`, xhr.status, xhr.statusText);
          setUploadErrors(prev => ({ 
            ...prev, 
            [type]: `Failed to upload file: ${xhr.statusText}` 
          }));
        }
      });
      
      // Handle errors
      xhr.addEventListener('error', () => {
        console.error(`Upload error for ${type}`);
        setUploadErrors(prev => ({ 
          ...prev, 
          [type]: 'Upload failed due to network error' 
        }));
      });
      
      // Wait for completion
      await new Promise((resolve, reject) => {
        xhr.addEventListener('load', resolve);
        xhr.addEventListener('error', reject);
      });
      
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setUploadErrors(prev => ({ 
        ...prev, 
        [type]: error instanceof Error ? error.message : 'Upload failed' 
      }));
    } finally {
      setUploading(prev => ({ ...prev, [uploadStateKey]: false }));
    }
  };

  const handleUploadClick = async (type: keyof typeof selectedFiles) => {
    const file = selectedFiles[type];
    if (file) {
      await uploadToS3(file, type);
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

        {/* Step Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {currentStep === 0 && (
            <MemberSelectionStep
              members={members}
              membersLoading={membersLoading}
              selectedMember={formData.selectedMember}
              onSelectMember={(member) => handleInputChange('selectedMember', member)}
              searchTerm={memberSearchTerm}
              onSearchChange={setMemberSearchTerm}
              error={errors.selectedMember}
              isEditMode={!!deathRegister}
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
              uploading={uploading}
              uploadProgress={uploadProgress}
              uploadErrors={uploadErrors}
              onFileSelect={handleFileSelect}
              onUploadClick={handleUploadClick}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === (deathRegister ? 1 : 0)} // Don't allow going back to member selection in edit mode
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            {currentStep < FORM_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
              >
                Next
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {deathRegister ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {deathRegister ? 'Update Record' : 'Create Record'}
                  </>
                )}
              </button>
            )}
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
  isEditMode: boolean;
}> = ({ members, membersLoading, selectedMember, onSelectMember, searchTerm, onSearchChange, error, isEditMode }) => (
  <div className="space-y-6">
    {isEditMode && selectedMember ? (
      // Read-only member display in edit mode
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Selected Member (Edit Mode)</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {selectedMember.profileImageUrl ? (
              <img
                src={selectedMember.profileImageUrl}
                alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                className="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center border-2 border-blue-300">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {selectedMember.firstName} {selectedMember.middleName} {selectedMember.lastName}
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedMember.email && <p>Email: {selectedMember.email}</p>}
              {selectedMember.phoneNumber && <p>Phone: {selectedMember.phoneNumber}</p>}
              {selectedMember.dateOfBirth && (
                <p>Date of Birth: {new Date(selectedMember.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm text-blue-700 bg-blue-100 rounded-lg p-3">
          <p className="font-medium">Note:</p>
          <p>Member selection cannot be changed when editing an existing death record. To change the member, please create a new record.</p>
        </div>
      </div>
    ) : (
      // Original member selection interface for create mode
      <>
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
              placeholder="Type member name to search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        {selectedMember && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-900 mb-2">Selected Member</h3>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {selectedMember.profileImageUrl ? (
                  <img
                    src={selectedMember.profileImageUrl}
                    alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-green-600" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {selectedMember.firstName} {selectedMember.middleName} {selectedMember.lastName}
                </h4>
                <p className="text-sm text-gray-600">{selectedMember.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {membersLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading members...</p>
            </div>
          ) : members.length > 0 ? (
            members.map((member) => (
              <button
                key={member.id}
                onClick={() => onSelectMember(member)}
                className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
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
      </>
    )}
  </div>
);
