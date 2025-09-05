"use client";

import Image from "next/image";
import { Member, AttendanceEvent } from "../../../dashboard/attendance/types";
import {
  XMarkIcon,
  CalendarDaysIcon,
  FireIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface MemberInfoProps {
  member: Member;
  event: AttendanceEvent;
  onClose: () => void;
}

export default function MemberInfo({
  member,
  event,
  onClose,
}: MemberInfoProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 pb-6 px-4 sm:px-6 lg:px-8 z-20">
      <div className="bg-white rounded-t-xl shadow-lg border border-gray-200 overflow-hidden transform transition-transform duration-300 ease-in-out">
        <div className="relative p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500 text-xl font-medium">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </div>
              )}
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
            </div>

            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {member.firstName} {member.lastName}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <FireIcon className="h-4 w-4 text-orange-500 mr-1" />
                  <span>{member.attendanceStreak || 0} streak</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span>
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center text-green-800">
              <CalendarDaysIcon className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium">
                  Successfully checked in to:
                </p>
                <p className="text-base">{event.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              View Details
            </button>
            <button
              onClick={onClose}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
