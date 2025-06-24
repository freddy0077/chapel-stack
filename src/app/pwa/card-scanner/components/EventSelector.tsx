"use client";

import { useState } from "react";
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UsersIcon 
} from "@heroicons/react/24/outline";
import { AttendanceEvent } from "../../../dashboard/attendance/types";

interface EventSelectorProps {
  events: AttendanceEvent[];
  onSelectEvent: (event: AttendanceEvent) => void;
}

export default function EventSelector({ events, onSelectEvent }: EventSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "service":
        return "bg-blue-100 text-blue-800";
      case "meeting":
        return "bg-green-100 text-green-800";
      case "special":
        return "bg-purple-100 text-purple-800";
      case "class":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "service":
        return <UsersIcon className="h-5 w-5 text-blue-600" />;
      case "meeting":
        return <UsersIcon className="h-5 w-5 text-green-600" />;
      case "special":
        return <CalendarIcon className="h-5 w-5 text-purple-600" />;
      case "class":
        return <UsersIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Event to Scan Attendance</h2>
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            placeholder="Search events..."
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="w-full text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{event.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{event.locationId}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>Expected: {event.expectedAttendees || "Unknown"}</span>
                  </div>
                  <div className="text-sm text-indigo-600 font-medium">Tap to select</div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-base font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {events.length === 0 
                ? "There are no active events at this time" 
                : "Try adjusting your search term"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
