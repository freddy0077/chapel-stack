"use client";

interface CommunicationStatsProps {
  totalMessages: number;
  totalAnnouncements: number;
  prayerRequests: number;
  deliveryRate: number;
}

export default function CommunicationStats({ 
  totalMessages, 
  totalAnnouncements, 
  prayerRequests, 
  deliveryRate 
}: CommunicationStatsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Messages Sent</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalMessages}</dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Announcements</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalAnnouncements}</dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Prayer Requests</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{prayerRequests}</dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Delivery Rate</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{deliveryRate}%</dd>
      </div>
    </div>
  );
}
