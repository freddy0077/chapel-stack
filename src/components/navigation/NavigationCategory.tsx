"use client";

import { NavigationCategory as NavigationCategoryType } from "@/config/navigation.config";
import { NavigationItem } from "./NavigationItem";

interface NavigationCategoryProps {
  category: NavigationCategoryType;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function NavigationCategory({
  category,
  isMobile = false,
  onItemClick,
}: NavigationCategoryProps) {
  if (category.items.length === 0) {
    return null;
  }

  return (
    <div className={isMobile ? "mt-6" : "mt-8"}>
      <h3
        className={`px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${isMobile ? "mb-2" : "mb-1"}`}
      >
        {category.category}
      </h3>
      <div className="space-y-1">
        {category.items.map((item) => (
          <NavigationItem
            key={item.name}
            item={item}
            isMobile={isMobile}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}
