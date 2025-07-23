import { NavigationCategory, NavigationItem, getNavigationForRole } from '@/config/navigation.config';

/**
 * Filter navigation items based on enabled modules
 */
export function filterNavigationByModules(
  navigation: NavigationCategory[],
  enabledModules: string[]
): NavigationCategory[] {
  return navigation.map(category => ({
    ...category,
    items: category.items.filter(item => 
      !item.moduleId || enabledModules.includes(item.moduleId)
    )
  })).filter(category => category.items.length > 0);
}

/**
 * Get filtered navigation for a user based on role and enabled modules
 */
export function getUserNavigation(
  userRole: string,
  enabledModules: string[] = []
): NavigationCategory[] {
  const roleNavigation = getNavigationForRole(userRole);
  
  if (enabledModules.length === 0) {
    return roleNavigation;
  }
  
  return filterNavigationByModules(roleNavigation, enabledModules);
}

/**
 * Find a navigation item by href
 */
export function findNavigationItem(
  navigation: NavigationCategory[],
  href: string
): NavigationItem | null {
  for (const category of navigation) {
    for (const item of category.items) {
      if (item.href === href) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Get breadcrumb trail for a given path
 */
export function getBreadcrumbs(
  navigation: NavigationCategory[],
  currentPath: string
): NavigationItem[] {
  const breadcrumbs: NavigationItem[] = [];
  
  // Find the current item
  const currentItem = findNavigationItem(navigation, currentPath);
  if (currentItem) {
    breadcrumbs.push(currentItem);
  }
  
  // Add parent items if needed (for nested routes)
  const pathSegments = currentPath.split('/').filter(Boolean);
  for (let i = pathSegments.length - 1; i > 0; i--) {
    const parentPath = '/' + pathSegments.slice(0, i).join('/');
    const parentItem = findNavigationItem(navigation, parentPath);
    if (parentItem && !breadcrumbs.includes(parentItem)) {
      breadcrumbs.unshift(parentItem);
    }
  }
  
  return breadcrumbs;
}

/**
 * Check if a navigation item is active based on current path
 */
export function isNavigationItemActive(
  item: NavigationItem,
  currentPath: string
): boolean {
  if (item.href === currentPath) {
    return true;
  }
  
  // Check if current path starts with item href (for nested routes)
  if (currentPath.startsWith(item.href) && item.href !== '/') {
    return true;
  }
  
  return false;
}

/**
 * Get the active navigation item for the current path
 */
export function getActiveNavigationItem(
  navigation: NavigationCategory[],
  currentPath: string
): NavigationItem | null {
  for (const category of navigation) {
    for (const item of category.items) {
      if (isNavigationItemActive(item, currentPath)) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Count total navigation items for a role
 */
export function getNavigationItemCount(navigation: NavigationCategory[]): number {
  return navigation.reduce((total, category) => total + category.items.length, 0);
}

/**
 * Get navigation items by category name
 */
export function getNavigationCategory(
  navigation: NavigationCategory[],
  categoryName: string
): NavigationCategory | null {
  return navigation.find(category => category.category === categoryName) || null;
}
