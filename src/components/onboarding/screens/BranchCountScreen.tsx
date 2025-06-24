import React, { useState } from 'react';
import { Button } from '@tremor/react';
import { saveOnboardingStepData } from '../utils/onboardingStorage';

interface BranchCountScreenProps {
  initialCount?: number;
  onNext: (count: number) => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

const BranchCountScreen: React.FC<BranchCountScreenProps> = ({ initialCount = 1, onNext, onBack, onSkip, isLoading }) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count < 1 || !Number.isInteger(count)) {
      setError('Please enter a valid number of branches (minimum 1).');
      return;
    }
    setError(null);
    saveOnboardingStepData('BranchCount', { branchCount: count });
    onNext(count);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-block animate-bounce mb-2">
            <ChurchIcon className="w-16 h-16 text-indigo-500 drop-shadow-lg" />
          </span>
          <h2 className="text-2xl font-bold mb-2 text-indigo-700">Branch Setup</h2>
          <p className="text-gray-600 text-center max-w-xs">
            Let's start by setting up your church branches. You can always add more later!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="branchCount" className="block font-semibold mb-1">
              Number of Branches
            </label>
            <input
              id="branchCount"
              type="number"
              min={1}
              className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-between items-center gap-2 mt-6">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                disabled={isLoading}
              >
                Back
              </button>
            )}
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2 rounded-lg border border-transparent text-indigo-400 font-semibold hover:underline"
                disabled={isLoading}
              >
                Skip
              </button>
            )}
            <Button type="submit" color="indigo" loading={isLoading} disabled={isLoading} className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ChurchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M24 6v8m0 0l-8 6v8h16v-8l-8-6zm0 0l8 6m-8-6l-8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="12" y="28" width="24" height="12" rx="2" fill="currentColor" fillOpacity=".15"/>
    <rect x="18" y="32" width="4" height="8" rx="1" fill="currentColor" fillOpacity=".5"/>
    <rect x="26" y="32" width="4" height="8" rx="1" fill="currentColor" fillOpacity=".5"/>
  </svg>
);

export default BranchCountScreen;
