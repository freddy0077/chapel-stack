"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem as NavigationItemType } from "@/config/navigation.config";
import { isNavigationItemActive } from "@/utils/navigation.utils";

interface NavigationItemProps {
  item: NavigationItemType;
  isMobile?: boolean;
  onClick?: () => void;
}

export function NavigationItem({
  item,
  isMobile = false,
  onClick,
}: NavigationItemProps) {
  const pathname = usePathname();
  const isActive = isNavigationItemActive(item, pathname);

  const baseClasses = isMobile
    ? "group flex items-center px-2 py-2 text-base font-medium rounded-md"
    : "group flex items-center px-2 py-2 text-sm font-medium rounded-md";

  const activeClasses = isActive
    ? "bg-indigo-100 text-indigo-900"
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  const iconClasses = isActive
    ? "text-indigo-500"
    : "text-gray-400 group-hover:text-gray-500";

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      <item.icon
        className={`${iconClasses} ${isMobile ? "mr-4 h-6 w-6" : "mr-3 h-5 w-5"} flex-shrink-0`}
        aria-hidden="true"
      />
      <span className="flex-1">{item.name}</span>
      {item.badge && (
        <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
