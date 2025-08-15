'use client';

// Synced from EditMemberModalWizard.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, UserIcon, PhoneIcon, UsersIcon, IdentificationIcon, ShieldCheckIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Member, UpdateMemberInput, MembershipStatus, MembershipType, Gender, MaritalStatus, PrivacyLevel, CommunicationPreferences } from '../types/member.types';
import { useUpdateMember } from '../hooks/useMemberOperations';
import { useCommunicationPrefs } from '../hooks/useMemberOperations';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onSuccess?: (updated: Member) => void;
}

// Wizard steps aligned with Add Member modal
const steps = [
  { id: 1, name: 'Personal Info', icon: UserIcon },
  { id: 2, name: 'Contact & Address', icon: PhoneIcon },
  { id: 3, name: 'Emergency & Family', icon: UsersIcon },
  { id: 4, name: 'Church & Membership', icon: IdentificationIcon },
  { id: 5, name: 'Communication Prefs', icon: ShieldCheckIcon },
  { id: 6, name: 'Review & Save', icon: ShieldCheckIcon },
];

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onSuccess,
}) => {
  const { updateMember } = useUpdateMember();
  const { updateCommunicationPrefs } = useCommunicationPrefs();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<UpdateMemberInput>({} as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: member.id,
        firstName: member.firstName || '',
        middleName: member.middleName || '',
        lastName: member.lastName || '',
        preferredName: member.preferredName || '',
        title: member.title || '',
        email: member.email || '',
        phoneNumber: member.phoneNumber || '',
        alternativeEmail: member.alternativeEmail || '',
        alternatePhone: member.alternatePhone || '',
        address: member.address || '',
        addressLine2: member.addressLine2 || '',
        city: member.city || '',
        state: member.state || '',
        postalCode: member.postalCode || '',
        country: member.country || '',
        district: member.district || '',
        region: member.region || '',
        digitalAddress: member.digitalAddress || '',
        landmark: member.landmark || '',
        placeOfBirth: member.placeOfBirth || '',
        nationality: member.nationality || '',
        nlbNumber: member.nlbNumber || '',
        occupation: member.occupation || '',
        emergencyContactName: member.emergencyContactName || '',
        emergencyContactPhone: member.emergencyContactPhone || '',
        emergencyContactRelation: member.emergencyContactRelation || '',
        membershipStatus: member.membershipStatus || MembershipStatus.MEMBER,
        membershipType: member.membershipType || MembershipType.REGULAR,
        gender: member.gender || Gender.NOT_SPECIFIED,
        maritalStatus: member.maritalStatus || MaritalStatus.UNKNOWN,
        privacyLevel: member.privacyLevel || PrivacyLevel.STANDARD,
        organisationId: member.organisationId,
        branchId: member.branchId,
        dateOfBirth: member.dateOfBirth,
        membershipDate: member.membershipDate,
        baptismDate: member.baptismDate,
        headOfHousehold: member.headOfHousehold || false,
        isRegularAttendee: member.isRegularAttendee || false,
        rfidCardId: member.rfidCardId || '',
        nfcId: member.nfcId || '',
        consentDate: member.consentDate,
        consentVersion: member.consentVersion || '',
        communicationPrefs: member.communicationPrefs || {},
      });
    }
  }, [isOpen, member]);

  const handleChange = (field: keyof UpdateMemberInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Allow nested updates for objects like communicationPrefs
  const handleNestedChange = (path: string, value: any) => {
    setFormData((prev) => {
      const next: any = { ...prev } as any;
      const parts = path.split('.');
      let cur: any = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = cur[parts[i]] ? { ...cur[parts[i]] } : {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const canGoNext = () => {
    if (currentStep === 1) {
      return Boolean(formData.firstName && formData.lastName);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const sanitizedFormData = { ...formData };
      Object.keys(sanitizedFormData).forEach((key) => {
        if (sanitizedFormData[key] === '') {
          sanitizedFormData[key] = null;
        }
      });

      const { communicationPrefs, previousChurch, ...updatePayload } = sanitizedFormData;

      await updateMember(formData.id, updatePayload);

      if (communicationPrefs) {
        await updateCommunicationPrefs(formData.id, communicationPrefs);
      }
      onSuccess?.({ ...member, ...formData } as Member);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Failed to update member', err);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ scale: 0.98, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 20, opacity: 0 }}
          >
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit Member</h3>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">
                <ol className="flex items-center w-full">
                  {steps.map((step, idx) => (
                    <li key={step.id} className="flex-1 flex items-center">
                      <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                        <step.icon className="w-4 h-4" />
                        <span className="text-xs font-medium whitespace-nowrap">{step.name}</span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`mx-2 h-px flex-1 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="modal-content p-6 space-y-6">
              {currentStep === 1 && (
                <div className="step-card">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">First Name</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Middle Name</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.middleName || ''} onChange={(e) => handleChange('middleName', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Preferred Name</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.preferredName || ''} onChange={(e) => handleChange('preferredName', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Title</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.title || ''} onChange={(e) => handleChange('title', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Gender</label>
                      <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.gender || ''} onChange={(e) => handleChange('gender', e.target.value as Gender)}>
                        {Object.values(Gender).map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                      <input type="date" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''} onChange={(e) => handleChange('dateOfBirth', e.target.value ? new Date(e.target.value) : undefined)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Marital Status</label>
                      <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.maritalStatus || ''} onChange={(e) => handleChange('maritalStatus', e.target.value as MaritalStatus)}>
                        {Object.values(MaritalStatus).map((ms) => (
                          <option key={ms} value={ms}>
                            {ms}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Nationality</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.nationality || ''} onChange={(e) => handleChange('nationality', e.target.value.trim())} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Place of Birth</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.placeOfBirth || ''} onChange={(e) => handleChange('placeOfBirth', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-card">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Contact & Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input type="email" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Alternative Email</label>
                      <input type="email" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.alternativeEmail || ''} onChange={(e) => handleChange('alternativeEmail', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.phoneNumber || ''} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Alternative Phone</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.alternatePhone || ''} onChange={(e) => handleChange('alternatePhone', e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Address</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Address Line 2</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.addressLine2 || ''} onChange={(e) => handleChange('addressLine2', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">District</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.district || ''} onChange={(e) => handleChange('district', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Region</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.region || ''} onChange={(e) => handleChange('region', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">State</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.state || ''} onChange={(e) => handleChange('state', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.postalCode || ''} onChange={(e) => handleChange('postalCode', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Country</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.country || ''} onChange={(e) => handleChange('country', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Digital Address</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.digitalAddress || ''} onChange={(e) => handleChange('digitalAddress', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Landmark</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.landmark || ''} onChange={(e) => handleChange('landmark', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-card">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Emergency & Family</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Emergency Contact Name</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.emergencyContactName || ''} onChange={(e) => handleChange('emergencyContactName', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Emergency Contact Phone</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.emergencyContactPhone || ''} onChange={(e) => handleChange('emergencyContactPhone', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Emergency Contact Relation</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.emergencyContactRelation || ''} onChange={(e) => handleChange('emergencyContactRelation', e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="headOfHousehold" type="checkbox" className="rounded border-gray-300" checked={Boolean(formData.headOfHousehold)} onChange={(e) => handleChange('headOfHousehold', e.target.checked)} />
                      <label htmlFor="headOfHousehold" className="text-sm text-gray-700">Head of Household</label>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Family ID</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.familyId || ''} onChange={(e) => handleChange('familyId', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="step-card">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Church & Membership</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Status</label>
                      <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.membershipStatus} onChange={(e) => handleChange('membershipStatus', e.target.value as MembershipStatus)}>
                        {Object.values(MembershipStatus).map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Type</label>
                      <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.membershipType || ''} onChange={(e) => handleChange('membershipType', e.target.value as MembershipType)}>
                        {Object.values(MembershipType).map((t) => (
                          <option key={t} value={t}>
                            {t.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date Joined</label>
                      <input type="date" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.membershipDate ? new Date(formData.membershipDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange('membershipDate', e.target.value ? new Date(e.target.value) : undefined)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date Baptized</label>
                      <input type="date" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.baptismDate ? new Date(formData.baptismDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange('baptismDate', e.target.value ? new Date(e.target.value) : undefined)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Profession</label>
                      <input className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.occupation || ''} onChange={(e) => handleChange('occupation', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="step-card">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Communication Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input id="consentDate" type="checkbox" className="rounded border-gray-300" checked={Boolean(formData.consentDate)} onChange={(e) => handleChange('consentDate', e.target.checked ? new Date() : undefined)} />
                      <label htmlFor="consentDate" className="text-sm text-gray-700">GDPR Consent Given</label>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Communication Preference</label>
                      <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={formData.communicationPrefs?.preferredContactTime || ''} onChange={(e) => handleNestedChange('communicationPrefs.preferredContactTime', e.target.value)}>
                        <option value="EMAIL">Email</option>
                        <option value="PHONE">Phone</option>
                        <option value="MAIL">Mail</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="canEmail" type="checkbox" className="rounded border-gray-300" checked={Boolean(formData.communicationPrefs?.emailNotifications)} onChange={(e) => handleNestedChange('communicationPrefs.emailNotifications', e.target.checked)} />
                      <label htmlFor="canEmail" className="text-sm text-gray-700">Can Email</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="canPhone" type="checkbox" className="rounded border-gray-300" checked={Boolean(formData.communicationPrefs?.phoneCallsAllowed)} onChange={(e) => handleNestedChange('communicationPrefs.phoneCallsAllowed', e.target.checked)} />
                      <label htmlFor="canPhone" className="text-sm text-gray-700">Can Phone</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="canMail" type="checkbox" className="rounded border-gray-300" checked={Boolean(formData.communicationPrefs?.mailNotifications)} onChange={(e) => handleNestedChange('communicationPrefs.mailNotifications', e.target.checked)} />
                      <label htmlFor="canMail" className="text-sm text-gray-700">Can Mail</label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="step-card">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Review & Save</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email || '—'}
                    </p>
                    <p>
                      <strong>Phone:</strong> {formData.phoneNumber || '—'}
                    </p>
                    <p>
                      <strong>Address:</strong> {formData.address || '—'}, {formData.city || ''} {formData.country || ''}
                    </p>
                    <p>
                      <strong>Membership:</strong> {formData.membershipStatus} / {formData.membershipType || '—'}
                    </p>
                  </div>
                </div>
              )}

              <div className="modal-actions flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={loading || currentStep === 1}
                >
                  <ArrowLeftIcon className="w-4 h-4 inline-block mr-1" />
                  Back
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                    disabled={loading || !canGoNext()}
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4 inline-block ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </form>
            {/* Scoped styles to enhance inputs without relying on tailwind forms plugin */}
            <style jsx>{`
              .step-card {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 0.75rem;
                padding: 1rem;
              }
              .modal-content label {
                color: #4b5563;
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
                display: block;
              }
              .modal-content input[type="text"],
              .modal-content input[type="email"],
              .modal-content input[type="date"],
              .modal-content input[type="tel"],
              .modal-content input:not([type]),
              .modal-content select,
              .modal-content textarea {
                width: 100%;
                border: 1px solid #d1d5db; /* gray-300 */
                border-radius: 0.5rem; /* rounded-md */
                padding: 0.5rem 0.75rem; /* py-2 px-3 */
                font-size: 0.875rem; /* text-sm */
                line-height: 1.25rem;
                color: #111827; /* gray-900 */
                background-color: #ffffff;
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
              }
              .modal-content input::placeholder,
              .modal-content textarea::placeholder {
                color: #9ca3af; /* gray-400 */
              }
              .modal-content input:focus,
              .modal-content select:focus,
              .modal-content textarea:focus {
                outline: none;
                border-color: #2563eb; /* blue-600 */
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
              }
              .modal-content input[type="checkbox"],
              .modal-content input[type="radio"] {
                height: 1rem;
                width: 1rem;
                border: 1px solid #d1d5db;
                border-radius: 0.25rem;
              }
              .modal-actions button {
                border-radius: 0.5rem;
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditMemberModal;
