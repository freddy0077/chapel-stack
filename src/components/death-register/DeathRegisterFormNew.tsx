'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Flex } from '@tremor/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@apollo/client';
import { GET_MEMBERS } from '../../graphql/queries/memberQueries';
import { 
  DeathRegister, 
  CreateDeathRegisterInput, 
  UpdateDeathRegisterInput, 
  BurialType,
  DeathRegisterFormData 
} from '../../types/deathRegister';
import { formatDateForInput } from '../../utils/dateUtils';

// Import form sections
import { MemberSelectionSection } from './form/MemberSelectionSection';
import { DeathDetailsSection } from './form/DeathDetailsSection';
import { FuneralDetailsSection } from './form/FuneralDetailsSection';
import { FamilyContactSection } from './form/FamilyContactSection';
import { DocumentsSection } from './form/DocumentsSection';

interface DeathRegisterFormProps {
  initialData?: DeathRegister;
  onSubmit: (data: CreateDeathRegisterInput | UpdateDeathRegisterInput) => Promise<void>;
  onCancel: () => void;
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

export const DeathRegisterForm: React.FC<DeathRegisterFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  organisationId,
  branchId,
}) => {
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
    branchId: branchId || '',
    organisationId,
    funeralEventId: '',
  });

  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch members for selection
  const { data: membersData, loading: membersLoading } = useQuery(GET_MEMBERS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        status: 'ACTIVE',
        searchTerm: memberSearchTerm,
        take: 20,
      },
    },
    skip: !showMemberSearch,
  });

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        selectedMember: initialData.member,
        dateOfDeath: formatDateForInput(initialData.dateOfDeath),
        timeOfDeath: initialData.timeOfDeath || '',
        placeOfDeath: initialData.placeOfDeath || '',
        causeOfDeath: initialData.causeOfDeath || '',
        circumstances: initialData.circumstances || '',
        funeralDate: initialData.funeralDate ? formatDateForInput(initialData.funeralDate) : '',
        funeralLocation: initialData.funeralLocation || '',
        funeralOfficiant: initialData.funeralOfficiant || '',
        burialCremation: initialData.burialCremation || BurialType.BURIAL,
        cemeteryLocation: initialData.cemeteryLocation || '',
        nextOfKin: initialData.nextOfKin || '',
        nextOfKinPhone: initialData.nextOfKinPhone || '',
        nextOfKinEmail: initialData.nextOfKinEmail || '',
        familyNotified: initialData.familyNotified || false,
        notificationDate: initialData.notificationDate ? formatDateForInput(initialData.notificationDate) : '',
        deathCertificateUrl: initialData.deathCertificateUrl || '',
        obituaryUrl: initialData.obituaryUrl || '',
        photoUrls: initialData.photoUrls || [],
        additionalDocuments: initialData.additionalDocuments || [],
        branchId: initialData.branchId || branchId || '',
        organisationId: initialData.organisationId || organisationId,
        funeralEventId: initialData.funeralEventId || '',
      });
    }
  }, [initialData, branchId, organisationId]);

  // Handle field changes
  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Member selection handlers
  const handleToggleMemberSearch = useCallback(() => {
    setShowMemberSearch(!showMemberSearch);
    setMemberSearchTerm('');
  }, [showMemberSearch]);

  const handleMemberSelect = useCallback((member: Member) => {
    setFormData(prev => ({
      ...prev,
      selectedMember: member,
    }));
    setShowMemberSearch(false);
    setMemberSearchTerm('');
  }, []);

  const handleClearMemberSelection = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      selectedMember: undefined,
    }));
  }, []);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.selectedMember) {
      newErrors.selectedMember = 'Please select a member';
    }
    if (!formData.dateOfDeath) {
      newErrors.dateOfDeath = 'Date of death is required';
    }
    if (!formData.placeOfDeath.trim()) {
      newErrors.placeOfDeath = 'Place of death is required';
    }
    if (!formData.causeOfDeath.trim()) {
      newErrors.causeOfDeath = 'Cause of death is required';
    }
    if (!formData.nextOfKin.trim()) {
      newErrors.nextOfKin = 'Next of kin is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData: CreateDeathRegisterInput | UpdateDeathRegisterInput = {
        memberId: formData.selectedMember!.id,
        dateOfDeath: new Date(formData.dateOfDeath),
        timeOfDeath: formData.timeOfDeath || undefined,
        placeOfDeath: formData.placeOfDeath,
        causeOfDeath: formData.causeOfDeath,
        circumstances: formData.circumstances || undefined,
        ageAtDeath: formData.selectedMember?.dateOfBirth 
          ? Math.floor((new Date(formData.dateOfDeath).getTime() - new Date(formData.selectedMember.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : undefined,
        funeralDate: formData.funeralDate ? new Date(formData.funeralDate) : undefined,
        funeralLocation: formData.funeralLocation || undefined,
        funeralOfficiant: formData.funeralOfficiant || undefined,
        burialCremation: formData.burialCremation,
        cemeteryLocation: formData.cemeteryLocation || undefined,
        nextOfKin: formData.nextOfKin,
        nextOfKinPhone: formData.nextOfKinPhone || undefined,
        nextOfKinEmail: formData.nextOfKinEmail || undefined,
        familyNotified: formData.familyNotified,
        notificationDate: formData.notificationDate ? new Date(formData.notificationDate) : undefined,
        deathCertificateUrl: formData.deathCertificateUrl || undefined,
        obituaryUrl: formData.obituaryUrl || undefined,
        photoUrls: formData.photoUrls,
        additionalDocuments: formData.additionalDocuments,
        branchId: formData.branchId,
        organisationId: formData.organisationId,
        funeralEventId: formData.funeralEventId || undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const members = membersData?.members?.data || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Member Selection */}
      <MemberSelectionSection
        selectedMember={formData.selectedMember}
        showMemberSearch={showMemberSearch}
        memberSearchTerm={memberSearchTerm}
        members={members}
        membersLoading={membersLoading}
        onToggleSearch={handleToggleMemberSearch}
        onSearchTermChange={setMemberSearchTerm}
        onMemberSelect={handleMemberSelect}
        onClearSelection={handleClearMemberSelection}
        error={errors.selectedMember}
      />

      {/* Death Details */}
      <DeathDetailsSection
        dateOfDeath={formData.dateOfDeath}
        timeOfDeath={formData.timeOfDeath}
        placeOfDeath={formData.placeOfDeath}
        causeOfDeath={formData.causeOfDeath}
        circumstances={formData.circumstances}
        onFieldChange={handleFieldChange}
        errors={errors}
      />

      {/* Funeral Details */}
      <FuneralDetailsSection
        funeralDate={formData.funeralDate}
        funeralLocation={formData.funeralLocation}
        funeralOfficiant={formData.funeralOfficiant}
        burialCremation={formData.burialCremation}
        cemeteryLocation={formData.cemeteryLocation}
        onFieldChange={handleFieldChange}
        errors={errors}
      />

      {/* Family Contact */}
      <FamilyContactSection
        nextOfKin={formData.nextOfKin}
        nextOfKinPhone={formData.nextOfKinPhone}
        nextOfKinEmail={formData.nextOfKinEmail}
        familyNotified={formData.familyNotified}
        notificationDate={formData.notificationDate}
        onFieldChange={handleFieldChange}
        errors={errors}
      />

      {/* Documents */}
      <DocumentsSection
        deathCertificateUrl={formData.deathCertificateUrl}
        obituaryUrl={formData.obituaryUrl}
        photoUrls={formData.photoUrls}
        additionalDocuments={formData.additionalDocuments}
        onFieldChange={handleFieldChange}
        errors={errors}
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
        <Button
          type="button"
          variant="secondary"
          icon={XMarkIcon}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          icon={CheckIcon}
          loading={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {initialData ? 'Update Record' : 'Create Record'}
        </Button>
      </div>
    </form>
  );
};
