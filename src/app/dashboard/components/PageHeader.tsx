"use client";

import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon && (
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-2 mr-4">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex-shrink-0 flex ml-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
