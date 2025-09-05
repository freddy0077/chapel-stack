import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Title,
  Text,
  Button,
  Grid,
  Flex,
  Dialog,
  DialogPanel,
} from "@tremor/react";
import {
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@apollo/client";
import { GET_MEMBERS } from "../../graphql/queries/memberQueries";
import {
  DeathRegister,
  CreateDeathRegisterInput,
  UpdateDeathRegisterInput,
  BurialType,
  DeathRegisterFormData,
} from "../../types/deathRegister";
import { formatDateForInput } from "../../utils/dateUtils";
import { toast } from "react-hot-toast";

interface DeathRegisterFormProps {
  deathRegister?: DeathRegister;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateDeathRegisterInput | UpdateDeathRegisterInput,
  ) => Promise<void>;
  loading: boolean;
  organisationId: string;
  branchId?: string;
}

interface Member {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  profileImageUrl?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export const DeathRegisterForm: React.FC<DeathRegisterFormProps> = ({
  deathRegister,
  isOpen,
  onClose,
  onSubmit,
  loading,
  organisationId,
  branchId,
}) => {
  const [formData, setFormData] = useState<DeathRegisterFormData>({
    selectedMember: undefined,
    dateOfDeath: "",
    timeOfDeath: "",
    placeOfDeath: "",
    causeOfDeath: "",
    circumstances: "",
    funeralDate: "",
    funeralLocation: "",
    funeralOfficiant: "",
    burialCremation: BurialType.BURIAL,
    cemeteryLocation: "",
    nextOfKin: "",
    nextOfKinPhone: "",
    nextOfKinEmail: "",
    familyNotified: false,
    notificationDate: "",
    deathCertificateUrl: "",
    obituaryUrl: "",
    photoUrls: [],
    additionalDocuments: [],
    branchId: branchId || "",
    organisationId,
    funeralEventId: "",
  });

  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch members for selection
  const { data: membersData, loading: membersLoading } = useQuery(GET_MEMBERS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        status: "ACTIVE", // Only show active members
        searchTerm: memberSearchTerm,
        take: 20,
      },
    },
    skip: !showMemberSearch,
  });

  // Initialize form data when editing
  useEffect(() => {
    if (deathRegister) {
      setFormData({
        selectedMember: {
          id: deathRegister.member.id,
          firstName: deathRegister.member.firstName,
          lastName: deathRegister.member.lastName,
          profileImageUrl: deathRegister.member.profileImageUrl,
        },
        dateOfDeath: formatDateForInput(deathRegister.dateOfDeath),
        timeOfDeath: deathRegister.timeOfDeath || "",
        placeOfDeath: deathRegister.placeOfDeath,
        causeOfDeath: deathRegister.causeOfDeath || "",
        circumstances: deathRegister.circumstances || "",
        funeralDate: deathRegister.funeralDate
          ? formatDateForInput(deathRegister.funeralDate)
          : "",
        funeralLocation: deathRegister.funeralLocation || "",
        funeralOfficiant: deathRegister.funeralOfficiant || "",
        burialCremation: deathRegister.burialCremation,
        cemeteryLocation: deathRegister.cemeteryLocation || "",
        nextOfKin: deathRegister.nextOfKin,
        nextOfKinPhone: deathRegister.nextOfKinPhone || "",
        nextOfKinEmail: deathRegister.nextOfKinEmail || "",
        familyNotified: deathRegister.familyNotified,
        notificationDate: deathRegister.notificationDate
          ? formatDateForInput(deathRegister.notificationDate)
          : "",
        deathCertificateUrl: deathRegister.deathCertificateUrl || "",
        obituaryUrl: deathRegister.obituaryUrl || "",
        photoUrls: deathRegister.photoUrls || [],
        additionalDocuments: deathRegister.additionalDocuments || [],
        branchId: deathRegister.branchId || "",
        organisationId: deathRegister.organisationId,
        funeralEventId: deathRegister.funeralEventId || "",
      });
    }
  }, [deathRegister]);

  const handleInputChange = useCallback(
    (field: keyof DeathRegisterFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors],
  );

  const handleMemberSelect = useCallback((member: Member) => {
    setFormData((prev) => ({
      ...prev,
      selectedMember: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        profileImageUrl: member.profileImageUrl,
      },
    }));
    setShowMemberSearch(false);
    setMemberSearchTerm("");
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.selectedMember) {
      newErrors.selectedMember = "Please select a member";
    }
    if (!formData.dateOfDeath) {
      newErrors.dateOfDeath = "Date of death is required";
    }
    if (!formData.placeOfDeath.trim()) {
      newErrors.placeOfDeath = "Place of death is required";
    }
    if (!formData.nextOfKin.trim()) {
      newErrors.nextOfKin = "Next of kin is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fix the form errors");
        return;
      }

      try {
        const submitData = {
          ...(deathRegister && { id: deathRegister.id }),
          memberId: formData.selectedMember!.id,
          dateOfDeath: new Date(formData.dateOfDeath),
          timeOfDeath: formData.timeOfDeath || undefined,
          placeOfDeath: formData.placeOfDeath,
          causeOfDeath: formData.causeOfDeath || undefined,
          circumstances: formData.circumstances || undefined,
          funeralDate: formData.funeralDate
            ? new Date(formData.funeralDate)
            : undefined,
          funeralLocation: formData.funeralLocation || undefined,
          funeralOfficiant: formData.funeralOfficiant || undefined,
          burialCremation: formData.burialCremation,
          cemeteryLocation: formData.cemeteryLocation || undefined,
          nextOfKin: formData.nextOfKin,
          nextOfKinPhone: formData.nextOfKinPhone || undefined,
          nextOfKinEmail: formData.nextOfKinEmail || undefined,
          familyNotified: formData.familyNotified,
          notificationDate: formData.notificationDate
            ? new Date(formData.notificationDate)
            : undefined,
          deathCertificateUrl: formData.deathCertificateUrl || undefined,
          obituaryUrl: formData.obituaryUrl || undefined,
          photoUrls: formData.photoUrls,
          additionalDocuments: formData.additionalDocuments,
          branchId: formData.branchId || undefined,
          organisationId: formData.organisationId,
          funeralEventId: formData.funeralEventId || undefined,
        };

        await onSubmit(submitData);
        onClose();
        toast.success(
          deathRegister
            ? "Death register updated successfully"
            : "Death register created successfully",
        );
      } catch (error) {
        toast.error("Failed to save death register");
        console.error("Form submission error:", error);
      }
    },
    [formData, deathRegister, validateForm, onSubmit, onClose],
  );

  const handleClose = useCallback(() => {
    setFormData({
      selectedMember: undefined,
      dateOfDeath: "",
      timeOfDeath: "",
      placeOfDeath: "",
      causeOfDeath: "",
      circumstances: "",
      funeralDate: "",
      funeralLocation: "",
      funeralOfficiant: "",
      burialCremation: BurialType.BURIAL,
      cemeteryLocation: "",
      nextOfKin: "",
      nextOfKinPhone: "",
      nextOfKinEmail: "",
      familyNotified: false,
      notificationDate: "",
      deathCertificateUrl: "",
      obituaryUrl: "",
      photoUrls: [],
      additionalDocuments: [],
      branchId: branchId || "",
      organisationId,
      funeralEventId: "",
    });
    setErrors({});
    onClose();
  }, [onClose, branchId, organisationId]);

  return (
    <Dialog open={isOpen} onClose={handleClose} static={true}>
      <DialogPanel className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <Flex justifyContent="between" alignItems="center">
            <Title className="text-xl font-semibold">
              {deathRegister ? "Edit Death Register" : "Create Death Register"}
            </Title>
            <Button
              variant="light"
              icon={XMarkIcon}
              onClick={handleClose}
              size="xs"
            />
          </Flex>

          {/* Member Selection */}
          <Card className="p-4">
            <Title className="text-lg mb-4">Member Information</Title>

            {formData.selectedMember ? (
              <Flex
                alignItems="center"
                className="space-x-3 p-3 bg-blue-50 rounded-lg"
              >
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {formData.selectedMember.profileImageUrl ? (
                    <img
                      src={formData.selectedMember.profileImageUrl}
                      alt={`${formData.selectedMember.firstName} ${formData.selectedMember.lastName}`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <Text className="font-medium">
                    {formData.selectedMember.firstName}{" "}
                    {formData.selectedMember.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600">Selected Member</Text>
                </div>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setShowMemberSearch(true)}
                >
                  Change
                </Button>
              </Flex>
            ) : (
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  icon={MagnifyingGlassIcon}
                  onClick={() => setShowMemberSearch(true)}
                  className="w-full"
                >
                  Select Member
                </Button>
                {errors.selectedMember && (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.selectedMember}
                  </Text>
                )}
              </div>
            )}
          </Card>

          {/* Death Information */}
          <Card className="p-4">
            <Title className="text-lg mb-4">Death Information</Title>

            <Grid numItems={1} numItemsSm={2} className="gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Death *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.dateOfDeath}
                  onChange={(e) =>
                    handleInputChange("dateOfDeath", e.target.value)
                  }
                />
                {errors.dateOfDeath && (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.dateOfDeath}
                  </Text>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Death
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.timeOfDeath}
                  onChange={(e) =>
                    handleInputChange("timeOfDeath", e.target.value)
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place of Death *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hospital, home, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.placeOfDeath}
                  onChange={(e) =>
                    handleInputChange("placeOfDeath", e.target.value)
                  }
                />
                {errors.placeOfDeath && (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.placeOfDeath}
                  </Text>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cause of Death
                </label>
                <input
                  type="text"
                  placeholder="Natural causes, illness, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.causeOfDeath}
                  onChange={(e) =>
                    handleInputChange("causeOfDeath", e.target.value)
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Circumstances
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional details about the circumstances..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.circumstances}
                  onChange={(e) =>
                    handleInputChange("circumstances", e.target.value)
                  }
                />
              </div>
            </Grid>
          </Card>

          {/* Funeral Information */}
          <Card className="p-4">
            <Title className="text-lg mb-4">Funeral Information</Title>

            <Grid numItems={1} numItemsSm={2} className="gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funeral Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.funeralDate}
                  onChange={(e) =>
                    handleInputChange("funeralDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Burial/Cremation *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.burialCremation}
                  onChange={(e) =>
                    handleInputChange(
                      "burialCremation",
                      e.target.value as BurialType,
                    )
                  }
                >
                  <option value={BurialType.BURIAL}>Burial</option>
                  <option value={BurialType.CREMATION}>Cremation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funeral Location
                </label>
                <input
                  type="text"
                  placeholder="Church, funeral home, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.funeralLocation}
                  onChange={(e) =>
                    handleInputChange("funeralLocation", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funeral Officiant
                </label>
                <input
                  type="text"
                  placeholder="Pastor, priest, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.funeralOfficiant}
                  onChange={(e) =>
                    handleInputChange("funeralOfficiant", e.target.value)
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cemetery/Crematorium Location
                </label>
                <input
                  type="text"
                  placeholder="Final resting place..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.cemeteryLocation}
                  onChange={(e) =>
                    handleInputChange("cemeteryLocation", e.target.value)
                  }
                />
              </div>
            </Grid>
          </Card>

          {/* Family & Contact Information */}
          <Card className="p-4">
            <Title className="text-lg mb-4">Family & Contact Information</Title>

            <Grid numItems={1} numItemsSm={2} className="gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next of Kin *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Name and relationship"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.nextOfKin}
                  onChange={(e) =>
                    handleInputChange("nextOfKin", e.target.value)
                  }
                />
                {errors.nextOfKin && (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.nextOfKin}
                  </Text>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next of Kin Phone
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.nextOfKinPhone}
                  onChange={(e) =>
                    handleInputChange("nextOfKinPhone", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next of Kin Email
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.nextOfKinEmail}
                  onChange={(e) =>
                    handleInputChange("nextOfKinEmail", e.target.value)
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="familyNotified"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.familyNotified}
                    onChange={(e) =>
                      handleInputChange("familyNotified", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="familyNotified"
                    className="text-sm font-medium text-gray-700"
                  >
                    Family has been notified
                  </label>
                </div>

                {formData.familyNotified && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notification Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.notificationDate}
                      onChange={(e) =>
                        handleInputChange("notificationDate", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </Grid>
          </Card>

          {/* Form Actions */}
          <Flex justifyContent="end" className="space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={CheckIcon}
            >
              {deathRegister ? "Update Record" : "Create Record"}
            </Button>
          </Flex>
        </form>

        {/* Member Search Modal */}
        <Dialog
          open={showMemberSearch}
          onClose={() => setShowMemberSearch(false)}
        >
          <DialogPanel className="max-w-2xl">
            <div className="space-y-4">
              <Title className="text-lg font-semibold">Select Member</Title>

              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-96 overflow-y-auto">
                {membersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <Text className="mt-2 text-gray-600">
                      Loading members...
                    </Text>
                  </div>
                ) : membersData?.members?.length === 0 ? (
                  <div className="text-center py-8">
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <Text className="text-gray-600">No members found</Text>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {membersData?.members?.map((member: Member) => (
                      <div
                        key={member.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleMemberSelect(member)}
                      >
                        <Flex alignItems="center" className="space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {member.profileImageUrl ? (
                              <img
                                src={member.profileImageUrl}
                                alt={`${member.firstName} ${member.lastName}`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Text className="font-medium">
                              {member.firstName} {member.middleName}{" "}
                              {member.lastName}
                            </Text>
                            <Text className="text-sm text-gray-600">
                              {member.email ||
                                member.phoneNumber ||
                                "No contact info"}
                            </Text>
                          </div>
                        </Flex>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Flex justifyContent="end">
                <Button
                  variant="secondary"
                  onClick={() => setShowMemberSearch(false)}
                >
                  Cancel
                </Button>
              </Flex>
            </div>
          </DialogPanel>
        </Dialog>
      </DialogPanel>
    </Dialog>
  );
};
