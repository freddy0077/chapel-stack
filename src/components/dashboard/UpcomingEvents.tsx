import React from "react";

interface EventInfo {
  id: string;
  title: string;
  startDate: string;
}

interface UpcomingEventsProps {
  events?: EventInfo[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const defaultEvents: EventInfo[] = [
    { id: "1", title: "Sample Event", startDate: "2025-08-10T23:10:33.625Z" },
  ];

  const displayEvents = events ?? defaultEvents;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <h2 className="font-semibold text-xl mb-6 text-blue-800">Upcoming Events</h2>
      <ul className="space-y-2">
        {displayEvents.map(e => (
          <li key={e.id} className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2">
            <span className="font-semibold text-blue-900">{e.title}</span>
            <span className="text-xs text-gray-400">{new Date(e.startDate).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
