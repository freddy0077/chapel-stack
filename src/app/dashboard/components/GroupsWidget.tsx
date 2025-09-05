"use client";

import { MyGroupsWidget as GroupsWidgetType } from "@/hooks/useDashboardData";
import Link from "next/link";
import Image from "next/image";

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  imageUrl?: string;
  type?: string;
  memberCount?: number;
  members?: GroupMember[];
  nextMeeting?: string | Date;
}

interface GroupsWidgetProps {
  widget: GroupsWidgetType;
}

export default function GroupsWidget({ widget }: GroupsWidgetProps) {
  if (!widget || !widget.groups || widget.groups.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          {widget.title || "Groups"}
        </h3>
      </div>
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {widget.groups.map((group: Group) => (
            <li key={group.id} className="py-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {group.imageUrl ? (
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src={group.imageUrl}
                      alt={group.name}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-sm">
                        {group.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/groups/${group.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {group.name}
                  </Link>
                  <div className="flex items-center mt-1">
                    <div className="flex -space-x-1 overflow-hidden">
                      {group.members &&
                        group.members
                          .slice(0, 3)
                          .map((member: GroupMember, i: number) => (
                            <div
                              key={i}
                              className="h-5 w-5 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs overflow-hidden"
                            >
                              {member.avatar ? (
                                <Image
                                  src={member.avatar || ""}
                                  alt={member.name}
                                  className="h-full w-full object-cover"
                                  width={20}
                                  height={20}
                                />
                              ) : (
                                <span>
                                  {member.name.substring(0, 1).toUpperCase()}
                                </span>
                              )}
                            </div>
                          ))}
                      {group.memberCount && group.memberCount > 3 && (
                        <div className="h-5 w-5 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-600">
                            +{group.memberCount - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="ml-1.5 text-xs text-gray-500">
                      {group.memberCount || 0} member
                      {(group.memberCount || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {group.type && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {group.type}
                    </span>
                  )}
                </div>
              </div>
              {group.nextMeeting && (
                <div className="mt-2 ml-13 text-xs text-gray-500">
                  Next meeting:{" "}
                  {new Date(group.nextMeeting).toLocaleDateString()} at{" "}
                  {new Date(group.nextMeeting).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4 text-center">
          <Link
            href="/groups"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all groups
            <svg
              className="ml-1 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
