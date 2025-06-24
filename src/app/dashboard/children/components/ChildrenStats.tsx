"use client";

interface ChildrenStatsProps {
  totalChildren: number;
  checkedInToday: number;
  classrooms: number;
}

export default function ChildrenStats({ totalChildren, checkedInToday, classrooms }: ChildrenStatsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Total Children</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalChildren}</dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Checked In Today</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{checkedInToday}</dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Classrooms</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{classrooms}</dd>
      </div>
    </div>
  );
}
