'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CREATE_SUBSCRIPTION,
  GET_SUBSCRIPTION_PLANS,
  GET_MEMBERS_FOR_SUBSCRIPTION,
  type CreateSubscriptionInput,
  type SubscriptionPlan,
  type Member,
} from '@/graphql/subscription-management';
import {
  UserIcon,
  CreditCardIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (subscription: any) => void;
}

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSubscriptionModalProps) {
  const [formData, setFormData] = useState<CreateSubscriptionInput>({
    customerId: '',
    planId: '',
    authorizationCode: '',
    startDate: '',
    metadata: {},
  });
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [planSearch, setPlanSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'member' | 'plan' | 'details' | 'review'>('member');

  // GraphQL queries
  const { data: membersData, loading: membersLoading } = useQuery(GET_MEMBERS_FOR_SUBSCRIPTION, {
    variables: {
      filter: {
        status: 'ACTIVE',
        search: memberSearch || undefined,
        limit: 20,
      },
    },
    skip: !isOpen,
  });

  const { data: plansData, loading: plansLoading } = useQuery(GET_SUBSCRIPTION_PLANS, {
    variables: {
      filter: {
        isActive: true,
        search: planSearch || undefined,
        limit: 20,
      },
    },
    skip: !isOpen,
  });

  // Create subscription mutation
  const [createSubscription, { loading: creating }] = useMutation(CREATE_SUBSCRIPTION, {
    onCompleted: (data) => {
      onSuccess?.(data.createSubscription);
      handleClose();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const members = membersData?.members || [];
  const plans = plansData?.subscriptionPlans || [];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      customerId: '',
      planId: '',
      authorizationCode: '',
      startDate: '',
      metadata: {},
    });
    setSelectedMember(null);
    setSelectedPlan(null);
    setMemberSearch('');
    setPlanSearch('');
    setErrors({});
    setStep('member');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateStep = (currentStep: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'member':
        if (!selectedMember) {
          newErrors.member = 'Please select a member';
        }
        break;
      case 'plan':
        if (!selectedPlan) {
          newErrors.plan = 'Please select a subscription plan';
        }
        break;
      case 'details':
        if (!formData.startDate) {
          newErrors.startDate = 'Please select a start date';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    const steps = ['member', 'plan', 'details', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as any);
    }
  };

  const handleBack = () => {
    const steps = ['member', 'plan', 'details', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as any);
    }
  };

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setFormData(prev => ({ ...prev, customerId: member.id }));
    setErrors(prev => ({ ...prev, member: '' }));
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setFormData(prev => ({ ...prev, planId: plan.id }));
    setErrors(prev => ({ ...prev, plan: '' }));
  };

  const handleSubmit = async () => {
    if (!validateStep('details')) return;

    try {
      await createSubscription({
        variables: {
          input: {
            ...formData,
            metadata: formData.metadata || {},
          },
        },
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100);
  };

  const formatInterval = (interval: string, count: number) => {
    const unit = count === 1 ? interval.toLowerCase() : `${interval.toLowerCase()}s`;
    return count === 1 ? unit : `${count} ${unit}`;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {['member', 'plan', 'details', 'review'].map((stepName, index) => {
        const isActive = step === stepName;
        const isCompleted = ['member', 'plan', 'details', 'review'].indexOf(step) > index;
        
        return (
          <React.Fragment key={stepName}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              isActive 
                ? 'border-blue-600 bg-blue-600 text-white' 
                : isCompleted 
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {isCompleted ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                isCompleted ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderMemberStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="member-search">Search Members</Label>
        <Input
          id="member-search"
          placeholder="Search by name or email..."
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
          className="mt-1"
        />
      </div>

      {errors.member && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{errors.member}</AlertDescription>
        </Alert>
      )}

      <div className="max-h-64 overflow-y-auto space-y-2">
        {membersLoading ? (
          <div className="text-center py-4">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No members found</div>
        ) : (
          members.map((member) => (
            <Card
              key={member.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMember?.id === member.id ? 'ring-2 ring-blue-600 bg-blue-50' : ''
              }`}
              onClick={() => handleMemberSelect(member)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {member.firstName} {member.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    {member.phoneNumber && (
                      <p className="text-sm text-gray-500">{member.phoneNumber}</p>
                    )}
                  </div>
                  <Badge variant="outline">{member.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderPlanStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="plan-search">Search Plans</Label>
        <Input
          id="plan-search"
          placeholder="Search subscription plans..."
          value={planSearch}
          onChange={(e) => setPlanSearch(e.target.value)}
          className="mt-1"
        />
      </div>

      {errors.plan && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{errors.plan}</AlertDescription>
        </Alert>
      )}

      <div className="max-h-64 overflow-y-auto space-y-2">
        {plansLoading ? (
          <div className="text-center py-4">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No plans found</div>
        ) : (
          plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPlan?.id === plan.id ? 'ring-2 ring-blue-600 bg-blue-50' : ''
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCardIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <h4 className="font-medium">{plan.name}</h4>
                      {plan.description && (
                        <p className="text-sm text-gray-500">{plan.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(plan.amount, plan.currency)}
                        </span>
                        <span className="text-sm text-gray-500">
                          per {formatInterval(plan.interval, plan.intervalCount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {plan.trialPeriodDays && (
                      <p className="text-xs text-gray-500 mt-1">
                        {plan.trialPeriodDays} day trial
                      </p>
                    )}
                  </div>
                </div>
                {plan.features && plan.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {plan.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          className="mt-1"
          min={format(new Date(), 'yyyy-MM-dd')}
        />
        {errors.startDate && (
          <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
        )}
      </div>

      <div>
        <Label htmlFor="authorization-code">Authorization Code (Optional)</Label>
        <Input
          id="authorization-code"
          placeholder="Paystack authorization code for saved card"
          value={formData.authorizationCode}
          onChange={(e) => setFormData(prev => ({ ...prev, authorizationCode: e.target.value }))}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to collect payment details during subscription activation
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes or metadata..."
          value={formData.metadata?.notes || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            metadata: { ...prev.metadata, notes: e.target.value }
          }))}
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>Member Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMember && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedMember.firstName} {selectedMember.lastName}</p>
              <p><strong>Email:</strong> {selectedMember.email}</p>
              {selectedMember.phoneNumber && (
                <p><strong>Phone:</strong> {selectedMember.phoneNumber}</p>
              )}
              <p><strong>Status:</strong> <Badge variant="outline">{selectedMember.status}</Badge></p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCardIcon className="w-5 h-5" />
            <span>Subscription Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPlan && (
            <div className="space-y-2">
              <p><strong>Plan:</strong> {selectedPlan.name}</p>
              {selectedPlan.description && (
                <p><strong>Description:</strong> {selectedPlan.description}</p>
              )}
              <p><strong>Price:</strong> {formatCurrency(selectedPlan.amount, selectedPlan.currency)} per {formatInterval(selectedPlan.interval, selectedPlan.intervalCount)}</p>
              {selectedPlan.trialPeriodDays && (
                <p><strong>Trial Period:</strong> {selectedPlan.trialPeriodDays} days</p>
              )}
              {selectedPlan.features && selectedPlan.features.length > 0 && (
                <div>
                  <strong>Features:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPlan.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Subscription Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Start Date:</strong> {formData.startDate ? format(new Date(formData.startDate), 'PPP') : 'Not set'}</p>
            {formData.authorizationCode && (
              <p><strong>Payment Method:</strong> Saved card (authorization provided)</p>
            )}
            {formData.metadata?.notes && (
              <p><strong>Notes:</strong> {formData.metadata.notes}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {errors.submit && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCardIcon className="w-6 h-6" />
            <span>Create New Subscription</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {renderStepIndicator()}
          
          <div className="mt-6">
            {step === 'member' && renderMemberStep()}
            {step === 'plan' && renderPlanStep()}
            {step === 'details' && renderDetailsStep()}
            {step === 'review' && renderReviewStep()}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            {step !== 'member' && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {step === 'review' ? (
              <Button onClick={handleSubmit} disabled={creating}>
                {creating ? 'Creating...' : 'Create Subscription'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
