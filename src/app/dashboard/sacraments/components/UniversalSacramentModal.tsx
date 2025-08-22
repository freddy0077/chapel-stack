"use client";

import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useCreateSacramentalRecord } from "@/graphql/hooks/useCreateSacramentalRecord";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import SearchableMemberInput from "@/components/ui/SearchableMemberInput";
import SearchableMemberOrTextInput from "@/components/ui/SearchableMemberOrTextInput";

interface UniversalSacramentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sacramentType: string;
  onSuccess: () => void;
}

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

// Map backend enum values to display names
const DISPLAY_TYPE_MAPPING = {
  'BAPTISM': 'Baptism',
  'EUCHARIST_FIRST_COMMUNION': 'First Communion',
  'CONFIRMATION': 'Confirmation',
  'MATRIMONY': 'Marriage',
  'RECONCILIATION_FIRST': 'First Reconciliation',
  'ANOINTING_OF_THE_SICK': 'Anointing of the Sick',
  'HOLY_ORDERS_DIACONATE': 'Diaconate Ordination',
  'HOLY_ORDERS_PRIESTHOOD': 'Priesthood Ordination',
  'RCIA_INITIATION': 'RCIA Initiation',
};

// Map frontend display names to backend enum values
const SACRAMENT_TYPE_MAPPING = {
  'BAPTISM': 'BAPTISM',
  'COMMUNION': 'EUCHARIST_FIRST_COMMUNION',
  'CONFIRMATION': 'CONFIRMATION',
  'MARRIAGE': 'MATRIMONY',
  'MATRIMONY': 'MATRIMONY',
  'EUCHARIST_FIRST_COMMUNION': 'EUCHARIST_FIRST_COMMUNION',
  'RECONCILIATION_FIRST': 'RECONCILIATION_FIRST',
  'ANOINTING_OF_THE_SICK': 'ANOINTING_OF_THE_SICK',
  'HOLY_ORDERS_DIACONATE': 'HOLY_ORDERS_DIACONATE',
  'HOLY_ORDERS_PRIESTHOOD': 'HOLY_ORDERS_PRIESTHOOD',
  'RCIA_INITIATION': 'RCIA_INITIATION',
};

const getSacramentColor = (type: string) => {
  switch (type) {
    case 'BAPTISM':
      return 'blue';
    case 'EUCHARIST_FIRST_COMMUNION':
      return 'amber';
    case 'CONFIRMATION':
      return 'purple';
    case 'MATRIMONY':
      return 'rose';
    case 'RECONCILIATION_FIRST':
      return 'green';
    case 'ANOINTING_OF_THE_SICK':
      return 'indigo';
    case 'HOLY_ORDERS_DIACONATE':
    case 'HOLY_ORDERS_PRIESTHOOD':
      return 'violet';
    case 'RCIA_INITIATION':
      return 'teal';
    default:
      return 'blue';
  }
};

// Get required fields for each sacrament type
const getRequiredFields = (type: string) => {
  const baseFields = ['dateOfSacrament', 'locationOfSacrament', 'officiantName'];
  
  switch (type) {
    case 'MATRIMONY':
    case 'MARRIAGE': 
      return [...baseFields, 'groomName', 'brideName'];
    case 'HOLY_ORDERS_DIACONATE':
    case 'HOLY_ORDERS_PRIESTHOOD':
      return [...baseFields, 'sponsorName'];
    default:
      return baseFields;
  }
};

// Get field configuration for each sacrament type
const getFieldConfig = (type: string) => {
  const config = {
    showGodparents: false,
    showSponsor: false,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  };

  switch (type) {
    case 'BAPTISM':
      config.showGodparents = true;
      break;
    case 'EUCHARIST_FIRST_COMMUNION':
    case 'CONFIRMATION':
      config.showSponsor = true;
      break;
    case 'MATRIMONY':
    case 'MARRIAGE': 
      config.showMarriageFields = true;
      config.showWitnesses = true;
      break;
    case 'HOLY_ORDERS_DIACONATE':
    case 'HOLY_ORDERS_PRIESTHOOD':
      config.showSponsor = true;
      config.showOrdinationFields = true;
      break;
    case 'RECONCILIATION_FIRST':
    case 'ANOINTING_OF_THE_SICK':
    case 'RCIA_INITIATION':
      // These typically don't require additional fields beyond base
      break;
  }

  return config;
};

export default function UniversalSacramentModal({
  isOpen,
  onClose,
  sacramentType,
  onSuccess,
}: UniversalSacramentModalProps) {
  const [formData, setFormData] = useState({
    dateOfSacrament: '',
    locationOfSacrament: '',
    officiantName: '',
    officiantId: '',
    godparent1Name: '',
    godparent2Name: '',
    sponsorName: '',
    witness1Name: '',
    witness2Name: '',
    groomName: '',
    brideName: '',
    certificateNumber: '',
    certificateUrl: '',
    notes: '',
  });

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedGroomMember, setSelectedGroomMember] = useState<Member | null>(null);
  const [selectedBrideMember, setSelectedBrideMember] = useState<Member | null>(null);
  const [createRecord, { loading }] = useCreateSacramentalRecord();
  const orgBranchFilter = useOrganizationBranchFilter();

  // Reset form when modal opens/closes or sacrament type changes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        dateOfSacrament: '',
        locationOfSacrament: '',
        officiantName: '',
        officiantId: '',
        godparent1Name: '',
        godparent2Name: '',
        sponsorName: '',
        witness1Name: '',
        witness2Name: '',
        groomName: '',
        brideName: '',
        certificateNumber: '',
        certificateUrl: '',
        notes: '',
      });
      setSelectedMember(null);
      setSelectedGroomMember(null);
      setSelectedBrideMember(null);
    }
  }, [isOpen, sacramentType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sacramentType) return;

    // Validate that a member is selected
    if (!selectedMember) {
      toast.error('Please select a member for this sacrament record');
      return;
    }

    // Special validation for marriage records
    if ((sacramentType === 'MARRIAGE' || sacramentType === 'MATRIMONY')) {
      if (!selectedGroomMember && !formData.groomName) {
        toast.error('Please select or enter the groom information');
        return;
      }
      if (!selectedBrideMember && !formData.brideName) {
        toast.error('Please select or enter the bride information');
        return;
      }
    }

    // Validate required fields
    const requiredFields = getRequiredFields(sacramentType);
    const missingFields = requiredFields.filter(field => {
      if (field === 'memberId') return false; // We handle member selection separately
      if (field === 'groomName' && (selectedGroomMember || formData.groomName)) return false;
      if (field === 'brideName' && (selectedBrideMember || formData.brideName)) return false;
      return !formData[field as keyof typeof formData];
    });
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      // Map frontend sacrament type to backend enum
      const backendSacramentType = SACRAMENT_TYPE_MAPPING[sacramentType as keyof typeof SACRAMENT_TYPE_MAPPING] || sacramentType;

      await createRecord({
        variables: {
          input: {
            sacramentType: backendSacramentType,
            memberId: selectedMember.id,
            dateOfSacrament: new Date(formData.dateOfSacrament),
            locationOfSacrament: formData.locationOfSacrament,
            officiantName: formData.officiantName,
            officiantId: formData.officiantId || null,
            // NEW: Marriage-specific member relationship fields
            groomMemberId: selectedGroomMember?.id || null,
            brideMemberId: selectedBrideMember?.id || null,
            // NEW: Witness member relationship fields (for future enhancement)
            witness1MemberId: null, // TODO: Add witness member selection
            witness2MemberId: null, // TODO: Add witness member selection
            godparent1Name: formData.godparent1Name || null,
            godparent2Name: formData.godparent2Name || null,
            sponsorName: formData.sponsorName || null,
            witness1Name: formData.witness1Name || null,
            witness2Name: formData.witness2Name || null,
            groomName: selectedGroomMember ? `${selectedGroomMember.firstName} ${selectedGroomMember.lastName}` : formData.groomName || null,
            brideName: selectedBrideMember ? `${selectedBrideMember.firstName} ${selectedBrideMember.lastName}` : formData.brideName || null,
            certificateNumber: formData.certificateNumber || null,
            certificateUrl: formData.certificateUrl || null,
            notes: formData.notes || null,
            branchId: orgBranchFilter.branchId || '',
            organisationId: orgBranchFilter.organisationId || null,
          },
        },
      });

      toast.success(`${DISPLAY_TYPE_MAPPING[backendSacramentType as keyof typeof DISPLAY_TYPE_MAPPING]} record created successfully`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating record:', error);
      toast.error(error.message || 'Failed to create sacrament record');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (memberId: string, member?: Member) => {
    setSelectedMember(member || null);
    setFormData(prev => {
      const newFormData = { ...prev, memberId };
      
      // Auto-populate groom/bride name based on member's gender for marriage records
      if (member && (sacramentType === 'MARRIAGE' || sacramentType === 'MATRIMONY')) {
        const memberFullName = `${member.firstName} ${member.lastName}`;
        
        if (member.gender === 'MALE') {
          // If selected member is male, auto-fill groom name
          newFormData.groomName = memberFullName;
          // Clear bride name to avoid confusion
          newFormData.brideName = '';
        } else if (member.gender === 'FEMALE') {
          // If selected member is female, auto-fill bride name
          newFormData.brideName = memberFullName;
          // Clear groom name to avoid confusion
          newFormData.groomName = '';
        }
      }
      
      return newFormData;
    });
  };

  const handleGroomMemberChange = (value: string, member?: Member) => {
    if (member) {
      setSelectedGroomMember(member);
      setFormData(prev => ({
        ...prev,
        groomName: `${member.firstName} ${member.lastName}`
      }));
    } else {
      setSelectedGroomMember(null);
      setFormData(prev => ({
        ...prev,
        groomName: value
      }));
    }
  };

  const handleBrideMemberChange = (value: string, member?: Member) => {
    if (member) {
      setSelectedBrideMember(member);
      setFormData(prev => ({
        ...prev,
        brideName: `${member.firstName} ${member.lastName}`
      }));
    } else {
      setSelectedBrideMember(null);
      setFormData(prev => ({
        ...prev,
        brideName: value
      }));
    }
  };

  if (!sacramentType) return null;

  const color = getSacramentColor(sacramentType);
  const displayName = DISPLAY_TYPE_MAPPING[sacramentType as keyof typeof DISPLAY_TYPE_MAPPING] || sacramentType;
  const fieldConfig = getFieldConfig(sacramentType);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className={`text-lg font-semibold text-${color}-900`}
                    >
                      Create {displayName} Record
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Enter the details for this sacramental record
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Member Selection */}
                  <div>
                    <SearchableMemberInput
                      value={selectedMember?.id || ''}
                      onChange={handleMemberChange}
                      label="Select Member"
                      placeholder="Search for a member by name..."
                      required={true}
                      className="w-full"
                    />
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Sacrament *
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfSacrament}
                        onChange={(e) => handleInputChange('dateOfSacrament', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={formData.locationOfSacrament}
                        onChange={(e) => handleInputChange('locationOfSacrament', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Church or location name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Officiant Name *
                    </label>
                    <input
                      type="text"
                      value={formData.officiantName}
                      onChange={(e) => handleInputChange('officiantName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Name of officiating minister"
                      required
                    />
                  </div>

                  {/* Sacrament-specific fields */}
                  {fieldConfig.showGodparents && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">Godparents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Godparent 1
                          </label>
                          <input
                            type="text"
                            value={formData.godparent1Name}
                            onChange={(e) => handleInputChange('godparent1Name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First godparent name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Godparent 2
                          </label>
                          <input
                            type="text"
                            value={formData.godparent2Name}
                            onChange={(e) => handleInputChange('godparent2Name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Second godparent name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {fieldConfig.showSponsor && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {fieldConfig.showOrdinationFields ? 'Sponsor *' : 'Sponsor'}
                      </label>
                      <input
                        type="text"
                        value={formData.sponsorName}
                        onChange={(e) => handleInputChange('sponsorName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Sponsor name"
                        required={fieldConfig.showOrdinationFields}
                      />
                    </div>
                  )}

                  {fieldConfig.showMarriageFields && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">Marriage Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <SearchableMemberOrTextInput
                            value={selectedGroomMember?.id || formData.groomName || ''}
                            onChange={handleGroomMemberChange}
                            label="Groom"
                            placeholder="Search for the groom by name or enter manually..."
                            required={true}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <SearchableMemberOrTextInput
                            value={selectedBrideMember?.id || formData.brideName || ''}
                            onChange={handleBrideMemberChange}
                            label="Bride"
                            placeholder="Search for the bride by name or enter manually..."
                            required={true}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {fieldConfig.showWitnesses && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">Witnesses</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Witness 1
                          </label>
                          <input
                            type="text"
                            value={formData.witness1Name}
                            onChange={(e) => handleInputChange('witness1Name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First witness name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Witness 2
                          </label>
                          <input
                            type="text"
                            value={formData.witness2Name}
                            onChange={(e) => handleInputChange('witness2Name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Second witness name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional Fields */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Officiant ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.officiantId}
                          onChange={(e) => handleInputChange('officiantId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Internal officiant ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificate Number
                        </label>
                        <input
                          type="text"
                          value={formData.certificateNumber}
                          onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Certificate tracking number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes or comments"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 text-sm font-medium text-white bg-${color}-600 border border-transparent rounded-md hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? 'Creating...' : `Create ${displayName} Record`}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
