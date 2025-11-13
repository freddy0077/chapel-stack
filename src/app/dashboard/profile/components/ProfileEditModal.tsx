'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UPDATE_MEMBER } from '@/graphql/mutations/memberMutations';
import { GET_MEMBER } from '@/graphql/queries/memberQueries';

/**
 * Validation schema for profile edit form
 */
const profileEditSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  middleName: z.string().max(50, 'Middle name must be less than 50 characters').optional().or(z.literal('')),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Invalid phone number').optional().or(z.literal('')),
  alternativeEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  alternatePhone: z.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Invalid phone number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', '']).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', '']).optional(),
  nationality: z.string().max(50, 'Nationality must be less than 50 characters').optional().or(z.literal('')),
  occupation: z.string().max(100, 'Occupation must be less than 100 characters').optional().or(z.literal('')),
  education: z.string().max(100, 'Education must be less than 100 characters').optional().or(z.literal('')),
  address: z.string().max(200, 'Address must be less than 200 characters').optional().or(z.literal('')),
  city: z.string().max(50, 'City must be less than 50 characters').optional().or(z.literal('')),
  state: z.string().max(50, 'State must be less than 50 characters').optional().or(z.literal('')),
  postalCode: z.string().max(20, 'Postal code must be less than 20 characters').optional().or(z.literal('')),
  country: z.string().max(50, 'Country must be less than 50 characters').optional().or(z.literal('')),
  emergencyContactName: z.string().max(100, 'Emergency contact name must be less than 100 characters').optional().or(z.literal('')),
  emergencyContactPhone: z.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Invalid phone number').optional().or(z.literal('')),
  emergencyContactRelation: z.string().max(50, 'Relation must be less than 50 characters').optional().or(z.literal('')),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  onSuccess?: () => void;
}

/**
 * ProfileEditModal Component
 * 
 * Modal dialog for editing member profile information
 * Includes form validation, submission handling, and error management
 * 
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when modal should close
 * @param member - Current member data to pre-fill form
 * @param onSuccess - Callback after successful update
 */
export default function ProfileEditModal({
  isOpen,
  onClose,
  member,
  onSuccess,
}: ProfileEditModalProps) {
  const [hasChanges, setHasChanges] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: member?.firstName || '',
      middleName: member?.middleName || '',
      lastName: member?.lastName || '',
      email: member?.email || '',
      phoneNumber: member?.phoneNumber || '',
      alternativeEmail: member?.alternativeEmail || '',
      alternatePhone: member?.alternatePhone || '',
      dateOfBirth: member?.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
      gender: member?.gender || '',
      maritalStatus: member?.maritalStatus || '',
      nationality: member?.nationality || '',
      occupation: member?.occupation || '',
      education: member?.education || '',
      address: member?.address || '',
      city: member?.city || '',
      state: member?.state || '',
      postalCode: member?.postalCode || '',
      country: member?.country || '',
      emergencyContactName: member?.emergencyContactName || '',
      emergencyContactPhone: member?.emergencyContactPhone || '',
      emergencyContactRelation: member?.emergencyContactRelation || '',
    },
  });

  const formValues = watch();

  // Track if form has changes
  useEffect(() => {
    const hasFormChanges =
      formValues.firstName !== (member?.firstName || '') ||
      formValues.middleName !== (member?.middleName || '') ||
      formValues.lastName !== (member?.lastName || '') ||
      formValues.email !== (member?.email || '') ||
      formValues.phoneNumber !== (member?.phoneNumber || '') ||
      formValues.alternativeEmail !== (member?.alternativeEmail || '') ||
      formValues.alternatePhone !== (member?.alternatePhone || '') ||
      formValues.dateOfBirth !== (member?.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '') ||
      formValues.gender !== (member?.gender || '') ||
      formValues.maritalStatus !== (member?.maritalStatus || '') ||
      formValues.nationality !== (member?.nationality || '') ||
      formValues.occupation !== (member?.occupation || '') ||
      formValues.education !== (member?.education || '') ||
      formValues.address !== (member?.address || '') ||
      formValues.city !== (member?.city || '') ||
      formValues.state !== (member?.state || '') ||
      formValues.postalCode !== (member?.postalCode || '') ||
      formValues.country !== (member?.country || '') ||
      formValues.emergencyContactName !== (member?.emergencyContactName || '') ||
      formValues.emergencyContactPhone !== (member?.emergencyContactPhone || '') ||
      formValues.emergencyContactRelation !== (member?.emergencyContactRelation || '');

    setHasChanges(hasFormChanges);
  }, [formValues, member]);

  const [updateMember] = useMutation(UPDATE_MEMBER, {
    refetchQueries: [
      {
        query: GET_MEMBER,
        variables: { memberId: member?.id },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success('Profile updated successfully!');
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const onSubmit = async (data: ProfileEditFormData) => {
    try {
      // Convert empty strings to null for optional fields
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? null : value;
        return acc;
      }, {} as Record<string, any>);

      await updateMember({
        variables: {
          id: member?.id,
          updateMemberInput: {
            ...cleanData,
            // Ensure required fields are included
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleClose = () => {
    reset();
    setHasChanges(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  placeholder="Middle name"
                  {...register('middleName')}
                  className={errors.middleName ? 'border-red-500' : ''}
                />
                {errors.middleName && (
                  <p className="text-sm text-red-500">{errors.middleName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  {...register('phoneNumber')}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternativeEmail">Alternative Email</Label>
                <Input
                  id="alternativeEmail"
                  type="email"
                  placeholder="alternative@example.com"
                  {...register('alternativeEmail')}
                  className={errors.alternativeEmail ? 'border-red-500' : ''}
                />
                {errors.alternativeEmail && (
                  <p className="text-sm text-red-500">{errors.alternativeEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternative Phone</Label>
                <Input
                  id="alternatePhone"
                  placeholder="+1 (555) 987-6543"
                  {...register('alternatePhone')}
                  className={errors.alternatePhone ? 'border-red-500' : ''}
                />
                {errors.alternatePhone && (
                  <p className="text-sm text-red-500">{errors.alternatePhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="MARRIED">Married</SelectItem>
                        <SelectItem value="DIVORCED">Divorced</SelectItem>
                        <SelectItem value="WIDOWED">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  placeholder="e.g., American"
                  {...register('nationality')}
                  className={errors.nationality ? 'border-red-500' : ''}
                />
                {errors.nationality && (
                  <p className="text-sm text-red-500">{errors.nationality.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="e.g., Software Engineer"
                  {...register('occupation')}
                  className={errors.occupation ? 'border-red-500' : ''}
                />
                {errors.occupation && (
                  <p className="text-sm text-red-500">{errors.occupation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <Input
                  id="education"
                  placeholder="e.g., Bachelor's Degree"
                  {...register('education')}
                  className={errors.education ? 'border-red-500' : ''}
                />
                {errors.education && (
                  <p className="text-sm text-red-500">{errors.education.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Address Information</h3>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                {...register('address')}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  {...register('city')}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Region</Label>
                <Input
                  id="state"
                  placeholder="State"
                  {...register('state')}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="12345"
                  {...register('postalCode')}
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  {...register('country')}
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Emergency Contact</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Full name"
                  {...register('emergencyContactName')}
                  className={errors.emergencyContactName ? 'border-red-500' : ''}
                />
                {errors.emergencyContactName && (
                  <p className="text-sm text-red-500">{errors.emergencyContactName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                <Input
                  id="emergencyContactPhone"
                  placeholder="+1 (555) 123-4567"
                  {...register('emergencyContactPhone')}
                  className={errors.emergencyContactPhone ? 'border-red-500' : ''}
                />
                {errors.emergencyContactPhone && (
                  <p className="text-sm text-red-500">{errors.emergencyContactPhone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relation</Label>
                <Input
                  id="emergencyContactRelation"
                  placeholder="e.g., Spouse, Parent"
                  {...register('emergencyContactRelation')}
                  className={errors.emergencyContactRelation ? 'border-red-500' : ''}
                />
                {errors.emergencyContactRelation && (
                  <p className="text-sm text-red-500">{errors.emergencyContactRelation.message}</p>
                )}
              </div>
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
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              disabled={!hasChanges || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
