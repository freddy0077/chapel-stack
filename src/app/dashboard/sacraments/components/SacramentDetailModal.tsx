"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  HeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { format, differenceInYears } from "date-fns";

interface Member {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profileImageUrl?: string | null;
  membershipDate?: string | null;
  status?: string | null;
}

interface SacramentRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  locationOfSacrament: string;
  officiantName: string;
  officiantId?: string | null;
  godparent1Name?: string | null;
  godparent2Name?: string | null;
  sponsorName?: string | null;
  witness1Name?: string | null;
  witness2Name?: string | null;
  groomName?: string | null;
  brideName?: string | null;
  certificateNumber?: string | null;
  certificateUrl?: string | null;
  notes?: string | null;
  branchId: string;
  organisationId?: string | null;
  createdAt: string;
  updatedAt: string;
  member?: Member;
  memberName?: string;
  displayName?: string;
}

interface SacramentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SacramentRecord | null;
  onEdit: (record: SacramentRecord) => void;
  onDelete: (recordId: string) => void;
  onGenerateCertificate: (record: SacramentRecord) => void;
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

const formatSacramentType = (type: string) => {
  return DISPLAY_TYPE_MAPPING[type as keyof typeof DISPLAY_TYPE_MAPPING] || 
         type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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

// Get the primary display name for the record based on sacrament type
const getPrimaryDisplayName = (record: SacramentRecord): string => {
  // First try to get member name from member object
  if (record.member) {
    const { firstName, middleName, lastName } = record.member;
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    if (fullName) return fullName;
  }
  
  // Fallback to memberName if available
  if (record.memberName) {
    return record.memberName;
  }
  
  // For marriage, show both groom and bride if available
  if (record.sacramentType === 'MATRIMONY') {
    if (record.groomName && record.brideName) {
      return `${record.groomName} & ${record.brideName}`;
    }
    if (record.groomName) return record.groomName;
    if (record.brideName) return record.brideName;
  }
  
  // Fallback to member ID if no name available
  return `Member ID: ${record.memberId}`;
};

// Get secondary information to display
const getSecondaryInfo = (record: SacramentRecord): string[] => {
  const info: string[] = [];
  
  switch (record.sacramentType) {
    case 'BAPTISM':
      if (record.godparent1Name) info.push(`Godparent: ${record.godparent1Name}`);
      if (record.godparent2Name) info.push(`Godparent: ${record.godparent2Name}`);
      break;
    case 'EUCHARIST_FIRST_COMMUNION':
    case 'CONFIRMATION':
      if (record.sponsorName) info.push(`Sponsor: ${record.sponsorName}`);
      break;
    case 'MATRIMONY':
      if (record.witness1Name) info.push(`Witness: ${record.witness1Name}`);
      if (record.witness2Name) info.push(`Witness: ${record.witness2Name}`);
      break;
  }
  
  return info;
};

// Helper function to calculate member age
const calculateAge = (dateOfBirth: string): number => {
  return differenceInYears(new Date(), new Date(dateOfBirth));
};

// Helper function to format member display information
const getMemberDisplayInfo = (member: Member): { age?: number; displayGender?: string } => {
  const age = member.dateOfBirth ? calculateAge(member.dateOfBirth) : undefined;
  const displayGender = member.gender ? (member.gender === 'MALE' ? 'Male' : member.gender === 'FEMALE' ? 'Female' : member.gender) : undefined;
  
  return { age, displayGender };
};

export default function SacramentDetailModal({
  isOpen,
  onClose,
  record,
  onEdit,
  onDelete,
  onGenerateCertificate,
}: SacramentDetailModalProps) {
  if (!record) return null;

  const color = getSacramentColor(record.sacramentType);
  const primaryName = getPrimaryDisplayName(record);
  const secondaryInfo = getSecondaryInfo(record);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this sacrament record? This action cannot be undone.')) {
      onDelete(record.id);
      onClose();
    }
  };

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header - Special Wedding Design for Marriage */}
                {record.sacramentType === 'MATRIMONY' ? (
                  <div className="relative bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 px-6 py-8 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-500/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute top-4 left-4 text-white/20">
                        <HeartIconSolid className="h-8 w-8" />
                      </div>
                      <div className="absolute top-6 right-8 text-white/20">
                        <SparklesIcon className="h-6 w-6" />
                      </div>
                      <div className="absolute bottom-4 right-4 text-white/20">
                        <HeartIconSolid className="h-6 w-6" />
                      </div>
                      <div className="absolute bottom-8 left-8 text-white/20">
                        <SparklesIcon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="text-left flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <HeartIconSolid className="h-8 w-8 text-white" />
                          <Dialog.Title className="text-2xl font-bold text-white">
                            Wedding Celebration
                          </Dialog.Title>
                        </div>
                        
                        {/* Couple Names with Special Styling */}
                        <div className="mt-4">
                          {record.groomName && record.brideName ? (
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-4">
                                <div className="text-center">
                                  <p className="text-xl font-semibold text-white">{record.groomName}</p>
                                  <p className="text-sm text-white/80">Groom</p>
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                  <HeartIconSolid className="h-6 w-6 text-white animate-pulse" />
                                  <p className="text-xs text-white/70 font-medium">&</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xl font-semibold text-white">{record.brideName}</p>
                                  <p className="text-sm text-white/80">Bride</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xl text-white/90 text-center">
                              {primaryName}
                            </p>
                          )}
                        </div>
                        
                        {/* Wedding Date */}
                        <div className="mt-4 text-center">
                          <p className="text-sm text-white/80">United in Holy Matrimony</p>
                          <p className="text-lg font-medium text-white">
                            {format(new Date(record.dateOfSacrament), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        
                        {secondaryInfo.length > 0 && (
                          <div className="mt-4 space-y-1 text-center">
                            {secondaryInfo.map((info, index) => (
                              <p key={index} className="text-sm text-white/80">
                                {info}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors ml-4"
                      >
                        <XMarkIcon className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Regular Header for Other Sacraments */
                  <div className={`bg-gradient-to-r ${
                    color === 'blue' ? 'from-blue-500 to-blue-600' :
                    color === 'amber' ? 'from-amber-500 to-amber-600' :
                    color === 'purple' ? 'from-purple-500 to-purple-600' :
                    color === 'rose' ? 'from-rose-500 to-rose-600' :
                    color === 'green' ? 'from-green-500 to-green-600' :
                    color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                    color === 'violet' ? 'from-violet-500 to-violet-600' :
                    'from-teal-500 to-teal-600'
                  } px-6 py-4`}>
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <Dialog.Title className="text-xl font-bold text-white">
                          {formatSacramentType(record.sacramentType)} Record
                        </Dialog.Title>
                        <p className="text-lg text-white/90 mt-1">
                          {primaryName}
                        </p>
                        {secondaryInfo.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {secondaryInfo.map((info, index) => (
                              <p key={index} className="text-sm text-white/80">
                                {info}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className={`p-6 ${record.sacramentType === 'MATRIMONY' ? 'bg-gradient-to-b from-rose-50/50 to-white' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${record.sacramentType === 'MATRIMONY' ? 'text-rose-900' : 'text-gray-900'} border-b ${record.sacramentType === 'MATRIMONY' ? 'border-rose-200' : 'border-gray-200'} pb-2 flex items-center space-x-2`}>
                        {record.sacramentType === 'MATRIMONY' && <HeartIcon className="h-5 w-5 text-rose-500" />}
                        <span>{record.sacramentType === 'MATRIMONY' ? 'Wedding Details' : 'Basic Information'}</span>
                      </h3>
                      
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className={`h-5 w-5 ${record.sacramentType === 'MATRIMONY' ? 'text-rose-400' : 'text-gray-400'}`} />
                        <div>
                          <p className={`text-sm font-medium ${record.sacramentType === 'MATRIMONY' ? 'text-rose-900' : 'text-gray-900'}`}>
                            {record.sacramentType === 'MATRIMONY' ? 'Wedding Date' : 'Date'}
                          </p>
                          <p className={`text-sm ${record.sacramentType === 'MATRIMONY' ? 'text-rose-700' : 'text-gray-600'}`}>
                            {format(new Date(record.dateOfSacrament), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPinIcon className={`h-5 w-5 ${record.sacramentType === 'MATRIMONY' ? 'text-rose-400' : 'text-gray-400'}`} />
                        <div>
                          <p className={`text-sm font-medium ${record.sacramentType === 'MATRIMONY' ? 'text-rose-900' : 'text-gray-900'}`}>
                            {record.sacramentType === 'MATRIMONY' ? 'Wedding Venue' : 'Location'}
                          </p>
                          <p className={`text-sm ${record.sacramentType === 'MATRIMONY' ? 'text-rose-700' : 'text-gray-600'}`}>{record.locationOfSacrament}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <UserIcon className={`h-5 w-5 ${record.sacramentType === 'MATRIMONY' ? 'text-rose-400' : 'text-gray-400'}`} />
                        <div>
                          <p className={`text-sm font-medium ${record.sacramentType === 'MATRIMONY' ? 'text-rose-900' : 'text-gray-900'}`}>
                            {record.sacramentType === 'MATRIMONY' ? 'Officiant Priest' : 'Officiant'}
                          </p>
                          <p className={`text-sm ${record.sacramentType === 'MATRIMONY' ? 'text-rose-700' : 'text-gray-600'}`}>{record.officiantName}</p>
                        </div>
                      </div>

                      {record.certificateNumber && (
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className={`h-5 w-5 ${record.sacramentType === 'MATRIMONY' ? 'text-rose-400' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-sm font-medium ${record.sacramentType === 'MATRIMONY' ? 'text-rose-900' : 'text-gray-900'}`}>
                              {record.sacramentType === 'MATRIMONY' ? 'Marriage Certificate' : 'Certificate Number'}
                            </p>
                            <p className={`text-sm ${record.sacramentType === 'MATRIMONY' ? 'text-rose-700' : 'text-gray-600'}`}>{record.certificateNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sacrament-Specific Details */}
                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${record.sacramentType === 'MATRIMONY' ? 'text-rose-900' : 'text-gray-900'} border-b ${record.sacramentType === 'MATRIMONY' ? 'border-rose-200' : 'border-gray-200'} pb-2 flex items-center space-x-2`}>
                        {record.sacramentType === 'MATRIMONY' && <SparklesIcon className="h-5 w-5 text-rose-500" />}
                        <span>{record.sacramentType === 'MATRIMONY' ? 'Wedding Party' : 'Sacrament Details'}</span>
                      </h3>

                      {/* Baptism Details */}
                      {record.sacramentType === 'BAPTISM' && (
                        <div className="space-y-3">
                          {record.godparent1Name && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Godparent 1</p>
                              <p className="text-sm text-gray-600">{record.godparent1Name}</p>
                            </div>
                          )}
                          {record.godparent2Name && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Godparent 2</p>
                              <p className="text-sm text-gray-600">{record.godparent2Name}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Communion/Confirmation Details */}
                      {(record.sacramentType === 'EUCHARIST_FIRST_COMMUNION' || record.sacramentType === 'CONFIRMATION') && (
                        <div className="space-y-3">
                          {record.sponsorName && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Sponsor</p>
                              <p className="text-sm text-gray-600">{record.sponsorName}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Marriage Details */}
                      {record.sacramentType === 'MATRIMONY' && (
                        <div className="space-y-4">
                          {/* Couple Section with Special Styling */}
                          {(record.groomName || record.brideName) && (
                            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
                              <h4 className="text-sm font-semibold text-rose-900 mb-3 flex items-center space-x-2">
                                <HeartIconSolid className="h-4 w-4 text-rose-500" />
                                <span>The Happy Couple</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {record.groomName && (
                                  <div className="text-center">
                                    <div className="bg-white p-3 rounded-lg border border-rose-100">
                                      <p className="text-sm font-medium text-rose-900">👤 Groom</p>
                                      <p className="text-sm text-rose-700 font-semibold mt-1">{record.groomName}</p>
                                    </div>
                                  </div>
                                )}
                                {record.brideName && (
                                  <div className="text-center">
                                    <div className="bg-white p-3 rounded-lg border border-rose-100">
                                      <p className="text-sm font-medium text-rose-900">👰 Bride</p>
                                      <p className="text-sm text-rose-700 font-semibold mt-1">{record.brideName}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Witnesses Section */}
                          {(record.witness1Name || record.witness2Name) && (
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                              <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-amber-600" />
                                <span>Wedding Witnesses</span>
                              </h4>
                              <div className="space-y-2">
                                {record.witness1Name && (
                                  <div className="bg-white p-2 rounded border border-amber-100">
                                    <p className="text-sm font-medium text-amber-900">Witness 1</p>
                                    <p className="text-sm text-amber-700">{record.witness1Name}</p>
                                  </div>
                                )}
                                {record.witness2Name && (
                                  <div className="bg-white p-2 rounded border border-amber-100">
                                    <p className="text-sm font-medium text-amber-900">Witness 2</p>
                                    <p className="text-sm text-amber-700">{record.witness2Name}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Member Information */}
                      {record.member && (
                        <div className="space-y-3">
                          <h4 className={`text-sm font-semibold ${record.sacramentType === 'MATRIMONY' ? 'text-rose-900' : 'text-gray-900'} flex items-center space-x-2`}>
                            {record.sacramentType === 'MATRIMONY' && <UserIcon className="h-4 w-4 text-rose-500" />}
                            <span>{record.sacramentType === 'MATRIMONY' ? 'Member Details' : 'Member Information'}</span>
                          </h4>
                          
                          {/* Member Profile Image */}
                          {record.member.profileImageUrl && (
                            <div className="flex items-center space-x-3">
                              <img
                                src={record.member.profileImageUrl}
                                alt="Member profile"
                                className="h-12 w-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {[record.member.firstName, record.member.middleName, record.member.lastName].filter(Boolean).join(' ')}
                                </p>
                                {(() => {
                                  const { age, displayGender } = getMemberDisplayInfo(record.member!);
                                  const details = [age ? `Age: ${age}` : null, displayGender].filter(Boolean);
                                  return details.length > 0 ? (
                                    <p className="text-xs text-gray-500">{details.join(' • ')}</p>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          )}
                          
                          {/* Member Details */}
                          {!record.member.profileImageUrl && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Full Name</p>
                              <p className="text-sm text-gray-600">
                                {[record.member.firstName, record.member.middleName, record.member.lastName].filter(Boolean).join(' ')}
                              </p>
                            </div>
                          )}
                          
                          {/* Age and Gender */}
                          {(() => {
                            const { age, displayGender } = getMemberDisplayInfo(record.member!);
                            return (age || displayGender) ? (
                              <div className="grid grid-cols-2 gap-3">
                                {age && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Age</p>
                                    <p className="text-sm text-gray-600">{age} years</p>
                                  </div>
                                )}
                                {displayGender && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Gender</p>
                                    <p className="text-sm text-gray-600">{displayGender}</p>
                                  </div>
                                )}
                              </div>
                            ) : null;
                          })()}
                          
                          {/* Contact Information */}
                          {record.member.email && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Email</p>
                              <p className="text-sm text-gray-600">{record.member.email}</p>
                            </div>
                          )}
                          
                          {record.member.phoneNumber && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Phone</p>
                              <p className="text-sm text-gray-600">{record.member.phoneNumber}</p>
                            </div>
                          )}
                          
                          {/* Membership Information */}
                          {record.member.membershipDate && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Member Since</p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(record.member.membershipDate), 'MMMM d, yyyy')}
                              </p>
                            </div>
                          )}
                          
                          {record.member.status && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">Status</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                record.member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                record.member.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {record.member.status.toLowerCase().replace('_', ' ')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {record.notes && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Notes
                      </h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {record.notes}
                      </p>
                    </div>
                  )}

                  {/* Certificate Section */}
                  {record.certificateUrl && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Certificate
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <a
                          href={record.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                          View Certificate
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-8 flex items-center justify-end space-x-4">
                    <button
                      onClick={() => onGenerateCertificate(record)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Generate Certificate
                    </button>
                    
                    <button
                      onClick={() => onEdit(record)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                        record.sacramentType === 'MATRIMONY' 
                          ? 'bg-rose-600 hover:bg-rose-700' 
                          : `bg-${color}-600 hover:bg-${color}-700`
                      } transition-colors`}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      {record.sacramentType === 'MATRIMONY' ? 'Edit Wedding Record' : 'Edit Record'}
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      {record.sacramentType === 'MATRIMONY' ? 'Delete Wedding Record' : 'Delete Record'}
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <p>Created: {format(new Date(record.createdAt), 'MMM d, yyyy h:mm a')}</p>
                      </div>
                      <div>
                        <p>Updated: {format(new Date(record.updatedAt), 'MMM d, yyyy h:mm a')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
