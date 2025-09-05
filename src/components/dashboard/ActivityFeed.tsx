import React from "react";

const activities = [
  { type: "member", desc: "New member joined: Sarah Mensah", time: "2m ago" },
  {
    type: "contribution",
    desc: "₵500 received from John Doe",
    time: "10m ago",
  },
  { type: "event", desc: "Event created: Youth Retreat", time: "1h ago" },
];

const approvals = [
  { desc: "Pending staff approval: James Owusu", time: "5m ago" },
  { desc: "Pending event approval: Women's Conference", time: "20m ago" },
];

export const ActivityFeed = () => (
  <div className="bg-white/80 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-7 border border-white/40 dark:border-black/40 flex flex-col gap-6 min-h-[220px]">
    <div>
      <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-lg">
        Recent Activity
      </div>
      <ul className="space-y-2">
        {activities.map((a, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
          >
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            <span>{a.desc}</span>
            <span className="text-xs text-gray-400 ml-auto">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
    <div>
      <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-lg">
        Pending Approvals
      </div>
      <ul className="space-y-2">
        {approvals.map((a, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
            <span>{a.desc}</span>
            <span className="text-xs text-gray-400 ml-auto">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ActivityFeed;
