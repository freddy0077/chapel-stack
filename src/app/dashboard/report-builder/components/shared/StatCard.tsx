'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo' | 'red' | 'gray' | 'cyan' | 'rose' | 'emerald' | 'teal' | 'amber';
  icon?: React.ReactNode;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  pink: 'bg-pink-50 text-pink-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-gray-50 text-gray-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  rose: 'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
};

export default function StatCard({
  label,
  value,
  colorScheme = 'blue',
  icon,
}: StatCardProps) {
  const bgClass = colorClasses[colorScheme].split(' ')[0];
  const textClass = colorClasses[colorScheme].split(' ')[1];

  return (
    <div className={`p-4 ${bgClass} rounded-lg`}>
      {icon && (
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      )}
      {!icon && <p className="text-sm text-gray-600">{label}</p>}
      <p className={`text-2xl font-bold ${textClass}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
