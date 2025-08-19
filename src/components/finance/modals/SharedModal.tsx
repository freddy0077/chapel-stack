"use client";

import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface SharedModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function SharedModal({ 
  open, 
  title, 
  onClose, 
  children, 
  maxWidth = '2xl' 
}: SharedModalProps) {
  if (!open) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className={`bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full ${maxWidthClasses[maxWidth]} mx-2 p-0 relative animate-fadeIn`}>
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100 rounded-t-2xl bg-gradient-to-br from-indigo-50 to-white">
          <h3 className="text-lg font-bold text-indigo-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-indigo-500 transition"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
