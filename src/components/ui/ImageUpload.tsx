'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@apollo/client';
import { GET_PRESIGNED_UPLOAD_URL } from '@/graphql/mutations/memberMutations';

interface ImageUploadProps {
  value?: string | null;
  onChange: (imageUrl: string | null) => void;
  onImageFile?: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showPreview?: boolean;
  acceptedFormats?: string[];
  maxSizeInMB?: number;
  placeholder?: string;
  branchId?: string;
  organisationId?: string;
  description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onImageFile,
  disabled = false,
  className = '',
  size = 'md',
  showPreview = true,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeInMB = 5,
  placeholder = 'Upload profile image',
  branchId,
  organisationId,
  description = 'Member profile image',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [getPresignedUploadUrl] = useMutation(GET_PRESIGNED_UPLOAD_URL);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const validateFile = (file: File): string | null => {
    // Check if file exists
    if (!file) {
      return 'No file selected';
    }

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size too large. Maximum size: ${maxSizeInMB}MB`;
    }

    // Check minimum file size (avoid empty files)
    if (file.size < 100) {
      return 'File is too small or corrupted';
    }

    // Check for reasonable image dimensions (basic validation)
    return null;
  };

  const uploadToS3 = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Additional validation: Check if the file is actually an image
      const img = new Image();
      const localImageUrl = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          // Check minimum dimensions
          if (img.width < 50 || img.height < 50) {
            reject(new Error('Image dimensions too small. Minimum 50x50 pixels required.'));
            return;
          }
          // Check maximum dimensions
          if (img.width > 5000 || img.height > 5000) {
            reject(new Error('Image dimensions too large. Maximum 5000x5000 pixels allowed.'));
            return;
          }
          resolve(img);
        };
        img.onerror = () => reject(new Error('Invalid or corrupted image file.'));
        img.src = localImageUrl;
      });

      // Clean up the local URL
      URL.revokeObjectURL(localImageUrl);
      
      // Get presigned URL for S3 upload
      const { data } = await getPresignedUploadUrl({
        variables: {
          input: {
            fileName: file.name,
            contentType: file.type,
            mediaType: 'IMAGE',
            branchId: branchId,
            description: description
          }
        }
      });
      
      if (!data || !data.getPresignedUploadUrl) {
        throw new Error('Failed to get presigned URL');
      }
      
      // Upload to S3 using XMLHttpRequest for progress tracking
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadUrl', data.getPresignedUploadUrl.uploadUrl);
      
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      // Send the request
      xhr.open('POST', '/api/proxy-upload');
      
      // Fallback progress simulation
      let progressInterval: NodeJS.Timeout;
      let simulatedProgress = 0;
      
      progressInterval = setInterval(() => {
        if (simulatedProgress < 90) {
          simulatedProgress += Math.random() * 10;
          if (simulatedProgress > 90) simulatedProgress = 90;
          setUploadProgress(Math.round(simulatedProgress));
        }
      }, 500);
      
      // Handle completion
      xhr.addEventListener('load', () => {
        clearInterval(progressInterval);
        if (xhr.status >= 200 && xhr.status < 300) {
          const fileUrl = data.getPresignedUploadUrl.fileUrl;
          setUploadProgress(100);
          onChange(fileUrl);
          onImageFile?.(file);
        } else {
          console.error('Upload failed:', xhr.status, xhr.statusText);
          setError(`Failed to upload image: ${xhr.statusText}`);
        }
      });
      
      // Handle errors
      xhr.addEventListener('error', () => {
        clearInterval(progressInterval);
        console.error('Upload error');
        setError('Upload failed due to network error');
      });
      
      xhr.send(formData);
      
      // Wait for completion
      await new Promise((resolve, reject) => {
        xhr.addEventListener('load', resolve);
        xhr.addEventListener('error', reject);
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      setError(errorMessage);
      console.error('Image upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!branchId) {
      setError('Branch ID is required for file upload');
      return;
    }

    await uploadToS3(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      setError('No file selected');
      return;
    }

    if (files.length > 1) {
      setError('Please select only one image file');
      return;
    }

    const file = files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    const files = event.dataTransfer.files;
    
    if (files.length === 0) {
      setError('No files were dropped');
      return;
    }

    if (files.length > 1) {
      setError('Please drop only one image file');
      return;
    }

    const file = files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    onChange(null);
    onImageFile?.(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetry = () => {
    setError(null);
    openFileDialog();
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Image Preview */}
      {showPreview && (
        <div className="flex items-center space-x-4">
          <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
            {value ? (
              <div className="relative group">
                <img
                  src={value}
                  alt="Profile"
                  className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 shadow-sm`}
                />
                {!disabled && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200`}>
                <UserCircleIcon className="w-full h-full text-gray-400" />
              </div>
            )}
          </div>

          {/* Upload Status */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              {value ? 'Profile Image' : placeholder}
            </p>
            {isUploading && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Uploading image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-red-700 font-medium">{error}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <button
                        onClick={handleRetry}
                        className="text-xs text-red-600 hover:text-red-800 underline font-medium"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => setError(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-2"
            >
              <div className="w-8 h-8 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-blue-600 font-medium">Uploading...</p>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-2"
            >
              <div className="flex justify-center">
                {isDragging ? (
                  <ArrowUpTrayIcon className="w-8 h-8 text-blue-500" />
                ) : (
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {acceptedFormats.map(f => f.split('/')[1]).join(', ').toUpperCase()} up to {maxSizeInMB}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageUpload;
