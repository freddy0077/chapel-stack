'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@tremor/react';
import { ArrowRightIcon, ArrowLeftIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import { ChurchProfile } from '../ModulePreferences';
import { useCreateOrganisation } from '@/graphql/hooks/useOrganisation';
import { useAuth } from '@/graphql/hooks/useAuth';
import { saveOnboardingStepData } from '../utils/onboardingStorage';
import { DateTime } from 'luxon';
import { markScreenCompleted } from '../utils/completedScreens';

interface ChurchProfileScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  churchProfile: ChurchProfile;
  setChurchProfile: (profile: ChurchProfile) => void;
}

/**
 * Church profile setup component for the onboarding flow
 * Collects information about the church organization
 */
const ChurchProfileScreen = ({ 
  onNext, 
  onBack,
  onSkip,
  isLoading,
  churchProfile,
  setChurchProfile
}: ChurchProfileScreenProps) => {
  // Use all Organisation model fields for the form
  const [localOrganisation, setLocalOrganisation] = useState(() => ({
    name: churchProfile.name || '',
    email: churchProfile.email || '',
    phoneNumber: churchProfile.phoneNumber || '',
    website: churchProfile.website || '',
    address: churchProfile.address || '',
    city: churchProfile.city || '',
    state: churchProfile.state || '',
    country: churchProfile.country || '',
    zipCode: churchProfile.zipCode || '',
    denomination: churchProfile.denomination || '',
    foundingYear: churchProfile.foundingYear || '',
    size: churchProfile.size || '',
    vision: churchProfile.vision || '',
    missionStatement: churchProfile.missionStatement || '',
    description: churchProfile.description || '',
    timezone: churchProfile.timezone || '',
    currency: churchProfile.currency || '',
    primaryColor: churchProfile.primaryColor || '',
    secondaryColor: churchProfile.secondaryColor || '',
    // tertiaryColor: churchProfile.tertiaryColor || ''
  }));
  
  // Log the initial state for debugging
  useEffect(() => {
    console.log('ChurchProfileScreen mounted with profile:', churchProfile);
    console.log('Initial localOrganisation state:', localOrganisation);
  }, [churchProfile, localOrganisation]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Log the field change for debugging
    console.log(`Field ${name} changed to:`, value);
    
    // Update local state
    const updatedOrganisation = {
      ...localOrganisation,
      [name]: value
    };
    
    setLocalOrganisation(updatedOrganisation);
    
    // Immediately update parent state as well for each change
    // This ensures parent always has the latest values
    setChurchProfile(updatedOrganisation);
    
    console.log('Updated local organisation:', updatedOrganisation);
  };

  const { createOrganisation, loading: mutationLoading } = useCreateOrganisation();
  const [isSaving, setIsSaving] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user: authUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!localOrganisation.name) {
      alert('Please fill all required fields (Church Name)');
      return;
    }

    // E.164 phone validation and normalization
    let phoneNumber = localOrganisation.phoneNumber?.trim() || '';
    if (phoneNumber && !phoneNumber.startsWith('+')) {
      // Attempt to prepend country code if country is Ghana
      if (localOrganisation.country === 'Ghana' && /^\d{9,10}$/.test(phoneNumber)) {
        phoneNumber = '+233' + phoneNumber.replace(/^0/, '');
      } else {
        alert('Phone number must be in international E.164 format (e.g., +1234567890).');
        return;
      }
    }
    const phoneRegex = /^\+\d{7,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      alert('Phone number must be in international E.164 format (e.g., +1234567890).');
      return;
    }
    // Assign normalized phone number back
    localOrganisation.phoneNumber = phoneNumber;

    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)?(\/)?$/;
    if (localOrganisation.website && !urlRegex.test(localOrganisation.website)) {
      alert('Please enter a valid website URL');
      return;
    }

    setIsSaving(true);
    setBackendError(null);
    try {
      // Call mutation
      const response = await createOrganisation({
        variables: {
          input: {
            ...localOrganisation // Spread all fields directly
          }
        }
      });
      const orgId = response?.data?.createOrganisation?.id;
      if (orgId) {
        localStorage.setItem('organisation_id', orgId);
      }
      saveOnboardingStepData('ChurchProfile', {
        churchName: localOrganisation.name,
        address: localOrganisation.address,
        phone: localOrganisation.phoneNumber,
        email: localOrganisation.email
      });
      setTimeout(() => {
        setIsSaving(false);
        setSuccess(true);
        if (onNext) onNext();
      }, 100);
    } catch (error: unknown) {
      // Show backend error if available
      let gqlError = 'An error occurred';
      if (error && typeof error === 'object' && 'graphQLErrors' in error && Array.isArray((error as any).graphQLErrors)) {
        gqlError = (error as any).graphQLErrors[0]?.message || (error as any).message || 'An error occurred';
      } else if (error instanceof Error) {
        gqlError = error.message;
      }
      setBackendError(gqlError);
      setIsSaving(false);
    }
  };
  
  // Mark completed on success
  useEffect(() => {
    if (success) {
      markScreenCompleted('ChurchProfile');
    }
  }, [success]);

  // Country select options (can be moved to a separate util or constants file)
  const countryOptions = [
    '', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Ghana', 'Nigeria', 'South Africa', 'Kenya', 'Germany', 'France', 'India', 'China', 'Japan', 'Brazil', 'Mexico', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'New Zealand', 'Ireland', 'Singapore', 'Malaysia', 'Philippines', 'South Korea', 'Indonesia', 'Turkey', 'Egypt', 'Morocco', 'UAE', 'Saudi Arabia', 'Israel', 'Pakistan', 'Bangladesh', 'Poland', 'Russia', 'Ukraine', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Thailand', 'Vietnam', 'Other'
  ];

  // Currency select options (ISO 4217)
  const currencyOptions = [
    '', 'USD', 'EUR', 'GBP', 'GHS', 'NGN', 'ZAR', 'KES', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'CHF', 'SEK', 'NOK', 'DKK', 'RUB', 'PLN', 'TRY', 'EGP', 'MAD', 'AED', 'SAR', 'ILS', 'PKR', 'BDT', 'SGD', 'MYR', 'PHP', 'KRW', 'IDR', 'THB', 'VND', 'ARS', 'CLP', 'COP', 'PEN', 'VEF', 'NZD', 'HKD', 'CZK', 'HUF', 'RON', 'UAH', 'CZK', 'HRK', 'BGN', 'LKR', 'TZS', 'UGX', 'XOF', 'XAF', 'Other'
  ];

  // Timezone select options (IANA timezones, common)
  const timezoneOptions = [
    '', 'Africa/Accra', 'Africa/Lagos', 'Africa/Johannesburg', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Zurich', 'Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen', 'Europe/Helsinki', 'Europe/Dublin', 'Europe/Warsaw', 'Europe/Moscow', 'Europe/Istanbul', 'Europe/Kiev', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'America/Vancouver', 'America/Sao_Paulo', 'America/Mexico_City', 'Asia/Dubai', 'Asia/Jerusalem', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Singapore', 'Asia/Bangkok', 'Asia/Hong_Kong', 'Asia/Kuala_Lumpur', 'Asia/Manila', 'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland', 'Pacific/Honolulu', 'UTC', 'Other'
  ];

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      {backendError && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 max-w-md w-full text-center border border-red-300">
          {backendError.replace("'", "&apos;")}
        </div>
      )}
      <div className="mb-8 text-center w-full max-w-screen-md">
        <div className="flex flex-col items-center justify-center mb-3">
          <span className="bg-indigo-100 rounded-full p-4 mb-2 flex items-center justify-center">
            <HomeModernIcon className="h-10 w-10 text-indigo-600" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1"> Let&apos;s Set Up Your Organisation</h2>
          <p className="text-gray-600 text-base max-w-xl">
            Help us get to know your church. This information personalizes your experience and helps you get the most out of the platform.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-screen-md mx-auto">
        <div className="transition-all duration-300 shadow-xl rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-100 to-white relative">
          <div className="bg-gradient-to-r from-indigo-500/80 to-indigo-400/80 text-white rounded-t-2xl px-6 py-4 flex items-center gap-3">
            <span className="font-bold text-lg">Organisation Set Up</span>
          </div>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1 col-span-1">
                  <label className="block font-semibold mb-1">Church Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={localOrganisation.name || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Enter your church name"
                    required
                  />
                </div>
                <div className="md:col-span-1 col-span-1">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    name="description"
                    value={localOrganisation.description || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Brief description of your church"
                  />
                </div>
              </div>
              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={localOrganisation.email || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="contact@yourchurch.org"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={localOrganisation.phoneNumber || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={localOrganisation.website || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="https://yourchurch.org"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={localOrganisation.address || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={localOrganisation.city || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={localOrganisation.state || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="State/Province"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Country</label>
                  <select
                    name="country"
                    value={localOrganisation.country || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    required
                  >
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>{country || 'Select country'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={localOrganisation.zipCode || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Zip Code"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Denomination</label>
                  <input
                    type="text"
                    name="denomination"
                    value={localOrganisation.denomination || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Denomination"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Founding Year</label>
                  <input
                    type="number"
                    name="foundingYear"
                    value={localOrganisation.foundingYear || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Founding Year"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={localOrganisation.size || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Size"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Vision</label>
                  <textarea
                    name="vision"
                    value={localOrganisation.vision || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Vision"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mission Statement</label>
                  <textarea
                    name="missionStatement"
                    value={localOrganisation.missionStatement || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Mission Statement"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Timezone</label>
                  <select
                    id="timezone"
                    name="timezone"
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    value={localOrganisation.timezone || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select timezone</option>
                    {timezoneOptions.map((tz) => {
                      let currentTime = '';
                      try {
                        currentTime = DateTime.now().setZone(tz).toFormat('HH:mm, MMM dd');
                      } catch (e) {
                        currentTime = '';
                      }
                      return (
                        <option key={tz} value={tz}>
                          {tz} {currentTime && `- ${currentTime}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Currency</label>
                  <select
                    name="currency"
                    value={localOrganisation.currency || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    required
                  >
                    {Array.from(new Set(currencyOptions)).map((currency) => (
                      <option key={currency} value={currency}>{currency || 'Select currency'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Primary Color</label>
                  <input
                    type="color"
                    name="primaryColor"
                    value={localOrganisation.primaryColor || '#000000'}
                    onChange={handleChange}
                    className="w-16 h-10 border-2 border-indigo-200 rounded-lg p-0 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Secondary Color</label>
                  <input
                    type="color"
                    name="secondaryColor"
                    value={localOrganisation.secondaryColor || '#000000'}
                    onChange={handleChange}
                    className="w-16 h-10 border-2 border-indigo-200 rounded-lg p-0 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tertiary Color</label>
                  <input
                    type="color"
                    name="tertiaryColor"
                    value={localOrganisation.tertiaryColor || '#000000'}
                    onChange={handleChange}
                    className="w-16 h-10 border-2 border-indigo-200 rounded-lg p-0 cursor-pointer"
                  />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8 gap-2">
                <Button
                  color="gray"
                  icon={ArrowLeftIcon}
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                {onSkip && (
                  <Button
                    color="gray"
                    onClick={onSkip}
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  color="indigo"
                  icon={ArrowRightIcon}
                  iconPosition="right"
                  type="submit"
                  loading={isLoading || mutationLoading || isSaving}
                  disabled={isLoading || mutationLoading || isSaving}
                >
                  Save & Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurchProfileScreen;
