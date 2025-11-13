"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useMember } from "@/graphql/hooks/useMember";
import { useUpdateMember } from "@/graphql/hooks/useUpdateMember";
import Loading from "@/components/ui/Loading";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  CameraIcon,
  HeartIcon,
  GiftIcon,
  Cog6ToothIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

function MemberProfileContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "personal" | "membership" | "history" | "preferences"
  >("personal");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch member data from backend
  const { data: memberData, loading: memberLoading, error: memberError } = useMember();
  const { updateMember, loading: updateLoading } = useUpdateMember();

  // Get member from backend or fallback to auth user
  const member = memberData?.member || user?.member;

  // Form state - initialize with safe defaults
  const [formData, setFormData] = useState({
    firstName: member?.firstName || user?.firstName || "",
    lastName: member?.lastName || user?.lastName || "",
    email: member?.email || user?.email || "",
    phone: member?.phone || user?.phone || "",
    bio: member?.bio || "",
  });

  if (!user) {
    return <Loading message="Loading your profile..." />;
  }

  if (!user.member) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
        <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400" />
        <h2 className="mt-4 text-2xl font-semibold text-yellow-700">
          Member Profile Not Found
        </h2>
        <p className="text-yellow-600">
          We couldn't find a member profile linked to your account.
        </p>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaveError(null);
      setSaveSuccess(false);

      // Call GraphQL mutation to update profile
      await updateMember(user?.id as string, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        // Map bio if supported by backend as notes or a profile field
        notes: formData.bio,
      });

      setSaveSuccess(true);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setSaveError(errorMessage);
      console.error("Error updating profile:", error);
    }
  };

  const membershipStatus = user.member?.status || "Active";
  const joinDate = user.member?.createdAt
    ? new Date(user.member.createdAt).toLocaleDateString()
    : "N/A";
  const profilePic = user.profilePictureUrl || "/profile-placeholder.png";

  if (memberLoading) {
    return <Loading message="Loading your profile..." />;
  }

  if (memberError) {
    console.error("Member error:", memberError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            {saveError}
          </div>
        )}

        {/* Header with Profile Picture */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-blue-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                <Image
                  src={profilePic}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition">
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-blue-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  <PencilIcon className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <CheckCircleIcon className="w-4 h-4" />
                  {membershipStatus}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <CalendarIcon className="w-4 h-4" />
                  Joined {joinDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mb-6">
          <div className="flex border-b border-blue-100">
            {[
              { id: "personal", label: "Personal Info", icon: UserIcon },
              { id: "membership", label: "Membership", icon: CheckCircleIcon },
              { id: "history", label: "History", icon: CalendarIcon },
              { id: "preferences", label: "Preferences", icon: Cog6ToothIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | "personal"
                      | "membership"
                      | "history"
                      | "preferences"
                  )
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={updateLoading}
                        className={`px-6 py-2 text-white rounded-lg font-semibold transition ${
                          updateLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {updateLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={updateLoading}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${
                          updateLoading
                            ? "bg-gray-200 cursor-not-allowed text-gray-500"
                            : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <InfoRow
                      icon={<UserIcon className="w-5 h-5" />}
                      label="Full Name"
                      value={`${user.firstName} ${user.lastName}`}
                    />
                    <InfoRow
                      icon={<EnvelopeIcon className="w-5 h-5" />}
                      label="Email"
                      value={user.email}
                    />
                    <InfoRow
                      icon={<PhoneIcon className="w-5 h-5" />}
                      label="Phone"
                      value={user.phone || "Not provided"}
                    />
                    {user.member?.bio && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Bio
                        </p>
                        <p className="text-gray-600">{user.member.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Membership Tab */}
            {activeTab === "membership" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard
                    icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}
                    label="Status"
                    value={membershipStatus}
                  />
                  <StatCard
                    icon={<CalendarIcon className="w-6 h-6 text-blue-500" />}
                    label="Member Since"
                    value={joinDate}
                  />
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-3">
                    Membership Benefits
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-indigo-700">
                      <CheckCircleIcon className="w-4 h-4" />
                      Access to all church events
                    </li>
                    <li className="flex items-center gap-2 text-indigo-700">
                      <CheckCircleIcon className="w-4 h-4" />
                      Join groups and ministries
                    </li>
                    <li className="flex items-center gap-2 text-indigo-700">
                      <CheckCircleIcon className="w-4 h-4" />
                      Make donations and give
                    </li>
                    <li className="flex items-center gap-2 text-indigo-700">
                      <CheckCircleIcon className="w-4 h-4" />
                      Receive announcements
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    icon={<CalendarIcon className="w-6 h-6 text-blue-500" />}
                    label="Events Attended"
                    value="12"
                  />
                  <StatCard
                    icon={<UserIcon className="w-6 h-6 text-green-500" />}
                    label="Groups Joined"
                    value="3"
                  />
                  <StatCard
                    icon={<GiftIcon className="w-6 h-6 text-yellow-500" />}
                    label="Total Giving"
                    value="GHS 500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <ActivityItem
                      date="Nov 8, 2025"
                      title="Attended Sunday Service"
                      description="Main Auditorium"
                    />
                    <ActivityItem
                      date="Nov 5, 2025"
                      title="Joined Bible Study Group"
                      description="Weekly meetings on Wednesdays"
                    />
                    <ActivityItem
                      date="Nov 1, 2025"
                      title="Made a Donation"
                      description="GHS 100 to General Fund"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Communication Preferences
                  </h3>
                  <div className="space-y-3">
                    <PreferenceToggle
                      label="Email Notifications"
                      description="Receive announcements and updates via email"
                      defaultChecked={true}
                    />
                    <PreferenceToggle
                      label="SMS Notifications"
                      description="Receive important updates via SMS"
                      defaultChecked={false}
                    />
                    <PreferenceToggle
                      label="Event Reminders"
                      description="Get reminders before events you've RSVP'd to"
                      defaultChecked={true}
                    />
                    <PreferenceToggle
                      label="Group Announcements"
                      description="Receive announcements from groups you're in"
                      defaultChecked={true}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Privacy Settings
                  </h3>
                  <div className="space-y-3">
                    <PreferenceToggle
                      label="Public Profile"
                      description="Allow other members to see your profile"
                      defaultChecked={true}
                    />
                    <PreferenceToggle
                      label="Show Giving History"
                      description="Allow admins to see your giving history"
                      defaultChecked={false}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                    <LockClosedIcon className="w-5 h-5" />
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickLinkCard
            href="/member/events"
            icon={<CalendarIcon className="w-6 h-6" />}
            title="View Events"
            description="See upcoming events"
          />
          <QuickLinkCard
            href="/member/groups"
            icon={<UserIcon className="w-6 h-6" />}
            title="My Groups"
            description="Manage your groups"
          />
          <QuickLinkCard
            href="/member/give"
            icon={<GiftIcon className="w-6 h-6" />}
            title="Give / Donate"
            description="Support the church"
          />
        </div>
      </div>
    </div>
  );
}

export default function MemberProfilePage() {
  return (
    <Suspense fallback={<Loading message="Loading your profile..." />}>
      <MemberProfileContent />
    </Suspense>
  );
}

// Helper Components
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-blue-500">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-sm font-semibold text-gray-600">{label}</p>
      </div>
      <p className="text-2xl font-bold text-blue-900">{value}</p>
    </div>
  );
}

function ActivityItem({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <p className="text-xs text-gray-500 whitespace-nowrap ml-4">{date}</p>
      </div>
    </div>
  );
}

function PreferenceToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg border border-blue-100 hover:border-blue-300 transition cursor-pointer">
        <div className="text-blue-500 mb-3">{icon}</div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
