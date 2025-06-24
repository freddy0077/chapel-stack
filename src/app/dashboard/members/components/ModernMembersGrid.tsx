"use client";

import ModernMemberCard from "./ModernMemberCard";
import type { ModernMemberCardProps as Member } from './ModernMemberCard'; // Use the prop type from card

// Skeleton Card for loading state
const SkeletonCard = () => (
  <div className="flex flex-col bg-white rounded-lg shadow-lg border-l-4 border-gray-200 overflow-hidden min-h-[320px] animate-pulse">
    <div className="p-5 flex-grow flex flex-col">
      <div className="flex items-center mb-4">
        <div className="h-16 w-16 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>
        <div className="flex-grow space-y-2">
          <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-6 w-1/3 bg-gray-300 rounded-md"></div>
        </div>
        <div className="h-6 w-6 bg-gray-300 rounded-full ml-2"></div>
      </div>
      <div className="space-y-3 text-sm mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);


type ModernMembersGridProps = {
  members: Member[];
  isLoading?: boolean;
};

export default function ModernMembersGrid({ members, isLoading = false }: ModernMembersGridProps) {
  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
      </div>
    );
  }

  if (!members || members.length === 0) {
    // Optional: Add an empty state message if needed, or let parent handle it.
    // return <div className="mt-8 text-center text-gray-500">No members found.</div>;
    return null; // Or return an empty state component
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member) => (
        <ModernMemberCard key={member.id} {...member} />
      ))}
    </div>
  );
}
