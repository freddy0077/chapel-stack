'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  BuildingOfficeIcon,
  UserIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { classNames } from '../utils/formatters';
import { useCreateOrganisation } from '@/graphql/hooks/useOrganisation';
import { GET_SUBSCRIPTION_PLANS } from '@/graphql/subscription-management';
import { useCreateOrganizationSubscription } from '@/hooks/subscription/useOrganizationSubscription';
import { CREATE_SUPER_ADMIN_USER } from '@/graphql/mutations/onboardingMutations';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrganizationData {
  // Step 1: Basic Information
  name: string;
  email: string;
  phoneNumber: string;
  website: string;
  
  // Step 2: Address & Location
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  
  // Step 3: Admin User
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  
  // Step 4: Subscription Plan
  planId: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  startDate: string;
  
  // Additional organization fields
  denomination?: string;
  foundingYear?: number;
  size?: string;
  vision?: string;
  missionStatement?: string;
  description?: string;
  timezone?: string;
  currency?: string;
  primaryColor?: string;
  secondaryColor?: string;
  organizationId?: string;
}

const WIZARD_STEPS = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Organization details and contact information',
    icon: BuildingOfficeIcon
  },
  {
    id: 'location',
    title: 'Address & Location',
    description: 'Physical address and location details',
    icon: BuildingOfficeIcon
  },
  {
    id: 'admin',
    title: 'Admin User',
    description: 'Primary administrator account setup',
    icon: UserIcon
  },
  {
    id: 'subscription',
    title: 'Subscription Plan',
    description: 'Choose subscription plan and billing',
    icon: CreditCardIcon
  },
  {
    id: 'review',
    title: 'Review & Create',
    description: 'Review details and create organization',
    icon: CheckCircleIcon
  }
];

export default function CreateOrganizationModal({ isOpen, onClose, onSuccess }: CreateOrganizationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // GraphQL hooks
  const { data: subscriptionPlansData, loading: subscriptionPlansLoading, error: subscriptionPlansError } = useQuery(GET_SUBSCRIPTION_PLANS, {
    skip: !isOpen, // Only fetch when modal is open
    fetchPolicy: 'cache-first', // Use cache first to prevent unnecessary requests
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false // Prevent unnecessary re-renders
  });
  const { createOrganisation, loading: createOrganizationLoading, error: createOrganizationError } = useCreateOrganisation();
  const { createOrganizationSubscription } = useCreateOrganizationSubscription();
  const [createSuperAdminUser, { loading: createSuperAdminUserLoading, error: createSuperAdminUserError }] = useMutation(CREATE_SUPER_ADMIN_USER);
  
  const subscriptionPlans = subscriptionPlansData?.subscriptionPlans || [];
  
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    // Step 1: Basic Information
    name: '',
    email: '',
    phoneNumber: '',
    website: '',
    
    // Step 2: Address & Location
    address: '',
    city: '',
    state: '',
    country: 'Ghana',
    zipCode: '',
    
    // Step 3: Admin User
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    
    // Step 4: Subscription Plan
    planId: '',
    billingCycle: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setErrors({});
      setOrganizationData({
        name: '',
        email: '',
        phoneNumber: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: 'Ghana',
        zipCode: '',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPhone: '',
        adminPassword: '',
        planId: '',
        billingCycle: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [isOpen]);

  const updateField = (field: keyof OrganizationData, value: string) => {
    setOrganizationData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!organizationData.name.trim()) newErrors.name = 'Organization name is required';
        if (!organizationData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(organizationData.email)) newErrors.email = 'Invalid email format';
        break;
        
      case 1: // Address & Location
        if (!organizationData.address.trim()) newErrors.address = 'Address is required';
        if (!organizationData.city.trim()) newErrors.city = 'City is required';
        if (!organizationData.state.trim()) newErrors.state = 'State is required';
        break;
        
      case 2: // Admin User
        if (!organizationData.adminFirstName.trim()) newErrors.adminFirstName = 'First name is required';
        if (!organizationData.adminLastName.trim()) newErrors.adminLastName = 'Last name is required';
        if (!organizationData.adminEmail.trim()) newErrors.adminEmail = 'Admin email is required';
        else if (!/\S+@\S+\.\S+/.test(organizationData.adminEmail)) newErrors.adminEmail = 'Invalid email format';
        if (!organizationData.adminPassword.trim()) newErrors.adminPassword = 'Admin password is required';
        break;
        
      case 3: // Subscription Plan
        if (!organizationData.planId) newErrors.planId = 'Please select a subscription plan';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    // If we're on the basic information step (step 0), create the organization first
    if (currentStep === 0) {
      setIsLoading(true);
      try {
        // Create the organization using GraphQL API
        const organizationResponse = await createOrganisation({
          variables: {
            input: {
              name: organizationData.name,
              email: organizationData.email,
              phoneNumber: organizationData.phoneNumber,
              website: organizationData.website,
              address: organizationData.address,
              city: organizationData.city,
              state: organizationData.state,
              country: organizationData.country,
              zipCode: organizationData.zipCode,
              currency: 'GHS',
              timezone: 'Africa/Accra'
            }
          }
        });
        
        if (organizationResponse.data?.createOrganisation) {
          // Store the created organization ID for later use in subscription creation
          const newOrganization = organizationResponse.data.createOrganisation;
          setOrganizationData(prev => ({ ...prev, organizationId: newOrganization.id }));
          
          // Move to next step after successful organization creation
          setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
        } else {
          setErrors({ submit: 'Failed to create organization. Please try again.' });
        }
      } catch (error) {
        console.error('Error creating organization:', error);
        setErrors({ submit: 'Failed to create organization. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } 
    // If we're on the admin user step (step 2), create the admin user
    else if (currentStep === 2) {
      setIsLoading(true);
      try {
        // Create the admin user using the onboarding GraphQL API
        const adminUserResponse = await createSuperAdminUser({
          variables: {
            email: organizationData.adminEmail,
            password: organizationData.adminPassword,
            firstName: organizationData.adminFirstName,
            lastName: organizationData.adminLastName,
            organisationId: organizationData.organizationId
          }
        });
        
        if (adminUserResponse.data?.createSuperAdminUser) {
          // Move to next step after successful admin user creation
          setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
        } else {
          setErrors({ submit: 'Failed to create admin user. Please try again.' });
        }
      } catch (error) {
        console.error('Error creating admin user:', error);
        setErrors({ submit: 'Failed to create admin user. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      // For other steps, just validate and move forward
      setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Only create the subscription since organization and admin user are already created
      if (organizationData.organizationId && organizationData.planId) {
        const subscriptionResponse = await createOrganizationSubscription(
          organizationData.organizationId,
          organizationData.planId,
          {
            startDate: organizationData.startDate || new Date().toISOString().split('T')[0],
            metadata: {
              adminFirstName: organizationData.adminFirstName,
              adminLastName: organizationData.adminLastName,
              adminEmail: organizationData.adminEmail,
              adminPhone: organizationData.adminPhone,
              billingCycle: organizationData.billingCycle
            }
          }
        );
        console.log('subscriptionResponse', subscriptionResponse);
        if (subscriptionResponse?.id) {
          console.log('Subscription created successfully:', subscriptionResponse);
          onSuccess();
          onClose();
        } else {
          setErrors({ submit: 'Failed to create subscription. Please try again.' });
        }
      } else {
        setErrors({ submit: 'Missing organization ID or plan ID. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      setErrors({ submit: 'Failed to create subscription. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <Input
                value={organizationData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter organization name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={organizationData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@organization.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                value={organizationData.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <Input
                value={organizationData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://www.organization.com"
              />
            </div>
          </div>
        );

      case 1: // Address & Location
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <Textarea
                value={organizationData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Enter full address"
                className={errors.address ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Input
                  value={organizationData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Region *
                </label>
                <Input
                  value={organizationData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State or Region"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Select value={organizationData.country} onValueChange={(value) => updateField('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input
                  value={organizationData.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Admin User
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <Input
                  value={organizationData.adminFirstName}
                  onChange={(e) => updateField('adminFirstName', e.target.value)}
                  placeholder="First name"
                  className={errors.adminFirstName ? 'border-red-500' : ''}
                />
                {errors.adminFirstName && <p className="text-red-500 text-sm mt-1">{errors.adminFirstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <Input
                  value={organizationData.adminLastName}
                  onChange={(e) => updateField('adminLastName', e.target.value)}
                  placeholder="Last name"
                  className={errors.adminLastName ? 'border-red-500' : ''}
                />
                {errors.adminLastName && <p className="text-red-500 text-sm mt-1">{errors.adminLastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email *
              </label>
              <Input
                type="email"
                value={organizationData.adminEmail}
                onChange={(e) => updateField('adminEmail', e.target.value)}
                placeholder="admin@organization.com"
                className={errors.adminEmail ? 'border-red-500' : ''}
              />
              {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password *
              </label>
              <Input
                type="password"
                value={organizationData.adminPassword}
                onChange={(e) => updateField('adminPassword', e.target.value)}
                placeholder="Password"
                className={errors.adminPassword ? 'border-red-500' : ''}
              />
              {errors.adminPassword && <p className="text-red-500 text-sm mt-1">{errors.adminPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Phone
              </label>
              <Input
                value={organizationData.adminPhone}
                onChange={(e) => updateField('adminPhone', e.target.value)}
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The admin user will receive login credentials via email and will have full access to manage the organization.
              </p>
            </div>
          </div>
        );

      case 3: // Subscription Plan
        return (
          <div className="space-y-4">
            {subscriptionPlansLoading && (
              <div className="text-center py-4">Loading subscription plans...</div>
            )}
            
            {subscriptionPlansError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error loading subscription plans. Please try again.</p>
              </div>
            )}
            
            {!subscriptionPlansLoading && !subscriptionPlansError && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Subscription Plan *
                </label>
                <div className="grid gap-4">
                  {subscriptionPlans.map((plan: any) => (
                    <Card 
                      key={plan.id}
                      className={classNames(
                        'cursor-pointer transition-all',
                        organizationData.planId === plan.id 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      )}
                      onClick={() => updateField('planId', plan.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                            <p className="text-2xl font-bold text-green-600">
                              {plan.currency} {plan.amount}
                              <span className="text-sm font-normal text-gray-500">
                                /{organizationData.billingCycle.toLowerCase()}
                              </span>
                            </p>
                            {plan.features && (
                              <ul className="mt-2 space-y-1">
                                {plan.features.map((feature: string, index: number) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-center">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          {organizationData.planId === plan.id && (
                            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.planId && <p className="text-red-500 text-sm mt-1">{errors.planId}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <Select value={organizationData.billingCycle} onValueChange={(value: 'MONTHLY' | 'YEARLY') => updateField('billingCycle', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly (Save 20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={organizationData.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        );

      case 4: // Review & Create
        const selectedPlan = subscriptionPlans.find((p: any) => p.id === organizationData.planId);
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Organization Details</h3>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {organizationData.name}</div>
                    <div><strong>Email:</strong> {organizationData.email}</div>
                    {organizationData.phoneNumber && <div><strong>Phone:</strong> {organizationData.phoneNumber}</div>}
                    {organizationData.website && <div><strong>Website:</strong> {organizationData.website}</div>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>{organizationData.address}</div>
                    <div>{organizationData.city}, {organizationData.state}</div>
                    <div>{organizationData.country} {organizationData.zipCode}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Administrator</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {organizationData.adminFirstName} {organizationData.adminLastName}</div>
                    <div><strong>Email:</strong> {organizationData.adminEmail}</div>
                    {organizationData.adminPhone && <div><strong>Phone:</strong> {organizationData.adminPhone}</div>}
                  </CardContent>
                </Card>

                {selectedPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Subscription</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Plan:</strong> {selectedPlan.name}</div>
                      <div><strong>Price:</strong> {selectedPlan.currency} {selectedPlan.amount}/{organizationData.billingCycle.toLowerCase()}</div>
                      <div><strong>Start Date:</strong> {new Date(organizationData.startDate).toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BuildingOfficeIcon className="h-6 w-6 mr-2" />
            Create New Organization
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Step Navigation */}
          <div className="lg:w-1/3">
            <div className="space-y-2">
              {WIZARD_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={classNames(
                      'flex items-center p-3 rounded-lg transition-colors',
                      isActive ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50',
                      isCompleted ? 'bg-green-50 border border-green-200' : ''
                    )}
                  >
                    <div className={classNames(
                      'flex items-center justify-center w-8 h-8 rounded-full mr-3',
                      isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    )}>
                      {isCompleted ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className={classNames(
                        'font-medium',
                        isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                      )}>
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">{WIZARD_STEPS[currentStep].title}</h2>
              <p className="text-gray-600">{WIZARD_STEPS[currentStep].description}</p>
            </div>

            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={currentStep === 0 ? onClose : handleBack}
                disabled={isLoading}
              >
                {currentStep === 0 ? (
                  <>
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back
                  </>
                )}
              </Button>

              <Button
                onClick={currentStep === WIZARD_STEPS.length - 1 ? handleSubmit : handleNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  'Creating...'
                ) : currentStep === WIZARD_STEPS.length - 1 ? (
                  'Create Organization'
                ) : (
                  <>
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
