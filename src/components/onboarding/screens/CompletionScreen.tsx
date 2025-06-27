'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Title, Text, Button, Card } from '@tremor/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { ChurchProfile } from '../ModulePreferences';

interface CompletionScreenProps {
  onFinish: () => void;
  churchProfile: ChurchProfile;
}

/**
 * Completion screen component for the onboarding flow
 * Shows a success message and next steps after completing onboarding
 */
const CompletionScreen = ({ 
  onFinish,
  churchProfile
}: CompletionScreenProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="text-center max-w-2xl mx-auto py-12"
  >
    <div className="mb-10 flex justify-center">
      <div className="bg-green-100 h-24 w-24 rounded-full flex items-center justify-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500" aria-hidden="true" />
      </div>
    </div>
    
    <Title className="text-3xl font-bold text-gray-900 mb-4">
      Congratulations, {churchProfile.name}!
    </Title>
    
    <Text className="text-lg text-gray-600 mb-6">
      Your church management system is now ready to use. You&apos;ve successfully configured your account with {churchProfile.branches} {churchProfile.branches > 1 ? 'locations' : 'location'}.
    </Text>
    
    <Card className="mb-8 p-6">
      <Title className="text-xl font-semibold mb-3">What&apos;s Next?</Title>
      <ul className="text-left space-y-2 mb-4">
        <li className="flex items-center">
          <span className="bg-indigo-100 rounded-full p-1 mr-2">
            <CheckCircleIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          </span>
          Add your team members and assign roles
        </li>
        <li className="flex items-center">
          <span className="bg-indigo-100 rounded-full p-1 mr-2">
            <CheckCircleIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          </span>
          Import your existing member data
        </li>
        <li className="flex items-center">
          <span className="bg-indigo-100 rounded-full p-1 mr-2">
            <CheckCircleIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          </span>
          Set up your first events and services
        </li>
      </ul>
    </Card>
    
    <Button 
      color="indigo"
      size="lg"
      onClick={onFinish}
    >
      Go to Dashboard
    </Button>
  </motion.div>
);

export default CompletionScreen;
