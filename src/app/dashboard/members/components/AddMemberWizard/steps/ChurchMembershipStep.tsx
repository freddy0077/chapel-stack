'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BuildingLibraryIcon, CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { WizardStepProps, ValidationError } from '../types/WizardTypes';
import { MembershipStatus, MembershipType } from '../../../types/member.types';

const ChurchMembershipStep: React.FC<WizardStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isFirstStep
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateStep = (): boolean => {
    const newErrors: ValidationError[] = [];

    // Add any specific validation rules for church membership
    // Currently no required fields in this step

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
    // Clear error for this field
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <BuildingLibraryIcon className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Church & Membership</h3>
        <p className="text-gray-600 mt-2">Membership status and spiritual milestones</p>
      </div>

      {/* Membership Status Section */}
      <div className="bg-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <BuildingLibraryIcon className="w-5 h-5 text-purple-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Membership Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Membership Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Level
            </label>
            <select
              value={formData.membershipStatus || MembershipStatus.VISITOR}
              onChange={(e) => handleInputChange('membershipStatus', e.target.value as MembershipStatus)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value={MembershipStatus.VISITOR}>Visitor</option>
              <option value={MembershipStatus.MEMBER}>Member</option>
              <option value={MembershipStatus.ACTIVE_MEMBER}>Active Member</option>
              <option value={MembershipStatus.INACTIVE_MEMBER}>Inactive Member</option>
              <option value={MembershipStatus.TRANSFERRED}>Transferred</option>
              <option value={MembershipStatus.DECEASED}>Deceased</option>
            </select>
          </div>

          {/* Membership Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Type
            </label>
            <select
              value={formData.membershipType || MembershipType.REGULAR}
              onChange={(e) => handleInputChange('membershipType', e.target.value as MembershipType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value={MembershipType.REGULAR}>Regular</option>
              <option value={MembershipType.ASSOCIATE}>Associate</option>
              <option value={MembershipType.HONORARY}>Honorary</option>
              <option value={MembershipType.YOUTH}>Youth</option>
              <option value={MembershipType.CHILD}>Child</option>
            </select>
          </div>

          {/* Membership Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.membershipDate ? new Date(formData.membershipDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('membershipDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <CalendarIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Spiritual Milestones Section */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Spiritual Milestones</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baptism Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Baptism Date
            </label>
            <input
              type="date"
              value={formData.baptismDate ? new Date(formData.baptismDate).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('baptismDate', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Baptism Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Baptism Location
            </label>
            <input
              type="text"
              value={formData.baptismLocation || ''}
              onChange={(e) => handleInputChange('baptismLocation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Church or location where baptized"
            />
          </div>

          {/* Confirmation Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmation Date
            </label>
            <input
              type="date"
              value={formData.confirmationDate ? new Date(formData.confirmationDate).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('confirmationDate', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Salvation Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salvation Date
            </label>
            <input
              type="date"
              value={formData.salvationDate ? new Date(formData.salvationDate).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('salvationDate', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Technology & Access Section */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CreditCardIcon className="w-5 h-5 text-green-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Technology & Access</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* RFID Card ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RFID Card ID (Optional)
            </label>
            <input
              type="text"
              value={formData.rfidCardId || ''}
              onChange={(e) => handleInputChange('rfidCardId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="RFID card identifier"
            />
            <p className="text-xs text-gray-500 mt-1">
              For church access and attendance tracking
            </p>
          </div>

          {/* NFC ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NFC ID (Optional)
            </label>
            <input
              type="text"
              value={formData.nfcId || ''}
              onChange={(e) => handleInputChange('nfcId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="NFC identifier"
            />
            <p className="text-xs text-gray-500 mt-1">
              For mobile-based access and interactions
            </p>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status Change Reason / Notes
        </label>
        <textarea
          value={formData.statusChangeReason || ''}
          onChange={(e) => handleInputChange('statusChangeReason', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Any additional notes about membership status or special circumstances..."
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isFirstStep
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next Step
        </motion.button>
      </div>
    </div>
  );
};

export default ChurchMembershipStep;
