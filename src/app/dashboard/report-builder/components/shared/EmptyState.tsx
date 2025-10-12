'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No Data Available',
  message = 'Apply filters and generate a report to see results',
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-16">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            {icon || <ChartBarIcon className="h-full w-full" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
