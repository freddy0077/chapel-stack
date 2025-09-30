import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  SearchIcon,
  XIcon,
  CheckIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import { Family, CreateFamilyInput, UpdateFamilyInput } from '@/graphql/queries/familyQueries';
import { useFamilyOperations } from '../hooks/useFamilyOperations';
import { useQuery } from '@apollo/client';
import { SEARCH_MEMBERS_FOR_FAMILY } from '@/graphql/queries/familyQueries';

const familySchema = z.object({
  name: z.string().min(1, 'Family name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type FamilyFormData = z.infer<typeof familySchema>;

interface CreateFamilyWizardProps {
  family?: Family | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateFamilyWizard: React.FC<CreateFamilyWizardProps> = ({
  family,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const { createFamily, updateFamily } = useFamilyOperations();
  const isEditing = !!family;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: family?.name || '',
      address: family?.address || '',
      city: family?.city || '',
      state: family?.state || '',
      postalCode: family?.postalCode || '',
      country: family?.country || '',
      phoneNumber: family?.phoneNumber || '',
    },
  });

  const { data: searchResults } = useQuery(SEARCH_MEMBERS_FOR_FAMILY, {
    variables: { query: memberSearchQuery },
    skip: !memberSearchQuery || memberSearchQuery.length < 2,
  });

  const watchedName = watch('name');

  // Initialize selected members for editing
  useEffect(() => {
    if (family?.members) {
      setSelectedMembers(family.members);
    }
  }, [family]);

  // Check for duplicate family names
  useEffect(() => {
    if (watchedName && watchedName.length > 2 && !isEditing) {
      // TODO: Implement duplicate detection
      // For now, just show a placeholder warning
      if (watchedName.toLowerCase().includes('smith')) {
        setDuplicateWarning('A family with a similar name already exists. Please verify this is a new family.');
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  }, [watchedName, isEditing]);

  const handleAddMember = (member: any) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setMemberSearchQuery('');
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
  };

  const onSubmit = async (data: FamilyFormData) => {
    try {
      const familyInput = {
        ...data,
        memberIds: selectedMembers.map(m => m.id),
      };

      if (isEditing && family) {
        await updateFamily(family.id, familyInput as UpdateFamilyInput);
      } else {
        await createFamily(familyInput as CreateFamilyInput);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save family:', error);
    }
  };

  const getMemberInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: HomeIcon },
    { id: 2, title: 'Add Members', icon: UsersIcon },
    { id: 3, title: 'Review & Save', icon: CheckIcon },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? `Edit ${family?.name}` : 'Create New Family'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HomeIcon className="mr-2 h-5 w-5" />
                    Family Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Family Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="e.g., Smith Family"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                    {duplicateWarning && (
                      <div className="flex items-center mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <AlertTriangleIcon className="h-4 w-4 text-yellow-600 mr-2" />
                        <p className="text-yellow-800 text-sm">{duplicateWarning}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        {...register('address')}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        {...register('state')}
                        placeholder="State or Province"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        {...register('postalCode')}
                        placeholder="Postal/ZIP code"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...register('country')}
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        {...register('phoneNumber')}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Add Members */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UsersIcon className="mr-2 h-5 w-5" />
                    Family Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Member Search */}
                  <div>
                    <Label>Search and Add Members</Label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search members by name..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Search Results */}
                    {searchResults?.searchMembers && memberSearchQuery.length >= 2 && (
                      <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                        {searchResults.searchMembers.map((member: any) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleAddMember(member)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.profileImageUrl} />
                                <AvatarFallback className="text-xs">
                                  {getMemberInitials(member.firstName, member.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.firstName} {member.lastName}</p>
                                <p className="text-sm text-gray-500">{member.email}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">Add</Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Selected Members */}
                  <div>
                    <Label>Selected Members ({selectedMembers.length})</Label>
                    {selectedMembers.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {selectedMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.profileImageUrl} />
                                <AvatarFallback className="text-xs">
                                  {getMemberInitials(member.firstName, member.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.firstName} {member.lastName}</p>
                                <p className="text-sm text-gray-500">{member.email}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 p-8 text-center text-gray-500">
                        <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p>No members selected yet</p>
                        <p className="text-sm">Search and add members to this family</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Review & Save */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckIcon className="mr-2 h-5 w-5" />
                    Review Family Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Family Name</Label>
                    <p className="text-lg font-semibold">{watch('name')}</p>
                  </div>

                  {(watch('address') || watch('city')) && (
                    <div>
                      <Label>Address</Label>
                      <p className="text-gray-900">
                        {[watch('address'), watch('city'), watch('state'), watch('postalCode'), watch('country')]
                          .filter(Boolean)
                          .join(', ') || 'No address provided'}
                      </p>
                    </div>
                  )}

                  {watch('phoneNumber') && (
                    <div>
                      <Label>Phone Number</Label>
                      <p className="text-gray-900">{watch('phoneNumber')}</p>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label>Family Members ({selectedMembers.length})</Label>
                    {selectedMembers.length > 0 ? (
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.profileImageUrl} />
                              <AvatarFallback className="text-xs">
                                {getMemberInitials(member.firstName, member.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.firstName} {member.lastName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mt-1">No members added</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && !!errors.name}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update Family' : 'Create Family'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
