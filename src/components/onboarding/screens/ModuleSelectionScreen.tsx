'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Title, Button } from '@tremor/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import ModuleSelection from '../ModuleSelection';
import { markScreenCompleted } from '../utils/completedScreens';

interface ModuleSelectionScreenProps {
  onNext: () => void;
  onBack: () => void;
  onModulesSelected: (modules: string[]) => void;
  isLoading?: boolean;
  success?: boolean;
}

/**
 * Module selection screen component for the onboarding flow
 * Allows users to select which modules they want to enable
 */
const ModuleSelectionScreen = ({ 
  onNext, 
  onBack,
  onModulesSelected,
  isLoading,
  success
}: ModuleSelectionScreenProps) => {
  useEffect(() => {
    if (success) {
      markScreenCompleted('ModuleSelection');
    }
  }, [success]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-2xl mx-auto py-8"
    >
      <Title className="text-2xl font-bold text-gray-900 mb-6">
        Select Modules to Enable
      </Title>
      
      <ModuleSelection 
        onModulesSelected={onModulesSelected} 
      />
      
      <div className="flex justify-between mt-8">
        <Button 
          color="gray"
          icon={ArrowLeftIcon}
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          color="indigo"
          icon={ArrowRightIcon}
          iconPosition="right"
          onClick={onNext}
          loading={isLoading}
          disabled={isLoading}
        >
          Save & Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default ModuleSelectionScreen;
