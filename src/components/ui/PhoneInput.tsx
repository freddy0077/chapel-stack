'use client';

import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface PhoneInputProps {
  value?: string;
  onChange: (phoneNumber: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

// Common country codes with their calling codes
const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+233', country: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: '+256', country: 'UG', flag: '🇺🇬', name: 'Uganda' },
  { code: '+255', country: 'TZ', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway' },
  { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  disabled = false,
  className = '',
  placeholder = 'Enter phone number',
  required = false,
  label = 'Phone Number',
}) => {
  const [countryCode, setCountryCode] = useState('+233'); // Default to Ghana
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Parse existing value on mount or when value changes
  useEffect(() => {
    if (value) {
      // Try to parse existing phone number
      const foundCountry = COUNTRY_CODES.find(country => value.startsWith(country.code));
      if (foundCountry) {
        setCountryCode(foundCountry.code);
        setPhoneNumber(value.substring(foundCountry.code.length).trim());
      } else {
        // If no country code found, assume it's a local number
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const validatePhoneNumber = (number: string): string | null => {
    if (!number && required) {
      return 'Phone number is required';
    }

    if (!number) {
      return null; // Optional field
    }

    // Remove all non-digit characters for validation
    const digitsOnly = number.replace(/\D/g, '');

    if (digitsOnly.length < 7) {
      return 'Phone number must be at least 7 digits';
    }

    if (digitsOnly.length > 15) {
      return 'Phone number cannot exceed 15 digits';
    }

    // Basic format validation (allows digits, spaces, hyphens, parentheses)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(number)) {
      return 'Phone number contains invalid characters';
    }

    return null;
  };

  const handlePhoneNumberChange = (newNumber: string) => {
    setPhoneNumber(newNumber);
    
    const validationError = validatePhoneNumber(newNumber);
    setError(validationError);

    // Combine country code and phone number
    const fullNumber = newNumber ? `${countryCode} ${newNumber}` : '';
    onChange(fullNumber);
  };

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    
    // Update the full number with new country code
    const fullNumber = phoneNumber ? `${newCountryCode} ${phoneNumber}` : '';
    onChange(fullNumber);
  };

  const formatPhoneNumber = (number: string): string => {
    // Remove all non-digit characters
    const digitsOnly = number.replace(/\D/g, '');
    
    // Format based on length (basic formatting)
    if (digitsOnly.length <= 3) {
      return digitsOnly;
    } else if (digitsOnly.length <= 6) {
      return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
    } else if (digitsOnly.length <= 10) {
      return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
    } else {
      return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 10)} ${digitsOnly.slice(10)}`;
    }
  };

  const selectedCountry = COUNTRY_CODES.find(country => country.code === countryCode);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex space-x-2">
        {/* Country Code Selector */}
        <div className="w-32">
          <select
            value={countryCode}
            onChange={(e) => handleCountryCodeChange(e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={`${country.code}-${country.country}`} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              handlePhoneNumberChange(formatted);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-1 mt-1">
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Helper Text */}
      {!error && selectedCountry && (
        <p className="text-xs text-gray-500">
          Format: {selectedCountry.code} XXX XXX XXXX ({selectedCountry.name})
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
