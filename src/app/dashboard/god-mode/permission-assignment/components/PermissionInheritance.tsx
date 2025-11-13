'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

interface Permission {
  id: string;
  action: string;
  subject: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  level: number;
}

interface PermissionInheritanceProps {
  role?: Role;
  permissions: Permission[];
  isLoading?: boolean;
}

/**
 * PermissionInheritance Component - Shows permission inheritance visualization
 */
export function PermissionInheritance({
  role,
  permissions,
  isLoading,
}: PermissionInheritanceProps) {
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    permissions.forEach((perm) => {
      if (!groups[perm.category]) {
        groups[perm.category] = [];
      }
      groups[perm.category].push(perm);
    });
    return groups;
  }, [permissions]);

  const categories = useMemo(() => {
    return Object.keys(groupedByCategory).sort();
  }, [groupedByCategory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div>
        <h3 className="font-semibold mb-2">Role</h3>
        {role ? (
          <div className="p-3 bg-background rounded border">
            <p className="font-medium">{role.name}</p>
            <p className="text-sm text-muted-foreground">Level {role.level}</p>
          </div>
        ) : (
          <div className="p-3 bg-background rounded border text-muted-foreground">
            No role selected
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Inherited Permissions</h3>
        {permissions.length === 0 ? (
          <div className="p-3 bg-background rounded border text-muted-foreground text-sm">
            No permissions inherited
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <Badge variant="secondary">{category}</Badge>
                <div className="space-y-1 ml-2">
                  {groupedByCategory[category].map((perm) => (
                    <div
                      key={perm.id}
                      className="p-2 bg-background rounded border text-sm flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium">{perm.action}</span>
                        <span className="text-muted-foreground"> on </span>
                        <span className="font-medium">{perm.subject}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <span className="font-semibold">ℹ️ Info:</span> Permissions shown here are inherited by
          the selected role based on its hierarchy level.
        </p>
      </div>
    </div>
  );
}
