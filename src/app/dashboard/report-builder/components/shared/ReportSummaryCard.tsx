'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ReportSummaryCardProps {
  title: string;
  colorScheme?: string;
  onExport: (format: 'PDF' | 'EXCEL' | 'CSV') => void;
  children: React.ReactNode;
}

export default function ReportSummaryCard({
  title,
  colorScheme = 'from-green-50 to-emerald-50',
  onExport,
  children,
}: ReportSummaryCardProps) {
  return (
    <Card>
      <CardHeader className={`bg-gradient-to-r ${colorScheme}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="h-6 w-6 text-green-600" />
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('PDF')}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('EXCEL')}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Excel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('CSV')}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
