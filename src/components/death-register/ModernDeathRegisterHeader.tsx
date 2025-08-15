'use client';

import React from 'react';
import { 
  PlusIcon, 
  UserMinusIcon, 
  HeartIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface ModernDeathRegisterHeaderProps {
  onAddRecord: () => void;
  totalRecords?: number;
  thisYearRecords?: number;
}

export const ModernDeathRegisterHeader: React.FC<ModernDeathRegisterHeaderProps> = ({
  onAddRecord,
  totalRecords = 0,
  thisYearRecords = 0,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient and patterns */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-2xl shadow-2xl">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        {/* Content */}
        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side - Title and description */}
            <div className="flex items-center space-x-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                    <HeartIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                    <UserMinusIcon className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Title and description */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Death Register
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  Compassionately manage and honor the memory of departed members with dignity and care
                </p>
                
                {/* Quick stats */}
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2 text-white/80">
                    <DocumentTextIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{totalRecords} Total Records</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{thisYearRecords} This Year</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick actions */}
              <div className="hidden lg:flex items-center space-x-3">
                <button className="group flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 text-white transition-all duration-200 hover:scale-105">
                  <ChartBarIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
                
                <button className="group flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 text-white transition-all duration-200 hover:scale-105">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Memorial Calendar</span>
                </button>
              </div>

              {/* Primary action button */}
              <button
                onClick={onAddRecord}
                className="group relative overflow-hidden bg-gradient-to-r from-white to-slate-100 hover:from-slate-50 hover:to-white text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <PlusIcon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Add Death Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
