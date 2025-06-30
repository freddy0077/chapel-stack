"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/authContext";
import Loading from "@/components/ui/Loading";
import { ExclamationTriangleIcon, CalendarIcon, UserGroupIcon, GiftIcon, ArrowRightIcon, UserIcon, ChatBubbleBottomCenterTextIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

// --- Member Dashboard Refactor ---
export default function MemberDashboard() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Placeholder data (replace with real hooks/queries)
  const memberName = user?.firstName || "Member";
  const profilePic = user?.profilePictureUrl || "/profile-placeholder.png";
  const membershipStatus = user?.member?.status || "Active";
  const attendanceStreak = 7;
  const upcomingEvents = [
    { id: 1, title: "Sunday Service", date: "2025-07-06", location: "Main Auditorium" },
    { id: 2, title: "Youth Fellowship", date: "2025-07-10", location: "Youth Hall" },
  ];
  const myGroups = [
    { id: 1, name: "Choir", nextMeeting: "2025-07-07" },
    { id: 2, name: "Bible Study", nextMeeting: "2025-07-08" },
  ];
  const announcements = [
    { id: 1, title: "Church Picnic This Saturday!", date: "2025-07-01" },
    { id: 2, title: "New Bible Study Series", date: "2025-06-28" },
  ];
  const quickLinks = [
    { title: "Give / Donate", icon: GiftIcon, href: "/dashboard/finances/give" },
    { title: "Prayer Request", icon: ChatBubbleBottomCenterTextIcon, href: "/dashboard/prayer-requests" },
    { title: "Update Profile", icon: Cog6ToothIcon, href: "/dashboard/members/profile" },
    { title: "Contact Admin", icon: UserIcon, href: "/dashboard/branch/contact" },
  ];

  if (!user) {
    return <Loading message="Loading your dashboard..." />;
  }
  if (!user.member) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
        <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400" />
        <h2 className="mt-4 text-2xl font-semibold text-yellow-700">Member Profile Not Found</h2>
        <p className="text-yellow-600">We couldn't find a member profile linked to your account.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 px-2 py-8">
      {/* Welcome & Profile */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow">
          <Image src={profilePic} alt="Profile" fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">Welcome, {memberName}!</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{membershipStatus}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Attendance Streak: {attendanceStreak} weeks</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<CalendarIcon className="w-7 h-7 text-blue-500" />} label="Upcoming Events" value={upcomingEvents.length} />
        <StatCard icon={<UserGroupIcon className="w-7 h-7 text-emerald-500" />} label="My Groups" value={myGroups.length} />
        <StatCard icon={<GiftIcon className="w-7 h-7 text-yellow-500" />} label="Giving" value={"GHS 0"} />
        <StatCard icon={<ArrowRightIcon className="w-7 h-7 text-gray-400" />} label="Recent Sacraments" value={"-"} />
      </div>

      {/* Upcoming Events */}
      <SectionCard title="Upcoming Events" icon={<CalendarIcon className="w-5 h-5 text-blue-400" />}>
        <ul className="divide-y divide-blue-100">
          {upcomingEvents.map((event) => (
            <li key={event.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{event.title}</div>
                <div className="text-xs text-gray-500">{event.date} &bull; {event.location}</div>
              </div>
              <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold text-xs hover:bg-blue-200 transition">View</button>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* My Groups */}
      <SectionCard title="My Groups & Ministries" icon={<UserGroupIcon className="w-5 h-5 text-emerald-400" />}>
        <ul className="divide-y divide-emerald-100">
          {myGroups.map((group) => (
            <li key={group.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{group.name}</div>
                <div className="text-xs text-gray-500">Next meeting: {group.nextMeeting}</div>
              </div>
              <button className="px-3 py-1 rounded bg-emerald-100 text-emerald-700 font-semibold text-xs hover:bg-emerald-200 transition">Details</button>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Announcements & Notifications */}
      <SectionCard title="Announcements" icon={<ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />}>
        <ul className="divide-y divide-yellow-100">
          {announcements.map((a) => (
            <li key={a.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{a.title}</div>
                <div className="text-xs text-gray-500">{a.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Quick Links */}
      <SectionCard title="Quick Links" icon={<ArrowRightIcon className="w-5 h-5 text-gray-400" />}>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link) => (
            <a key={link.title} href={link.href} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:bg-blue-50 border border-blue-100 transition">
              <link.icon className="w-5 h-5" />
              <span className="font-medium text-blue-800">{link.title}</span>
            </a>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// --- Stat Card ---
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-start gap-2 border border-blue-100 hover:shadow-xl transition group cursor-pointer relative overflow-hidden">
      <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-50 mb-1 shadow group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="text-2xl font-extrabold text-blue-800 drop-shadow-sm">{value}</div>
      <div className="text-base text-gray-600 font-medium">{label}</div>
    </div>
  );
}

// --- Section Card ---
function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-bold text-blue-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}
