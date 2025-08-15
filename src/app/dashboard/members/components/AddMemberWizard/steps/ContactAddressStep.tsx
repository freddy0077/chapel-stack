'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { WizardStepProps, ValidationError } from '../types/WizardTypes';

const ContactAddressStep: React.FC<WizardStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isFirstStep
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateStep = (): boolean => {
    const newErrors: ValidationError[] = [];

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    // Confirm email validation
    if (formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail) {
      newErrors.push({ field: 'confirmEmail', message: 'Email addresses do not match' });
    }

    // Phone number basic validation
    if (formData.phoneNumber && formData.phoneNumber.length < 10) {
      newErrors.push({ field: 'phoneNumber', message: 'Please enter a valid phone number' });
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
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <EnvelopeIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Contact & Address</h3>
        <p className="text-gray-600 mt-2">How can we reach you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                getFieldError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {getFieldError('email') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
          )}
        </div>

        {/* Confirm Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.confirmEmail || ''}
              onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
              className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                getFieldError('confirmEmail') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your email"
              disabled={!formData.email}
            />
            <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {getFieldError('confirmEmail') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('confirmEmail')}</p>
          )}
        </div>

        {/* Primary Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                getFieldError('phoneNumber') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+233 XX XXX XXXX"
            />
            <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {getFieldError('phoneNumber') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('phoneNumber')}</p>
          )}
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternate Phone
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.alternatePhone || ''}
              onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Alternative contact number"
            />
            <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="House number and street name"
            />
            <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="City or town"
          />
        </div>

        {/* State/Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Region
          </label>
          <input
            type="text"
            value={formData.state || ''}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="State, region, or province"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            value={formData.postalCode || ''}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="ZIP or postal code"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={formData.country || ''}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Select Country</option>
            <option value="Ghana">Ghana</option>
            <option value="Nigeria">Nigeria</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="South Africa">South Africa</option>
            <option value="Kenya">Kenya</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Preferred Language */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Language
          </label>
          <select
            value={formData.preferredLanguage || 'en'}
            onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="en">English</option>
            <option value="tw">Twi</option>
            <option value="ga">Ga</option>
            <option value="ewe">Ewe</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="other">Other</option>
          </select>
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

export default ContactAddressStep;
