import React from 'react';
import { Label } from '@/components/ui/label';

interface ModernFilterSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  children: React.ReactNode;
}

export default function ModernFilterSection({
  icon,
  title,
  description,
  gradient,
  children,
}: ModernFilterSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg`}>
          {icon}
        </div>
        <div>
          <Label className="text-base font-semibold text-gray-900">
            {title}
          </Label>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
