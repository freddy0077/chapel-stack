'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface ReportFilterPanelProps {
  title?: string;
  colorScheme?: string;
  onReset: () => void;
  children: React.ReactNode;
}

export default function ReportFilterPanel({
  title = 'Report Filters',
  colorScheme = 'from-blue-50 to-indigo-50',
  onReset,
  children,
}: ReportFilterPanelProps) {
  return (
    <Card>
      <CardHeader className={`bg-gradient-to-r ${colorScheme}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-6 w-6 text-blue-600" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
