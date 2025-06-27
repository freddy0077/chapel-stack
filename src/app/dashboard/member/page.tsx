'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '@/lib/auth/authContext';
import { useMemberDashboard } from '@/graphql/hooks/useMemberDashboard';
import Loading from '@/components/ui/Loading';
import { Card, Metric, Text, Icon, Flex, Grid, Title, Badge, Button } from '@tremor/react';
import {
  UserIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CakeIcon,
  GiftIcon,
  ArrowRightIcon,
  PencilIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const { dashboardData, loading, error } = useMemberDashboard(user?.member?.id);

  if (loading || !user) {
    return <Loading message="Loading your dashboard..." />;
  }

  if (!user.member) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
        <Icon icon={ExclamationTriangleIcon} size="lg" color="yellow" />
        <Title className="mt-4 text-yellow-700">Member Profile Not Found</Title>
        <Text className="text-yellow-600">
          We couldn't find a member profile linked to your account.
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <Icon icon={ExclamationTriangleIcon} size="lg" color="red" />
        <Title className="mt-4 text-red-700">Something went wrong</Title>
        <Text className="text-red-600">We couldn't load your dashboard. Please try again later.</Text>
        <Text className="mt-2 text-xs text-red-500">{error.message}</Text>
      </div>
    );
  }

  if (!dashboardData) {
    return <Loading message="Preparing your dashboard..." />;
  }

  // Modal open handlers
  function openEventModal(event) {
    setModalContent(
      <div>
        <Title className="mb-2">{event.name}</Title>
        <Text className="mb-1 text-gray-500">{new Date(event.date).toLocaleString()} &bull; {event.location}</Text>
        <Text className="mb-4">{event.description || 'No description available.'}</Text>
        <Button variant="primary" className="w-full">RSVP</Button>
      </div>
    );
    setModalOpen(true);
  }
  function openGroupModal(group) {
    setModalContent(
      <div>
        <Title className="mb-2">{group.name}</Title>
        <Badge color="fuchsia" className="mb-3">Role: {group.role}</Badge>
        <Text className="mb-4">{group.description || 'No description available.'}</Text>
        <Button variant="primary" className="w-full">Go to Group Page</Button>
      </div>
    );
    setModalOpen(true);
  }
  function openEditInfoModal() {
    setModalContent(
      <div>
        <Title className="mb-2">Edit Personal Info</Title>
        <Text className="mb-4">(This is a placeholder for a future editable form.)</Text>
        <Button variant="primary" className="w-full">Save Changes</Button>
      </div>
    );
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setModalContent(null);
  }

  return (
    <div className="bg-gradient-to-tr from-indigo-100 via-white to-blue-100 min-h-screen py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Profile Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl mb-2 bg-gradient-to-br from-indigo-600/80 to-blue-400/80 flex flex-col md:flex-row items-center md:items-end gap-6 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-blue-500/60 to-blue-300/40 opacity-80 blur-[2px]" aria-hidden="true" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 w-full">
            <Image
              src={dashboardData.profileImageUrl || '/images/avatars/avatar-1.png'}
              alt={`${user.member.firstName}'s profile picture`}
              width={110}
              height={110}
              className="rounded-full object-cover ring-4 ring-white/70 shadow-lg"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">Welcome, {user.member.firstName}!</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge color="teal" icon={UserIcon} className="text-base px-4 py-1.5 bg-white/20 text-white/90 font-semibold shadow">{dashboardData.membershipStatus}</Badge>
                <span className="text-white/80 font-medium">Member since {new Date(dashboardData.membershipDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <GlassStatCard title="Groups Joined" value={dashboardData.stats.groups} icon={UserGroupIcon} color="from-fuchsia-400 to-violet-500" />
          <GlassStatCard title="Attendance Rate" value={`${dashboardData.stats.attendance.toFixed(0)}%`} icon={CalendarIcon} color="from-blue-400 to-cyan-500" />
          <GlassStatCard title="Total Giving (YTD)" value={dashboardData.stats.giving} icon={CurrencyDollarIcon} color="from-emerald-400 to-teal-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2">
          {/* Main Content */}
          <main className="lg:col-span-2 space-y-10">
            {/* Upcoming Events */}
            <GlassSectionCard title="Upcoming Events" icon={CalendarIcon}>
              <div className="space-y-4">
                {dashboardData.upcomingEvents.length > 0 ? dashboardData.upcomingEvents.map(event => (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 backdrop-blur rounded-xl p-4 shadow hover:shadow-lg transition group">
                    <div>
                      <Text className="font-semibold text-gray-800 group-hover:text-indigo-700 transition">{event.name}</Text>
                      <Text className="text-gray-500 text-sm">{new Date(event.date).toLocaleString()} <span className="mx-1">•</span> {event.location}</Text>
                    </div>
                    <Button variant="light" icon={ArrowRightIcon} iconPosition="right" className="mt-2 sm:mt-0" onClick={() => openEventModal(event)}>Details</Button>
                  </div>
                )) : <Text>No upcoming events.</Text>}
              </div>
            </GlassSectionCard>

            {/* My Groups */}
            <GlassSectionCard title="My Groups" icon={UserGroupIcon}>
              <div className="space-y-4">
                {dashboardData.groups.length > 0 ? dashboardData.groups.map(group => (
                  <div key={group.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 backdrop-blur rounded-xl p-4 shadow hover:shadow-lg transition group">
                    <div>
                      <Text className="font-semibold text-gray-800 group-hover:text-fuchsia-700 transition">{group.name}</Text>
                      <Text className="text-gray-500 text-sm">Your Role: {group.role}</Text>
                    </div>
                    <Button variant="light" icon={ArrowRightIcon} iconPosition="right" className="mt-2 sm:mt-0" onClick={() => openGroupModal(group)}>View Group</Button>
                  </div>
                )) : <Text>You are not in any groups yet.</Text>}
              </div>
            </GlassSectionCard>
          </main>

          {/* Sidebar */}
          <aside className="space-y-10">
            {/* Personal Information */}
            <GlassSectionCard title="My Info" icon={UserIcon} action={<Button variant="light" icon={PencilIcon} size="xs" onClick={openEditInfoModal}>Edit</Button>}> 
              <div className="space-y-3">
                <InfoItem icon={UserIcon} label="Email" value={user.email} />
                {/* Phone and Birthday removed as they are not in the dashboard data yet */}
              </div>
            </GlassSectionCard>

            {/* Spiritual Milestones */}
            <GlassSectionCard title="Spiritual Milestones" icon={GiftIcon}>
              <div className="space-y-3">
                {dashboardData.milestones.baptismDate ? (
                  <InfoItem icon={GiftIcon} label="Baptism Date" value={new Date(dashboardData.milestones.baptismDate).toLocaleDateString()} />
                ) : <Text>No baptism date recorded.</Text>}
                {dashboardData.milestones.confirmationDate ? (
                  <InfoItem icon={GiftIcon} label="Confirmation Date" value={new Date(dashboardData.milestones.confirmationDate).toLocaleDateString()} />
                ) : <Text>No confirmation date recorded.</Text>}
              </div>
            </GlassSectionCard>
          </aside>
        </div>
      </div>

      {/* Modal */}
      <MemberModal open={modalOpen} onClose={closeModal}>
        {modalContent}
      </MemberModal>
    </div>
  );
}

// Glassmorphism Stat Card
const GlassStatCard = ({ title, value, icon, color }) => (
  <div className={`rounded-2xl shadow-xl bg-gradient-to-br ${color} bg-opacity-60 backdrop-blur-lg p-6 flex items-center space-x-5 hover:scale-[1.03] transition-transform`}> 
    <div className="flex-shrink-0">
      <Icon icon={icon} variant="light" size="xl" color="white" className="drop-shadow" />
    </div>
    <div>
      <Text className="text-lg font-semibold text-white/90 mb-1">{title}</Text>
      <Metric className="text-3xl text-white font-extrabold">{value}</Metric>
    </div>
  </div>
);

// Glass Section Card
const GlassSectionCard = ({ title, icon, action, children }) => (
  <section className="rounded-3xl bg-white/70 backdrop-blur-lg shadow-xl p-6">
    <Flex alignItems="center" justifyContent="between" className="mb-4">
      <div className="flex items-center gap-3">
        <Icon icon={icon} variant="light" size="lg" color="indigo" />
        <Title className="text-xl font-bold text-indigo-900">{title}</Title>
      </div>
      {action && <div>{action}</div>}
    </Flex>
    {children}
  </section>
);

const InfoItem = ({ icon, label, value }) => (
  <Flex justifyContent="start" className="space-x-4">
    <Icon icon={icon} variant="light" size="md" color="gray" />
    <div>
      <Text className="text-gray-500 font-medium">{label}</Text>
      <Text className="font-semibold text-gray-900">{value}</Text>
    </div>
  </Flex>
);

// Modern glassmorphism modal
function MemberModal({ open, onClose, children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-lg shadow-2xl p-8 ring-1 ring-indigo-200">
              <button
                className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-indigo-100 text-indigo-600 shadow"
                onClick={onClose}
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="mt-2">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
