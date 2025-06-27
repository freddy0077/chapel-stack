import React, { useState, useEffect } from 'react';
import { saveOnboardingStepData } from '../utils/onboardingStorage';
import { markScreenCompleted } from '../utils/completedScreens';

interface BrandingScreenProps {
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  success?: boolean;
}

const BrandingScreen: React.FC<BrandingScreenProps> = ({ onNext, onBack, onSkip, isLoading, success }) => {
  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#4f46e5'); // Default indigo
  const [secondaryColor, setSecondaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#22d3ee'); // Default cyan
  const [slogan, setSlogan] = useState('');
  const [brandFont, setBrandFont] = useState('');
  const [social, setSocial] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFavicon(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save branding data for summary
    saveOnboardingStepData('Branding', {
      logo: logo ? logo.name : null,
      favicon: favicon ? favicon.name : null,
      primaryColor,
      secondaryColor,
      accentColor,
      slogan,
      brandFont,
      socialHandle: social
    });
    onNext();
  };

  useEffect(() => {
    if (success) {
      markScreenCompleted('Branding');
    }
  }, [success]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">Branding</h2>
        <p className="mb-6 text-gray-600">Upload your organization’s logo and select your brand colors. This will personalize your experience and communications.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {logo && <div className="mt-2 text-xs text-gray-500">Selected: {logo.name}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Favicon</label>
            <input
              type="file"
              accept="image/x-icon,image/png"
              onChange={handleFaviconChange}
              className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {favicon && <div className="mt-2 text-xs text-gray-500">Selected: {favicon.name}</div>}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Primary Color</label>
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Secondary Color</label>
              <input
                type="color"
                value={secondaryColor}
                onChange={e => setSecondaryColor(e.target.value)}
                className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Accent Color</label>
              <input
                type="color"
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
                className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Slogan / Tagline</label>
            <input
              type="text"
              value={slogan}
              onChange={e => setSlogan(e.target.value)}
              placeholder="e.g. A Place for Everyone"
              className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Brand Font</label>
            <input
              type="text"
              value={brandFont}
              onChange={e => setBrandFont(e.target.value)}
              placeholder="e.g. Inter, Roboto, Nunito..."
              className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Social Media Handle</label>
            <input
              type="text"
              value={social}
              onChange={e => setSocial(e.target.value)}
              placeholder="e.g. @yourchurchname"
              className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
          <div className="flex justify-between items-center mt-6 gap-2">
            {onBack && (
              <button type="button" onClick={onBack} className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition">
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
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandingScreen;
