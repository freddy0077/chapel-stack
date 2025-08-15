'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { WizardStepProps, ValidationError } from '../types/WizardTypes';
import { Gender, MaritalStatus } from '../../../types/member.types';

const PersonalInfoStep: React.FC<WizardStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isFirstStep
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateStep = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.firstName?.trim()) {
      newErrors.push({ field: 'firstName', message: 'First name is required' });
    }
    if (!formData.lastName?.trim()) {
      newErrors.push({ field: 'lastName', message: 'Last name is required' });
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
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <UserIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
        <p className="text-gray-600 mt-2">Let's start with basic personal details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              getFieldError('firstName') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {getFieldError('firstName') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('firstName')}</p>
          )}
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            value={formData.middleName || ''}
            onChange={(e) => handleInputChange('middleName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter middle name (optional)"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              getFieldError('lastName') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {getFieldError('lastName') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('lastName')}</p>
          )}
        </div>

        {/* Preferred Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Name
          </label>
          <input
            type="text"
            value={formData.preferredName || ''}
            onChange={(e) => handleInputChange('preferredName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="How would you like to be called?"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <CalendarIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={formData.gender || Gender.NOT_SPECIFIED}
            onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value={Gender.NOT_SPECIFIED}>Prefer not to specify</option>
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.OTHER}>Other</option>
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            value={formData.maritalStatus || MaritalStatus.UNKNOWN}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value as MaritalStatus)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value={MaritalStatus.UNKNOWN}>Unknown</option>
            <option value={MaritalStatus.SINGLE}>Single</option>
            <option value={MaritalStatus.MARRIED}>Married</option>
            <option value={MaritalStatus.DIVORCED}>Divorced</option>
            <option value={MaritalStatus.WIDOWED}>Widowed</option>
            <option value={MaritalStatus.SEPARATED}>Separated</option>
          </select>
        </div>

        {/* Place of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Place of Birth
          </label>
          <input
            type="text"
            value={formData.placeOfBirth || ''}
            onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="City, Country"
          />
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.nationality || ''}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="e.g., Ghanaian, American"
            />
            <GlobeAltIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={formData.occupation || ''}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Job title or profession"
          />
        </div>

        {/* Employer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employer
          </label>
          <input
            type="text"
            value={formData.employerName || ''}
            onChange={(e) => handleInputChange('employerName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Company or organization name"
          />
        </div>

        {/* Education */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education
          </label>
          <input
            type="text"
            value={formData.education || ''}
            onChange={(e) => handleInputChange('education', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Highest level of education or qualifications"
          />
        </div>
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

export default PersonalInfoStep;
