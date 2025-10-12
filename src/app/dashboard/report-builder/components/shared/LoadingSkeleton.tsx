'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function FilterSkeleton() {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse">
        <div className="h-6 w-32 bg-gray-300 rounded"></div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SummarySkeleton() {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse">
        <div className="h-6 w-40 bg-gray-300 rounded"></div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <FilterSkeleton />
      <SummarySkeleton />
      <TableSkeleton />
    </div>
  );
}
