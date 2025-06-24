"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  PencilSquareIcon,
  TrashIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

export type ModernMemberCardProps = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  status: string; // e.g., "Active", "Inactive"
  memberSince?: string;
  branch?: string;
  profileImage?: string | null;
  role?: string;
};

const getStatusPresentation = (
  status: string
): {
  badgeColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
  badgeBg: string;
} => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        badgeColor: "text-green-700",
        textColor: "text-green-700",
        borderColor: "border-green-500",
        dotColor: "bg-green-500",
        badgeBg: "bg-green-100",
      };
    case "pending":
      return {
        badgeColor: "text-amber-700",
        textColor: "text-amber-700",
        borderColor: "border-amber-400",
        dotColor: "bg-amber-400",
        badgeBg: "bg-amber-100",
      };
    case "visitor":
    case "first time visitor":
    case "returning visitor":
      return {
        badgeColor: "text-sky-700",
        textColor: "text-sky-700",
        borderColor: "border-sky-400",
        dotColor: "bg-sky-400",
        badgeBg: "bg-sky-100",
      };
    case "inactive":
    case "transferred out":
    case "excommunicated":
      return {
        badgeColor: "text-gray-500",
        textColor: "text-gray-500",
        borderColor: "border-gray-300",
        dotColor: "bg-gray-400",
        badgeBg: "bg-gray-100",
      };
    case "deceased":
    case "prospective":
    default:
      return {
        badgeColor: "text-gray-700",
        textColor: "text-gray-700",
        borderColor: "border-gray-300",
        dotColor: "bg-gray-400",
        badgeBg: "bg-gray-100",
      };
  }
};

const getInitials = (name: string): string => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function ModernMemberCard({
  id,
  name,
  email,
  phone,
  status,
  memberSince,
  branch,
  profileImage,
  role = "Member",
}: ModernMemberCardProps) {
  const { badgeColor, borderColor, dotColor, badgeBg } = getStatusPresentation(status);

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-l-4 ${borderColor} min-h-[320px] overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-400`}
    >
      <div className="p-6 flex flex-col flex-grow">
        {/* Profile Section */}
        <div className="flex items-center mb-6 gap-5">
          <div className="relative flex-shrink-0">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={name}
                width={72}
                height={72}
                className="rounded-full object-cover h-18 w-18 ring-2 ring-gray-100"
              />
            ) : (
              <div
                className="h-18 w-18 rounded-full flex items-center justify-center bg-gray-50 text-gray-600 text-2xl font-semibold ring-2 ring-gray-100"
              >
                {getInitials(name)}
              </div>
            )}
            {/* Status Dot */}
            <span
              className={`absolute -bottom-1 -right-1 block h-5 w-5 rounded-full ${dotColor} ring-2 ring-white`}
            >
              <span className="sr-only">{status}</span>
            </span>
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-lg font-bold text-gray-900 truncate"
                title={name}
              >
                {name}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor} ${badgeBg} border border-opacity-0 ml-1`}>{status}</span>
            </div>
            {role && (
              <div className="text-xs text-gray-400 font-medium mb-1 truncate">{role}</div>
            )}
          </div>
          {/* Actions Menu */}
          <Menu as="div" className="relative ml-2 flex-shrink-0">
            <Menu.Button className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2">
              <span className="sr-only">Open options</span>
              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/dashboard/members/${id}`}
                      className={`group flex w-full items-center rounded-md px-3 py-2 text-sm text-white ${
                        active
                          ? "bg-indigo-500"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      }`}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-indigo-100" />
                      View Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/dashboard/members/${id}/edit`}
                      className={`group flex w-full items-center rounded-md px-3 py-2 text-sm ${
                        active
                          ? "bg-gray-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <PencilSquareIcon className="mr-3 h-5 w-5 text-blue-400 group-hover:text-blue-600" />
                      Edit Member
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsMessageModalOpen(true)}
                      className={`group flex w-full items-center rounded-md px-3 py-2 text-sm ${
                        active
                          ? "bg-gray-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChatBubbleLeftEllipsisIcon className="mr-3 h-5 w-5 text-blue-400 group-hover:text-blue-600" />
                      Send Message
                    </button>
                  )}
                </Menu.Item>
                <div className="my-1 h-px bg-gray-100" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`group flex w-full items-center rounded-md px-3 py-2 text-sm ${
                        active
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <TrashIcon
                        className={`mr-3 h-5 w-5 ${
                          active
                            ? "text-red-500"
                            : "text-gray-400 group-hover:text-red-500"
                        }`}
                      />
                      Delete Member
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Details Section */}
        <div className="space-y-3 text-[15px] mt-auto pt-5 border-t border-gray-50">
          {email && (
            <div className="flex items-center text-gray-500">
              <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-300 flex-shrink-0" />
              <a
                href={`mailto:${email}`}
                className="text-blue-600 hover:text-blue-700 hover:underline truncate"
                title={email}
              >
                {email}
              </a>
            </div>
          )}
          {phone && (
            <div className="flex items-center text-gray-500">
              <PhoneIcon className="h-4 w-4 mr-2 text-gray-300 flex-shrink-0" />
              <a
                href={`tel:${phone}`}
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {phone}
              </a>
            </div>
          )}
          {memberSince && (
            <div className="flex items-center text-gray-500">
              <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-300 flex-shrink-0" />
              <span>Joined: {memberSince}</span>
            </div>
          )}
          {branch && (
            <div className="flex items-center text-gray-500">
              <BuildingStorefrontIcon className="h-4 w-4 mr-2 text-gray-300 flex-shrink-0" />
              <span className="truncate" title={branch}>
                {branch}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
