'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ui/ImageUpload';
import { UPLOAD_MEMBER_IMAGE } from '@/graphql/mutations/memberMutations';
import { GET_MEMBER } from '@/graphql/queries/memberQueries';

interface ProfilePictureUploadProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  currentImageUrl?: string;
  onSuccess?: (imageUrl: string) => void;
  branchId?: string;
}

/**
 * ProfilePictureUpload Component
 * 
 * Modal dialog for uploading and changing member profile picture
 * Uses existing ImageUpload component for drag-drop and S3 upload
 * Integrates with uploadMemberImage mutation
 * 
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when modal should close
 * @param memberId - ID of member to update
 * @param currentImageUrl - Current profile image URL
 * @param onSuccess - Callback after successful upload
 * @param branchId - Branch ID for S3 upload context
 */
export default function ProfilePictureUpload({
  isOpen,
  onClose,
  memberId,
  currentImageUrl,
  onSuccess,
  branchId,
}: ProfilePictureUploadProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadMemberImage] = useMutation(UPLOAD_MEMBER_IMAGE, {
    refetchQueries: [
      {
        query: GET_MEMBER,
        variables: { memberId },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const imageUrl = data?.uploadMemberImage;
      if (imageUrl) {
        toast.success('Profile picture updated successfully!');
        onSuccess?.(imageUrl);
        handleClose();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload profile picture');
    },
  });

  const handleImageChange = (imageUrl: string | null) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleSubmit = async () => {
    if (!selectedImageUrl) {
      toast.error('Please select an image');
      return;
    }

    // If the image URL hasn't changed, just close
    if (selectedImageUrl === currentImageUrl) {
      handleClose();
      return;
    }

    try {
      setIsSubmitting(true);

      // The ImageUpload component already uploads to S3 and returns the URL
      // We just need to update the member record with the new URL
      await uploadMemberImage({
        variables: {
          memberId,
          file: selectedImageUrl, // This is already the S3 URL from ImageUpload
        },
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedImageUrl(currentImageUrl || null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Change Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Upload Component */}
          <div className="space-y-4">
            <ImageUpload
              value={selectedImageUrl}
              onChange={handleImageChange}
              size="lg"
              showPreview={true}
              acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeInMB={5}
              placeholder="Upload profile picture"
              branchId={branchId}
              description="Member profile picture"
            />

            {/* File Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Supported formats: JPG, PNG, WebP</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Recommended: 400x400px or larger</li>
                <li>• Square images work best</li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={handleSubmit}
              disabled={!selectedImageUrl || selectedImageUrl === currentImageUrl || isSubmitting}
            >
              {isSubmitting ? 'Uploading...' : 'Save Picture'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
