'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Title } from '@tremor/react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ChurchProfile } from './ModulePreferences';

// Church profile setup component
const ChurchProfileScreen = ({ 
  onNext, 
  onBack,
  isLoading,
  churchProfile,
  setChurchProfile
}: { 
  onNext: () => void; 
  onBack: () => void;
  isLoading?: boolean;
  churchProfile: ChurchProfile;
  setChurchProfile: (profile: ChurchProfile) => void;
}) => {
  // Initialize localProfile with churchProfile, but ensure it's a new object
  const [localProfile, setLocalProfile] = useState(() => ({
    ...churchProfile,
    // Ensure required fields have default values
    name: churchProfile.name || '',
    branches: churchProfile.branches || 1,
    size: churchProfile.size || 'small'
  }));
  
  // Log the initial state for debugging
  useEffect(() => {
  }, [churchProfile, localProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Log the field change for debugging
    
    // Update local state
    const updatedProfile = {
      ...localProfile,
      [name]: name === 'branches' || name === 'foundingYear' ? parseInt(value) || undefined : value
    };
    
    setLocalProfile(updatedProfile);
    
    // Immediately update parent state as well for each change
    // This ensures parent always has the latest values
    setChurchProfile(updatedProfile);
    
  };

  const handleSubmit = (e?: React.FormEvent) => {
    // Prevent form submission if called from a form event
    if (e) e.preventDefault();
    
    // Validate required fields
    if (!localProfile.name || !localProfile.branches || !localProfile.size) {
      alert('Please fill all required fields (Church Name, Number of Branches, and Church Size)');
      return;
    }
    
    // Log what's being submitted for debugging
    
    // Ensure parent component has the latest state
    setChurchProfile({
      ...localProfile,
      // Make sure required fields are definitely present and valid
      name: localProfile.name || '',
      branches: localProfile.branches || 1,
      size: localProfile.size || 'small'
    });
    
    // Wait for React to process the state update
    setTimeout(() => {
      // Log one more time to verify final state
      onNext();
    }, 100);
  };
  
  const isFormValid = !!localProfile.name && !!localProfile.branches && !!localProfile.size;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-2xl mx-auto py-8"
    >
      <Title className="text-2xl font-bold text-gray-900 mb-6">
        Tell Us About Your Church
      </Title>
      
      {/* Basic Information */}
      <Card className="mb-6 p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Church Name*
            </label>
            <input
              type="text"
              name="name"
              value={localProfile.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your church name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Branches/Locations*
              </label>
              <select
                name="branches"
                value={localProfile.branches || 1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value={1}>1 (Single Location)</option>
                <option value={2}>2 Locations</option>
                <option value={3}>3-5 Locations</option>
                <option value={6}>6-10 Locations</option>
                <option value={11}>More than 10 Locations</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Congregation Size*
              </label>
              <select
                name="size"
                value={localProfile.size || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select size</option>
                <option value="small">Small (Under 100)</option>
                <option value="medium">Medium (100-500)</option>
                <option value="large">Large (500-1000)</option>
                <option value="mega">Mega (1000+)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Denomination
            </label>
            <input
              type="text"
              name="denomination"
              value={localProfile.denomination || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="E.g., Baptist, Catholic, Non-denominational"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founding Year
            </label>
            <input
              type="number"
              name="foundingYear"
              value={localProfile.foundingYear || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Year when church was established"
              min="1500"
              max={new Date().getFullYear()}
            />
          </div>
        </div>
      </Card>
      
      {/* Contact Information */}
      <Card className="mb-6 p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={localProfile.email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="church@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={localProfile.phone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={localProfile.website || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://yourchurch.org"
            />
          </div>
        </div>
      </Card>
      
      {/* Address Information */}
      <Card className="mb-6 p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={localProfile.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="123 Church Street"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={localProfile.city || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="City"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                value={localProfile.state || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="State/Province"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={localProfile.zipCode || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ZIP/Postal Code"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={localProfile.country || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Country"
            />
          </div>
        </div>
      </Card>
      
      {/* Church Vision & Mission */}
      <Card className="mb-6 p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Vision & Mission</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vision Statement
            </label>
            <textarea
              name="vision"
              value={localProfile.vision || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your church's vision statement"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission Statement
            </label>
            <textarea
              name="missionStatement"
              value={localProfile.missionStatement || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your church's mission statement"
            />
          </div>
        </div>
      </Card>
      
      {/* Navigation Controls */}
      <div className="flex justify-between gap-4 mt-8 w-full max-w-2xl mx-auto">
        <Button 
          color="gray"
          icon={ArrowLeftIcon}
          onClick={onBack}
          className="w-36"
        >
          Back
        </Button>
        <Button 
          color="indigo"
          icon={ArrowRightIcon}
          iconPosition="right"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading || !isFormValid}
          className="w-48 max-w-full"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default ChurchProfileScreen;
