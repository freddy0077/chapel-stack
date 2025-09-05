"use client";

interface WorshipStatsProps {
  upcomingServices: number;
  songsInLibrary: number;
  teamMembers: number;
  completedServices: number;
}

export default function WorshipStats({
  upcomingServices,
  songsInLibrary,
  teamMembers,
  completedServices,
}: WorshipStatsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Upcoming Services
        </dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {upcomingServices}
        </dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Songs in Library
        </dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {songsInLibrary}
        </dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Team Members
        </dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {teamMembers}
        </dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Completed Services
        </dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {completedServices}
        </dd>
      </div>
    </div>
  );
}
