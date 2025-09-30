import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  User, 
  Heart, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCreateBirthRegister,
  useUpdateBirthRegister,
} from '@/graphql/hooks/useBirthRegistry';
import SearchableMemberOrTextInput from '@/components/ui/SearchableMemberOrTextInput';
import {
  BirthRegister,
  CreateBirthRegisterInput,
  UpdateBirthRegisterInput,
  Gender,
} from '@/graphql/queries/birthQueries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  memberId?: string;
  gender?: string;
  branch?: {
    id: string;
    name: string;
  };
}

interface BirthRegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  birthRegister?: BirthRegister;
  onSuccess?: (birthRegister: BirthRegister) => void;
}

interface FormData {
  childFirstName: string;
  childMiddleName: string;
  childLastName: string;
  childGender: Gender;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  hospitalName: string;
  attendingPhysician: string;
  birthWeight: string;
  birthLength: string;
  motherFirstName: string;
  motherLastName: string;
  motherAge: string;
  motherOccupation: string;
  fatherFirstName: string;
  fatherLastName: string;
  fatherAge: string;
  fatherOccupation: string;
  parentAddress: string;
  parentPhone: string;
  parentEmail: string;
  baptismPlanned: boolean;
  baptismDate: string;
  baptismLocation: string;
  baptismOfficiant: string;
  createChildMember: boolean;
}

const BirthRegisterForm: React.FC<BirthRegisterFormProps> = ({
  isOpen,
  onClose,
  birthRegister,
  onSuccess,
}) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const { create, loading: createLoading, error: createError } = useCreateBirthRegister();
  const { update, loading: updateLoading, error: updateError } = useUpdateBirthRegister();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    childFirstName: '',
    childMiddleName: '',
    childLastName: '',
    childGender: Gender.UNKNOWN,
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    hospitalName: '',
    attendingPhysician: '',
    birthWeight: '',
    birthLength: '',
    motherFirstName: '',
    motherLastName: '',
    motherAge: '',
    motherOccupation: '',
    fatherFirstName: '',
    fatherLastName: '',
    fatherAge: '',
    fatherOccupation: '',
    parentAddress: '',
    parentPhone: '',
    parentEmail: '',
    baptismPlanned: false,
    baptismDate: '',
    baptismLocation: '',
    baptismOfficiant: '',
    createChildMember: true, // Default to true for automatic member creation
  });

  // Member selection state
  const [selectedFatherMember, setSelectedFatherMember] = useState<Member | null>(null);
  const [selectedMotherMember, setSelectedMotherMember] = useState<Member | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!birthRegister;
  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  const steps = [
    {
      id: 1,
      title: 'Child Information',
      icon: User,
      description: 'Basic details about the child',
    },
    {
      id: 2,
      title: 'Birth Details',
      icon: Sparkles,
      description: 'Birth location and medical information',
    },
    {
      id: 3,
      title: 'Parent Information',
      icon: Heart,
      description: 'Details about the parents',
    },
    {
      id: 4,
      title: 'Baptism Planning',
      icon: Calendar,
      description: 'Baptism arrangements if planned',
    },
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (birthRegister && isOpen) {
      setFormData({
        childFirstName: birthRegister.childFirstName,
        childMiddleName: birthRegister.childMiddleName || '',
        childLastName: birthRegister.childLastName,
        childGender: birthRegister.childGender,
        dateOfBirth: birthRegister.dateOfBirth.split('T')[0],
        timeOfBirth: birthRegister.timeOfBirth || '',
        placeOfBirth: birthRegister.placeOfBirth,
        hospitalName: birthRegister.hospitalName || '',
        attendingPhysician: birthRegister.attendingPhysician || '',
        birthWeight: birthRegister.birthWeight?.toString() || '',
        birthLength: birthRegister.birthLength?.toString() || '',
        motherFirstName: birthRegister.motherFirstName,
        motherLastName: birthRegister.motherLastName,
        motherAge: birthRegister.motherAge?.toString() || '',
        motherOccupation: birthRegister.motherOccupation || '',
        fatherFirstName: birthRegister.fatherFirstName || '',
        fatherLastName: birthRegister.fatherLastName || '',
        fatherAge: birthRegister.fatherAge?.toString() || '',
        fatherOccupation: birthRegister.fatherOccupation || '',
        parentAddress: birthRegister.parentAddress,
        parentPhone: birthRegister.parentPhone || '',
        parentEmail: birthRegister.parentEmail || '',
        baptismPlanned: birthRegister.baptismPlanned,
        baptismDate: birthRegister.baptismDate ? birthRegister.baptismDate.split('T')[0] : '',
        baptismLocation: birthRegister.baptismLocation || '',
        baptismOfficiant: birthRegister.baptismOfficiant || '',
        createChildMember: birthRegister.createChildMember ?? true, // Default to true if not set
      });
      
      // Reset member selections when editing
      setSelectedFatherMember(null);
      setSelectedMotherMember(null);
    } else if (isOpen && !birthRegister) {
      // Reset member selections when creating new record
      setSelectedFatherMember(null);
      setSelectedMotherMember(null);
    }
  }, [birthRegister, isOpen]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Member selection handlers
  const handleFatherMemberChange = (value: string, member?: Member) => {
    if (member) {
      setSelectedFatherMember(member);
      setFormData(prev => ({
        ...prev,
        fatherFirstName: member.firstName,
        fatherLastName: member.lastName,
      }));
    } else {
      setSelectedFatherMember(null);
      // Parse the manually entered name
      const nameParts = value.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      setFormData(prev => ({
        ...prev,
        fatherFirstName: firstName,
        fatherLastName: lastName,
      }));
    }
  };

  const handleMotherMemberChange = (value: string, member?: Member) => {
    if (member) {
      setSelectedMotherMember(member);
      setFormData(prev => ({
        ...prev,
        motherFirstName: member.firstName,
        motherLastName: member.lastName,
      }));
    } else {
      setSelectedMotherMember(null);
      // Parse the manually entered name
      const nameParts = value.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      setFormData(prev => ({
        ...prev,
        motherFirstName: firstName,
        motherLastName: lastName,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.childFirstName.trim()) {
        newErrors.childFirstName = 'First name is required';
      }
      if (!formData.childLastName.trim()) {
        newErrors.childLastName = 'Last name is required';
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }
    } else if (step === 2) {
      if (!formData.placeOfBirth.trim()) {
        newErrors.placeOfBirth = 'Place of birth is required';
      }
    } else if (step === 3) {
      if (!formData.motherFirstName.trim()) {
        newErrors.motherFirstName = 'Mother\'s first name is required';
      }
      if (!formData.motherLastName.trim()) {
        newErrors.motherLastName = 'Mother\'s last name is required';
      }
      if (!formData.parentAddress.trim()) {
        newErrors.parentAddress = 'Parent address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    return validateStep(1) && validateStep(2) && validateStep(3);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleClose = () => {
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const input: CreateBirthRegisterInput | UpdateBirthRegisterInput = {
        childFirstName: formData.childFirstName.trim(),
        childMiddleName: formData.childMiddleName.trim() || undefined,
        childLastName: formData.childLastName.trim(),
        childGender: formData.childGender,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        timeOfBirth: formData.timeOfBirth.trim() || undefined,
        placeOfBirth: formData.placeOfBirth.trim(),
        hospitalName: formData.hospitalName.trim() || undefined,
        attendingPhysician: formData.attendingPhysician.trim() || undefined,
        birthWeight: formData.birthWeight ? parseFloat(formData.birthWeight) : undefined,
        birthLength: formData.birthLength ? parseFloat(formData.birthLength) : undefined,
        motherFirstName: formData.motherFirstName.trim(),
        motherLastName: formData.motherLastName.trim(),
        motherMemberId: selectedMotherMember?.id || undefined,
        motherAge: formData.motherAge ? parseInt(formData.motherAge) : undefined,
        motherOccupation: formData.motherOccupation.trim() || undefined,
        fatherFirstName: formData.fatherFirstName.trim() || undefined,
        fatherLastName: formData.fatherLastName.trim() || undefined,
        fatherMemberId: selectedFatherMember?.id || undefined,
        fatherAge: formData.fatherAge ? parseInt(formData.fatherAge) : undefined,
        fatherOccupation: formData.fatherOccupation.trim() || undefined,
        parentAddress: formData.parentAddress.trim(),
        parentPhone: formData.parentPhone.trim() || undefined,
        parentEmail: formData.parentEmail.trim() || undefined,
        baptismPlanned: formData.baptismPlanned,
        baptismDate: formData.baptismDate ? new Date(formData.baptismDate).toISOString() : undefined,
        baptismLocation: formData.baptismLocation.trim() || undefined,
        baptismOfficiant: formData.baptismOfficiant.trim() || undefined,
        createChildMember: formData.createChildMember,
        branchId,
        organisationId,
      };

      let result;
      if (isEditing) {
        result = await update(birthRegister.id, input);
      } else {
        result = await create(input as CreateBirthRegisterInput);
      }

      if (result && onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (error) {
      console.error('Error saving birth register:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isEditing ? 'Edit Birth Record' : 'Create New Birth Record'}
          </DialogTitle>
        </DialogHeader>
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 -m-6 mb-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/10" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? 'Edit Birth Record' : 'Add Birth Record'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {steps[currentStep - 1]?.description}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-white text-blue-600'
                        : currentStep === step.id
                        ? 'bg-white/20 text-white border-2 border-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                        currentStep > step.id ? 'bg-white' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Title */}
            <h3 className="text-lg font-semibold text-white">
              {steps[currentStep - 1]?.title}
            </h3>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert className="border-red-200 bg-red-50 rounded-xl">
              <AlertDescription className="text-red-800">
                {error.message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Step Content Container */}
        <div className="overflow-y-auto max-h-[60vh] px-1">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="childFirstName" className="text-gray-700 font-medium">First Name *</Label>
                      <Input
                        id="childFirstName"
                        value={formData.childFirstName}
                        onChange={(e) => handleInputChange('childFirstName', e.target.value)}
                        className={`mt-1 ${errors.childFirstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl`}
                        placeholder="Enter first name"
                      />
                      {errors.childFirstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.childFirstName}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="childMiddleName" className="text-gray-700 font-medium">Middle Name</Label>
                      <Input
                        id="childMiddleName"
                        value={formData.childMiddleName}
                        onChange={(e) => handleInputChange('childMiddleName', e.target.value)}
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                        placeholder="Enter middle name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="childLastName" className="text-gray-700 font-medium">Last Name *</Label>
                      <Input
                        id="childLastName"
                        value={formData.childLastName}
                        onChange={(e) => handleInputChange('childLastName', e.target.value)}
                        className={`mt-1 ${errors.childLastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl`}
                        placeholder="Enter last name"
                      />
                      {errors.childLastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.childLastName}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="childGender" className="text-gray-700 font-medium">Gender *</Label>
                      <Select value={formData.childGender} onValueChange={(value) => handleInputChange('childGender', value as Gender)}>
                        <SelectTrigger className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-xl">
                          <SelectItem value={Gender.MALE} className="text-gray-900 hover:bg-blue-50 rounded-lg">Male</SelectItem>
                          <SelectItem value={Gender.FEMALE} className="text-gray-900 hover:bg-pink-50 rounded-lg">Female</SelectItem>
                          <SelectItem value={Gender.UNKNOWN} className="text-gray-900 hover:bg-gray-50 rounded-lg">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className={`mt-1 ${errors.dateOfBirth ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl`}
                      />
                      {errors.dateOfBirth && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.dateOfBirth}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="timeOfBirth" className="text-gray-700 font-medium">Time of Birth</Label>
                      <Input
                        id="timeOfBirth"
                        type="time"
                        value={formData.timeOfBirth}
                        onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Child Member Creation Option */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <input
                        id="createChildMember"
                        type="checkbox"
                        checked={formData.createChildMember}
                        onChange={(e) => handleInputChange('createChildMember', e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <Label htmlFor="createChildMember" className="text-gray-700 font-medium cursor-pointer">
                          Register child as church member
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Automatically create a member record for this child with "Infant" status. 
                          This enables better family tracking and future sacrament planning.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="placeOfBirth" className="text-gray-700 font-medium">Place of Birth *</Label>
                      <Input
                        id="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                        placeholder="e.g., City General Hospital"
                        className={`mt-1 ${errors.placeOfBirth ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl`}
                      />
                      {errors.placeOfBirth && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.placeOfBirth}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="hospitalName" className="text-gray-700 font-medium">Hospital Name</Label>
                      <Input
                        id="hospitalName"
                        value={formData.hospitalName}
                        onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                        placeholder="Enter hospital name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="birthWeight" className="text-gray-700 font-medium">Birth Weight (grams)</Label>
                      <Input
                        id="birthWeight"
                        type="number"
                        value={formData.birthWeight}
                        onChange={(e) => handleInputChange('birthWeight', e.target.value)}
                        placeholder="e.g., 3200"
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="birthLength" className="text-gray-700 font-medium">Birth Length (cm)</Label>
                      <Input
                        id="birthLength"
                        type="number"
                        value={formData.birthLength}
                        onChange={(e) => handleInputChange('birthLength', e.target.value)}
                        placeholder="e.g., 50"
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="attendingPhysician" className="text-gray-700 font-medium">Attending Physician</Label>
                      <Input
                        id="attendingPhysician"
                        value={formData.attendingPhysician}
                        onChange={(e) => handleInputChange('attendingPhysician', e.target.value)}
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                        placeholder="Enter physician name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Parent Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <SearchableMemberOrTextInput
                          value={
                            selectedMotherMember?.id ||
                            `${formData.motherFirstName} ${formData.motherLastName}`.trim() ||
                            ""
                          }
                          onChange={handleMotherMemberChange}
                          label="Mother *"
                          placeholder="Search for the mother by name or enter manually..."
                          required={true}
                          className="w-full"
                        />
                        {errors.motherFirstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.motherFirstName}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <SearchableMemberOrTextInput
                          value={
                            selectedFatherMember?.id ||
                            `${formData.fatherFirstName} ${formData.fatherLastName}`.trim() ||
                            ""
                          }
                          onChange={handleFatherMemberChange}
                          label="Father"
                          placeholder="Search for the father by name or enter manually..."
                          required={false}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="parentAddress" className="text-gray-700 font-medium">Parent Address *</Label>
                    <Textarea
                      id="parentAddress"
                      value={formData.parentAddress}
                      onChange={(e) => handleInputChange('parentAddress', e.target.value)}
                      className={`mt-1 ${errors.parentAddress ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl`}
                      rows={3}
                      placeholder="Enter complete address"
                    />
                    {errors.parentAddress && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.parentAddress}
                      </motion.p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parentPhone" className="text-gray-700 font-medium">Parent Phone</Label>
                      <Input
                        id="parentPhone"
                        value={formData.parentPhone}
                        onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="parentEmail" className="text-gray-700 font-medium">Parent Email</Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        value={formData.parentEmail}
                        onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                        className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Checkbox
                      id="baptismPlanned"
                      checked={formData.baptismPlanned}
                      onCheckedChange={(checked) => handleInputChange('baptismPlanned', checked as boolean)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="baptismPlanned" className="text-gray-700 font-medium">
                      Baptism is planned for this child
                    </Label>
                  </div>

                  <AnimatePresence>
                    {formData.baptismPlanned && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div>
                          <Label htmlFor="baptismDate" className="text-gray-700 font-medium">Baptism Date</Label>
                          <Input
                            id="baptismDate"
                            type="date"
                            value={formData.baptismDate}
                            onChange={(e) => handleInputChange('baptismDate', e.target.value)}
                            className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                          />
                        </div>

                        <div>
                          <Label htmlFor="baptismLocation" className="text-gray-700 font-medium">Baptism Location</Label>
                          <Input
                            id="baptismLocation"
                            value={formData.baptismLocation}
                            onChange={(e) => handleInputChange('baptismLocation', e.target.value)}
                            placeholder="e.g., Main Church Sanctuary"
                            className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                          />
                        </div>

                        <div>
                          <Label htmlFor="baptismOfficiant" className="text-gray-700 font-medium">Baptism Officiant</Label>
                          <Input
                            id="baptismOfficiant"
                            value={formData.baptismOfficiant}
                            onChange={(e) => handleInputChange('baptismOfficiant', e.target.value)}
                            placeholder="e.g., Pastor John Smith"
                            className="mt-1 border-gray-200 focus:ring-blue-500 rounded-xl"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modern Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={loading}
                  className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              </motion.div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80 rounded-xl"
              >
                Cancel
              </Button>
            </motion.div>

            {currentStep < steps.length ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg min-w-[140px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {isEditing ? 'Update Record' : 'Create Record'}
                    </div>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BirthRegisterForm;
