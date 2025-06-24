import React from "react";
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, UsersIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface MemberSummaryCardProps {
  member: {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    avatar?: string;
    groups?: string[];
    family?: string;
    sacraments?: string[];
  };
}

const MemberSummaryCard: React.FC<MemberSummaryCardProps> = ({ member }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center gap-6 transition-shadow hover:shadow-2xl duration-200">
      <div className="flex flex-col items-center">
        {member.avatar ? (
          <div className="relative">
            <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow-md ring-4 ring-white" />
            <span className="absolute -bottom-2 right-2 bg-indigo-400 rounded-full w-5 h-5 border-2 border-white" />
          </div>
        ) : (
          <UserCircleIcon className="w-24 h-24 text-indigo-200" />
        )}
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">{member.name}</h2>
        <span className="text-gray-400 text-xs font-medium mt-0.5">Member ID: {member.id}</span>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-3 text-gray-700 text-base">
          <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700 text-base">
          <PhoneIcon className="h-5 w-5 text-indigo-400" />
          <span>{member.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700 text-base">
          <CalendarIcon className="h-5 w-5 text-indigo-400" />
          <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
        </div>
        {member.groups && member.groups.length > 0 && (
          <div className="flex items-center gap-3 text-gray-700 text-base">
            <UsersIcon className="h-5 w-5 text-indigo-400" />
            <span>Groups: {member.groups.join(", ")}</span>
          </div>
        )}
        {member.family && (
          <div className="flex items-center gap-3 text-gray-700 text-base">
            <UsersIcon className="h-5 w-5 text-indigo-400" />
            <span>Family: {member.family}</span>
          </div>
        )}
        {member.sacraments && member.sacraments.length > 0 && (
          <div className="flex items-center gap-3 text-gray-700 text-base">
            <SparklesIcon className="h-5 w-5 text-indigo-400" />
            <span>Sacraments: {member.sacraments.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSummaryCard;
