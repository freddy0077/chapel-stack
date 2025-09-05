import React from "react";
import { SpeakerWaveIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface AnnouncementInfo {
  id: string;
  title: string;
  startDate: string;
}

interface BranchAnnouncementsDto {
  announcements: AnnouncementInfo[];
}

interface BranchAnnouncementsProps {
  branchAnnouncements: BranchAnnouncementsDto;
}

export function BranchAnnouncements({
  branchAnnouncements,
}: BranchAnnouncementsProps) {
  const { announcements } = branchAnnouncements;

  if (!announcements || announcements.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
            <SpeakerWaveIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Branch Announcements
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center text-gray-500">
            <SpeakerWaveIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No announcements at this time</p>
            <p className="text-sm mt-2">
              Check back later for important updates and news.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
          <SpeakerWaveIcon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Branch Announcements
        </h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {announcements.length} active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <SpeakerWaveIcon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {announcement.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {new Date(announcement.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
