import React from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

interface PrayerRequest {
  id?: string;
  requestText?: string;
  status?: string;
  createdAt?: string;
  assignedPastorId?: string;
  [key: string]: any;
}

interface Member {
  prayerRequests: PrayerRequest[];
}

export default function MemberPrayerRequestsTab({ member }: { member: Member }) {
  const prayerRequests: PrayerRequest[] = member?.prayerRequests || [];

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h4 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
        <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-indigo-400" /> Prayer Requests
      </h4>
      {prayerRequests.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {prayerRequests.map((prayer, i) => (
            <li key={prayer.id || i} className="py-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-gray-800">{prayer.requestText || <span className="text-gray-400">No text</span>}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${prayer.status === 'ANSWERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{prayer.status || 'Open'}</span>
                <span className="text-xs text-gray-400">{prayer.createdAt ? new Date(prayer.createdAt).toLocaleDateString() : ''}</span>
              </div>
              {prayer.assignedPastorId && (
                <div className="text-xs text-gray-500 mb-1">Assigned Pastor: {prayer.assignedPastorId}</div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400 py-8 text-center">No prayer requests found.</div>
      )}
    </div>
  );
}
