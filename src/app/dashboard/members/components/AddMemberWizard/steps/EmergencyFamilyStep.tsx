'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, HomeIcon, UsersIcon } from '@heroicons/react/24/outline';
import { WizardStepProps, ValidationError } from '../types/WizardTypes';

const EmergencyFamilyStep: React.FC<WizardStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  isFirstStep,
  isLastStep
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateStep = (): boolean => {
    const newErrors: ValidationError[] = [];

    // Emergency contact validation
    if (formData.emergencyContactName && !formData.emergencyContactPhone) {
      newErrors.push({ field: 'emergencyContactPhone', message: 'Emergency contact phone is required when name is provided' });
    }
    if (formData.emergencyContactPhone && !formData.emergencyContactName) {
      newErrors.push({ field: 'emergencyContactName', message: 'Emergency contact name is required when phone is provided' });
    }

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
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Emergency & Family</h3>
        <p className="text-gray-600 mt-2">Emergency contact and family information</p>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-orange-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Emergency Contact</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Emergency Contact Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.emergencyContactName || ''}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                getFieldError('emergencyContactName') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Full name of emergency contact"
            />
            {getFieldError('emergencyContactName') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('emergencyContactName')}</p>
            )}
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone || ''}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                getFieldError('emergencyContactPhone') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+233 XX XXX XXXX"
            />
            {getFieldError('emergencyContactPhone') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('emergencyContactPhone')}</p>
            )}
          </div>

          {/* Emergency Contact Relationship */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship to You
            </label>
            <select
              value={formData.emergencyContactRelation || ''}
              onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select relationship</option>
              <option value="Parent">Parent</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Relative">Relative</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Family Information Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <UsersIcon className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Family Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Head of Household */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="headOfHousehold"
                checked={formData.headOfHousehold || false}
                onChange={(e) => handleInputChange('headOfHousehold', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="headOfHousehold" className="ml-2 text-sm font-medium text-gray-700">
                I am the head of household
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Check this if you are the primary decision-maker for your household
            </p>
          </div>

          {/* Family ID (if existing family) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family ID (Optional)
            </label>
            <input
              type="text"
              value={formData.familyId || ''}
              onChange={(e) => handleInputChange('familyId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="If joining existing family"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to create a new family record
            </p>
          </div>

          {/* Spouse ID (if married) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spouse Member ID (Optional)
            </label>
            <input
              type="text"
              value={formData.spouseId || ''}
              onChange={(e) => handleInputChange('spouseId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="If spouse is already a member"
              disabled={formData.maritalStatus !== 'MARRIED'}
            />
            {formData.maritalStatus !== 'MARRIED' && (
              <p className="text-xs text-gray-500 mt-1">
                Only available for married members
              </p>
            )}
          </div>

          {/* Parent ID (for children) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent/Guardian Member ID (Optional)
            </label>
            <input
              type="text"
              value={formData.parentId || ''}
              onChange={(e) => handleInputChange('parentId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="If parent/guardian is already a member"
            />
            <p className="text-xs text-gray-500 mt-1">
              For children or dependents - link to parent/guardian member
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Information */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <HomeIcon className="w-5 h-5 text-green-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Church Attendance</h4>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRegularAttendee"
            checked={formData.isRegularAttendee || false}
            onChange={(e) => handleInputChange('isRegularAttendee', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isRegularAttendee" className="ml-2 text-sm font-medium text-gray-700">
            I am a regular attendee
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Check this if you attend church services regularly
        </p>
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

export default EmergencyFamilyStep;
