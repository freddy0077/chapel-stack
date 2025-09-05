"use client";

import { motion } from "framer-motion";
import { Title, Text, Button } from "@tremor/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

/**
 * Welcome screen component for the onboarding flow
 * Displays a welcome message and a button to start the onboarding process
 */
const WelcomeScreen = ({ onNext, onSkip, isLoading }: WelcomeScreenProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center max-w-2xl mx-auto py-12"
  >
    <div className="mb-10">
      <div className="bg-indigo-600 h-24 w-24 rounded-2xl mx-auto flex items-center justify-center">
        <span className="text-white text-3xl font-bold">CMS</span>
      </div>
    </div>

    <Title className="text-3xl font-bold text-gray-900 mb-4">
      Welcome to Your Church Management System
    </Title>

    <Text className="text-lg text-gray-600 mb-10">
      A comprehensive platform designed to streamline administrative tasks,
      improve member engagement, and enhance ministry operations across multiple
      church branches.
    </Text>

    <div className="flex flex-col items-center gap-3 mt-8">
      <Button
        color="indigo"
        icon={ArrowRightIcon}
        iconPosition="right"
        onClick={onNext}
        size="lg"
        loading={isLoading}
        disabled={isLoading}
        className="w-48"
      >
        Get Started
      </Button>
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="mt-2 text-indigo-500 hover:underline text-base"
        >
          Skip
        </button>
      )}
    </div>
  </motion.div>
);

export default WelcomeScreen;
