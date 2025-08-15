'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';
import { ViewMode } from '../types/member.types';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

const viewModes = [
  {
    mode: 'card' as ViewMode,
    icon: Squares2X2Icon,
    label: 'Card View',
    description: 'Visual cards with member photos'
  },
  {
    mode: 'list' as ViewMode,
    icon: ListBulletIcon,
    label: 'List View',
    description: 'Compact list format'
  },
  {
    mode: 'table' as ViewMode,
    icon: TableCellsIcon,
    label: 'Table View',
    description: 'Detailed table with sorting'
  },
  {
    mode: 'grid' as ViewMode,
    icon: ViewColumnsIcon,
    label: 'Grid View',
    description: 'Dense grid layout'
  }
];

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = ""
}) => {
  return (
    <div className={`flex items-center bg-white rounded-xl shadow-lg p-1 ${className}`}>
      {viewModes.map((viewMode) => {
        const Icon = viewMode.icon;
        const isActive = currentMode === viewMode.mode;
        
        return (
          <motion.button
            key={viewMode.mode}
            onClick={() => onModeChange(viewMode.mode)}
            className={`relative p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={viewMode.label}
          >
            {/* Active Background */}
            {isActive && (
              <motion.div
                layoutId="activeViewMode"
                className="absolute inset-0 bg-blue-100 rounded-lg"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            
            {/* Icon */}
            <Icon className="w-5 h-5 relative z-10" />
          </motion.button>
        );
      })}
    </div>
  );
};

export default ViewModeToggle;
