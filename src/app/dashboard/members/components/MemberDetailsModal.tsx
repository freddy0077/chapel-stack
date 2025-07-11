import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  PencilIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  IdentificationIcon,
  UserGroupIcon,
  CakeIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  HeartIcon,
  UsersIcon,
  BellIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  PlusIcon,
  SparklesIcon,
  CameraIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@apollo/client";
import { UPDATE_MEMBER, GET_PRESIGNED_UPLOAD_URL } from "@/graphql/mutations/memberMutations";
import MessageModal from "./MessageModal";
import { useMember } from "@/graphql/hooks/useMember";
import { useAllSmallGroups, useSmallGroupMutations, SmallGroupMemberRole, SmallGroupMemberStatus } from "@/graphql/hooks/useSmallGroups";
import { gql } from "@apollo/client";
import { useProcessCardScan, useFilteredAttendanceSessions } from "@/graphql/hooks/useAttendance";
import { useAuth } from "@/graphql/hooks/useAuth";
import { useOrganizationBranchFilter } from '@/graphql/hooks/useOrganizationBranchFilter';
import { useFilteredSmallGroups } from '@/graphql/hooks/useSmallGroups';
import AddToSacraments from './AddToSacraments';
import MemberPrayerRequestsTab from './MemberPrayerRequestsTab';
import MemberContributionsTab from './MemberContributionsTab';
import MemberActivityTimeline from "./MemberActivityTimeline";
import { CREATE_FAMILY } from "@/graphql/mutations/familyMutations";
import UpdateFamilyModal from './UpdateFamilyModal';
import { useMinistryMutations } from "@/graphql/hooks/useMinistryMutations";
import { useFilteredMinistries } from "@/graphql/hooks/useFilteredMinistries";
import { useSearchMembers } from '@/graphql/hooks/useSearchMembers';

const ADD_MEMBER_TO_GROUP = gql`
  mutation AddMemberToGroup($groupId: ID!, $memberId: ID!, $roleInGroup: String!, $status: String!, $joinDate: String!) {
    addMemberToGroup(groupId: $groupId, memberId: $memberId, roleInGroup: $roleInGroup, status: $status, joinDate: $joinDate) {
      id
      member { id firstName lastName }
      smallGroup { id name }
      role
      status
      joinDate
    }
  }
`;

const ADD_FAMILY_CONNECTION = gql`
  mutation AddFamilyConnection($familyId: String!, $memberId: String!, $relatedMemberId: String!, $relationship: String!) {
    addFamilyConnection(familyId: $familyId, memberId: $memberId, relatedMemberId: $relatedMemberId, relationship: $relationship) {
      id
      name
      members { id firstName lastName }
    }
  }
`;

interface AddToAttendanceProps {
  memberId: string;
  rfidCardId?: string;
  onSuccess?: () => void;
}

function AddToAttendance({ memberId, rfidCardId, onSuccess }: AddToAttendanceProps) {
  const { user } = useAuth();
  const orgBranchFilter = useOrganizationBranchFilter();
  const { sessions, loading: sessionsLoading } = useFilteredAttendanceSessions(orgBranchFilter);
  const { processCardScan, loading: adding, error } = useProcessCardScan();
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleAdd = async () => {
    if (!selectedSession || !rfidCardId) return;
    try {
      await processCardScan({
        sessionId: selectedSession,
        cardId: rfidCardId,
        scanMethod: "MANUAL", // must be uppercase for backend
        recordedById: user?.id,
        branchId: orgBranchFilter.branchId,
      });
      setSuccessMsg("Member added to attendance session!");
      if (onSuccess) onSuccess();
    } catch (e) {
      setSuccessMsg("");
    }
  };

  // Only enable if session selected, rfidCardId exists, and not loading
  const canAdd = !!selectedSession && !!rfidCardId && !adding;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 bg-indigo-50 rounded-xl mb-6 border border-indigo-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
        <label className="font-medium text-gray-700 mr-2 whitespace-nowrap">Add to Attendance Session:</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full md:w-64 bg-white"
          value={selectedSession}
          onChange={e => setSelectedSession(e.target.value)}
          disabled={sessionsLoading}
        >
          <option value="">Select Session</option>
          {sessions && sessions.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name} ({s.date ? new Date(s.date).toLocaleDateString() : "No date"})</option>
          ))}
        </select>
      </div>
      <button
        className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAdd}
        onClick={handleAdd}
      >
        <PlusIcon className="h-5 w-5" /> Add
      </button>
      {successMsg && <span className="text-green-600 text-sm font-medium ml-2">{successMsg}</span>}
      {error && <span className="text-red-600 text-sm font-medium ml-2">{error.message}</span>}
    </div>
  );
}

interface MemberDetailsModalProps {
  memberId: string;
  onClose: () => void;
}

export default function MemberDetailsModal({ memberId, onClose }: MemberDetailsModalProps) {
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showUpdateFamily, setShowUpdateFamily] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    dateOfBirth: '',
    baptismDate: '',
    confirmationDate: '',
    membershipDate: '',
    status: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    employerName: '',
    notes: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { member, loading, error, refetch } = useMember(memberId);

  // Reset upload state when modal closes
  useEffect(() => {
    if (!showEditModal) {
      setUploadError(null);
      setImageFile(null);
      setPreviewImage(null);
    }
  }, [showEditModal]);

  // Initialize edit form data when member data is available
  useEffect(() => {
    if (member) {
      // Helper to format date as YYYY-MM-DD for input fields
      const formatDate = (dateValue: any) => {
        if (!dateValue) return '';
        const d = new Date(dateValue);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
      };
      setEditFormData({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        middleName: member.middleName || '',
        email: member.email || '',
        phoneNumber: member.phoneNumber || '',
        address: member.address || '',
        city: member.city || '',
        state: member.state || '',
        postalCode: member.postalCode || '',
        country: member.country || '',
        dateOfBirth: formatDate(member.dateOfBirth),
        baptismDate: formatDate(member.baptismDate),
        confirmationDate: formatDate(member.confirmationDate),
        membershipDate: formatDate(member.membershipDate),
        status: member.status || '',
        gender: member.gender || '',
        maritalStatus: member.maritalStatus || '',
        occupation: member.occupation || '',
        employerName: member.employerName || '',
        notes: member.notes || '',
      });
      setPreviewImage(null);
      setImageFile(null);
      setUploadError(null);
    }
  }, [member]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activity");

  const [updateMember] = useMutation(UPDATE_MEMBER, {
    onCompleted: () => {
      refetch();
      setShowEditModal(false);
    },
    onError: (error) => {
      console.error('Error updating member:', error);
    },
  });

  const [getPresignedUploadUrl] = useMutation(GET_PRESIGNED_UPLOAD_URL, {
    onError: (error) => {
      console.error('Error getting presigned URL:', error);
      setUploadError('Failed to get upload URL');
    }
  });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageId = member?.imageId;
      let imageUrl = member?.profileImageUrl;
      
      if (imageFile) {
        setIsUploading(true);
        
        try {
          // Step 1: Get a presigned URL for the upload
          const { data: presignedData } = await getPresignedUploadUrl({
            variables: {
              input: {
                fileName: imageFile.name,
                contentType: imageFile.type,
                mediaType: "IMAGE",
                branchId: member.branchId || "",
                description: `Profile image for member ${memberId}`
              }
            }
          });
          
          if (!presignedData || !presignedData.getPresignedUploadUrl) {
            throw new Error('Failed to get presigned URL');
          }
          
          // Instead of direct S3 upload which causes CORS issues,
          // create a FormData object and send it to our backend
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('uploadUrl', presignedData.getPresignedUploadUrl.uploadUrl);
          
          // Send to our backend API which will proxy the upload to S3
          const uploadResponse = await fetch('/api/proxy-upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Failed to upload image: ${errorText}`);
          }
          
          // Store both the ID and the URL
          imageId = presignedData.getPresignedUploadUrl.mediaItemId;
          imageUrl = presignedData.getPresignedUploadUrl.fileUrl;
        } catch (error) {
          console.error('Image upload error:', error);
          setUploadError('Failed to upload profile image');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Helper to convert date string to Date or null
      const parseDateOrNull = (val: string) => {
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      };
      await updateMember({
        variables: {
          id: memberId,
          updateMemberInput: {
            id: memberId, // Required field in UpdateMemberInput
            firstName: editFormData.firstName,
            lastName: editFormData.lastName,
            middleName: editFormData.middleName,
            email: editFormData.email,
            phoneNumber: editFormData.phoneNumber, // Correct field name
            address: editFormData.address,
            city: editFormData.city,
            state: editFormData.state,
            postalCode: editFormData.postalCode,
            country: editFormData.country,
            dateOfBirth: parseDateOrNull(editFormData.dateOfBirth),
            baptismDate: parseDateOrNull(editFormData.baptismDate),
            confirmationDate: parseDateOrNull(editFormData.confirmationDate),
            membershipDate: parseDateOrNull(editFormData.membershipDate),
            status: editFormData.status,
            gender: editFormData.gender,
            maritalStatus: editFormData.maritalStatus,
            occupation: editFormData.occupation,
            employerName: editFormData.employerName,
            notes: editFormData.notes,
            // Use the complete file URL
            profileImageUrl: imageUrl,
          },
        },
      });
      setShowEditModal(false);
      refetch();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleFamilyCreated = (family: any) => {
    setShowCreateFamily(false);
    refetch();
  };

  const { user } = useAuth();
  const orgBranchFilter = useOrganizationBranchFilter();
  const tabs = [
    { key: "activity", label: "Activity" },
    { key: "info", label: "Info" },
    { key: "family", label: "Family" },
    { key: "groups", label: "Groups" },
    { key: "ministries", label: "Ministries" },
    { key: "attendance", label: "Attendance" },
    { key: "sacraments", label: "Sacraments" },
    { key: "prayer", label: "Prayer Requests" },
    { key: "contributions", label: "Contributions" },
    { key: "notifications", label: "Notifications" },
    { key: "custom", label: "Custom Fields" },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error Loading Member</h2>
          <p className="mt-2 text-gray-600">{error ? error.message : "Member not found."}</p>
          <button onClick={onClose} className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
            <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const formatMemberSince = () => {
    if (!member.membershipDate) return 'N/A';
    return new Date(member.membershipDate).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };
  const getInitials = () => {
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
  };
  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'VISITOR': return 'Visitor';
      case 'PENDING': return 'Pending';
      default: return status;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-red-500';
      case 'VISITOR': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'VISITOR': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activityTimeline = [];
  if (member.membershipDate) {
    activityTimeline.push({
      type: "Membership",
      date: member.membershipDate,
      summary: `Became a member`,
      details: `Official member since ${new Date(member.membershipDate).toLocaleDateString()}`,
      icon: "CalendarIcon",
    });
  }
  if (member.dateOfBirth) {
    activityTimeline.push({
      type: "Birth",
      date: member.dateOfBirth,
      summary: `Date of Birth`,
      details: `${new Date(member.dateOfBirth).toLocaleDateString()}`,
      icon: "CakeIcon",
    });
  }
  if (member.groupMemberships) {
    member.groupMemberships.forEach(gm => {
      if (gm.joinDate) {
        activityTimeline.push({
          type: `Joined Group` + (gm.smallGroup?.name ? `: ${gm.smallGroup.name}` : ""),
          date: gm.joinDate,
          summary: `Joined group as ${gm.role}`,
          details: gm.smallGroup?.name ? `Group: ${gm.smallGroup.name}` : "",
          icon: "UserGroupIcon",
        });
      }
    });
  }
  if (member.attendanceRecords) {
    member.attendanceRecords.forEach(ar => {
      if (ar.checkInTime) {
        activityTimeline.push({
          type: "Attendance",
          date: ar.checkInTime,
          summary: `Checked in (${ar.checkInMethod})`,
          details: ar.notes || "",
          icon: "ClipboardDocumentCheckIcon",
        });
      }
    });
  }
  if (member.sacramentalRecords) {
    member.sacramentalRecords.forEach(sr => {
      if (sr.dateOfSacrament) {
        activityTimeline.push({
          type: `Sacrament: ${sr.sacramentType}`,
          date: sr.dateOfSacrament,
          summary: `Received ${sr.sacramentType}`,
          details: sr.locationOfSacrament ? `At ${sr.locationOfSacrament}` : "",
          icon: "SparklesIcon",
        });
      }
    });
  }
  activityTimeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-white overflow-y-auto flex flex-col">
      <button
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div className="flex-1 flex flex-col w-full h-full">
        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-5xl mx-2 h-[85vh] p-8 relative animate-fadeIn overflow-y-auto flex flex-col justify-start">
              <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100 rounded-t-2xl bg-gradient-to-br from-indigo-50 to-white">
                <h3 className="text-lg font-bold text-indigo-900">Edit Member Details</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-indigo-500 transition"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="px-6 py-6">
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Profile Image
                        </label>
                        {isUploading && (
                          <div className="text-sm text-indigo-600">
                            Uploading...
                          </div>
                        )}
                        {uploadError && (
                          <div className="text-sm text-red-500">
                            {uploadError}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : member?.imageId ? (
                            <img
                              src={`/api/images/${member.imageId}`}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <UserIcon className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => document.getElementById('profileImage')?.click()}
                          className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          {imageFile ? 'Change Image' : 'Upload Image'}
                          <PhotoIcon className="ml-2 h-4 w-4" />
                        </button>
                        <input
                          type="file"
                          id="profileImage"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setImageFile(e.target.files[0]);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setPreviewImage(event.target?.result as string);
                              };
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        required
                        placeholder="Enter first name"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        required
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                      className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      placeholder="Enter address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={editFormData.state}
                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={editFormData.postalCode}
                        onChange={(e) => setEditFormData({ ...editFormData, postalCode: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={editFormData.country}
                        onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={editFormData.dateOfBirth}
                        onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="baptismDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Baptism Date
                      </label>
                      <input
                        type="date"
                        id="baptismDate"
                        name="baptismDate"
                        value={editFormData.baptismDate}
                        onChange={(e) => setEditFormData({ ...editFormData, baptismDate: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="confirmationDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmation Date
                      </label>
                      <input
                        type="date"
                        id="confirmationDate"
                        name="confirmationDate"
                        value={editFormData.confirmationDate}
                        onChange={(e) => setEditFormData({ ...editFormData, confirmationDate: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="membershipDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Membership Date
                      </label>
                      <input
                        type="date"
                        id="membershipDate"
                        name="membershipDate"
                        value={editFormData.membershipDate}
                        onChange={(e) => setEditFormData({ ...editFormData, membershipDate: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="VISITOR">Visitor</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={editFormData.gender}
                        onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        Marital Status
                      </label>
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={editFormData.maritalStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, maritalStatus: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                      >
                        <option value="">Select Marital Status</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                        <option value="SEPARATED">Separated</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                        Occupation
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={editFormData.occupation}
                        onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="employerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Employer Name
                      </label>
                      <input
                        type="text"
                        id="employerName"
                        name="employerName"
                        value={editFormData.employerName}
                        onChange={(e) => setEditFormData({ ...editFormData, employerName: e.target.value })}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        placeholder="Enter employer name"
                      />
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={editFormData.notes}
                        onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                        placeholder="Enter notes"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Modal Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6 border-b border-gray-100">
          <div className="relative">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt={`${member.firstName} ${member.lastName}`}
                className="h-16 w-16 rounded-full object-cover shadow-lg mb-2"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg mb-2">
                {getInitials()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg">
              <label className="cursor-pointer">
                <CameraIcon className="h-6 w-6 text-indigo-600" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      handleImageUpload();
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">{member.firstName} {member.lastName}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-1 justify-center">
            <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusBadgeClasses(member.status)}`}>{formatStatus(member.status)}</span>
            <span className="inline-flex items-center text-xs text-gray-600 bg-white rounded-full px-2 py-0.5">
              Member since {formatMemberSince()}
            </span>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Edit Details
            </button>
          </div>
        </div>
        {/* Redesigned Tabs */}
        <div className="bg-gray-50 px-8 pt-4 pb-2 border-b border-gray-100">
          <nav className="flex flex-wrap gap-3 justify-center" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative whitespace-nowrap py-2 px-5 text-base font-medium rounded-lg transition-all duration-200
                  ${activeTab === tab.key ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50'}`}
                style={{ minWidth: '130px', letterSpacing: '0.01em' }}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-10 h-1 rounded bg-indigo-600" />
                )}
              </button>
            ))}
          </nav>
        </div>
        {/* Redesigned Tab Content */}
        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
          {activeTab === "activity" && (
            <MemberActivityTimeline activities={activityTimeline} />
          )}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
                  <span className="truncate">{member.email || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <PhoneIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.phoneNumber || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPinIcon className="h-5 w-5 text-indigo-400" />
                  <span>{typeof member.address === 'object' ? member.address?.fullAddress : member.address || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BuildingOfficeIcon className="h-5 w-5 text-indigo-400" />
                  <span>{typeof member.branch === 'object' ? member.branch?.name : member.branch || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <IdentificationIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.rfidCardId || <span className='text-gray-400'>Not assigned</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <UserIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.gender || <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CakeIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <HeartIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.maritalStatus || <span className='text-gray-400'>Not specified</span>}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <BriefcaseIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.occupation || member.employerName || <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <InformationCircleIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.notes || <span className='text-gray-400'>None</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckBadgeIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.statusChangeDate ? new Date(member.statusChangeDate).toLocaleDateString() : <span className='text-gray-400'>No change</span>}</span>
                  <span>{member.statusChangeReason && <span className="text-xs text-gray-500">({member.statusChangeReason})</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.baptismDate ? new Date(member.baptismDate).toLocaleDateString() : <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.confirmationDate ? new Date(member.confirmationDate).toLocaleDateString() : <span className='text-gray-400'>Not specified</span>}</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === "family" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.families && member.families.length > 0 ? (
                <AddToGroup memberId={member.id} />
              ) : (
                <div className="col-span-2 flex flex-col items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                  <span className="text-gray-700 mb-2">This member does not belong to any family.</span>
                  <button
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    onClick={() => setShowCreateFamily(true)}
                  >
                    <PlusIcon className="h-5 w-5 inline mr-1" /> Create Family
                  </button>
                  <button
                    className="mt-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                    onClick={() => setShowUpdateFamily(true)}
                  >
                    Update Family
                  </button>
                </div>
              )}
              <CreateFamilyModal open={showCreateFamily} onClose={() => setShowCreateFamily(false)} onCreated={handleFamilyCreated} memberId={member.id} />
              <UpdateFamilyModal open={showUpdateFamily} onClose={() => setShowUpdateFamily(false)} memberId={member.id} onUpdated={refetch} />
              {/* --- Family Relationships --- */}
              {member.familyRelationships && member.familyRelationships.length > 0 && (
                <div className="mt-4 col-span-2">
                  <div className="font-semibold text-indigo-700 mb-1 flex items-center"><UsersIcon className="h-5 w-5 mr-1" />Family Relationships</div>
                  <ul className="divide-y divide-gray-100">
                    {member.familyRelationships.map(rel => {
                      return (
                          <li key={rel.id}
                              className="py-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                            <div>
                              <span className="font-semibold mr-2">{rel.relationshipType}:</span>
                              <span>{rel.relatedMember?.firstName} {rel.relatedMember?.lastName}</span>
                            </div>
                            <div
                                className="text-xs text-gray-400 mt-1 md:mt-0">Added {new Date(rel.createdAt).toLocaleDateString()}</div>
                          </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
          {activeTab === "groups" && (
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm bg-white">
              <AddToGroup memberId={member.id} />
              {member.groupMemberships && member.groupMemberships.filter(gm => !gm.ministry).length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm mt-4">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Group Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Role</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {member.groupMemberships.filter(gm => !gm.ministry).map((gm, idx) => (
                      <tr key={gm.smallGroup?.id || idx} className="hover:bg-indigo-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap">{gm.smallGroup?.name || <span className='text-gray-400'>Unnamed Group</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.role || <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.joinDate ? new Date(gm.joinDate).toLocaleDateString() : <span className='text-gray-400'>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400 px-4 py-6 text-center">No group memberships.</div>
              )}
            </div>
          )}
          {activeTab === "ministries" && (
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm bg-white">
              <AddToMinistry memberId={member.id} onSuccess={refetch} />
              {member.groupMemberships && member.groupMemberships.filter(gm => !!gm.ministry).length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm mt-4">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Ministry Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Role</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {member.groupMemberships.filter(gm => !!gm.ministry).map((gm, idx) => (
                      <tr key={gm.ministry?.id || idx} className="hover:bg-indigo-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap">{gm.ministry?.name || <span className='text-gray-400'>Unnamed Ministry</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.role || <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.joinDate ? new Date(gm.joinDate).toLocaleDateString() : <span className='text-gray-400'>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400 px-4 py-6 text-center">No ministry memberships.</div>
              )}
            </div>
          )}
          {activeTab === "attendance" && (
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm bg-white">
              <AddToAttendance memberId={member.id} rfidCardId={member.rfidCardId} onSuccess={refetch} />
              {member.attendanceRecords && member.attendanceRecords.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Event Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Location</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Check-in Method</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {member.attendanceRecords.map((rec, idx) => (
                      <tr key={rec.id || idx} className="hover:bg-indigo-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{rec.session?.name || <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{rec.session?.location || <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{rec.checkInMethod || <span className='text-gray-400'>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400 px-4 py-6 text-center">No attendance records.</div>
              )}
            </div>
          )}
          {activeTab === "sacraments" && (
            <div className="overflow-x-auto rounded-2xl border border-indigo-100 shadow-xl bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-0 py-8 flex flex-col items-center">
              <div className="w-full max-w-xl mb-6">
                {/*<h4 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center">Add Sacramental Record</h4>*/}
                <AddToSacraments memberId={member.id} onSuccess={() => { /* Optionally refetch sacramental records */ }} />
              </div>
              <div className="w-full max-w-xl">
                <h5 className="text-lg font-bold text-gray-700 mb-2 mt-6">Existing Sacramental Records</h5>
                {member.sacramentalRecords && member.sacramentalRecords.length > 0 ? (
                  <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
                    {member.sacramentalRecords.map((rec, idx) => (
                      <li key={rec.id || idx} className="py-4 px-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div className="flex-1">
                          <div className="flex gap-3 items-center mb-1">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 uppercase tracking-wide">{rec.sacramentType || <span className='text-gray-400'>—</span>}</span>
                            <span className="text-xs text-gray-400">{rec.dateOfSacrament ? new Date(rec.dateOfSacrament).toLocaleDateString() : <span className='text-gray-400'>—</span>}</span>
                          </div>
                          <div className="text-sm text-gray-700">Location: <span className="font-semibold">{rec.locationOfSacrament || <span className='text-gray-400'>—</span>}</span></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 px-4 py-6 text-center bg-white rounded-xl shadow-sm">No sacramental records.</div>
                )}
              </div>
            </div>
          )}
          {activeTab === "prayer" && (
            <MemberPrayerRequestsTab memberId={member.id} />
          )}
          {activeTab === "contributions" && (
            <MemberContributionsTab memberId={member.id} />
          )}
          {activeTab === "notifications" && (
            <div className="space-y-2">
              {member.notifications && member.notifications.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {member.notifications.map((note, idx) => (
                    <li key={note.id || idx} className="py-2 flex items-center gap-3">
                      <BellIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{note.message || <span className='text-gray-400'>—</span>}</div>
                        <div className="text-xs text-gray-500">{note.date ? new Date(note.date).toLocaleDateString() : <span className='text-gray-400'>—</span>}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <div className="text-gray-400">No notifications.</div>}
            </div>
          )}
          {activeTab === "custom" && (
            <div className="space-y-2">
              {member.customFields && Object.keys(member.customFields).length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {Object.entries(member.customFields).map(([key, value]) => (
                    <li key={key} className="py-2 flex items-center gap-3">
                      <InformationCircleIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                      <span className="font-semibold">{key}:</span> <span className="text-gray-700">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              ) : <div className="text-gray-400">No custom fields.</div>}
            </div>
          )}
        </div>
        {/* Modal Actions */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={() => setIsMessageModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2 text-white" />
            Message
          </button>
          <a
              onClick={() => setShowEditModal(true)}
            href="#"
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Edit
          </a>
        </div>
        {isMessageModalOpen && (
          <MessageModal memberId={member.id} onClose={() => setIsMessageModalOpen(false)} />
        )}
      </div>
    </div>
  );
}

interface AddToGroupProps {
  memberId: string;
}

function AddToGroup({ memberId }: AddToGroupProps) {
  const orgBranchFilter = useOrganizationBranchFilter();
  const { smallGroups, loading } = useFilteredSmallGroups(orgBranchFilter, !orgBranchFilter.branchId && !orgBranchFilter.organisationId);
  const { addMemberToGroup } = useSmallGroupMutations();

  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [role, setRole] = useState("MEMBER");
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredGroups = smallGroups.filter((g: { name: string }) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = async () => {
    if (!selectedGroup) return;
    setIsAdding(true);
    setError(null);
    try {
      await addMemberToGroup({
        memberId,
        smallGroupId: selectedGroup.id,
        role: role as SmallGroupMemberRole
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);
      setShowAdd(false);
      setSelectedGroup(null);
      setSearchQuery("");
    } catch (e: any) {
      setError(e?.message || "Failed to add member to group.");
    }
    setIsAdding(false);
  };

  return (
    <div className="mb-4">
      {!showAdd && (
        <button
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow transition font-semibold text-base"
          onClick={() => setShowAdd(true)}
        >
          {/* Inline SVG for plus icon */}
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add to Group
        </button>
      )}
      {showAdd && (
        <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg max-w-md mx-auto">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Search Group</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type group name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-base px-4 py-2 w-full"
                autoComplete="off"
              />
              {searchQuery && (
                <div className="absolute z-20 bg-white border border-gray-200 rounded-lg w-full mt-1 max-h-56 overflow-y-auto shadow-xl">
                  {filteredGroups.length === 0 && (
                    <div className="p-3 text-sm text-gray-400">No groups found</div>
                  )}
                  {filteredGroups.map((g: { name: string; id: string }) => (
                    <button
                      key={g.id}
                      className="block w-full text-left px-4 py-2 text-base hover:bg-indigo-50 hover:text-indigo-700 transition"
                      onClick={() => setSelectedGroup(g)}
                    >
                      <span className="font-semibold">{g.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="rounded-lg border border-gray-300 text-base px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="LEADER">Leader</option>
              <option value="CO_LEADER">Co-Leader</option>
              <option value="VISITOR">Visitor</option>
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-indigo-600 text-white text-base font-semibold shadow hover:bg-indigo-700 disabled:opacity-50 transition"
              disabled={!selectedGroup || isAdding}
              onClick={handleAdd}
            >
              {isAdding ? "Adding..." : "Add to Group"}
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 text-base font-semibold hover:bg-gray-200 transition"
              onClick={() => { setShowAdd(false); setSelectedGroup(null); setSearchQuery(""); setRole("MEMBER"); setError(null); }}
              type="button"
            >
              Cancel
            </button>
          </div>
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-1">Successfully added to group!</div>}
        </div>
      )}
    </div>
  );
}

interface AddToMinistryProps {
  memberId: string;
  onSuccess?: () => void;
}

function AddToMinistry({ memberId, onSuccess }: AddToMinistryProps) {
  const { user } = useAuth();
  // Filter ministries by organisation for super admins, by branch for others
  const orgId = user?.organisationId;
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0]?.branch?.id : undefined;
  const filter = user?.primaryRole === 'super_admin' ? { organisationId: orgId } : { branchId };
  const { ministries, loading } = useFilteredMinistries(filter);
  const { addMemberToMinistry, loading: adding, error, data } = useMinistryMutations();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<{ id: string; name: string } | null>(null);
  const [role, setRole] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const filteredMinistries = ministries.filter((m: { name: string }) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = async () => {
    if (!selectedMinistry) return;
    try {
      await addMemberToMinistry({
        memberId,
        ministryId: selectedMinistry.id,
        role,
        joinDate: new Date().toISOString().split('T')[0],
      });
      setSuccess(true);
      setShowAdd(false);
      setSelectedMinistry(null);
      setRole('');
      setSearchQuery('');
      setErrMsg(null);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setErrMsg(e?.message || 'Failed to add member to ministry.');
    }
  };

  return (
    <div className="mb-4">
      {!showAdd ? (
        <button
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm mb-2"
          onClick={() => { setShowAdd(true); setSuccess(false); }}
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add to Ministry
        </button>
      ) : (
        <div className="bg-gray-50 border rounded p-4 mb-2">
          <input
            type="text"
            placeholder="Search ministry..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded"
          />
          <div className="max-h-40 overflow-y-auto mb-2">
            {filteredMinistries.length === 0 && <div className="p-2 text-xs text-gray-400">No ministries found</div>}
            {filteredMinistries.map((m: { name: string; id: string }) => (
              <button
                key={m.id}
                className="block w-full text-left px-3 py-1 text-sm hover:bg-indigo-100"
                onClick={() => setSelectedMinistry(m)}
              >
                {m.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Role (optional)"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded"
          />
          <div className="flex gap-2">
            <button
              className="px-4 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
              disabled={!selectedMinistry || adding}
              onClick={handleAdd}
            >
              {adding ? 'Adding...' : 'Add to Ministry'}
            </button>
            <button
              className="px-4 py-1 bg-gray-200 rounded"
              onClick={() => { setShowAdd(false); setSelectedMinistry(null); setSearchQuery(''); setRole(''); setErrMsg(null); }}
            >
              Cancel
            </button>
          </div>
          {errMsg && <div className="text-red-600 text-xs mt-2">{errMsg}</div>}
          {success && <div className="text-green-600 text-xs mt-2">Successfully added to ministry!</div>}
        </div>
      )}
    </div>
  );
}

interface AddFamilyConnectionProps {
  memberId: string;
  familyId: string;
  onSuccess?: () => void;
}

function AddFamilyConnection({ memberId, familyId, onSuccess }: AddFamilyConnectionProps) {
  const [showInput, setShowInput] = useState(false);
  const [relatedMemberId, setRelatedMemberId] = useState("");
  const [relationship, setRelationship] = useState("SIBLING");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const orgBranchFilter = useOrganizationBranchFilter();
  const { data: members, loading } = useSearchMembers(
    searchTerm,
    orgBranchFilter.organisationId,
    orgBranchFilter.branchId
  );

  const [addFamilyConnection] = useMutation(ADD_FAMILY_CONNECTION);

  const handleSelectMember = (member: { id: string; firstName: string; lastName: string }) => {
    setRelatedMemberId(member.id);
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setDropdownOpen(false);
  };

  const handleAdd = async () => {
    if (!relatedMemberId) return;
    setAdding(true);
    setError(null);
    try {
      await addFamilyConnection({ variables: { familyId, memberId, relatedMemberId, relationship } });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch {
      setError("Failed to add family connection.");
    }
    setAdding(false);
  };

  return (
    <div className="mb-4">
      {!showInput && (
        <button
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow transition font-semibold text-base"
          onClick={() => setShowInput(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Family Connection
        </button>
      )}
      {showInput && (
        <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg max-w-md mx-auto">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Search Member in Branch</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type a name, email, or phone..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setDropdownOpen(true);
                }}
                className="rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-base px-4 py-2 w-full"
                autoComplete="off"
              />
              {dropdownOpen && searchTerm && members && (
                <div className="absolute z-20 bg-white border border-gray-200 rounded-lg w-full mt-1 max-h-56 overflow-y-auto shadow-xl">
                  {loading && <div className="p-3 text-sm text-gray-400">Searching...</div>}
                  {members.length === 0 && !loading && (
                    <div className="p-3 text-sm text-gray-400">No members found</div>
                  )}
                  {members.map((m: any) => (
                    <button
                      key={m.id}
                      className="block w-full text-left px-4 py-2 text-base hover:bg-indigo-50 hover:text-indigo-700 transition"
                      onClick={() => handleSelectMember(m)}
                    >
                      <span className="font-semibold">{m.firstName} {m.lastName}</span>
                      <span className="text-gray-500 ml-2 text-sm">{m.email || m.phoneNumber || m.id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Relationship</label>
            <select
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              className="rounded-lg border border-gray-300 text-base px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="SPOUSE">Spouse</option>
              <option value="PARENT">Parent</option>
              <option value="CHILD">Child</option>
              <option value="SIBLING">Sibling</option>
              <option value="GRANDPARENT">Grandparent</option>
              <option value="GRANDCHILD">Grandchild</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAdd}
              disabled={adding || !relatedMemberId}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-indigo-600 text-white text-base font-semibold shadow hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {adding ? "Adding..." : "Add Connection"}
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 text-base font-semibold hover:bg-gray-200 transition"
              onClick={() => { setShowInput(false); setSuccess(false); setError(null); setSearchTerm(""); setRelatedMemberId(""); }}
              type="button"
            >
              Cancel
            </button>
          </div>
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-1">Added!</div>}
        </div>
      )}
    </div>
  );
}

function CreateFamilyModal({ open, onClose, onCreated, memberId }: { open: boolean; onClose: () => void; onCreated: (family: any) => void; memberId: string }) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createFamily] = useMutation(CREATE_FAMILY);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const { data } = await createFamily({ variables: { createFamilyInput: { name, memberIds: [memberId] } } });
      if (data?.createFamily) {
        onCreated(data.createFamily);
        onClose();
      }
    } catch (e: any) {
      setError(e.message || "Failed to create family.");
    }
    setCreating(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
        <h2 className="text-xl font-semibold mb-4">Create New Family</h2>
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
          placeholder="Family Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={creating}
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onClose}
            disabled={creating}
          >Cancel</button>
          <button
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            onClick={handleCreate}
            disabled={creating || !name.trim()}
          >{creating ? "Creating..." : "Create"}</button>
        </div>
      </div>
    </div>
  );
}
