"use client";

export default function LoadingState() {
  return (
    <div className="mt-6 flex justify-center py-8">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600"></div>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-500 delay-75"></div>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-400 delay-150"></div>
        </div>
        <p className="mt-3 text-sm text-gray-500">Loading members...</p>
      </div>
    </div>
  );
}
