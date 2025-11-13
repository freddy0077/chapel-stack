'use client';

import { useAuth } from '@/contexts/AuthContextEnhanced';
import { useQuery } from '@apollo/client';
import { GET_MEMBER } from '@/graphql/queries/memberQueries';
import Loading from '@/components/ui/Loading';
import { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  IdentificationIcon,
  HeartIcon,
  CheckCircleIcon,
  PencilIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProfileEditModal, ProfilePictureUpload, CommunicationPreferencesPanel, MembershipStatsPanel, ActivityTimelinePanel } from './components';
import FamilyRelationshipsPanel from '@/components/members/FamilyRelationshipsPanel';

export default function ProfilePage() {
  const { state } = useAuth();
  const user = state.user;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPictureUploadOpen, setIsPictureUploadOpen] = useState(false);

  // Get member ID from user.member.id or fallback to user.id
  const memberId = user?.member?.id || user?.id;

  // Fetch member details if user exists
  const { data, loading, error, refetch } = useQuery(GET_MEMBER, {
    variables: { memberId },
    skip: !memberId,
  });

  const member = data?.member;

  // Debug logging
  console.log('Profile Page Debug:', {
    user,
    memberId,
    member,
    data,
    loading,
    error,
  });

  if (loading) {
    return <Loading />;
  }

  // Handle member not found error - use user data as fallback
  if (error && error.message.includes('not found')) {
    console.log('Member not found, using user data as fallback');
    // Continue to render with user data
  } else if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-red-600 font-semibold">Error loading profile</p>
            <p className="text-gray-600 mt-2">{error.message}</p>
            <p className="text-xs text-gray-500 mt-4">Member ID: {memberId}</p>
            <p className="text-xs text-gray-500">User ID: {user?.id}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!member && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No profile data available</p>
            <p className="text-xs text-gray-500 mt-4">Member ID: {memberId}</p>
            <p className="text-xs text-gray-500">User ID: {user?.id}</p>
            <p className="text-xs text-gray-500">User Member ID: {user?.member?.id}</p>
          </div>
        </div>
      </div>
    );
  }

  const profileData = member || user;
  const hasMemberRecord = !!member;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Member Record Notice */}
        {!hasMemberRecord && user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600">ℹ️</div>
              <div>
                <p className="text-yellow-800 font-medium">Limited Profile Information</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Your user account is active, but a full member profile hasn't been created yet. 
                  Some features like family relationships and statistics are not available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                {profileData?.profileImageUrl ? (
                  <Image
                    src={profileData.profileImageUrl}
                    alt={profileData?.firstName}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                    <UserIcon className="w-16 h-16 text-white" />
                  </div>
                )}
                {/* Change Picture Button */}
                <button
                  onClick={() => setIsPictureUploadOpen(true)}
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Change profile picture"
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {profileData?.firstName} {profileData?.lastName}
                </h1>
                <p className="text-blue-100 text-lg">
                  {profileData?.membershipStatus || 'Member'}
                </p>
                {profileData?.memberId && (
                  <p className="text-blue-200 mt-2">
                    Member ID: {profileData.memberId}
                  </p>
                )}
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData?.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">{profileData.email}</p>
                  </div>
                )}
                {profileData?.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p className="text-gray-900 mt-1">{profileData.phoneNumber}</p>
                  </div>
                )}
                {profileData?.alternativeEmail && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Alternative Email
                    </label>
                    <p className="text-gray-900 mt-1">
                      {profileData.alternativeEmail}
                    </p>
                  </div>
                )}
                {profileData?.alternatePhone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Alternative Phone
                    </label>
                    <p className="text-gray-900 mt-1">
                      {profileData.alternatePhone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData?.dateOfBirth && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </label>
                    <p className="text-gray-900 mt-1">
                      {new Date(profileData.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {profileData?.gender && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gender
                    </label>
                    <p className="text-gray-900 mt-1">{profileData.gender}</p>
                  </div>
                )}
                {profileData?.maritalStatus && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Marital Status
                    </label>
                    <p className="text-gray-900 mt-1">
                      {profileData.maritalStatus}
                    </p>
                  </div>
                )}
                {profileData?.nationality && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nationality
                    </label>
                    <p className="text-gray-900 mt-1">
                      {profileData.nationality}
                    </p>
                  </div>
                )}
                {profileData?.occupation && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Occupation
                    </label>
                    <p className="text-gray-900 mt-1">
                      {profileData.occupation}
                    </p>
                  </div>
                )}
                {profileData?.education && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Education Level
                    </label>
                    <p className="text-gray-900 mt-1">
                      {profileData.education}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            {(profileData?.address ||
              profileData?.city ||
              profileData?.state ||
              profileData?.country) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-blue-600" />
                  Address
                </h2>
                <div className="space-y-4">
                  {profileData?.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Street Address
                      </label>
                      <p className="text-gray-900 mt-1">{profileData.address}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData?.city && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          City
                        </label>
                        <p className="text-gray-900 mt-1">{profileData.city}</p>
                      </div>
                    )}
                    {profileData?.state && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          State/Region
                        </label>
                        <p className="text-gray-900 mt-1">{profileData.state}</p>
                      </div>
                    )}
                    {profileData?.postalCode && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Postal Code
                        </label>
                        <p className="text-gray-900 mt-1">
                          {profileData.postalCode}
                        </p>
                      </div>
                    )}
                    {profileData?.country && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Country
                        </label>
                        <p className="text-gray-900 mt-1">
                          {profileData.country}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Family Relationships Section */}
            {hasMemberRecord && member && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <FamilyRelationshipsPanel
                  member={member}
                  onRelationshipsChange={() => refetch()}
                  compact={false}
                  showTitle={true}
                  showAddButton={true}
                />
              </div>
            )}

            {/* Communication Preferences Section */}
            {hasMemberRecord && member && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <CommunicationPreferencesPanel
                  memberId={member.id}
                  onUpdate={() => refetch()}
                />
              </div>
            )}

            {/* Activity Timeline Section */}
            {hasMemberRecord && member && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <ActivityTimelinePanel memberId={member.id} />
              </div>
            )}
          </div>

          {/* Right Column - Membership & Status */}
          <div className="space-y-6">
            {/* Membership Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                Membership
              </h3>
              <div className="space-y-3">
                {profileData?.membershipStatus && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Status
                    </label>
                    <p className="text-gray-900 font-semibold mt-1">
                      {profileData.membershipStatus}
                    </p>
                  </div>
                )}
                {profileData?.membershipType && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Type
                    </label>
                    <p className="text-gray-900 font-semibold mt-1">
                      {profileData.membershipType}
                    </p>
                  </div>
                )}
                {profileData?.membershipDate && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Join Date
                    </label>
                    <p className="text-gray-900 font-semibold mt-1">
                      {new Date(profileData.membershipDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Spiritual Milestones */}
            {(profileData?.baptismDate ||
              profileData?.confirmationDate ||
              profileData?.salvationDate) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HeartIcon className="w-5 h-5 text-red-600" />
                  Spiritual Milestones
                </h3>
                <div className="space-y-3">
                  {profileData?.baptismDate && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase">
                        Baptism Date
                      </label>
                      <p className="text-gray-900 font-semibold mt-1">
                        {new Date(profileData.baptismDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {profileData?.confirmationDate && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase">
                        Confirmation Date
                      </label>
                      <p className="text-gray-900 font-semibold mt-1">
                        {new Date(
                          profileData.confirmationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {profileData?.salvationDate && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase">
                        Salvation Date
                      </label>
                      <p className="text-gray-900 font-semibold mt-1">
                        {new Date(profileData.salvationDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IdentificationIcon className="w-5 h-5 text-blue-600" />
                Account Info
              </h3>
              <div className="space-y-3">
                {profileData?.createdAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Member Since
                    </label>
                    <p className="text-gray-900 font-semibold mt-1">
                      {new Date(profileData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {profileData?.status && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase">
                      Account Status
                    </label>
                    <p className="text-gray-900 font-semibold mt-1">
                      {profileData.status}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Membership Statistics */}
            {hasMemberRecord && member && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <MembershipStatsPanel memberId={member.id} />
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          member={member}
          onSuccess={() => {
            refetch();
          }}
        />

        <ProfilePictureUpload
          isOpen={isPictureUploadOpen}
          onClose={() => setIsPictureUploadOpen(false)}
          memberId={memberId}
          currentImageUrl={member?.profileImageUrl}
          onSuccess={(imageUrl) => {
            refetch();
          }}
          branchId={member?.branchId}
        />
      </div>
    </div>
  );
}
