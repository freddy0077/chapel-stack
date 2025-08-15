'use client';

import React from 'react';
import { 
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CameraIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { 
  DeathRegisterFormData, 
  BurialType 
} from '../../types/deathRegister';

interface StepProps {
  formData: DeathRegisterFormData;
  onChange: (field: keyof DeathRegisterFormData, value: any) => void;
  errors: Record<string, string>;
}

export const DeathDetailsStep: React.FC<StepProps> = ({ formData, onChange, errors }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date of Death *
      </label>
      <input
        type="date"
        value={formData.dateOfDeath}
        onChange={(e) => onChange('dateOfDeath', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {errors.dateOfDeath && <p className="mt-1 text-sm text-red-600">{errors.dateOfDeath}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Time of Death
      </label>
      <input
        type="time"
        value={formData.timeOfDeath}
        onChange={(e) => onChange('timeOfDeath', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Place of Death *
      </label>
      <input
        type="text"
        value={formData.placeOfDeath}
        onChange={(e) => onChange('placeOfDeath', e.target.value)}
        placeholder="Hospital, home, etc."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {errors.placeOfDeath && <p className="mt-1 text-sm text-red-600">{errors.placeOfDeath}</p>}
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cause of Death
      </label>
      <input
        type="text"
        value={formData.causeOfDeath}
        onChange={(e) => onChange('causeOfDeath', e.target.value)}
        placeholder="Medical cause or circumstances"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Circumstances
      </label>
      <textarea
        value={formData.circumstances}
        onChange={(e) => onChange('circumstances', e.target.value)}
        placeholder="Additional details about the circumstances..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  </div>
);

export const FuneralArrangementsStep: React.FC<StepProps> = ({ formData, onChange, errors }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Funeral Date *
      </label>
      <input
        type="date"
        value={formData.funeralDate}
        onChange={(e) => onChange('funeralDate', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {errors.funeralDate && <p className="mt-1 text-sm text-red-600">{errors.funeralDate}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Funeral Location *
      </label>
      <input
        type="text"
        value={formData.funeralLocation}
        onChange={(e) => onChange('funeralLocation', e.target.value)}
        placeholder="Church, funeral home, etc."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {errors.funeralLocation && <p className="mt-1 text-sm text-red-600">{errors.funeralLocation}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Funeral Officiant
      </label>
      <input
        type="text"
        value={formData.funeralOfficiant}
        onChange={(e) => onChange('funeralOfficiant', e.target.value)}
        placeholder="Pastor, minister, etc."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Burial/Cremation
      </label>
      <select
        value={formData.burialCremation}
        onChange={(e) => onChange('burialCremation', e.target.value as BurialType)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value={BurialType.BURIAL}>Burial</option>
        <option value={BurialType.CREMATION}>Cremation</option>
      </select>
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cemetery/Final Resting Place
      </label>
      <input
        type="text"
        value={formData.cemeteryLocation}
        onChange={(e) => onChange('cemeteryLocation', e.target.value)}
        placeholder="Cemetery name and location"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  </div>
);

export const FamilyContactStep: React.FC<StepProps> = ({ formData, onChange, errors }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Next of Kin Name *
        </label>
        <input
          type="text"
          value={formData.nextOfKin}
          onChange={(e) => onChange('nextOfKin', e.target.value)}
          placeholder="Full name of next of kin"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {errors.nextOfKin && <p className="mt-1 text-sm text-red-600">{errors.nextOfKin}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Next of Kin Phone *
        </label>
        <input
          type="tel"
          value={formData.nextOfKinPhone}
          onChange={(e) => onChange('nextOfKinPhone', e.target.value)}
          placeholder="Phone number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {errors.nextOfKinPhone && <p className="mt-1 text-sm text-red-600">{errors.nextOfKinPhone}</p>}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Next of Kin Email
        </label>
        <input
          type="email"
          value={formData.nextOfKinEmail}
          onChange={(e) => onChange('nextOfKinEmail', e.target.value)}
          placeholder="Email address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="familyNotified"
          checked={formData.familyNotified}
          onChange={(e) => onChange('familyNotified', e.target.checked)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="familyNotified" className="text-sm font-medium text-gray-700">
          Family has been notified
        </label>
      </div>

      {formData.familyNotified && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Date
          </label>
          <input
            type="date"
            value={formData.notificationDate}
            onChange={(e) => onChange('notificationDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  </div>
);

export const DocumentsStep: React.FC<StepProps> = ({ formData, onChange, errors }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Death Certificate URL
        </label>
        <input
          type="url"
          value={formData.deathCertificateUrl}
          onChange={(e) => onChange('deathCertificateUrl', e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Obituary URL
        </label>
        <input
          type="url"
          value={formData.obituaryUrl}
          onChange={(e) => onChange('obituaryUrl', e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    </div>

    {/* Photo URLs */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photo URLs
      </label>
      <div className="space-y-2">
        {formData.photoUrls.map((url, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                const newUrls = [...formData.photoUrls];
                newUrls[index] = e.target.value;
                onChange('photoUrls', newUrls);
              }}
              placeholder="https://..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => {
                const newUrls = formData.photoUrls.filter((_, i) => i !== index);
                onChange('photoUrls', newUrls);
              }}
              className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange('photoUrls', [...formData.photoUrls, ''])}
          className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-700 hover:border-gray-400 transition-colors"
        >
          <CameraIcon className="h-4 w-4" />
          <span>Add Photo URL</span>
        </button>
      </div>
    </div>

    {/* Additional Documents */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Additional Documents
      </label>
      <div className="space-y-2">
        {formData.additionalDocuments.map((doc, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="url"
              value={doc}
              onChange={(e) => {
                const newDocs = [...formData.additionalDocuments];
                newDocs[index] = e.target.value;
                onChange('additionalDocuments', newDocs);
              }}
              placeholder="Document URL..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => {
                const newDocs = formData.additionalDocuments.filter((_, i) => i !== index);
                onChange('additionalDocuments', newDocs);
              }}
              className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange('additionalDocuments', [...formData.additionalDocuments, ''])}
          className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-700 hover:border-gray-400 transition-colors"
        >
          <PaperClipIcon className="h-4 w-4" />
          <span>Add Document</span>
        </button>
      </div>
    </div>

    {/* Upload Instructions */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <DocumentTextIcon className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-blue-900">Document Upload Instructions</h4>
          <p className="text-sm text-blue-700 mt-1">
            Upload documents to your preferred cloud storage service and paste the public URLs here. 
            Supported formats include PDF, DOC, DOCX, JPG, PNG, and other common file types.
          </p>
        </div>
      </div>
    </div>
  </div>
);
