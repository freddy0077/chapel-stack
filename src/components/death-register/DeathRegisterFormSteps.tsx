'use client';

import React from 'react';
import { 
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CameraIcon,
  PaperClipIcon,
  CheckCircleIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { 
  DeathRegisterFormData, 
  BurialType 
} from '../../types/deathRegister';

interface StepProps {
  formData: DeathRegisterFormData;
  onChange: (field: keyof DeathRegisterFormData, value: any) => void;
  errors: Record<string, string>;
  uploading?: { 
    deathCertificate: boolean; 
    obituary: boolean; 
    photos: boolean; 
    additionalDocuments: boolean; 
  };
  uploadProgress?: { 
    deathCertificate: number; 
    obituary: number; 
    photos: number; 
    additionalDocuments: number; 
  };
  uploadErrors?: { 
    deathCertificateUrl: string; 
    obituaryUrl: string; 
    photoUrls: string; 
    additionalDocuments: string; 
  };
  onFileSelect?: (file: File | null, type: string) => void;
  onUploadClick?: (type: string) => void;
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

export const DocumentsStep: React.FC<StepProps> = ({ 
  formData, 
  onChange, 
  errors, 
  uploading = { deathCertificate: false, obituary: false, photos: false, additionalDocuments: false },
  uploadProgress = { deathCertificate: 0, obituary: 0, photos: 0, additionalDocuments: 0 },
  uploadErrors = { deathCertificateUrl: '', obituaryUrl: '', photoUrls: '', additionalDocuments: '' },
  onFileSelect,
  onUploadClick
}) => (
  <div className="space-y-6">
    {/* Death Certificate Upload */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Death Certificate
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          id="death-certificate-upload"
          onChange={(e) => onFileSelect?.(e.target.files?.[0] || null, 'deathCertificateUrl')}
        />
        <button
          type="button"
          onClick={() => document.getElementById('death-certificate-upload')?.click()}
          className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          disabled={uploading.deathCertificate}
        >
          <DocumentIcon className="h-5 w-5 mr-2 text-gray-500" />
          {uploading.deathCertificate ? `Uploading... (${uploadProgress.deathCertificate}%)` : 'Upload Death Certificate'}
        </button>
        {formData.deathCertificateUrl && (
          <span className="ml-3 text-sm text-green-600 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-1" /> Certificate uploaded
          </span>
        )}
      </div>
      {uploading.deathCertificate && (
        <div className="mt-3 w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Uploading death certificate...</span>
            <span>{uploadProgress.deathCertificate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress.deathCertificate}%` }}
            ></div>
          </div>
        </div>
      )}
      {uploadErrors.deathCertificateUrl && (
        <p className="mt-1 text-sm text-red-600">{uploadErrors.deathCertificateUrl}</p>
      )}
    </div>

    {/* Obituary Upload */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Obituary
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="hidden"
          id="obituary-upload"
          onChange={(e) => onFileSelect?.(e.target.files?.[0] || null, 'obituaryUrl')}
        />
        <button
          type="button"
          onClick={() => document.getElementById('obituary-upload')?.click()}
          className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          disabled={uploading.obituary}
        >
          <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
          {uploading.obituary ? `Uploading... (${uploadProgress.obituary}%)` : 'Upload Obituary'}
        </button>
        {formData.obituaryUrl && (
          <span className="ml-3 text-sm text-green-600 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-1" /> Obituary uploaded
          </span>
        )}
      </div>
      {uploading.obituary && (
        <div className="mt-3 w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Uploading obituary...</span>
            <span>{uploadProgress.obituary}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress.obituary}%` }}
            ></div>
          </div>
        </div>
      )}
      {uploadErrors.obituaryUrl && (
        <p className="mt-1 text-sm text-red-600">{uploadErrors.obituaryUrl}</p>
      )}
    </div>

    {/* Photos Upload */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Photos
      </label>
      <div className="flex items-center space-x-3 mb-3">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="photos-upload"
          onChange={(e) => onFileSelect?.(e.target.files?.[0] || null, 'photoUrls')}
        />
        <button
          type="button"
          onClick={() => document.getElementById('photos-upload')?.click()}
          className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          disabled={uploading.photos}
        >
          <PhotoIcon className="h-5 w-5 mr-2 text-gray-500" />
          {uploading.photos ? `Uploading... (${uploadProgress.photos}%)` : 'Upload Photos'}
        </button>
        {formData.photoUrls && formData.photoUrls.length > 0 && (
          <span className="ml-3 text-sm text-green-600 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-1" /> {formData.photoUrls.length} photo(s) uploaded
          </span>
        )}
      </div>
      {uploading.photos && (
        <div className="mt-3 w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Uploading photos...</span>
            <span>{uploadProgress.photos}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress.photos}%` }}
            ></div>
          </div>
        </div>
      )}
      {uploadErrors.photoUrls && (
        <p className="mt-1 text-sm text-red-600">{uploadErrors.photoUrls}</p>
      )}
      
      {/* Display uploaded photos */}
      {formData.photoUrls && formData.photoUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {formData.photoUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img 
                src={url} 
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  const newUrls = formData.photoUrls.filter((_, i) => i !== index);
                  onChange('photoUrls', newUrls);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Additional Documents Upload */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Additional Documents
      </label>
      <div className="flex items-center space-x-3 mb-3">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          id="additional-docs-upload"
          onChange={(e) => onFileSelect?.(e.target.files?.[0] || null, 'additionalDocuments')}
        />
        <button
          type="button"
          onClick={() => document.getElementById('additional-docs-upload')?.click()}
          className="bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          disabled={uploading.additionalDocuments}
        >
          <PaperClipIcon className="h-5 w-5 mr-2 text-gray-500" />
          {uploading.additionalDocuments ? `Uploading... (${uploadProgress.additionalDocuments}%)` : 'Upload Documents'}
        </button>
        {formData.additionalDocuments && formData.additionalDocuments.length > 0 && (
          <span className="ml-3 text-sm text-green-600 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-1" /> {formData.additionalDocuments.length} document(s) uploaded
          </span>
        )}
      </div>
      {uploading.additionalDocuments && (
        <div className="mt-3 w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Uploading documents...</span>
            <span>{uploadProgress.additionalDocuments}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress.additionalDocuments}%` }}
            ></div>
          </div>
        </div>
      )}
      {uploadErrors.additionalDocuments && (
        <p className="mt-1 text-sm text-red-600">{uploadErrors.additionalDocuments}</p>
      )}
      
      {/* Display uploaded documents */}
      {formData.additionalDocuments && formData.additionalDocuments.length > 0 && (
        <div className="space-y-2">
          {formData.additionalDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <DocumentIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">Document {index + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newDocs = formData.additionalDocuments.filter((_, i) => i !== index);
                  onChange('additionalDocuments', newDocs);
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
