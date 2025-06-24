"use client";

import Link from "next/link";
import { EllipsisVerticalIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import MessageModal from "./MessageModal";

type MemberProps = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  memberSince: string;
  index: number;
  branch?: string;
};

const colors = [
  "bg-pink-600",
  "bg-purple-600",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-teal-500"
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function MemberCard({ id, name, email, phone, status, memberSince, index, branch }: MemberProps) {
  const colorIndex = index % colors.length;
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`relative h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full ${colors[colorIndex]} text-white font-medium text-lg`}>
              {getInitials(name)}
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${
                status === 'Active' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">Member since {memberSince}</p>
            </div>
          </div>
          
          <Menu as="div" className="relative">
            <Menu.Button className="-m-2 p-2 rounded-full hover:bg-gray-100">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/dashboard/members/${id}`}
                      className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                    >
                      View profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/dashboard/members/${id}/edit`}
                      className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                    >
                      Edit details
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                    >
                      Send email
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${active ? 'bg-red-50' : ''} block px-4 py-2 text-sm text-red-700`}
                    >
                      Delete member
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        
        <div className="space-y-2">
          {email && (
            <div className="flex items-center text-sm">
              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <a href={`mailto:${email}`} className="text-gray-600 hover:text-indigo-600 truncate">{email}</a>
            </div>
          )}
          {phone && (
            <div className="flex items-center text-sm">
              <PhoneIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <a href={`tel:${phone}`} className="text-gray-600 hover:text-indigo-600">{phone}</a>
            </div>
          )}
          {branch && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-gray-600">{branch}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
          
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setIsMessageModalOpen(true)}
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Message
            </button>
            <Link
              href={`/dashboard/members/${id}`}
              className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              View
            </Link>
          </div>
        </div>
      </div>
      
      {/* Message Modal */}
      <MessageModal 
        isOpen={isMessageModalOpen} 
        onClose={() => setIsMessageModalOpen(false)}
        memberName={name}
        memberEmail={email || ''}
      />
    </div>
  );
}
