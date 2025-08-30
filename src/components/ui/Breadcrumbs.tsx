import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
}

/**
 * Breadcrumb navigation component for page context
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  separator,
  showHome = true,
}) => {
  const allItems = showHome 
    ? [{ label: 'Dashboard', href: '/dashboard', icon: HomeIcon }, ...items]
    : items;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const Icon = item.icon;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">
                  {separator || <ChevronRightIcon className="h-4 w-4" />}
                </span>
              )}
              
              <div className="flex items-center">
                {Icon && (
                  <Icon className={`h-4 w-4 mr-1 ${
                    isLast || item.current 
                      ? 'text-indigo-600' 
                      : 'text-gray-400'
                  }`} />
                )}
                
                {item.href && !isLast && !item.current ? (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={`text-sm font-medium ${
                    isLast || item.current
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * Sacrament-specific breadcrumb component
 */
export const SacramentBreadcrumbs: React.FC<{
  currentPage?: string;
  sacramentType?: string;
  recordId?: string;
}> = ({ currentPage = 'Records', sacramentType, recordId }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Sacraments', href: '/dashboard/sacraments' },
  ];

  if (sacramentType) {
    items.push({
      label: sacramentType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      href: `/dashboard/sacraments?type=${sacramentType.toLowerCase()}`,
    });
  }

  if (recordId) {
    items.push({
      label: `Record ${recordId.slice(0, 8)}...`,
      current: true,
    });
  } else {
    items.push({
      label: currentPage,
      current: true,
    });
  }

  return <Breadcrumbs items={items} />;
};

export default Breadcrumbs;
