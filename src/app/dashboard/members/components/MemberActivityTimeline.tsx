import React from "react";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftEllipsisIcon,
  SparklesIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

interface Activity {
  type: string;
  date: string;
  summary: string;
  details: string;
  icon: string;
}

interface MemberActivityTimelineProps {
  activities: Activity[];
}

const iconMap: Record<string, React.ReactNode> = {
  CalendarIcon: <CalendarIcon className="h-6 w-6 text-blue-500" />,
  CurrencyDollarIcon: <CurrencyDollarIcon className="h-6 w-6 text-green-500" />,
  ChatBubbleLeftEllipsisIcon: <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-indigo-500" />,
  SparklesIcon: <SparklesIcon className="h-6 w-6 text-purple-500" />,
  EnvelopeIcon: <EnvelopeIcon className="h-6 w-6 text-pink-500" />,
};

const MemberActivityTimeline: React.FC<MemberActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Activity Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-indigo-100" />
        <ul className="space-y-8">
          {activities.map((activity, idx) => (
            <li key={idx} className="relative flex items-start gap-4">
              {/* Icon node */}
              <div className="z-10">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-indigo-200 shadow-sm">
                  {iconMap[activity.icon]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-700 text-base">{activity.type}</span>
                  <span className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-800 text-sm mt-1 font-medium">{activity.summary}</div>
                <div className="text-gray-500 text-xs mt-0.5">{activity.details}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MemberActivityTimeline;
