"use client";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

/**
 * Progress bar component for the onboarding flow
 * Shows visual progress through the onboarding steps
 */
const ProgressBar = ({ step, totalSteps }: ProgressBarProps) => (
  <div className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  </div>
);

export default ProgressBar;
